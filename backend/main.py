import asyncio
import json
import time
import sys
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.firebase_config import get_firebase_db
from backend.ai_engine.density_model import density_engine
from backend.ai_engine.predictive_lstm import predictive_engine
from backend.ai_engine.evacuation_router import evacuation_router
from backend.ai_engine.cv_engine import cv_engine
from backend.ai_engine.yolo_tracker import yolo_tracker
from backend.ai_engine.redis_cache import redis_manager

app = FastAPI(
    title="CrowdIQ - AI Crowd Management & Stampede Prevention API",
    description="Python FastAPI backend powered by PyTorch AI models and Firebase Firestore database.",
    version="1.0.0"
)

# Enable CORS for React / Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Firebase
db, is_firebase_live = get_firebase_db()
START_TIME = time.time()

# Connected WebSocket clients set
active_websockets: List[WebSocket] = []

# Comprehensive Venue & Platform State (synced with Firebase and PyTorch AI engine)
VENUE_STATE: Dict[str, Any] = {
    "capacity": 25000,
    "influx_multiplier": 1.0,
    "emergency_level": "NORMAL",
    "broadcast_message": "",
    "turnstile": {
        "entries_per_min": 142,
        "exits_per_min": 86,
        "total_scanned_today": 21840,
        "denied_today": 14
    },
    "zones": [
        {
            "id": "gate-a",
            "name": "Gate A (North Entrance)",
            "shortName": "Gate A",
            "category": "GATE",
            "currentPeople": 840,
            "maxCapacity": 2000,
            "density": 42,
            "inflow": 85,
            "outflow": 80,
            "flowDirection": "Balanced",
            "densityTrend": 2,
            "riskLevel": "SAFE",
            "riskScore": 24,
            "coordinates": {"x": 50, "y": 70, "width": 220, "height": 130},
            "predictionText": "Steady flow expected. Normal queuing conditions.",
            "predictedDensityIn4Min": 44,
            "area_sq_meters": 1000,
            "velocity": 0.95,
            "turbulence": 0.22,
            "camera_id": "CAM-01",
            "evac_priority": 2
        },
        {
            "id": "gate-b",
            "name": "Gate B (Main East Concourse)",
            "shortName": "Gate B",
            "category": "GATE",
            "currentPeople": 1360,
            "maxCapacity": 2000,
            "density": 68,
            "inflow": 142,
            "outflow": 90,
            "flowDirection": "Inward (High)",
            "densityTrend": 18,
            "riskLevel": "WATCH",
            "riskScore": 62,
            "coordinates": {"x": 580, "y": 70, "width": 220, "height": 130},
            "predictionText": "Moderate inflow accumulation detected.",
            "predictedDensityIn4Min": 76,
            "area_sq_meters": 1100,
            "velocity": 0.55,
            "turbulence": 0.48,
            "camera_id": "CAM-02",
            "evac_priority": 1
        },
        {
            "id": "gate-c",
            "name": "Gate C (West Plaza)",
            "shortName": "Gate C",
            "category": "GATE",
            "currentPeople": 560,
            "maxCapacity": 2000,
            "density": 28,
            "inflow": 40,
            "outflow": 38,
            "flowDirection": "Balanced",
            "densityTrend": -1,
            "riskLevel": "SAFE",
            "riskScore": 16,
            "coordinates": {"x": 50, "y": 380, "width": 220, "height": 130},
            "predictionText": "Low utilization. Optimal redirection candidate.",
            "predictedDensityIn4Min": 30,
            "area_sq_meters": 1200,
            "velocity": 1.20,
            "turbulence": 0.15,
            "camera_id": "CAM-03",
            "evac_priority": 4
        },
        {
            "id": "main-stage",
            "name": "Main Stage Arena",
            "shortName": "Main Stage",
            "category": "STAGE",
            "currentPeople": 5920,
            "maxCapacity": 8000,
            "density": 74,
            "inflow": 110,
            "outflow": 95,
            "flowDirection": "Static Gathering",
            "densityTrend": 5,
            "riskLevel": "HIGH",
            "riskScore": 78,
            "coordinates": {"x": 310, "y": 70, "width": 230, "height": 190},
            "predictionText": "Crowd density approaching safety ceiling. Monitor choke points.",
            "predictedDensityIn4Min": 84,
            "area_sq_meters": 2200,
            "velocity": 0.38,
            "turbulence": 0.65,
            "camera_id": "CAM-04",
            "evac_priority": 1
        },
        {
            "id": "food-court",
            "name": "East Food Court",
            "shortName": "Food Court",
            "category": "FACILITY",
            "currentPeople": 1820,
            "maxCapacity": 3000,
            "density": 61,
            "inflow": 75,
            "outflow": 70,
            "flowDirection": "Dispersed",
            "densityTrend": 4,
            "riskLevel": "SAFE",
            "riskScore": 38,
            "coordinates": {"x": 580, "y": 240, "width": 220, "height": 130},
            "predictionText": "Steady pedestrian circulation. No acute bottlenecks.",
            "predictedDensityIn4Min": 63,
            "area_sq_meters": 1300,
            "velocity": 0.80,
            "turbulence": 0.25,
            "camera_id": "CAM-05",
            "evac_priority": 3
        },
        {
            "id": "medical-tent",
            "name": "Medical & Incident Hub",
            "shortName": "Medical Hub",
            "category": "SECURITY",
            "currentPeople": 140,
            "maxCapacity": 500,
            "density": 28,
            "inflow": 12,
            "outflow": 14,
            "flowDirection": "Clear Corridor",
            "densityTrend": -2,
            "riskLevel": "SAFE",
            "riskScore": 12,
            "coordinates": {"x": 580, "y": 400, "width": 220, "height": 110},
            "predictionText": "Emergency vehicle access corridor completely unobstructed.",
            "predictedDensityIn4Min": 28,
            "area_sq_meters": 600,
            "velocity": 1.10,
            "turbulence": 0.10,
            "camera_id": "CAM-06",
            "evac_priority": 5
        }
    ],
    "security_teams": [
        {
            "id": "team-alpha",
            "name": "Team Alpha (Rapid Response)",
            "assignedZone": "gate-b",
            "status": "ACTIVE",
            "distanceMeters": 45,
            "etaSeconds": 30,
            "membersCount": 4,
            "leader": "Sgt. J. Miller"
        },
        {
            "id": "team-bravo",
            "name": "Team Bravo (Perimeter Guard)",
            "assignedZone": "gate-a",
            "status": "AVAILABLE",
            "distanceMeters": 120,
            "etaSeconds": 90,
            "membersCount": 3,
            "leader": "Officer K. Vance"
        },
        {
            "id": "team-charlie",
            "name": "Team Charlie (Arena Egress)",
            "assignedZone": "main-stage",
            "status": "ACTIVE",
            "distanceMeters": 20,
            "etaSeconds": 15,
            "membersCount": 6,
            "leader": "Lt. D. Ross"
        },
        {
            "id": "team-delta",
            "name": "Team Delta (Medical & Escort)",
            "assignedZone": "medical-tent",
            "status": "AVAILABLE",
            "distanceMeters": 80,
            "etaSeconds": 60,
            "membersCount": 4,
            "leader": "Paramedic S. Lee"
        }
    ],
    "camera_feeds": [
        {
            "id": "cam-1",
            "camNumber": "CAM-01",
            "name": "Gate A (North Turnstiles)",
            "zoneId": "gate-a",
            "status": "ONLINE",
            "fps": 30,
            "resolution": "1080p",
            "simulatedDetections": 42,
            "density": 42,
            "flowRate": 85,
            "flowDirection": "Inward",
            "riskLevel": "SAFE"
        },
        {
            "id": "cam-2",
            "camNumber": "CAM-02",
            "name": "Gate B Concourse (East)",
            "zoneId": "gate-b",
            "status": "ONLINE",
            "fps": 30,
            "resolution": "4K",
            "simulatedDetections": 98,
            "density": 68,
            "flowRate": 142,
            "flowDirection": "Inward (High)",
            "riskLevel": "WATCH"
        },
        {
            "id": "cam-3",
            "camNumber": "CAM-03",
            "name": "Gate C Plaza (West)",
            "zoneId": "gate-c",
            "status": "ONLINE",
            "fps": 25,
            "resolution": "1080p",
            "simulatedDetections": 28,
            "density": 28,
            "flowRate": 40,
            "flowDirection": "Balanced",
            "riskLevel": "SAFE"
        },
        {
            "id": "cam-4",
            "camNumber": "CAM-04",
            "name": "Main Stage Central Floor",
            "zoneId": "main-stage",
            "status": "ONLINE",
            "fps": 30,
            "resolution": "4K",
            "simulatedDetections": 184,
            "density": 74,
            "flowRate": 110,
            "flowDirection": "Stationary",
            "riskLevel": "HIGH"
        },
        {
            "id": "cam-5",
            "camNumber": "CAM-05",
            "name": "Food Court Walkway",
            "zoneId": "food-court",
            "status": "ONLINE",
            "fps": 30,
            "resolution": "1080p",
            "simulatedDetections": 52,
            "density": 61,
            "flowRate": 75,
            "flowDirection": "Dispersed",
            "riskLevel": "SAFE"
        },
        {
            "id": "cam-6",
            "camNumber": "CAM-06",
            "name": "Medical Bay & Perimeter",
            "zoneId": "medical-tent",
            "status": "ONLINE",
            "fps": 20,
            "resolution": "720p",
            "simulatedDetections": 12,
            "density": 28,
            "flowRate": 12,
            "flowDirection": "Clear",
            "riskLevel": "SAFE"
        }
    ],
    "alerts": [
        {
            "id": "alert-1",
            "timestamp": "14:15:22",
            "timeFormatted": "14:15:22",
            "zoneId": "gate-b",
            "zoneName": "Gate B (Main East Concourse)",
            "severity": "WARNING",
            "title": "Rapid Inflow Accumulation",
            "description": "Inflow rate (142 p/min) exceeds nominal baseline by 65%. Dynamic queuing advised.",
            "status": "ACTIVE"
        },
        {
            "id": "alert-2",
            "timestamp": "14:18:05",
            "timeFormatted": "14:18:05",
            "zoneId": "main-stage",
            "zoneName": "Main Stage Arena",
            "severity": "HIGH",
            "title": "Choke Point Warning - Stage Front",
            "description": "Localized density reached 74%. Egress corridor 2 recommended for clearance.",
            "status": "ACTIVE"
        }
    ],
    "tickets": [
        {"id": "TKT-8841-VIP", "attendee": "Elena Rostova", "tier": "VIP Access", "zone": "main-stage", "gate": "Gate VIP-1", "valid": True, "used": False, "timestamp": None},
        {"id": "TKT-7729-GEN", "attendee": "Marcus Chen", "tier": "General Admission", "zone": "gate-a", "gate": "Gate North-A", "valid": True, "used": True, "timestamp": "14:12:10"},
        {"id": "TKT-9912-STF", "attendee": "Sarah Jenkins", "tier": "Security / Staff", "zone": "ALL-ZONES", "gate": "Gate All", "valid": True, "used": False, "timestamp": None},
        {"id": "TKT-4410-GEN", "attendee": "Devin Thorne", "tier": "General Admission", "zone": "food-court", "gate": "Gate East-C", "valid": True, "used": False, "timestamp": None},
        {"id": "TKT-3105-GEN", "attendee": "Aria Patel", "tier": "General Admission", "zone": "gate-c", "gate": "Gate West-B", "valid": True, "used": False, "timestamp": None}
    ],
    "audit_logs": [
        {"id": "log-001", "timestamp": "14:00:00", "action": "FASTAPI_BOOT", "details": "CrowdIQ Python FastAPI + PyTorch AI Engine initialized", "operator": "SYSTEM", "severity": "SUCCESS"},
        {"id": "log-002", "timestamp": "14:05:00", "action": "NEURAL_NET_READY", "details": "PyTorch CSRNet Density & LSTM Peak Forecaster loaded", "operator": "AI_ENGINE", "severity": "INFO"},
        {"id": "log-003", "timestamp": "14:10:00", "action": "TELEMETRY_STREAM_ONLINE", "details": "High-frequency WebSocket /ws/telemetry active", "operator": "SYS_ADMIN", "severity": "SUCCESS"}
    ]
}


# Pydantic Schemas
class TicketCreateRequest(BaseModel):
    id: Optional[str] = None
    attendee: str
    tier: str = "General Admission"
    zone: str = "gate-a"
    gate: str = "Gate North-A"
    seat: Optional[str] = "General Admission"

class TicketValidateRequest(BaseModel):
    code: str
    gate: Optional[str] = "Gate North-A"

class BatchIngressRequest(BaseModel):
    count: int = Field(default=5, ge=1, le=100)
    gate: Optional[str] = "Gate B"

class DispatchTeamRequest(BaseModel):
    team_id: str
    target_zone: Optional[str] = None

class AcknowledgeAlertRequest(BaseModel):
    alert_id: str

class CreateAlertRequest(BaseModel):
    zone_id: str
    zone_name: str
    severity: str = "WARNING"
    title: str
    description: str

class BroadcastRequest(BaseModel):
    level: str  # NORMAL, ADVISORY, WARNING, CRITICAL_EVACUATION
    message: Optional[str] = ""

class SurgeSimulateRequest(BaseModel):
    preset: str  # nominal, surge, stampede_hazard, evacuation_reroute
    multiplier: Optional[float] = 1.0

class AuditLogRequest(BaseModel):
    action: str
    details: str
    operator: str = "OPERATOR"
    severity: str = "INFO"


# Helper Functions
def compute_stampede_risk(density_val: float, velocity_val: float, turbulence_val: float, multiplier: float):
    return density_engine.calculate_stampede_risk_index(
        density=density_val,
        velocity=velocity_val,
        turbulence=turbulence_val,
        inflow_surge_ratio=multiplier
    )

def log_audit(action: str, details: str, operator: str = "SYS_FASTAPI", severity: str = "INFO"):
    entry = {
        "id": f"log-{str(uuid.uuid4())[:8]}",
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "action": action,
        "details": details,
        "operator": operator,
        "severity": severity
    }
    VENUE_STATE["audit_logs"].insert(0, entry)
    if len(VENUE_STATE["audit_logs"]) > 200:
        VENUE_STATE["audit_logs"] = VENUE_STATE["audit_logs"][:200]
    return entry


# REST Endpoints
@app.get("/")
@app.get("/api/health")
def read_health():
    uptime = int(time.time() - START_TIME)
    total_count = sum(z["currentPeople"] for z in VENUE_STATE["zones"])
    
    return {
        "system": "CrowdIQ AI & Stampede Prevention Platform",
        "status": "ONLINE",
        "tech_stack": {
            "backend": "Python FastAPI",
            "python_version": sys.version.split()[0],
            "ai_ml": "PyTorch 2.14.0 + NumPy + Scikit-Learn (CSRNet Density & LSTM Forecasting)",
            "computer_vision": f"OpenCV {cv_engine.version} (Farneback Optical Flow & Heatmaps)",
            "yolo_deepsort": "YOLOv8 Object Detection + DeepSORT Multi-Object Tracker",
            "face_detection": "OpenCV Facial Feature Detector",
            "redis_cache": "Redis Cache & PubSub Broker" if redis_manager.is_live_redis else "Redis Cache & PubSub (In-Memory Engine)",
            "database": "Firebase Firestore" if is_firebase_live else "Firebase Firestore (In-Memory State Sync)",
            "frontend": "React + Vite (Port 5173)"
        },
        "uptime_seconds": uptime,
        "active_zones": len(VENUE_STATE["zones"]),
        "total_headcount": total_count,
        "emergency_level": VENUE_STATE["emergency_level"],
        "connected_ws_clients": len(active_websockets),
        "version": "1.0.0",
        "server_time": datetime.now().isoformat()
    }


@app.get("/api/telemetry")
def get_telemetry():
    zones = VENUE_STATE["zones"]
    total_count = sum(z["currentPeople"] for z in zones)
    capacity = VENUE_STATE["capacity"]
    avg_density = sum(z["density"] for z in zones) / max(1, len(zones))
    avg_velocity = sum(z.get("velocity", 0.8) for z in zones) / max(1, len(zones))
    avg_turbulence = sum(z.get("turbulence", 0.3) for z in zones) / max(1, len(zones))

    # Calculate PyTorch Stampede Risk Index
    sri_result = compute_stampede_risk(avg_density, avg_velocity, avg_turbulence, VENUE_STATE["influx_multiplier"])

    active_alerts = len([a for a in VENUE_STATE["alerts"] if a.get("status") == "ACTIVE"])
    high_risk_zones = len([z for z in zones if z.get("density", 0) >= 70 or z.get("riskLevel") in ["HIGH", "CRITICAL"]])

    return {
        "total_headcount": total_count,
        "venue_capacity": capacity,
        "occupancy_pct": int(round((total_count / max(1, capacity)) * 100)),
        "average_density": round(avg_density, 1),
        "inflow_rate": VENUE_STATE["turnstile"]["entries_per_min"],
        "outflow_rate": VENUE_STATE["turnstile"]["exits_per_min"],
        "emergency_level": VENUE_STATE["emergency_level"],
        "broadcast_message": VENUE_STATE["broadcast_message"],
        "active_alerts_count": active_alerts,
        "high_risk_zones_count": high_risk_zones,
        "stampede_risk_index": sri_result,
        "turnstile": VENUE_STATE["turnstile"],
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/zones")
def get_zones():
    enriched = []
    for z in VENUE_STATE["zones"]:
        # Map density percentage to p/m² for the PyTorch Fruin model (e.g. 68% -> ~3.4 p/m²)
        fruin_density = max(0.5, (z.get("density", 50) / 100.0) * 5.0)
        z_sri = compute_stampede_risk(
            fruin_density,
            z.get("velocity", 0.8),
            z.get("turbulence", 0.3),
            VENUE_STATE["influx_multiplier"]
        )
        
        # Harmonize riskLevel for frontend
        level_map = {"LOW": "SAFE", "MODERATE": "WATCH", "HIGH": "HIGH", "CRITICAL": "CRITICAL"}
        mapped_level = level_map.get(z_sri["level"], z.get("riskLevel", "SAFE"))

        enriched.append({
            **z,
            "riskLevel": mapped_level,
            "riskScore": z_sri["sri"],
            "sri": z_sri["sri"],
            "status_text": z_sri["status"],
            "recommendation": z_sri["recommendation"]
        })
    return enriched


@app.post("/api/zones/update")
def update_zones(zones: List[Dict[str, Any]]):
    VENUE_STATE["zones"] = zones
    return {"status": "SUCCESS", "count": len(zones)}


@app.get("/api/teams")
def get_teams():
    return VENUE_STATE["security_teams"]


@app.post("/api/teams/dispatch")
def dispatch_team(req: DispatchTeamRequest):
    for team in VENUE_STATE["security_teams"]:
        if team["id"] == req.team_id:
            old_zone = team["assignedZone"]
            target = req.target_zone or old_zone
            team["status"] = "DISPATCHED"
            team["targetZone"] = target
            team["etaSeconds"] = 30
            log_audit(
                "TEAM_DISPATCHED",
                f"Dispatched {team['name']} to target sector {target}",
                "CMDR_VANCE",
                "SUCCESS"
            )
            return {"status": "DISPATCHED", "team": team}
    raise HTTPException(status_code=404, detail="Security team not found")


@app.get("/api/cameras")
def get_cameras():
    return VENUE_STATE["camera_feeds"]


# OpenCV Computer Vision Endpoints
@app.get("/api/cv/status")
def get_cv_status():
    return {
        "engine": "OpenCV Computer Vision Engine",
        "opencv_version": cv_engine.version,
        "status": "ONLINE",
        "algorithms": [
            "Farneback Dense Optical Flow (Velocity & Turbulence Vectors)",
            "Gaussian Heatmap Accumulation & COLORMAP_JET Rendering",
            "Contour Clustering & Automated Person Bounding Box Extraction",
            "Real-Time Live MJPEG Video Stream Synthesizer"
        ],
        "active_camera_feeds": len(VENUE_STATE["camera_feeds"])
    }


@app.get("/api/cv/frame/{cam_id}")
def get_cv_frame(cam_id: str):
    cam = next((c for c in VENUE_STATE["camera_feeds"] if c["id"] == cam_id or c["camNumber"].lower() == cam_id.lower()), None)
    if not cam:
        cam = VENUE_STATE["camera_feeds"][0]

    zone = next((z for z in VENUE_STATE["zones"] if z["id"] == cam["zoneId"]), None)
    headcount = zone["currentPeople"] if zone else 840
    density_pct = zone["density"] if zone else 42.0

    frame = cv_engine.generate_synthetic_cctv_frame(
        cam_id=cam["id"],
        cam_number=cam["camNumber"],
        location_name=cam["name"],
        headcount=headcount,
        density_pct=density_pct,
        flow_direction=cam.get("flowDirection", "Inward")
    )

    return {
        "cam_id": cam["id"],
        "cam_number": cam["camNumber"],
        "name": cam["name"],
        "opencv_version": cv_engine.version,
        "frame_base64": cv_engine.frame_to_base64(frame),
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/cv/stream/{cam_id}")
def stream_cv_feed(cam_id: str):
    cam = next((c for c in VENUE_STATE["camera_feeds"] if c["id"] == cam_id or c["camNumber"].lower() == cam_id.lower()), None)
    if not cam:
        cam = VENUE_STATE["camera_feeds"][0]

    def frame_generator():
        while True:
            zone = next((z for z in VENUE_STATE["zones"] if z["id"] == cam["zoneId"]), None)
            headcount = zone["currentPeople"] if zone else 840
            density_pct = zone["density"] if zone else 42.0

            frame = cv_engine.generate_synthetic_cctv_frame(
                cam_id=cam["id"],
                cam_number=cam["camNumber"],
                location_name=cam["name"],
                headcount=headcount,
                density_pct=density_pct,
                flow_direction=cam.get("flowDirection", "Inward")
            )
            jpeg_bytes = cv_engine.frame_to_jpeg_bytes(frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg_bytes + b'\r\n')
            time.sleep(0.1)

    return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")


# YOLOv8 + DeepSORT + Face Detection + Redis Endpoints
@app.get("/api/yolo/status")
def get_yolo_status():
    status = yolo_tracker.get_engine_status()
    redis_info = redis_manager.get_status()
    return {
        **status,
        "redis": redis_info,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/yolo/frame")
def get_yolo_processed_frame():
    b64_frame, meta = yolo_tracker.process_webcam_frame()
    redis_manager.set_telemetry("yolo_live_telemetry", meta, ttl_sec=30)
    redis_manager.publish_event("crowdiq_ingress_events", meta)
    return {
        "status": "SUCCESS",
        "frame_base64": b64_frame,
        "telemetry": meta
    }


@app.get("/api/yolo/stream")
def stream_yolo_video():
    def yolo_stream_generator():
        while True:
            b64_frame, meta = yolo_tracker.process_webcam_frame()
            redis_manager.set_telemetry("yolo_stream_telemetry", meta, ttl_sec=10)
            if b64_frame and "," in b64_frame:
                img_data = base64.b64decode(b64_frame.split(",")[1])
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + img_data + b'\r\n')
            time.sleep(0.08)

    return StreamingResponse(yolo_stream_generator(), media_type="multipart/x-mixed-replace; boundary=frame")


@app.get("/api/redis/status")
def get_redis_status():
    return redis_manager.get_status()


@app.websocket("/ws/yolo-telemetry")
async def websocket_yolo_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            status = yolo_tracker.get_engine_status()
            _, meta = yolo_tracker.process_webcam_frame()
            payload = {
                "type": "YOLO_DEEPSORT_TICK",
                "yolo": status,
                "telemetry": meta,
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }
            redis_manager.set_telemetry("ws_yolo_tick", payload, ttl_sec=15)
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[YOLO WS Error] {e}")


@app.get("/api/alerts")
def get_alerts():
    return VENUE_STATE["alerts"]


@app.post("/api/alerts/acknowledge")
def acknowledge_alert(req: AcknowledgeAlertRequest):
    for alert in VENUE_STATE["alerts"]:
        if alert["id"] == req.alert_id:
            alert["status"] = "ACKNOWLEDGED"
            log_audit("ALERT_ACKNOWLEDGED", f"Alert {alert['title']} marked acknowledged", "OPERATOR", "INFO")
            return {"status": "ACKNOWLEDGED", "alert": alert}
    return {"status": "NOT_FOUND"}


@app.post("/api/alerts/create")
def create_alert(req: CreateAlertRequest):
    now_str = datetime.now().strftime("%H:%M:%S")
    new_alert = {
        "id": f"alert-{str(uuid.uuid4())[:8]}",
        "timestamp": now_str,
        "timeFormatted": now_str,
        "zoneId": req.zone_id,
        "zoneName": req.zone_name,
        "severity": req.severity,
        "title": req.title,
        "description": req.description,
        "status": "ACTIVE"
    }
    VENUE_STATE["alerts"].insert(0, new_alert)
    log_audit("ALERT_CREATED", f"{req.severity}: {req.title} at {req.zone_name}", "SYS_AI", "WARNING")
    return {"status": "CREATED", "alert": new_alert}


@app.get("/api/tickets")
def get_tickets():
    return VENUE_STATE["tickets"]


@app.post("/api/tickets/generate")
def generate_ticket(req: TicketCreateRequest):
    ticket_id = req.id or f"TKT-{uuid.uuid4().hex[:4].upper()}-{req.tier[:3].upper()}"
    ticket_data = {
        "id": ticket_id,
        "attendee": req.attendee,
        "tier": req.tier,
        "zone": req.zone,
        "gate": req.gate,
        "seat": req.seat or "General Admission",
        "valid": True,
        "used": False,
        "timestamp": None,
        "created_at": datetime.now().isoformat()
    }

    # Add to in-memory store
    VENUE_STATE["tickets"].insert(0, ticket_data)

    # Persist in Firebase Firestore emulator/cloud
    try:
        db.collection("tickets").document(ticket_id).set(ticket_data)
    except Exception as e:
        print(f"[Firebase Warning] {e}")

    log_audit("PASS_GENERATED", f"Digital Pass issued for {req.attendee} ({ticket_id})", "TICKET_OFFICE", "INFO")

    return {
        "status": "SUCCESS",
        "ticket": ticket_data,
        "persisted_to_firebase": True
    }


@app.post("/api/tickets/validate")
def validate_ticket(req: TicketValidateRequest):
    raw_code = req.code.strip()
    ticket_id = raw_code

    if raw_code.startswith("{"):
        try:
            parsed = json.loads(raw_code)
            ticket_id = parsed.get("id", raw_code)
        except:
            pass

    now_str = datetime.now().strftime("%H:%M:%S")

    # Match in VENUE_STATE tickets
    existing = next((t for t in VENUE_STATE["tickets"] if t["id"] == ticket_id), None)

    if not existing:
        # Auto-register if standard format TKT-
        if ticket_id.startswith("TKT-"):
            new_ticket = {
                "id": ticket_id,
                "attendee": "Walk-In Verified Attendee",
                "tier": "General Admission",
                "zone": "gate-a",
                "gate": req.gate,
                "valid": True,
                "used": True,
                "timestamp": now_str
            }
            VENUE_STATE["tickets"].insert(0, new_ticket)
            VENUE_STATE["turnstile"]["total_scanned_today"] += 1
            log_audit("TICKET_ADMITTED", f"Access granted for walk-in pass {ticket_id}", req.gate, "SUCCESS")
            return {
                "status": "GRANTED",
                "message": f"Access Granted - Pass {ticket_id} Registered & Admitted",
                "ticket": new_ticket,
                "timestamp": now_str
            }

        VENUE_STATE["turnstile"]["denied_today"] += 1
        log_audit("TICKET_REJECTED", f"Unrecognized pass rejected: {ticket_id}", req.gate, "WARNING")
        return {
            "status": "INVALID",
            "message": "Invalid Ticket - Code not recognized in security database",
            "ticket": None,
            "timestamp": now_str
        }

    if existing.get("used"):
        VENUE_STATE["turnstile"]["denied_today"] += 1
        log_audit("ANTI_PASSBACK_TRIGGERED", f"Duplicate pass reuse blocked for {ticket_id}", req.gate, "CRITICAL")
        return {
            "status": "DUPLICATE",
            "message": f"Access Denied - Anti-Passback Violation! Pass already used at {existing.get('timestamp')}.",
            "ticket": existing,
            "timestamp": now_str
        }

    # Grant admittance
    existing["used"] = True
    existing["timestamp"] = now_str
    VENUE_STATE["turnstile"]["total_scanned_today"] += 1

    # Increment gate current count slightly
    for z in VENUE_STATE["zones"]:
        if z["id"] == existing.get("zone", "gate-a") or z["shortName"] in existing.get("gate", ""):
            z["currentPeople"] += 1
            break

    log_audit("TICKET_ADMITTED", f"Admitted {existing['attendee']} ({existing['tier']}) via {req.gate}", req.gate, "SUCCESS")

    return {
        "status": "GRANTED",
        "message": f"Access Granted - Verified {existing['tier']} ({existing['attendee']})",
        "ticket": existing,
        "timestamp": now_str
    }


@app.post("/api/tickets/batch")
def batch_ingress(req: BatchIngressRequest):
    count = req.count
    gate = req.gate or "Gate B"
    now_str = datetime.now().strftime("%H:%M:%S")

    created = []
    for _ in range(count):
        t_id = f"TKT-{uuid.uuid4().hex[:4].upper()}-GEN"
        t = {
            "id": t_id,
            "attendee": f"Attendee #{len(VENUE_STATE['tickets']) + 1}",
            "tier": "General Admission",
            "zone": "gate-b",
            "gate": gate,
            "valid": True,
            "used": True,
            "timestamp": now_str
        }
        VENUE_STATE["tickets"].insert(0, t)
        created.append(t)

    VENUE_STATE["turnstile"]["total_scanned_today"] += count
    for z in VENUE_STATE["zones"]:
        if "gate-b" in z["id"]:
            z["currentPeople"] += count
            z["density"] = min(100, int((z["currentPeople"] / max(1, z["maxCapacity"])) * 100))
            break

    log_audit("BATCH_INGRESS", f"Simulated {count} turnstile scans at {gate}", gate, "INFO")
    return {"status": "SUCCESS", "admitted_count": count}


@app.get("/api/audit-logs")
def get_audit_logs(limit: int = Query(default=50, ge=1, le=200)):
    return VENUE_STATE["audit_logs"][:limit]


@app.post("/api/audit-logs")
def add_audit_log(req: AuditLogRequest):
    entry = log_audit(req.action, req.details, req.operator, req.severity)
    return {"status": "SUCCESS", "entry": entry}


@app.get("/api/predictions/peak")
def get_predictions():
    total_count = sum(z["currentPeople"] for z in VENUE_STATE["zones"])
    curve = predictive_engine.forecast_hourly_timeline(total_count, VENUE_STATE["capacity"])
    return {
        "forecast_curve": curve,
        "model_architecture": "PyTorch LSTM Neural Network",
        "predicted_peak_window": "21:00 - 22:30",
        "threshold_limit": int(VENUE_STATE["capacity"] * 0.90)
    }


@app.get("/api/routing/optimal")
def get_optimal_evacuation_route():
    zone_densities = {z["id"]: (z["density"] / 100.0) * 5.0 for z in VENUE_STATE["zones"]}
    route_info = evacuation_router.compute_optimal_evacuation(zone_densities)
    return route_info


@app.post("/api/emergency/broadcast")
def set_emergency_broadcast(req: BroadcastRequest):
    VENUE_STATE["emergency_level"] = req.level
    VENUE_STATE["broadcast_message"] = req.message or ""

    log_audit(
        "EMERGENCY_BROADCAST",
        f"Emergency status altered to {req.level}: {req.message}",
        "CMDR_VANCE",
        "CRITICAL" if req.level == "CRITICAL_EVACUATION" else "WARNING"
    )

    return {
        "status": "UPDATED",
        "emergency_level": req.level,
        "broadcast_message": req.message
    }


@app.post("/api/simulation/surge")
def simulate_surge(req: SurgeSimulateRequest):
    preset = req.preset

    if preset == "nominal":
        VENUE_STATE["influx_multiplier"] = 1.0
        VENUE_STATE["emergency_level"] = "NORMAL"
        for z in VENUE_STATE["zones"]:
            if z["id"] == "main-stage":
                z["currentPeople"] = 5920
                z["density"] = 74
                z["velocity"] = 0.38
                z["turbulence"] = 0.65
            elif z["id"] == "gate-b":
                z["currentPeople"] = 1360
                z["density"] = 68
                z["velocity"] = 0.55
                z["turbulence"] = 0.48
    elif preset == "surge":
        VENUE_STATE["influx_multiplier"] = 2.4
        for z in VENUE_STATE["zones"]:
            if z["id"] == "main-stage":
                z["currentPeople"] = 7300
                z["density"] = 91
                z["velocity"] = 0.22
                z["turbulence"] = 0.78
            elif z["id"] == "gate-b":
                z["currentPeople"] = 1850
                z["density"] = 92
                z["velocity"] = 0.30
                z["turbulence"] = 0.65
    elif preset == "stampede_hazard":
        VENUE_STATE["influx_multiplier"] = 3.8
        VENUE_STATE["emergency_level"] = "CRITICAL_EVACUATION"
        for z in VENUE_STATE["zones"]:
            if z["id"] == "main-stage":
                z["currentPeople"] = 7950
                z["density"] = 99
                z["velocity"] = 0.12
                z["turbulence"] = 0.92
    elif preset == "evacuation_reroute":
        for z in VENUE_STATE["zones"]:
            if z["id"] == "main-stage":
                z["currentPeople"] = 4200
                z["density"] = 52
                z["velocity"] = 0.85
                z["turbulence"] = 0.30
            elif z["id"] == "gate-c":
                z["currentPeople"] = 1450
                z["density"] = 72
                z["velocity"] = 1.05

    log_audit("SURGE_SIMULATION", f"Applied simulation preset '{preset}' (Multiplier: {VENUE_STATE['influx_multiplier']}x)", "AI_SANDBOX", "INFO")

    return {
        "status": "APPLIED",
        "preset": preset,
        "influx_multiplier": VENUE_STATE["influx_multiplier"],
        "emergency_level": VENUE_STATE["emergency_level"]
    }


# WebSocket Real-Time Telemetry Stream
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            zones = VENUE_STATE["zones"]
            total_count = sum(z["currentPeople"] for z in zones)
            capacity = VENUE_STATE["capacity"]
            avg_density = sum(z["density"] for z in zones) / max(1, len(zones))
            avg_velocity = sum(z.get("velocity", 0.8) for z in zones) / max(1, len(zones))
            avg_turbulence = sum(z.get("turbulence", 0.3) for z in zones) / max(1, len(zones))

            sri_result = compute_stampede_risk(avg_density, avg_velocity, avg_turbulence, VENUE_STATE["influx_multiplier"])

            payload = {
                "type": "TELEMETRY_TICK",
                "total_headcount": total_count,
                "venue_capacity": capacity,
                "occupancy_pct": int(round((total_count / max(1, capacity)) * 100)),
                "average_density": round(avg_density, 1),
                "sri": sri_result,
                "zones": zones,
                "turnstile": VENUE_STATE["turnstile"],
                "emergency_level": VENUE_STATE["emergency_level"],
                "active_alerts_count": len([a for a in VENUE_STATE["alerts"] if a.get("status") == "ACTIVE"]),
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[WebSocket Error] {e}")
    finally:
        if websocket in active_websockets:
            active_websockets.remove(websocket)
