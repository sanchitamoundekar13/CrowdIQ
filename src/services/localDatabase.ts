/**
 * CrowdIQ Production Local Storage Database Engine
 * High-performance, offline-first persistent storage adapter.
 * Connects operational telemetry, zones, security teams, alerts,
 * settings, turnstile tickets, and audit trails directly into browser storage.
 */

import { Zone, SecurityTeam, CameraFeed, AlertItem, EventSettings } from '../types';
import { initialZones, initialSecurityTeams, initialCameraFeeds, initialAlerts, initialSettings } from '../data/initialData';

export interface TicketRecord {
  id: string;
  attendee: string;
  tier: string;
  zone: string;
  gate: string;
  valid: boolean;
  used: boolean;
  timestamp: string | null;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  operator: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
}

export interface DatabaseMetadata {
  schemaVersion: string;
  databaseName: string;
  isConnected: boolean;
  lastSyncedAt: string;
  transactionCount: number;
}

const STORAGE_KEYS = {
  METADATA: 'crowdiq_db_metadata',
  ZONES: 'crowdiq_zones_db',
  SECURITY_TEAMS: 'crowdiq_security_teams_db',
  CAMERA_FEEDS: 'crowdiq_camera_feeds_db',
  ALERTS: 'crowdiq_alerts_db',
  SETTINGS: 'crowdiq_settings_db',
  TICKETS: 'crowdiq_tickets_db',
  AUDIT_LOGS: 'crowdiq_audit_logs_db',
} as const;

const INITIAL_TICKETS: TicketRecord[] = [
  { id: 'TKT-8841-VIP', attendee: 'Elena Rostova', tier: 'VIP Access', zone: 'zone-arena-bowl', gate: 'Gate VIP-1', valid: true, used: false, timestamp: null },
  { id: 'TKT-7729-GEN', attendee: 'Marcus Chen', tier: 'General Admission', zone: 'zone-north-gate', gate: 'Gate North-A', valid: true, used: true, timestamp: '18:22:10' },
  { id: 'TKT-9912-STF', attendee: 'Sarah Jenkins', tier: 'Security / Staff', zone: 'ALL-ZONES', gate: 'Gate All', valid: true, used: false, timestamp: null },
  { id: 'TKT-4410-GEN', attendee: 'Devin Thorne', tier: 'General Admission', zone: 'zone-east-food', gate: 'Gate East-C', valid: true, used: false, timestamp: null },
  { id: 'TKT-3105-GEN', attendee: 'Aria Patel', tier: 'General Admission', zone: 'zone-west-concourse', gate: 'Gate West-B', valid: true, used: false, timestamp: null },
];

const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  { id: 'log-001', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), action: 'SYSTEM_BOOT', details: 'CrowdIQ Neural Vision Nodes & Telemetry initialized', operator: 'SYS_ADMIN', severity: 'INFO' },
  { id: 'log-002', timestamp: new Date(Date.now() - 2400000).toLocaleTimeString(), action: 'DATABASE_CONNECTED', details: 'Persistent Local Storage Engine bound to client storage', operator: 'SYS_ADMIN', severity: 'SUCCESS' },
  { id: 'log-003', timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(), action: 'GATING_ONLINE', details: 'Turnstile Barcode & Anti-Passback validation online', operator: 'CHIEF_SECURITY', severity: 'INFO' },
];

type StorageListener = () => void;

class LocalDatabase {
  private listeners: Set<StorageListener> = new Set();
  private transactionCounter = 0;

  constructor() {
    this.initDatabase();
  }

  public subscribe(callback: StorageListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in database listener', e);
      }
    });
  }

  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch (_) {
      return false;
    }
  }

  private safeGet<T>(key: string, fallback: T): T {
    try {
      if (!this.isStorageAvailable()) return fallback;
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[LocalDatabase] Failed to read key "${key}", falling back.`, err);
      return fallback;
    }
  }

  private safeSet<T>(key: string, data: T): void {
    try {
      if (!this.isStorageAvailable()) return;
      localStorage.setItem(key, JSON.stringify(data));
      this.transactionCounter++;
      this.touchMetadata();
      this.notify();
    } catch (err) {
      console.error(`[LocalDatabase] Failed to write key "${key}".`, err);
    }
  }

  private touchMetadata() {
    if (!this.isStorageAvailable()) return;
    const meta: DatabaseMetadata = {
      schemaVersion: '2.0.0',
      databaseName: 'CrowdIQ_Production_DB',
      isConnected: true,
      lastSyncedAt: new Date().toLocaleTimeString(),
      transactionCount: this.transactionCounter,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(meta));
    } catch (_) {}
  }

  public initDatabase(): void {
    if (!this.isStorageAvailable()) return;
    try {
      if (!localStorage.getItem(STORAGE_KEYS.METADATA)) {
        this.touchMetadata();
      }
      if (!localStorage.getItem(STORAGE_KEYS.ZONES)) {
        this.safeSet(STORAGE_KEYS.ZONES, initialZones);
      }
      if (!localStorage.getItem(STORAGE_KEYS.SECURITY_TEAMS)) {
        this.safeSet(STORAGE_KEYS.SECURITY_TEAMS, initialSecurityTeams);
      }
      if (!localStorage.getItem(STORAGE_KEYS.CAMERA_FEEDS)) {
        this.safeSet(STORAGE_KEYS.CAMERA_FEEDS, initialCameraFeeds);
      }
      if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
        this.safeSet(STORAGE_KEYS.ALERTS, initialAlerts);
      }
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        this.safeSet(STORAGE_KEYS.SETTINGS, initialSettings);
      }
      if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
        this.safeSet(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
        this.safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
      }
    } catch (e) {
      console.warn('[LocalDatabase] Initialization warning', e);
    }
  }

  // --- ZONES REPOSITORY ---
  public getZones(): Zone[] {
    return this.safeGet<Zone[]>(STORAGE_KEYS.ZONES, initialZones);
  }

  public saveZones(zones: Zone[]): void {
    this.safeSet(STORAGE_KEYS.ZONES, zones);
  }

  // --- SECURITY TEAMS REPOSITORY ---
  public getSecurityTeams(): SecurityTeam[] {
    return this.safeGet<SecurityTeam[]>(STORAGE_KEYS.SECURITY_TEAMS, initialSecurityTeams);
  }

  public saveSecurityTeams(teams: SecurityTeam[]): void {
    this.safeSet(STORAGE_KEYS.SECURITY_TEAMS, teams);
  }

  // --- CAMERA FEEDS REPOSITORY ---
  public getCameraFeeds(): CameraFeed[] {
    return this.safeGet<CameraFeed[]>(STORAGE_KEYS.CAMERA_FEEDS, initialCameraFeeds);
  }

  public saveCameraFeeds(feeds: CameraFeed[]): void {
    this.safeSet(STORAGE_KEYS.CAMERA_FEEDS, feeds);
  }

  // --- ALERTS REPOSITORY ---
  public getAlerts(): AlertItem[] {
    return this.safeGet<AlertItem[]>(STORAGE_KEYS.ALERTS, initialAlerts);
  }

  public saveAlerts(alerts: AlertItem[]): void {
    this.safeSet(STORAGE_KEYS.ALERTS, alerts);
  }

  // --- EVENT SETTINGS REPOSITORY ---
  public getSettings(): EventSettings {
    return this.safeGet<EventSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  }

  public saveSettings(settings: EventSettings): void {
    this.safeSet(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- TICKETS / PASSES REPOSITORY ---
  public getTickets(): TicketRecord[] {
    return this.safeGet<TicketRecord[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  }

  public saveTickets(tickets: TicketRecord[]): void {
    this.safeSet(STORAGE_KEYS.TICKETS, tickets);
  }

  public addTicket(ticket: TicketRecord): void {
    const list = this.getTickets();
    const updated = [ticket, ...list.filter(t => t.id !== ticket.id)];
    this.saveTickets(updated);
  }

  // --- AUDIT TRAIL LOG REPOSITORY ---
  public getAuditLogs(): AuditLogRecord[] {
    return this.safeGet<AuditLogRecord[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public addAuditLog(action: string, details: string, operator = 'DUTY_OFFICER', severity: AuditLogRecord['severity'] = 'INFO'): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogRecord = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      operator,
      severity
    };
    this.safeSet(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...logs.slice(0, 49)]);
  }

  // --- METADATA & TELEMETRY ---
  public getMetadata(): DatabaseMetadata {
    return this.safeGet<DatabaseMetadata>(STORAGE_KEYS.METADATA, {
      schemaVersion: '2.0.0',
      databaseName: 'CrowdIQ_Production_DB',
      isConnected: true,
      lastSyncedAt: new Date().toLocaleTimeString(),
      transactionCount: this.transactionCounter,
    });
  }

  public getDatabaseStats() {
    const zones = this.getZones();
    const teams = this.getSecurityTeams();
    const feeds = this.getCameraFeeds();
    const alerts = this.getAlerts();
    const tickets = this.getTickets();
    const logs = this.getAuditLogs();
    const meta = this.getMetadata();

    let totalChars = 0;
    Object.values(STORAGE_KEYS).forEach(k => {
      totalChars += (localStorage.getItem(k) || '').length;
    });
    const sizeKB = (totalChars / 1024).toFixed(2);

    return {
      isConnected: true,
      lastSyncedAt: meta.lastSyncedAt,
      sizeKB,
      transactionCount: meta.transactionCount,
      counts: {
        zones: zones.length,
        securityTeams: teams.length,
        cameraFeeds: feeds.length,
        alerts: alerts.length,
        tickets: tickets.length,
        auditLogs: logs.length,
      }
    };
  }

  // --- BACKUP & RESTORE ---
  public exportDatabaseJSON(): string {
    const backup = {
      version: '2.0.0',
      database: 'CrowdIQ_Production_DB',
      exportedAt: new Date().toISOString(),
      metadata: this.getMetadata(),
      zones: this.getZones(),
      securityTeams: this.getSecurityTeams(),
      cameraFeeds: this.getCameraFeeds(),
      alerts: this.getAlerts(),
      settings: this.getSettings(),
      tickets: this.getTickets(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.zones) this.saveZones(data.zones);
      if (data.securityTeams) this.saveSecurityTeams(data.securityTeams);
      if (data.cameraFeeds) this.saveCameraFeeds(data.cameraFeeds);
      if (data.alerts) this.saveAlerts(data.alerts);
      if (data.settings) this.saveSettings(data.settings);
      if (data.tickets) this.saveTickets(data.tickets);
      if (data.auditLogs) this.safeSet(STORAGE_KEYS.AUDIT_LOGS, data.auditLogs);
      this.addAuditLog('DATABASE_RESTORE', 'Full database restore successfully loaded from external backup JSON', 'SYS_ADMIN', 'SUCCESS');
      return true;
    } catch (err) {
      console.error('[LocalDatabase] Failed to restore database from JSON', err);
      return false;
    }
  }

  // --- GATE ACTUATIONS ---
  public getGateStatuses(): Record<string, 'OPEN' | 'RESTRICTED' | 'EVACUATION' | 'LOCKED'> {
    return this.safeGet<Record<string, 'OPEN' | 'RESTRICTED' | 'EVACUATION' | 'LOCKED'>>('crowdiq_gate_controls_db', {
      'gate-a': 'OPEN',
      'gate-b': 'OPEN',
      'gate-c': 'OPEN',
      'gate-vip': 'OPEN'
    });
  }

  public setGateStatus(gateId: string, status: 'OPEN' | 'RESTRICTED' | 'EVACUATION' | 'LOCKED', operator = 'ADMIN_COMMANDER'): void {
    const current = this.getGateStatuses();
    const updated = { ...current, [gateId]: status };
    this.safeSet('crowdiq_gate_controls_db', updated);
    this.addAuditLog('GATE_ACTUATION', `Gate [${gateId.toUpperCase()}] status commanded to ${status}`, operator, status === 'LOCKED' || status === 'EVACUATION' ? 'CRITICAL' : 'WARNING');
  }

  // --- ATTENDANCE & INFLOW METRICS ---
  public getAttendanceStats() {
    const zones = this.getZones();
    const settings = this.getSettings();
    const tickets = this.getTickets();
    const currentlyInside = zones.reduce((sum, z) => sum + (z.currentPeople || 0), 0);
    const capacityCeiling = settings.venueCapacity || 25000;
    const totalAdmitted = Math.max(currentlyInside + 3652, 18492);
    const totalExited = totalAdmitted - currentlyInside;
    const occupancyPercentage = Math.min(100, Math.round((currentlyInside / capacityCeiling) * 100));

    return {
      totalAdmitted,
      currentlyInside,
      totalExited,
      capacityCeiling,
      occupancyPercentage,
      peakHourExpected: '21:30 - 22:30 IST',
      currentInflowPerMinute: zones.reduce((sum, z) => sum + (z.inflow || 0), 0),
      currentOutflowPerMinute: zones.reduce((sum, z) => sum + (z.outflow || 0), 0),
      gates: [
        { id: 'gate-a', name: 'Gate A (North Plaza)', inflow: 85, total: 5410, status: this.getGateStatuses()['gate-a'] || 'OPEN' },
        { id: 'gate-b', name: 'Gate B (Main Concourse)', inflow: 158, total: 8940, status: this.getGateStatuses()['gate-b'] || 'OPEN' },
        { id: 'gate-c', name: 'Gate C (West Plaza)', inflow: 40, total: 3410, status: this.getGateStatuses()['gate-c'] || 'OPEN' },
        { id: 'gate-vip', name: 'Gate VIP (Concourse East)', inflow: 14, total: 732, status: this.getGateStatuses()['gate-vip'] || 'OPEN' },
      ]
    };
  }

  public exportAuditCSV(): string {
    const logs = this.getAuditLogs();
    const header = 'ID,Timestamp,Operator,Action,Severity,Details\n';
    const rows = logs.map(l => 
      `"${l.id}","${l.timestamp}","${l.operator}","${l.action}","${l.severity}","${l.details.replace(/"/g, '""')}"`
    ).join('\n');
    return header + rows;
  }

  public resetDatabaseToBaseline(): void {
    this.safeSet(STORAGE_KEYS.ZONES, initialZones);
    this.safeSet(STORAGE_KEYS.SECURITY_TEAMS, initialSecurityTeams);
    this.safeSet(STORAGE_KEYS.CAMERA_FEEDS, initialCameraFeeds);
    this.safeSet(STORAGE_KEYS.ALERTS, initialAlerts);
    this.safeSet(STORAGE_KEYS.SETTINGS, initialSettings);
    this.safeSet(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
    this.safeSet('crowdiq_gate_controls_db', {
      'gate-a': 'OPEN',
      'gate-b': 'OPEN',
      'gate-c': 'OPEN',
      'gate-vip': 'OPEN'
    });
    this.safeSet(STORAGE_KEYS.AUDIT_LOGS, [
      { id: 'log-reset', timestamp: new Date().toLocaleTimeString(), action: 'DATABASE_RESET', details: 'All operational records restored to factory baseline state', operator: 'SYS_ADMIN', severity: 'WARNING' },
      ...INITIAL_AUDIT_LOGS
    ]);
    this.addAuditLog('DATABASE_RESET', 'Factory baseline restored', 'SYS_ADMIN', 'INFO');
  }
}

export const localDatabase = new LocalDatabase();
