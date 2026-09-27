import { supabaseService } from './supabaseService';

export interface MobileCameraNode {
  id: string; // 'CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'
  name: string; // 'Mobile Cam 1 (Main Entrance)', etc.
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'CONNECTING';
  peopleCount: number;
  density: number;
  fps: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  deviceInfo: string;
  lastSeen: number;
  frameData?: string; // Base64 snapshot with bounding boxes
  facingMode?: 'environment' | 'user';
}

export const DEFAULT_MOBILE_CAMERAS: MobileCameraNode[] = [
  {
    id: 'CAM-01',
    name: 'Mobile CCTV #1 - Main Gate',
    location: 'North Entrance Gate (Phone Feed 1)',
    status: 'OFFLINE',
    peopleCount: 0,
    density: 0,
    fps: 0,
    riskLevel: 'LOW',
    deviceInfo: 'Unassigned Phone',
    lastSeen: 0,
  },
  {
    id: 'CAM-02',
    name: 'Mobile CCTV #2 - Concourse',
    location: 'East Concourse Gate (Phone Feed 2)',
    status: 'OFFLINE',
    peopleCount: 0,
    density: 0,
    fps: 0,
    riskLevel: 'LOW',
    deviceInfo: 'Unassigned Phone',
    lastSeen: 0,
  },
  {
    id: 'CAM-03',
    name: 'Mobile CCTV #3 - West Exit',
    location: 'Emergency Exit West (Phone Feed 3)',
    status: 'OFFLINE',
    peopleCount: 0,
    density: 0,
    fps: 0,
    riskLevel: 'LOW',
    deviceInfo: 'Unassigned Phone',
    lastSeen: 0,
  },
  {
    id: 'CAM-04',
    name: 'Mobile CCTV #4 - Plaza Core',
    location: 'Central Plaza Stage (Phone Feed 4)',
    status: 'OFFLINE',
    peopleCount: 0,
    density: 0,
    fps: 0,
    riskLevel: 'LOW',
    deviceInfo: 'Unassigned Phone',
    lastSeen: 0,
  },
];

const STORAGE_KEY = 'crowdiq_mobile_cctv_nodes';
const CHANNEL_NAME = 'crowdiq_mobile_cctv_channel';

class MobileCctvService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(cameras: MobileCameraNode[]) => void> = new Set();
  private cameras: Map<string, MobileCameraNode> = new Map();
  private heartbeatTimer: any = null;

  constructor() {
    // Initialize default slots
    DEFAULT_MOBILE_CAMERAS.forEach((cam) => {
      this.cameras.set(cam.id, { ...cam });
    });

    // Load stored state if available
    this.loadFromStorage();

    // Setup BroadcastChannel for zero-latency multi-tab/device sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'CAMERA_UPDATE') {
          this.handleRemoteUpdate(event.data.camera);
        }
      };
    }

    // Heartbeat to mark cameras offline if silent for > 6 seconds
    if (typeof window !== 'undefined') {
      this.heartbeatTimer = setInterval(() => {
        this.checkStaleCameras();
      }, 3000);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: MobileCameraNode[] = JSON.parse(stored);
        parsed.forEach((cam) => {
          if (this.cameras.has(cam.id)) {
            const now = Date.now();
            const isOnline = now - cam.lastSeen < 6000;
            this.cameras.set(cam.id, {
              ...cam,
              status: isOnline ? 'ONLINE' : 'OFFLINE',
            });
          }
        });
      }
    } catch (e) {
      console.error('Failed to load mobile CCTV state from storage', e);
    }
  }

  private saveToStorage() {
    try {
      const list = Array.from(this.cameras.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save mobile CCTV state to storage', e);
    }
  }

  public subscribe(callback: (cameras: MobileCameraNode[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getAllCameras());
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const list = this.getAllCameras();
    this.saveToStorage();
    this.listeners.forEach((cb) => {
      try {
        cb(list);
      } catch (err) {
        console.error('Listener error in MobileCctvService', err);
      }
    });
  }

  public getAllCameras(): MobileCameraNode[] {
    return Array.from(this.cameras.values());
  }

  public getCamera(id: string): MobileCameraNode | undefined {
    return this.cameras.get(id);
  }

  /**
   * Published by a mobile phone running body detection
   */
  public updateTelemetry(data: Partial<MobileCameraNode> & { id: string }) {
    const existing = this.cameras.get(data.id) || {
      id: data.id,
      name: `Mobile CCTV #${data.id}`,
      location: 'Mobile Security Node',
      status: 'ONLINE',
      peopleCount: 0,
      density: 0,
      fps: 30,
      riskLevel: 'LOW',
      deviceInfo: 'Mobile Device',
      lastSeen: Date.now(),
    };

    const updated: MobileCameraNode = {
      ...existing,
      ...data,
      status: 'ONLINE',
      lastSeen: Date.now(),
    };

    this.cameras.set(data.id, updated);
    this.notify();

    // Broadcast update across browser tabs & devices
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'CAMERA_UPDATE',
        camera: updated,
      });
    }

    // Sync to Supabase if configured
    try {
      supabaseService.getClient()?.from('camera_telemetry').upsert({
        id: updated.id,
        cam_number: updated.id,
        location_name: updated.location,
        zone_id: updated.id,
        status: 'ONLINE',
        detections: updated.peopleCount,
        density: Math.round(updated.density),
        fps: Math.round(updated.fps),
        risk_level: updated.riskLevel,
        updated_at: new Date().toISOString(),
      }).then(() => {}).catch(() => {});
    } catch (_) {}
  }

  private handleRemoteUpdate(camera: MobileCameraNode) {
    if (!camera || !camera.id) return;
    this.cameras.set(camera.id, { ...camera, status: 'ONLINE', lastSeen: Date.now() });
    this.notify();
  }

  private checkStaleCameras() {
    let changed = false;
    const now = Date.now();
    this.cameras.forEach((cam) => {
      if (cam.status === 'ONLINE' && now - cam.lastSeen > 7000) {
        cam.status = 'OFFLINE';
        cam.fps = 0;
        changed = true;
      }
    });

    if (changed) {
      this.notify();
    }
  }

  public resetCamera(id: string) {
    const defaultCam = DEFAULT_MOBILE_CAMERAS.find((c) => c.id === id);
    if (defaultCam) {
      this.cameras.set(id, { ...defaultCam });
      this.notify();
    }
  }
}

export const mobileCctvService = new MobileCctvService();
