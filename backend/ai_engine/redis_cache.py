import json
import time
from typing import Dict, Any, Optional

try:
    import redis
    # Quick probe connection to local Redis server
    r_client = redis.Redis(host='127.0.0.1', port=6379, socket_timeout=1)
    r_client.ping()
    IS_REAL_REDIS = True
except Exception:
    IS_REAL_REDIS = False
    r_client = None

class MockRedisEngine:
    """In-memory Redis Cache & PubSub Emulator when local Redis server is standby."""
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._hash_store: Dict[str, Dict[str, Any]] = {}
        self._pubsub_channels: Dict[str, list] = {}

    def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        self._store[key] = {
            "value": value,
            "expires_at": (time.time() + ex) if ex else None
        }
        return True

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        item = self._store[key]
        if item["expires_at"] and time.time() > item["expires_at"]:
            del self._store[key]
            return None
        return item["value"]

    def hset(self, name: str, key: str, value: Any) -> int:
        if name not in self._hash_store:
            self._hash_store[name] = {}
        self._hash_store[name][key] = value
        return 1

    def hgetall(self, name: str) -> Dict[str, Any]:
        return self._hash_store.get(name, {})

    def publish(self, channel: str, message: Any) -> int:
        if channel not in self._pubsub_channels:
            self._pubsub_channels[channel] = []
        self._pubsub_channels[channel].append({
            "message": message,
            "timestamp": time.time()
        })
        # Keep channel buffer bounded
        if len(self._pubsub_channels[channel]) > 100:
            self._pubsub_channels[channel] = self._pubsub_channels[channel][-100:]
        return 1

mock_redis = MockRedisEngine()

class RedisCacheManager:
    """Unified Redis Caching & PubSub Client for CrowdIQ Telemetry & DeepSORT Tracking."""

    def __init__(self):
        self.is_live_redis = IS_REAL_REDIS
        self.client = r_client if IS_REAL_REDIS else mock_redis

    def get_status(self) -> Dict[str, Any]:
        return {
            "status": "ONLINE",
            "type": "Redis Server (TCP 6379)" if self.is_live_redis else "Redis In-Memory Engine (Emulator)",
            "is_live_redis": self.is_live_redis,
            "timestamp": time.strftime("%H:%M:%S")
        }

    def set_telemetry(self, key: str, value: Dict[str, Any], ttl_sec: int = 60) -> bool:
        try:
            payload = json.dumps(value)
            if self.is_live_redis and self.client:
                self.client.set(key, payload, ex=ttl_sec)
            else:
                mock_redis.set(key, payload, ex=ttl_sec)
            return True
        except Exception as e:
            print(f"[Redis Cache Error] {e}")
            return False

    def get_telemetry(self, key: str) -> Optional[Dict[str, Any]]:
        try:
            val = self.client.get(key) if (self.is_live_redis and self.client) else mock_redis.get(key)
            if val:
                if isinstance(val, bytes):
                    val = val.decode('utf-8')
                return json.loads(val)
        except Exception as e:
            print(f"[Redis Get Error] {e}")
        return None

    def publish_event(self, channel: str, event_data: Dict[str, Any]) -> bool:
        try:
            payload = json.dumps(event_data)
            if self.is_live_redis and self.client:
                self.client.publish(channel, payload)
            else:
                mock_redis.publish(channel, payload)
            return True
        except Exception as e:
            print(f"[Redis PubSub Error] {e}")
            return False

# Singleton instance
redis_manager = RedisCacheManager()
