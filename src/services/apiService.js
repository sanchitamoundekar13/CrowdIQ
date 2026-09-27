// API Client connecting React to Python FastAPI Backend & Firebase Firestore
// High-performance asynchronous client with automatic failover to local engine

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname === ''
);

// Read environment variables (injected at build/runtime in Vite)
const envApi = import.meta.env?.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '';
const envWs = import.meta.env?.VITE_WS_URL || '';

// Stored backend override in localStorage (if user customizes in settings)
const storedBackendUrl = isBrowser ? localStorage.getItem('crowdiq_fastapi_url') : null;

export const API_BASE_URL = storedBackendUrl || envApi || (isLocalhost ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000');

export const WS_URL = envWs || (
  API_BASE_URL ? API_BASE_URL.replace(/^http/, 'ws') + '/ws/telemetry' : 'ws://127.0.0.1:8000/ws/telemetry'
);

let wsRetryCount = 0;
const MAX_WS_RETRIES = 5;

export const apiService = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  setBaseUrl(url) {
    if (isBrowser) {
      if (url) {
        localStorage.setItem('crowdiq_fastapi_url', url.replace(/\/$/, ''));
      } else {
        localStorage.removeItem('crowdiq_fastapi_url');
      }
    }
  },

  isConfigured() {
    return Boolean(API_BASE_URL);
  },

  // Check backend & tech stack health
  async checkHealth(targetUrl = API_BASE_URL) {
    if (!targetUrl) return null;
    const start = performance.now();
    try {
      const res = await fetch(`${targetUrl}/api/health`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      data.latencyMs = Math.round(performance.now() - start);
      return data;
    } catch (err) {
      // Try root endpoint as fallback
      try {
        const rootRes = await fetch(`${targetUrl}/`, {
          signal: AbortSignal.timeout ? AbortSignal.timeout(2000) : undefined
        });
        if (rootRes.ok) {
          const rootData = await rootRes.json();
          rootData.latencyMs = Math.round(performance.now() - start);
          return rootData;
        }
      } catch (e) {
        // quiet fallback
      }
      return null;
    }
  },

  // Test connection with detailed latency metrics
  async testConnection(targetUrl = API_BASE_URL) {
    const start = performance.now();
    try {
      const data = await this.checkHealth(targetUrl);
      if (data && data.status === 'ONLINE') {
        const latency = Math.round(performance.now() - start);
        return {
          success: true,
          latencyMs: latency,
          message: `Connected to Python FastAPI (Uptime: ${data.uptime_seconds || 0}s, PyTorch AI Online)`,
          data
        };
      }
      return {
        success: false,
        message: 'FastAPI responded but reported non-online status'
      };
    } catch (err) {
      return {
        success: false,
        message: `Connection failed: ${err.message}`
      };
    }
  },

  // Fetch live telemetry (headcount, occupancy, SRI from PyTorch)
  async getTelemetry() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/telemetry`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Telemetry fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch zones with PyTorch AI density & SRI metrics
  async getZones() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/zones`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Zones fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Synchronize client zones to backend
  async updateZones(zones) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/zones/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zones),
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch Security Teams
  async getSecurityTeams() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Security teams fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Dispatch Security Team
  async dispatchSecurityTeam(teamId, targetZone) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId, target_zone: targetZone }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch Camera Feeds
  async getCameraFeeds() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cameras`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Cameras fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // OpenCV Computer Vision Status
  async getCVStatus() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cv/status`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('CV status fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // OpenCV Real-Time Processed Frame (Base64)
  async getCVFrame(camId = 'cam-1') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cv/frame/${camId}`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('CV frame fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // OpenCV Live Stream URL
  getCVStreamUrl(camId = 'cam-1') {
    return API_BASE_URL ? `${API_BASE_URL}/api/cv/stream/${camId}` : '';
  },

  // Fetch Alerts
  async getAlerts() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Alerts fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Acknowledge Alert
  async acknowledgeAlert(alertId) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Create custom Alert
  async createAlert(alert) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: alert.zoneId,
          zone_name: alert.zoneName,
          severity: alert.severity || 'WARNING',
          title: alert.title,
          description: alert.description
        }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch Tickets
  async getTickets() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Tickets fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Generate ticket and persist
  async generateTicket(ticketPayload) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      if (!res.ok) throw new Error('Ticket generation failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Validate ticket against FastAPI database with Anti-Passback
  async validateTicket(code, gate = 'Gate North-A') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, gate }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      if (!res.ok) throw new Error('Validation failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Batch Ingress Injection
  async batchIngress(count = 5, gate = 'Gate B') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, gate }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch Audit Logs
  async getAuditLogs(limit = 50) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/audit-logs?limit=${limit}`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (!res.ok) throw new Error('Audit logs fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Append Audit Log
  async addAuditLog(action, details, operator = 'OPERATOR', severity = 'INFO') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details, operator, severity }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch PyTorch LSTM peak crowd predictions
  async getPeakPredictions() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/predictions/peak`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('Predictions fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Fetch optimal evacuation routing
  async getOptimalRoute() {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/routing/optimal`, {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      });
      if (!res.ok) throw new Error('Routing fetch failed');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Trigger emergency broadcast
  async broadcastEmergency(level, message = '') {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/emergency/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Inject simulation surge into PyTorch engine
  async simulateSurge(preset, multiplier = 1.0) {
    if (!API_BASE_URL) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulation/surge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset, multiplier }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Connect to live WebSocket stream
  connectWebSocket(onMessage, onError, onOpen, onClose) {
    if (!WS_URL) {
      return null;
    }
    let ws = null;
    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = (e) => {
        wsRetryCount = 0;
        console.log('[CrowdIQ WS] Connected to FastAPI WebSocket stream:', WS_URL);
        if (onOpen) onOpen(e);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (e) {
          console.error('[CrowdIQ WS] Parse error', e);
        }
      };
      ws.onerror = (e) => {
        if (onError) onError(e);
      };
      ws.onclose = (e) => {
        if (onClose) onClose(e);
        if (wsRetryCount < MAX_WS_RETRIES) {
          wsRetryCount++;
          const delay = wsRetryCount * 2500;
          setTimeout(() => {
            this.connectWebSocket(onMessage, onError, onOpen, onClose);
          }, delay);
        }
      };
    } catch (e) {
      console.warn('[CrowdIQ WS] WebSocket connection error:', e.message);
    }
    return ws;
  }
};
