import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Users, 
  DoorOpen, 
  DoorClosed, 
  Camera, 
  Database, 
  FileText, 
  Download, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Sliders, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Radio, 
  Send, 
  Volume2, 
  HardDrive, 
  UserCheck, 
  Layers, 
  Eye, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Zap,
  Sparkles,
  Maximize2,
  Video,
  Key,
  Shield,
  Server,
  Settings,
  Cpu,
  Save,
  Trash2,
  Check,
  Play,
  Pause,
  Copy,
  Wifi,
  Ticket,
  Cloud,
  Link2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { localDatabase, TicketRecord } from '../services/localDatabase';

// Initial Users List
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Incident Commander' | 'Chief Security Officer' | 'Zone Operator' | 'Tactical Dispatcher' | 'Read-only Analyst';
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
  twoFactor: boolean;
}

const INITIAL_USERS: AdminUser[] = [
  { id: 'USR-01', name: 'Cmdr. Marcus Vance', email: 'vance.m@arena.security.gov', role: 'Incident Commander', department: 'Executive Tactical Command', status: 'ACTIVE', lastLogin: 'Just now', twoFactor: true },
  { id: 'USR-02', name: 'Capt. Sarah Jenkins', email: 'jenkins.s@arena.security.gov', role: 'Chief Security Officer', department: 'Surveillance Operations', status: 'ACTIVE', lastLogin: '18 mins ago', twoFactor: true },
  { id: 'USR-03', name: 'Officer David Kross', email: 'kross.d@arena.security.gov', role: 'Tactical Dispatcher', department: 'Rapid Unit Response', status: 'ACTIVE', lastLogin: '42 mins ago', twoFactor: true },
  { id: 'USR-04', name: 'Elena Rostova', email: 'rostova.e@arena.security.gov', role: 'Zone Operator', department: 'Gate B & Ingress Monitoring', status: 'ACTIVE', lastLogin: '2 hours ago', twoFactor: false },
  { id: 'USR-05', name: 'Alex Morales', email: 'morales.a@arena.analytics.io', role: 'Read-only Analyst', department: 'Data Intelligence', status: 'ACTIVE', lastLogin: 'Yesterday', twoFactor: true },
];

export const AdminPortalPage: React.FC = () => {
  const { 
    zones, 
    securityTeams, 
    cameraFeeds, 
    alerts, 
    settings, 
    updateSettings, 
    dispatchSecurityTeam, 
    toggleEmergencyMode, 
    emergencyMode, 
    playAlertSound, 
    openDatabaseModal,
    currentTime,
    isRealtimeActive,
    toggleRealtimeStream,
    injectRealtimeIngress,
    injectBatchIngress,
    isBackendConnected,
    backendInfo,
    backendLatency,
    isBackendWsConnected,
    testBackendConnection,
    syncAllToBackend,
    supabaseStatus,
    syncAllToSupabase,
    testSupabaseConnection,
    saveSupabaseConfig,
    getSupabaseSqlSchema
  } = useSimulation();

  // Authentication State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(true);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Console Top Navigation Tab
  // User spec: Users, Roles & permissions, Cameras, Events, Zones, System health, Audit logs, Settings
  const [adminSubTab, setAdminSubTab] = useState<'users' | 'roles' | 'cameras' | 'events' | 'zones' | 'health' | 'audit' | 'settings'>('users');
  
  // Local Database records & state
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState(localDatabase.getAuditLogs());
  const [dbStats, setDbStats] = useState(localDatabase.getDatabaseStats());
  const [gateStatuses, setGateStatuses] = useState(localDatabase.getGateStatuses());
  const [liveTickets, setLiveTickets] = useState<TicketRecord[]>(() => localDatabase.getTickets());
  const [activeCollectionTab, setActiveCollectionTab] = useState<'zones' | 'cameras' | 'tickets' | 'alerts' | 'teams' | 'audit'>('tickets');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<string>('ALL');

  // Supabase Cloud Link State
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseForm, setSupabaseForm] = useState({
    url: supabaseStatus.url || '',
    anonKey: '',
    autoSync: supabaseStatus.autoSync ?? true,
    realtimeEnabled: supabaseStatus.realtimeEnabled ?? true,
  });
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (supabaseStatus.url) {
      setSupabaseForm(prev => ({ ...prev, url: supabaseStatus.url }));
    }
  }, [supabaseStatus.url]);

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);
    const res = await testSupabaseConnection(supabaseForm.url, supabaseForm.anonKey);
    setSupabaseTestResult(res);
    setIsTestingSupabase(false);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseForm.url.trim(),
      anonKey: supabaseForm.anonKey.trim(),
      autoSync: supabaseForm.autoSync,
      realtimeEnabled: supabaseForm.realtimeEnabled,
    });
    playAlertSound('success');
  };

  const handleSyncAllSupabase = async () => {
    setIsSyncingSupabase(true);
    await syncAllToSupabase();
    setIsSyncingSupabase(false);
    playAlertSound('success');
  };

  // Real-time Attendance & Inflow Metrics
  const attendanceStats = useMemo(() => localDatabase.getAttendanceStats(), [zones, liveTickets]);

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Zone Operator' as AdminUser['role'],
    department: 'Concourse Operations'
  });

  // Settings form state
  const [configSettings, setConfigSettings] = useState({
    eventName: settings.eventName || 'World Championship Finals 2026',
    venueCapacity: settings.venueCapacity || 25000,
    criticalDensityThreshold: settings.criticalDensityThreshold || 85,
    warningDensityThreshold: settings.warningDensityThreshold || 70,
    autoDispatchEnabled: true,
    alarmVolume: 80,
    logRetentionDays: 90,
    webhookEndpoint: 'https://security-api.arena.lan/v1/telemetry'
  });
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  // Roles & Permissions Matrix
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
    'Incident Commander': { feeds: true, ptz: true, emergency: true, dispatch: true, events: true, audit: true, database: true },
    'Chief Security Officer': { feeds: true, ptz: true, emergency: true, dispatch: true, events: true, audit: true, database: false },
    'Zone Operator': { feeds: true, ptz: true, emergency: false, dispatch: false, events: false, audit: false, database: false },
    'Tactical Dispatcher': { feeds: true, ptz: false, emergency: true, dispatch: true, events: false, audit: true, database: false },
    'Read-only Analyst': { feeds: true, ptz: false, emergency: false, dispatch: false, events: false, audit: true, database: false },
  });

  // Sync audit logs, tickets, and stats
  const refreshAdminData = () => {
    setAuditLogs(localDatabase.getAuditLogs());
    setDbStats(localDatabase.getDatabaseStats());
    setGateStatuses(localDatabase.getGateStatuses());
    setLiveTickets(localDatabase.getTickets());
  };

  useEffect(() => {
    refreshAdminData();
    const unsub = localDatabase.subscribe(refreshAdminData);
    return () => unsub();
  }, [zones, alerts, cameraFeeds]);

  // Log single optical frame detection
  const handleLogCctvFrame = () => {
    if (cameraFeeds.length === 0) return;
    const randomFeed = cameraFeeds[Math.floor(Math.random() * cameraFeeds.length)];
    const people = Math.floor(Math.random() * 45) + 30;
    const density = Math.min(100, Math.floor(people * 1.2));
    localDatabase.recordRealtimeDetection(randomFeed.id, people, density, 'Southward Inflow', density > 80 ? 'CRITICAL' : 'MODERATE');
    localDatabase.addAuditLog('CCTV_FRAME_INSPECTED', `Neural vision frame analyzed for ${randomFeed.camNumber} (${randomFeed.locationName}): ${people} pax, density ${density}%`, 'YOLO_SORT_ENGINE', density > 80 ? 'WARNING' : 'INFO');
    playAlertSound('info');
  };

  // Auth unlock handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'ADMIN-2026' || passcode.trim() === 'admin' || passcode.trim() === '1234') {
      setIsAdminUnlocked(true);
      setAuthError(null);
      localDatabase.addAuditLog('ADMIN_AUTHENTICATED', 'Operator authenticated with Master Commander credentials', 'CMDR_VANCE', 'SUCCESS');
    } else {
      setAuthError('Invalid Security Passcode. Default master passcode is ADMIN-2026');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const added: AdminUser = {
      id: `USR-0${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: 'ACTIVE',
      lastLogin: 'Never',
      twoFactor: false
    };
    setUsers([...users, added]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Zone Operator', department: 'Concourse Operations' });
    localDatabase.addAuditLog('USER_CREATED', `Registered new operator ${added.name} with role ${added.role}`, 'CMDR_VANCE', 'SUCCESS');
    playAlertSound('info');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
    playAlertSound('warning');
  };

  const togglePermission = (role: string, permKey: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role][permKey]
      }
    }));
    playAlertSound('info');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      eventName: configSettings.eventName,
      venueCapacity: configSettings.venueCapacity,
      criticalDensityThreshold: configSettings.criticalDensityThreshold,
      warningDensityThreshold: configSettings.warningDensityThreshold,
    });
    setIsSettingsSaved(true);
    localDatabase.addAuditLog('PLATFORM_SETTINGS_UPDATED', 'Updated global safety thresholds and emergency configurations', 'CMDR_VANCE', 'INFO');
    playAlertSound('info');
    setTimeout(() => setIsSettingsSaved(false), 3000);
  };

  // Export handlers
  const handleExportCSV = () => {
    const csvStr = localDatabase.exportAuditCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CrowdIQ_Admin_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    localDatabase.addAuditLog('AUDIT_EXPORT', 'Exported comprehensive operational CSV report', 'CMDR_VANCE', 'INFO');
  };

  const handleExportJSON = () => {
    const jsonStr = localDatabase.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CrowdIQ_Full_Database_Dump_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    localDatabase.addAuditLog('DATABASE_EXPORT', 'Exported full JSON database dump', 'CMDR_VANCE', 'INFO');
  };

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesFilter = auditSeverityFilter === 'ALL' ? true : log.severity === auditSeverityFilter;
      const matchesSearch = 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.operator.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [auditLogs, auditSeverityFilter, searchQuery]);

  // Auth lock screen
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
              RESTRICTED COMMAND CLEARANCE
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              CrowdIQ Admin Console 🔐
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Authentication required to access Users, Roles, Cameras, Events, Zones, Health & Audit Logs.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-mono font-bold uppercase text-slate-700 block mb-1.5">
                Master Security Passcode
              </label>
              <input
                type="password"
                placeholder="Enter ADMIN-2026..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
                autoFocus
              />
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                Tip: Default master passcode is <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-bold">ADMIN-2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>AUTHENTICATE & ENTER CONSOLE</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* 1. TOP ADMIN IDENTITY & MASTER OPERATIONS BAR */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-2xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  MASTER ADMIN CONSOLE 🔐
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  RECORDING ACTIVE
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10">
                  DB SIZE: {dbStats.sizeKB} KB
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1.5">
                CrowdIQ Administrative Command Center
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                <span>Commander: <strong>Cmdr. Marcus Vance</strong></span>
                <span>•</span>
                <span>Role: <strong>Level 5 SuperAdmin</strong></span>
                <span>•</span>
                <span>Master Clock: <strong>{currentTime} IST</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Master Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition shadow-md cursor-pointer ${
                supabaseStatus.isConnected
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/40'
              }`}
              title="Configure Supabase PostgreSQL link and realtime replication"
            >
              <Cloud className="w-4 h-4 text-emerald-300" />
              <span>Supabase {supabaseStatus.isConnected ? 'Linked 🟢' : 'Link DB ⚡'}</span>
            </button>

            <button
              onClick={openDatabaseModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition shadow-md cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Storage DB ({dbStats.transactionCount})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-mono font-bold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Audit CSV</span>
            </button>

            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1.5 REAL-TIME TELEMETRY & DATABASE STREAM ENGINE */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl border border-indigo-500/20 p-5 shadow-lg text-white space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isRealtimeActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'}`}>
              <Radio className={`w-5 h-5 ${isRealtimeActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isRealtimeActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  {isRealtimeActive ? 'REAL-TIME DB STREAM: LIVE' : 'STREAM: PAUSED'}
                </span>
                <span className="text-[11px] font-mono text-indigo-300">
                  Storage Adapter: HTML5 LocalStorage + Supabase Cloud Engine
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-1">
                Real-Time Telemetry & Database Ingress Controller
              </h2>
            </div>
          </div>

          {/* Quick Real-Time Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncAllSupabase}
              disabled={isSyncingSupabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
              title="Push all live records to Supabase PostgreSQL database tables"
            >
              <Cloud className={`w-3.5 h-3.5 text-teal-200 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync to Supabase'}</span>
            </button>

            <button
              onClick={() => injectRealtimeIngress('Walk-in ' + Math.floor(Math.random() * 900 + 100), 'gate-b', 'General Admission')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer active:scale-95"
              title="Record single turnstile attendee barcode scan into database"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>+1 Scan Attendee</span>
            </button>

            <button
              onClick={() => injectBatchIngress(25, 'gate-b')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer active:scale-95"
              title="Simulate rapid turnstile wave of 25 attendees"
            >
              <Users className="w-3.5 h-3.5 text-blue-200" />
              <span>+25 Batch Ingress</span>
            </button>

            <button
              onClick={handleLogCctvFrame}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer active:scale-95"
              title="Record neural YOLO detection telemetry frame into camera feed database"
            >
              <Camera className="w-3.5 h-3.5 text-purple-200" />
              <span>Log CCTV Detection</span>
            </button>

            <button
              onClick={toggleRealtimeStream}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition shadow-sm cursor-pointer ${
                isRealtimeActive 
                  ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRealtimeActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Admitted</span>
            <div className="text-lg font-extrabold text-white mt-0.5">{attendanceStats.totalAdmitted.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live admissions
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inside Venue</span>
            <div className="text-lg font-extrabold text-blue-400 mt-0.5">{attendanceStats.currentlyInside.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400">{attendanceStats.occupancyPercentage}% capacity</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inflow Velocity</span>
            <div className="text-lg font-extrabold text-amber-400 mt-0.5">{attendanceStats.currentInflowPerMinute}/min</div>
            <span className="text-[10px] text-slate-400">All turnstiles</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">DB Transactions</span>
            <div className="text-lg font-extrabold text-indigo-400 mt-0.5">{dbStats.transactionCount}</div>
            <span className="text-[10px] text-slate-400">Atomic commits</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Storage Size</span>
            <div className="text-lg font-extrabold text-slate-200 mt-0.5">{dbStats.sizeKB} KB</div>
            <span className="text-[10px] text-emerald-400">LocalStorage DB</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ambient Ingestion</span>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">2.5s Sync</div>
            <span className="text-[10px] text-slate-400">Neural + Gates</span>
          </div>
        </div>

        {/* Real-Time Turnstile Admissions Live Ticker */}
        <div className="bg-black/30 rounded-xl border border-white/10 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                Live Turnstile Ingress Stream ({liveTickets.length} recorded)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Auto-streaming to database ledger</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {liveTickets.slice(0, 4).map((ticket, idx) => (
              <div 
                key={ticket.id + '-' + idx} 
                className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between text-[11px] font-mono hover:bg-white/10 transition"
              >
                <div>
                  <div className="font-bold text-white truncate max-w-[130px]">{ticket.attendee}</div>
                  <div className="text-[10px] text-slate-400">{ticket.id} • {ticket.gate}</div>
                </div>
                <div className="text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    ticket.tier.includes('VIP') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {ticket.tier}
                  </span>
                  <div className="text-[9px] text-emerald-400 mt-0.5">{ticket.timestamp || currentTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ADMIN CONSOLE SUB-MODULE NAVIGATION TABS */}
      {/* Users | Roles & permissions | Cameras | Events | Zones | System health | Audit logs | Settings */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { id: 'roles', label: 'Roles & Permissions', icon: <Key className="w-4 h-4" /> },
            { id: 'cameras', label: 'Cameras', icon: <Video className="w-4 h-4" /> },
            { id: 'events', label: 'Events', icon: <Clock className="w-4 h-4" /> },
            { id: 'zones', label: 'Zones', icon: <Layers className="w-4 h-4" /> },
            { id: 'health', label: 'System Health', icon: <Server className="w-4 h-4" /> },
            { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = adminSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SUB-MODULE VIEWS */}

      {/* SUBMODULE A: USERS */}
      {adminSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Operator & User Management</h2>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Authorized security operators, access clearance levels, and two-factor enforcement
              </p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Role & Clearance</th>
                  <th className="p-3">2FA</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="p-3">
                      <div className="font-bold text-[#0F172A]">{u.name}</div>
                      <div className="text-[10px] text-[#64748B]">{u.email}</div>
                    </td>
                    <td className="p-3 text-[#475569]">{u.department}</td>
                    <td className="p-3 font-semibold text-[#2563EB]">{u.role}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${u.twoFactor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {u.twoFactor ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-3 text-[#64748B]">{u.lastLogin}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                          u.status === 'ACTIVE' 
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE B: ROLES & PERMISSIONS */}
      {adminSubTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h2 className="text-base font-extrabold text-[#0F172A]">Roles & Permissions Matrix</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Granular role-based capability enforcement for video streams, emergency klaxon, unit dispatching, and audit ledgers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Role Name</th>
                  <th className="p-3 text-center">Video Feeds</th>
                  <th className="p-3 text-center">PTZ Controls</th>
                  <th className="p-3 text-center">Emergency PA</th>
                  <th className="p-3 text-center">Tactical Dispatch</th>
                  <th className="p-3 text-center">Manage Events</th>
                  <th className="p-3 text-center">Audit Logs</th>
                  <th className="p-3 text-center">Database Reset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {Object.entries(rolePermissions).map(([roleName, perms]) => (
                  <tr key={roleName} className="hover:bg-[#F8FAFC] transition">
                    <td className="p-3 font-bold text-[#0F172A]">{roleName}</td>
                    {(['feeds', 'ptz', 'emergency', 'dispatch', 'events', 'audit', 'database'] as const).map(key => (
                      <td key={key} className="p-3 text-center">
                        <button
                          onClick={() => togglePermission(roleName, key)}
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition cursor-pointer ${
                            perms[key] 
                              ? 'bg-emerald-500 text-white shadow-2xs' 
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perms[key] ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '—'}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE C: CAMERAS */}
      {adminSubTab === 'cameras' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">CCTV Camera Infrastructure Nodes</h2>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Surveillance camera edge endpoints, RTSP protocols, resolution tiers, and link status
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              8 Nodes Registered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'CAM-01', name: 'Main Gate Ingress A', zone: 'Gate A', ip: '192.168.10.101', fps: 30, res: '1080p', status: 'ONLINE' },
              { id: 'CAM-02', name: 'Gate 2 Turnstiles', zone: 'Gate B', ip: '192.168.10.102', fps: 30, res: '4K UHD', status: 'ONLINE' },
              { id: 'CAM-03', name: 'North Emergency Exit', zone: 'North Exit', ip: '192.168.10.103', fps: 0, res: '1080p', status: 'OFFLINE' },
              { id: 'CAM-04', name: 'Central Arena Plaza', zone: 'Core', ip: '192.168.10.104', fps: 28, res: '4K UHD', status: 'ONLINE' },
              { id: 'CAM-05', name: 'South Concourse & Food', zone: 'South Wing', ip: '192.168.10.105', fps: 30, res: '1080p', status: 'ONLINE' },
              { id: 'CAM-06', name: 'VIP Lounge Mezzanine', zone: 'VIP', ip: '192.168.10.106', fps: 30, res: '4K UHD', status: 'ONLINE' },
              { id: 'CAM-07', name: 'Emergency Stairwell B', zone: 'Stairwell', ip: '192.168.10.107', fps: 20, res: '720p', status: 'ONLINE' },
              { id: 'CAM-08', name: 'West Gate Turnstiles', zone: 'Gate C', ip: '192.168.10.108', fps: 30, res: '1080p', status: 'ONLINE' },
            ].map(cam => (
              <div key={cam.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">{cam.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${cam.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {cam.status}
                  </span>
                </div>
                <div className="font-bold text-slate-900 truncate">{cam.name}</div>
                <div className="text-[10px] text-slate-500">Zone: {cam.zone} • IP: {cam.ip}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-600">
                  <span>{cam.res}</span>
                  <span className="font-bold text-emerald-600">{cam.fps} FPS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE D: EVENTS */}
      {adminSubTab === 'events' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Event Schedule & Capacity Operations</h2>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Current active venue event parameters, attendance allowances, and turnstile concourse allocations
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Active Hosted Event</span>
                <div className="text-base font-bold text-slate-900">{settings.eventName}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                PRODUCTION LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Venue Capacity</span>
                <span className="text-slate-900 font-bold">{settings.venueCapacity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Critical Threshold</span>
                <span className="text-rose-600 font-bold">{settings.criticalDensityThreshold}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Warning Threshold</span>
                <span className="text-amber-600 font-bold">{settings.warningDensityThreshold}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Security Squads</span>
                <span className="text-blue-600 font-bold">{securityTeams.length} Active Squads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE E: ZONES */}
      {adminSubTab === 'zones' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h2 className="text-base font-extrabold text-[#0F172A]">Venue Zones & Sector Safety Limits</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Sector capacity ceilings, real-time saturation load, flow vectors, and gate door statuses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map(z => (
              <div key={z.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{z.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    z.density >= 85 ? 'bg-rose-100 text-rose-800' :
                    z.density >= 70 ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {z.density}% Load
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Occupancy: {z.currentPeople} / {z.maxCapacity} cap
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${z.density >= 85 ? 'bg-rose-500' : z.density >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${z.density}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>In: {z.inflow}/m</span>
                  <span>Out: {z.outflow}/m</span>
                  <span className="text-blue-600 font-bold">{z.flowDirection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMODULE F: SYSTEM HEALTH */}
      {adminSubTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Edge Node & Neural Inference Health</h2>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  YOLOv8 Computer Vision pipeline metrics, WebSocket latency, dropped frames, and GPU compute
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Edge CV Inference</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">29.8 FPS</div>
                <span className="text-[10px] text-emerald-600 font-bold">YOLOv8x on TensorRT</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Inference Latency</span>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">16.4 ms</div>
                <span className="text-[10px] text-slate-500">Under 33ms target</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">GPU Memory VRAM</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">4.2 / 16 GB</div>
                <span className="text-[10px] text-emerald-600 font-bold">26% Utilization</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Dropped Frame Rate</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">0.00%</div>
                <span className="text-[10px] text-slate-500">Zero packet drops</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono space-y-2">
                <div className="font-bold text-blue-900 flex items-center justify-between">
                  <span>Local Engine: HTML5 Storage</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                  <span>Key: <code className="bg-white px-1.5 py-0.5 rounded border">CROWDGUARD_MASTER_DB_V2</code></span>
                  <span>Size: <strong>{dbStats.sizeKB} KB</strong></span>
                  <span>Tx: <strong>{dbStats.transactionCount} entries</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-mono space-y-2">
                <div className="font-bold text-indigo-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    Python FastAPI + PyTorch AI
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isBackendConnected ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isBackendConnected ? 'ONLINE 🟢' : 'STANDBY ⚡'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Target: <strong>http://127.0.0.1:8000</strong> ({backendLatency ? `${backendLatency}ms` : 'Local'})</span>
                  <button
                    onClick={openDatabaseModal}
                    className="text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                  >
                    Inspect Engine →
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono space-y-2">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    Cloud Engine: Supabase Realtime
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    supabaseStatus.isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {supabaseStatus.isConnected ? 'LINKED 🟢' : 'STANDBY ⚡'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Target: <strong>{supabaseStatus.url ? (supabaseStatus.url.replace(/^https?:\/\//, '').split('/')[0]) : 'Local Fallback'}</strong></span>
                  <button
                    onClick={() => setIsSupabaseModalOpen(true)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Configure Link →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME DATABASE COLLECTIONS INSPECTOR */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Live Database Collections & Real-Time Data Store
                </h2>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Inspect live database entities currently held in memory and synchronized with persistent storage
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    let dataToCopy: any = [];
                    if (activeCollectionTab === 'tickets') dataToCopy = liveTickets;
                    else if (activeCollectionTab === 'zones') dataToCopy = zones;
                    else if (activeCollectionTab === 'cameras') dataToCopy = cameraFeeds;
                    else if (activeCollectionTab === 'alerts') dataToCopy = alerts;
                    else if (activeCollectionTab === 'teams') dataToCopy = securityTeams;
                    else if (activeCollectionTab === 'audit') dataToCopy = auditLogs;
                    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
                    setCopiedNotification(true);
                    setTimeout(() => setCopiedNotification(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition cursor-pointer"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Collection JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={openDatabaseModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Full DB Backup / Restore</span>
                </button>
              </div>
            </div>

            {/* Collection Tab Selectors */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'tickets', label: `Turnstile Tickets (${liveTickets.length})` },
                { id: 'zones', label: `Zones Telemetry (${zones.length})` },
                { id: 'cameras', label: `CCTV Feeds (${cameraFeeds.length})` },
                { id: 'alerts', label: `Incident Alerts (${alerts.length})` },
                { id: 'teams', label: `Security Squads (${securityTeams.length})` },
                { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCollectionTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                    activeCollectionTab === tab.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Collection Inspector View */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[360px] border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
                <span>COLLECTION: <strong>{activeCollectionTab.toUpperCase()}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE UPDATING
                </span>
              </div>
              <pre className="text-[11px] leading-relaxed text-emerald-300">
                {JSON.stringify(
                  activeCollectionTab === 'tickets' ? liveTickets.slice(0, 10) :
                  activeCollectionTab === 'zones' ? zones :
                  activeCollectionTab === 'cameras' ? cameraFeeds :
                  activeCollectionTab === 'alerts' ? alerts :
                  activeCollectionTab === 'teams' ? securityTeams :
                  auditLogs.slice(0, 15),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULE G: AUDIT LOGS */}
      {adminSubTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Security Audit Ledger ({filteredAuditLogs.length})</h2>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Chronological immutable ledger of security interventions, camera changes, alarms, and admissions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search audit trail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-hidden focus:border-blue-500 w-44"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-mono">
                {['ALL', 'INFO', 'WARNING', 'CRITICAL', 'SUCCESS'].map(st => (
                  <button
                    key={st}
                    onClick={() => setAuditSeverityFilter(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                      auditSeverityFilter === st ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Event Details</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-blue-700">{log.action}</td>
                    <td className="p-3 text-slate-800 max-w-md truncate">{log.details}</td>
                    <td className="p-3 text-slate-600 font-semibold">{log.operator}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        log.severity === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMODULE H: SETTINGS */}
      {adminSubTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Platform Security Policies & Settings</h2>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Global density limits, automated incident triage rules, and webhook telemetry integrations
              </p>
            </div>
            {isSettingsSaved && (
              <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Settings Successfully Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Venue Event Name</label>
                <input
                  type="text"
                  value={configSettings.eventName}
                  onChange={(e) => setConfigSettings({ ...configSettings, eventName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Venue Capacity Quota</label>
                <input
                  type="number"
                  value={configSettings.venueCapacity}
                  onChange={(e) => setConfigSettings({ ...configSettings, venueCapacity: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Critical Density Threshold (%)</label>
                <input
                  type="number"
                  value={configSettings.criticalDensityThreshold}
                  onChange={(e) => setConfigSettings({ ...configSettings, criticalDensityThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Warning Density Threshold (%)</label>
                <input
                  type="number"
                  value={configSettings.warningDensityThreshold}
                  onChange={(e) => setConfigSettings({ ...configSettings, warningDensityThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Security Webhook Endpoint</label>
              <input
                type="text"
                value={configSettings.webhookEndpoint}
                onChange={(e) => setConfigSettings({ ...configSettings, webhookEndpoint: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wider transition cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE PLATFORM CONFIGURATION</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-[#0F172A] text-base">Register New Operator</h3>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name & Title</label>
                <input
                  type="text"
                  placeholder="e.g. Officer Rachel Cruz"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Security Email</label>
                <input
                  type="email"
                  placeholder="cruz.r@arena.security.gov"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Role & Clearance</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    <option value="Incident Commander">Incident Commander</option>
                    <option value="Chief Security Officer">Chief Security Officer</option>
                    <option value="Zone Operator">Zone Operator</option>
                    <option value="Tactical Dispatcher">Tactical Dispatcher</option>
                    <option value="Read-only Analyst">Read-only Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save & Authorize User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Cloud Link Modal */}
      {isSupabaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                    Supabase PostgreSQL Cloud Link
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      supabaseStatus.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {supabaseStatus.isConnected ? 'CONNECTED' : 'STANDBY'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Bidirectional real-time replication between CrowdIQ and Supabase
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSupabaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Test result banner if available */}
            {supabaseTestResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                supabaseTestResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {supabaseTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{supabaseTestResult.success ? 'Connection Successful!' : 'Connection Error'}</div>
                  <div className="text-[11px] mt-0.5">{supabaseTestResult.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://afadfyatmxszxrebpcmb.supabase.co"
                  value={supabaseForm.url}
                  onChange={(e) => setSupabaseForm({ ...supabaseForm, url: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono"
                  required
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Targeting Project: <strong>afadfyatmxszxrebpcmb</strong></span>
                  <a 
                    href="https://supabase.com/dashboard/project/afadfyatmxszxrebpcmb/settings/api" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 font-bold"
                  >
                    Open API Settings <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>Supabase Public / Anon API Key</span>
                  <a 
                    href="https://supabase.com/dashboard/project/afadfyatmxszxrebpcmb/settings/api" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 font-bold normal-case text-[10px]"
                  >
                    Copy anon key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  placeholder="Paste your anon public key (eyJhbGci...)"
                  value={supabaseForm.anonKey}
                  onChange={(e) => setSupabaseForm({ ...supabaseForm, anonKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {supabaseStatus.anonKeyMasked ? `Currently registered: ${supabaseStatus.anonKeyMasked}` : 'Paste your anon key from your Supabase Dashboard to complete the link.'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supabaseForm.autoSync}
                    onChange={(e) => setSupabaseForm({ ...supabaseForm, autoSync: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-800 font-bold">Auto-Push Live Admissions & Ingress to Cloud</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supabaseForm.realtimeEnabled}
                    onChange={(e) => setSupabaseForm({ ...supabaseForm, realtimeEnabled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-800 font-bold">Subscribe to Supabase Realtime Channels (PostgreSQL WAL)</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={isTestingSupabase}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isTestingSupabase ? 'Testing Ping...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSchemaModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>SQL Migration Schema</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncAllSupabase}
                    disabled={isSyncingSupabase}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    <Cloud className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingSupabase ? 'Syncing...' : 'Sync All Live Data'}</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Credentials</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase PostgreSQL Migration SQL Schema Modal */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-scaleUp text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Supabase PostgreSQL Real-Time Migration Script
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Copy and run in your Supabase Dashboard: <strong>SQL Editor → New query</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSchemaModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs max-h-[380px] overflow-y-auto text-emerald-300 select-all">
              <pre>{getSupabaseSqlSchema()}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">
                Enables UUID, RLS policies, and PostgreSQL Realtime Publications
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSchemaModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getSupabaseSqlSchema());
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Migration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
