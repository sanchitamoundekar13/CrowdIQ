import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Zone, CameraFeed, AlertItem } from '../types';
import { TicketRecord, AuditLogRecord } from './localDatabase';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  autoSync: boolean;
  realtimeEnabled: boolean;
}

const STORAGE_KEY_SUPABASE_CONFIG = 'crowdiq_supabase_config';

export const DEFAULT_SUPABASE_SQL_SCHEMA = `-- ========================================================
-- CrowdIQ Supabase PostgreSQL Real-Time Schema Migration
-- Run this script in your Supabase SQL Editor (SQL Query)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Zones Telemetry Table
CREATE TABLE IF NOT EXISTS public.zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  current_people INTEGER DEFAULT 0,
  max_capacity INTEGER NOT NULL,
  density INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'LOW',
  inflow INTEGER DEFAULT 0,
  outflow INTEGER DEFAULT 0,
  flow_direction TEXT DEFAULT 'Stationary',
  status TEXT DEFAULT 'OPEN',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Turnstile E-Tickets & Ingress Admissions Table
CREATE TABLE IF NOT EXISTS public.turnstile_tickets (
  id TEXT PRIMARY KEY,
  attendee TEXT NOT NULL,
  tier TEXT DEFAULT 'General Admission',
  zone TEXT NOT NULL,
  gate TEXT NOT NULL,
  valid BOOLEAN DEFAULT true,
  used BOOLEAN DEFAULT false,
  scanned_at TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Neural Vision Cameras & Optical Telemetry Table
CREATE TABLE IF NOT EXISTS public.camera_telemetry (
  id TEXT PRIMARY KEY,
  cam_number TEXT NOT NULL,
  location_name TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  status TEXT DEFAULT 'ONLINE',
  detections INTEGER DEFAULT 0,
  density INTEGER DEFAULT 0,
  fps INTEGER DEFAULT 30,
  risk_level TEXT DEFAULT 'LOW',
  flow_direction TEXT DEFAULT 'Normal',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Safety & Incident Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  camera_id TEXT,
  severity TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ACTIVE',
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Operational Audit Trail Ledger Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  operator TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable Row Level Security (RLS) & Allow Read/Write for Authenticated and Anon Public
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnstile_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for zones" ON public.zones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for turnstiles" ON public.turnstile_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for cameras" ON public.camera_telemetry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for audit" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime Publications on All CrowdIQ Tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.zones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.turnstile_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.camera_telemetry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
`;

class SupabaseService {
  private client: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;
  private isConnected = false;
  private lastSyncTime: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initFromStoredConfig();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error in SupabaseService listener', err);
      }
    });
  }

  public getConfig(): SupabaseConfig {
    const defaultUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://afadfyatmxszxrebpcmb.supabase.co';
    const defaultKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KHzJO93wItwToU4tzkvh0w_C38YW5iF';

    try {
      const storedStr = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
      if (storedStr) {
        const stored = JSON.parse(storedStr);
        if (stored.url && stored.anonKey && String(stored.anonKey).trim() !== '') {
          return stored;
        }
      }
    } catch (_) {}

    // Save and return active credentials automatically
    const activeConfig: SupabaseConfig = {
      url: defaultUrl,
      anonKey: defaultKey,
      autoSync: true,
      realtimeEnabled: true,
    };
    try {
      localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(activeConfig));
    } catch (_) {}

    return activeConfig;
  }

  public saveConfig(config: SupabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
      this.initFromStoredConfig();
      this.notify();
    } catch (err) {
      console.error('Failed to save Supabase config', err);
    }
  }

  private initFromStoredConfig(): void {
    const config = this.getConfig();
    if (config.url && config.anonKey) {
      try {
        this.client = createClient(config.url, config.anonKey, {
          realtime: {
            params: {
              eventsPerSecond: 10,
            }
          }
        });
        this.isConnected = true;
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConnected = false;
      }
    } else {
      this.client = null;
      this.isConnected = false;
    }
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public getStatus() {
    const config = this.getConfig();
    return {
      isConfigured: Boolean(config.url && config.anonKey),
      isConnected: this.isConnected && Boolean(this.client),
      url: config.url,
      anonKeyMasked: config.anonKey ? `${config.anonKey.substring(0, 12)}...${config.anonKey.slice(-6)}` : '',
      lastSyncTime: this.lastSyncTime,
      autoSync: config.autoSync,
      realtimeEnabled: config.realtimeEnabled,
    };
  }

  /**
   * Tests connection to Supabase project
   */
  public async testConnection(url?: string, key?: string): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const testUrl = url || this.getConfig().url;
    const testKey = key || this.getConfig().anonKey;

    if (!testUrl || !testKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Public Anon Key.' };
    }

    const startTime = performance.now();
    try {
      const client = createClient(testUrl, testKey);
      // Query zones table or standard auth health check
      const { error } = await client.from('zones').select('id').limit(1);
      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        // Even if table doesn't exist yet, if we got a 404 or Postgres relation error, the connection itself is valid
        if (error.code === '42P01' || error.message.includes('relation "public.zones" does not exist')) {
          return {
            success: true,
            latencyMs,
            message: `Connected successfully (${latencyMs}ms)! Note: Tables not created yet. Run the SQL Migration Schema in Supabase SQL Editor.`,
          };
        }
        return {
          success: false,
          latencyMs,
          message: `Supabase Error: ${error.message} (Code: ${error.code})`,
        };
      }

      this.isConnected = true;
      this.notify();
      return {
        success: true,
        latencyMs,
        message: `Successfully connected to Supabase PostgreSQL (${latencyMs}ms). Database is live!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || String(err)}`,
      };
    }
  }

  /**
   * Pushes all local real-time operational data to Supabase PostgreSQL tables
   */
  public async syncAllToSupabase(payload: {
    zones: Zone[];
    cameraFeeds: CameraFeed[];
    tickets: TicketRecord[];
    alerts: AlertItem[];
    auditLogs: AuditLogRecord[];
  }): Promise<{ success: boolean; message: string; syncedCount: number }> {
    if (!this.client) {
      return { success: false, message: 'Supabase client is not configured or offline.', syncedCount: 0 };
    }

    try {
      let totalSynced = 0;

      // 1. Sync Zones
      if (payload.zones && payload.zones.length > 0) {
        const zoneRows = payload.zones.map(z => ({
          id: z.id,
          name: z.name,
          type: (z as any).type || z.category || 'GATE',
          current_people: z.currentPeople,
          max_capacity: z.maxCapacity,
          density: z.density,
          risk_level: z.riskLevel,
          inflow: z.inflow,
          outflow: z.outflow,
          flow_direction: z.flowDirection,
          status: (z as any).status || 'OPEN',
          updated_at: new Date().toISOString()
        }));
        const { error: zoneErr } = await this.client.from('zones').upsert(zoneRows, { onConflict: 'id' });
        if (!zoneErr) totalSynced += zoneRows.length;
      }

      // 2. Sync Turnstile Tickets
      if (payload.tickets && payload.tickets.length > 0) {
        const ticketRows = payload.tickets.slice(0, 100).map(t => ({
          id: t.id,
          attendee: t.attendee,
          tier: t.tier,
          zone: t.zone,
          gate: t.gate,
          valid: t.valid,
          used: t.used,
          scanned_at: t.timestamp || new Date().toLocaleTimeString(),
        }));
        const { error: tktErr } = await this.client.from('turnstile_tickets').upsert(ticketRows, { onConflict: 'id' });
        if (!tktErr) totalSynced += ticketRows.length;
      }

      // 3. Sync Camera Telemetry
      if (payload.cameraFeeds && payload.cameraFeeds.length > 0) {
        const camRows = payload.cameraFeeds.map(c => ({
          id: c.id,
          cam_number: c.camNumber,
          location_name: (c as any).locationName || c.name || c.camNumber,
          zone_id: c.zoneId,
          status: c.status,
          detections: c.simulatedDetections,
          density: c.density,
          fps: c.fps,
          risk_level: c.riskLevel,
          flow_direction: c.flowDirection,
          updated_at: new Date().toISOString()
        }));
        const { error: camErr } = await this.client.from('camera_telemetry').upsert(camRows, { onConflict: 'id' });
        if (!camErr) totalSynced += camRows.length;
      }

      // 4. Sync Alerts
      if (payload.alerts && payload.alerts.length > 0) {
        const alertRows = payload.alerts.map(a => ({
          id: a.id,
          title: a.title,
          zone_id: a.zoneId,
          camera_id: (a as any).cameraId || a.zoneId || null,
          severity: a.severity,
          description: a.description,
          status: a.status,
          recommendation: (a as any).recommendation || (a as any).actionTaken || null,
        }));
        const { error: alertErr } = await this.client.from('alerts').upsert(alertRows, { onConflict: 'id' });
        if (!alertErr) totalSynced += alertRows.length;
      }

      // 5. Sync Audit Logs
      if (payload.auditLogs && payload.auditLogs.length > 0) {
        const logRows = payload.auditLogs.slice(0, 50).map(l => ({
          id: l.id,
          timestamp: l.timestamp,
          action: l.action,
          details: l.details,
          operator: l.operator,
          severity: l.severity,
        }));
        const { error: logErr } = await this.client.from('audit_logs').upsert(logRows, { onConflict: 'id' });
        if (!logErr) totalSynced += logRows.length;
      }

      this.lastSyncTime = new Date().toLocaleTimeString();
      this.notify();

      return {
        success: true,
        message: `Successfully synchronized ${totalSynced} records directly into Supabase PostgreSQL database tables.`,
        syncedCount: totalSynced,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Sync failed: ${err.message || String(err)}`,
        syncedCount: 0,
      };
    }
  }

  /**
   * Synchronizes a single turnstile scan directly into Supabase
   */
  public async pushTicketScan(ticket: TicketRecord): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.from('turnstile_tickets').upsert({
        id: ticket.id,
        attendee: ticket.attendee,
        tier: ticket.tier,
        zone: ticket.zone,
        gate: ticket.gate,
        valid: ticket.valid,
        used: ticket.used,
        scanned_at: ticket.timestamp || new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.warn('Background Supabase ticket push deferred:', err);
    }
  }

  /**
   * Subscribes to Supabase Realtime WebSocket changes
   */
  public subscribeToRealtime(onRecordChange: (table: string, payload: any) => void): () => void {
    if (!this.client) return () => {};

    try {
      if (this.channel) {
        this.channel.unsubscribe();
      }

      this.channel = this.client
        .channel('crowdiq-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'zones' }, (payload) => {
          onRecordChange('zones', payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'turnstile_tickets' }, (payload) => {
          onRecordChange('turnstile_tickets', payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
          onRecordChange('alerts', payload);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true;
            this.notify();
          }
        });

      return () => {
        if (this.channel) {
          this.channel.unsubscribe();
          this.channel = null;
        }
      };
    } catch (err) {
      console.error('Failed to setup Supabase Realtime channel:', err);
      return () => {};
    }
  }

  public getSqlSchema(): string {
    return DEFAULT_SUPABASE_SQL_SCHEMA;
  }
}

export const supabaseService = new SupabaseService();
