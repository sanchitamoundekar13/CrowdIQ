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
  Maximize2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { localDatabase, TicketRecord } from '../services/localDatabase';

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
    currentTime
  } = useSimulation();

  // Authentication State (Admin Access Lock)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(true);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab in the Records Section
  const [activeLedgerTab, setActiveLedgerTab] = useState<'tickets' | 'alerts' | 'audit' | 'teams'>('tickets');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Attendance & Gate State
  const [attendance, setAttendance] = useState(localDatabase.getAttendanceStats());
  const [gateStatuses, setGateStatuses] = useState(localDatabase.getGateStatuses());
  const [dbStats, setDbStats] = useState(localDatabase.getDatabaseStats());
  const [tickets, setTickets] = useState(localDatabase.getTickets());
  const [auditLogs, setAuditLogs] = useState(localDatabase.getAuditLogs());

  // Active CCTV Feed Selector for live monitoring
  const [selectedCamId, setSelectedCamId] = useState<string>('cam-01');

  // Ingress Record Simulation Form State
  const [newAttendeeName, setNewAttendeeName] = useState<string>('');
  const [newAttendeeTier, setNewAttendeeTier] = useState<string>('General Admission');
  const [newAttendeeGate, setNewAttendeeGate] = useState<string>('gate-b');
  const [ingressNotification, setIngressNotification] = useState<string | null>(null);

  // Manual Dispatch State
  const [selectedTeamToDispatch, setSelectedTeamToDispatch] = useState<string>('team-01');
  const [targetZoneToDispatch, setTargetZoneToDispatch] = useState<string>('gate-b');

  // Sync with localDatabase subscriptions
  const refreshAllAdminData = () => {
    setAttendance(localDatabase.getAttendanceStats());
    setGateStatuses(localDatabase.getGateStatuses());
    setDbStats(localDatabase.getDatabaseStats());
    setTickets(localDatabase.getTickets());
    setAuditLogs(localDatabase.getAuditLogs());
  };

  useEffect(() => {
    refreshAllAdminData();
    const unsub = localDatabase.subscribe(refreshAllAdminData);
    return () => unsub();
  }, [zones, alerts, securityTeams, cameraFeeds]);

  // Hourly influx demo curve (Real-world accumulation projection)
  const hourlyInflowData = useMemo(() => [
    { time: '14:00', entrants: 1200, exits: 150, inside: 1050 },
    { time: '15:00', entrants: 2800, exits: 320, inside: 3530 },
    { time: '16:00', entrants: 4900, exits: 680, inside: 7750 },
    { time: '17:00', entrants: 7600, exits: 1100, inside: 14250 },
    { time: '18:00', entrants: 8900, exits: 1650, inside: 17500 },
    { time: '19:00', entrants: 6200, exits: 2200, inside: 18492 },
    { time: '20:00 (Est)', entrants: 3100, exits: 3100, inside: 18492 },
    { time: '21:00 (Est)', entrants: 1400, exits: 4500, inside: 15392 },
  ], []);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t => 
      t.id.toLowerCase().includes(q) ||
      t.attendee.toLowerCase().includes(q) ||
      t.tier.toLowerCase().includes(q) ||
      t.gate.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    if (!searchQuery.trim()) return auditLogs;
    const q = searchQuery.toLowerCase();
    return auditLogs.filter(l => 
      l.action.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.operator.toLowerCase().includes(q) ||
      l.severity.toLowerCase().includes(q)
    );
  }, [auditLogs, searchQuery]);

  // Gate actuation handler
  const handleGateActuation = (gateId: string, status: 'OPEN' | 'RESTRICTED' | 'EVACUATION' | 'LOCKED') => {
    localDatabase.setGateStatus(gateId, status, 'CMDR_VANCE');
    refreshAllAdminData();
    playAlertSound('warning');
  };

  // Direct Squad Dispatch handler
  const handleDispatchSquad = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchSecurityTeam(selectedTeamToDispatch, targetZoneToDispatch);
    const teamObj = securityTeams.find(t => t.id === selectedTeamToDispatch);
    const zoneObj = zones.find(z => z.id === targetZoneToDispatch);
    localDatabase.addAuditLog(
      'DIRECT_DISPATCH',
      `Admin dispatched ${teamObj?.name || selectedTeamToDispatch} to sector ${zoneObj?.name || targetZoneToDispatch}`,
      'CMDR_VANCE',
      'WARNING'
    );
    refreshAllAdminData();
  };

  // Manual Ingress Admission & Real-time Record (People coming in)
  const handleManualAdmitAttendee = (overrideName?: string) => {
    const attendeeName = overrideName || (newAttendeeName.trim() ? newAttendeeName.trim() : `Visitor-${Math.floor(1000 + Math.random() * 9000)}`);
    const newTktId = `TKT-${Math.floor(1000 + Math.random() * 9000)}-${newAttendeeTier.slice(0, 3).toUpperCase()}`;
    const targetGateObj = attendance.gates.find(g => g.id === newAttendeeGate) || attendance.gates[0];

    const newTicket: TicketRecord = {
      id: newTktId,
      attendee: attendeeName,
      tier: newAttendeeTier,
      zone: newAttendeeGate === 'gate-a' ? 'North Plaza Gate' : newAttendeeGate === 'gate-b' ? 'West Concourse' : newAttendeeGate === 'gate-c' ? 'East Plaza' : 'Arena Main Bowl',
      gate: targetGateObj.name,
      valid: true,
      used: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    localDatabase.saveTickets([newTicket, ...tickets]);
    localDatabase.addAuditLog(
      'INGRESS_VERIFIED',
      `Optical turnstile scanned and admitted attendee "${attendeeName}" (${newAttendeeTier}) via ${targetGateObj.name}`,
      'TURNSTILE_OPTICAL',
      'SUCCESS'
    );
    setNewAttendeeName('');
    setIngressNotification(`Recorded ingress for ${attendeeName} at ${targetGateObj.name}`);
    setTimeout(() => setIngressNotification(null), 4000);
    playAlertSound('info');
    refreshAllAdminData();
  };

  const handleBatchAdmitAttendees = (count = 5) => {
    const sampleNames = ['Rohan Verma', 'Ananya Deshmukh', 'Kevin O\'Connor', 'Fatima Zahra', 'Liam Vance', 'Carlos Mendez', 'Yuki Tanaka', 'Zara Al-Mansoor', 'Dmitri Petrov', 'Priya Sharma'];
    const newRecords: TicketRecord[] = [];
    const nowTime = new Date().toLocaleTimeString();

    for (let i = 0; i < count; i++) {
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)] + ` #${Math.floor(100 + Math.random() * 900)}`;
      const randomGate = attendance.gates[Math.floor(Math.random() * attendance.gates.length)];
      newRecords.push({
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}-GEN`,
        attendee: randomName,
        tier: 'General Admission',
        zone: randomGate.name,
        gate: randomGate.name,
        valid: true,
        used: true,
        timestamp: nowTime,
      });
    }

    localDatabase.saveTickets([...newRecords, ...tickets]);
    localDatabase.addAuditLog(
      'BATCH_INGRESS_ADMISSION',
      `High-speed turnstile batch admission recorded +${count} attendees entering venue concourses`,
      'TURNSTILE_AUTOMATION',
      'INFO'
    );
    setIngressNotification(`Batch admission recorded +${count} entrants in persistent database ledger`);
    setTimeout(() => setIngressNotification(null), 4000);
    playAlertSound('info');
    refreshAllAdminData();
  };

  const handleRecordCCTVSnapshot = () => {
    const cam = cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0];
    localDatabase.addAuditLog(
      'CCTV_SURVEILLANCE_RECORD',
      `AI Neural Vision logged frame analysis on ${cam.name} (${cam.camNumber}): Density ${cam.density}%, FPS ${cam.fps}, Flow ${cam.flowDirection}, Detections: ${cam.simulatedDetections} persons`,
      'EDGE_YOLO_NODE',
      cam.riskLevel === 'CRITICAL' ? 'CRITICAL' : cam.riskLevel === 'WATCH' ? 'WARNING' : 'INFO'
    );
    setIngressNotification(`Recorded CCTV telemetry frame for ${cam.camNumber} into immutable audit database`);
    setTimeout(() => setIngressNotification(null), 4000);
    playAlertSound('info');
    refreshAllAdminData();
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

  // Authentication unlock verification
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

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
              RESTRICTED COMMAND CLEARANCE
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              CrowdIQ Admin Console
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Privileged access reserved for Incident Commanders, Chief Security Officers, and Venue Operations Directors.
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
              <span className="text-[10px] text-slate-400 block mt-1">
                Tip: Press Enter or use <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-bold">ADMIN-2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>AUTHENTICATE & ENTER ADMIN CONSOLE</span>
            </button>
          </form>

          <div className="pt-2 text-xs text-slate-400 font-mono">
            Audited & Recorded by LocalStorage Engine • TLS 1.3
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. TOP ADMIN IDENTITY & MASTER OPERATIONS BAR */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-2xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  LEVEL 5 MASTER ADMIN
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
                CrowdIQ Master Operations & Attendance Console
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                <span>Commander: <strong>Cmdr. Marcus Vance</strong></span>
                <span>•</span>
                <span>Venue: <strong>{settings.eventName}</strong></span>
                <span>•</span>
                <span>Master Clock: <strong>{currentTime} IST</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Master Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
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
              title="Download full operational audit CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Audit CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-mono font-bold transition cursor-pointer"
              title="Download entire database JSON snapshot"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>JSON Dump</span>
            </button>

            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition cursor-pointer"
              title="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ATTENDANCE & INFLOW TELEMETRY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900">
              Live Attendance & Turnstile Inflow Metrics
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Auto-recording every optical scan & gate ingress
          </span>
        </div>

        {/* Ingress Notification Toast */}
        {ingressNotification && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{ingressNotification}</span>
            </span>
            <span className="text-[10px] text-emerald-600 uppercase font-semibold bg-emerald-100 px-2 py-0.5 rounded">
              DB Synced
            </span>
          </div>
        )}

        {/* Turnstile Admission & People Ingress Recorder Bar */}
        <div className="bg-white rounded-2xl border border-blue-200/80 p-4 mb-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Admin Turnstile Controller
              </span>
              <h3 className="text-xs font-mono font-bold text-slate-900 mt-1">
                Record Attendee Ingress & Live Concourse Arrival
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Log turnstile gate scans directly into persistent storage to update live crowd tallies
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualAdmitAttendee()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
                title="Admit 1 person"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Record Ingress (+1)</span>
              </button>

              <button
                type="button"
                onClick={() => handleBatchAdmitAttendees(5)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
                title="Batch admit 5 people across turnstiles"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Batch Ingress (+5)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-mono font-bold text-slate-500 block mb-1">
                Attendee Name / Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. David Vance, VIP-04..."
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-mono font-bold text-slate-500 block mb-1">
                Pass Classification
              </label>
              <select
                value={newAttendeeTier}
                onChange={(e) => setNewAttendeeTier(e.target.value)}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
              >
                <option value="General Admission">General Admission</option>
                <option value="VIP Access">VIP Access</option>
                <option value="Security / Staff">Security / Staff</option>
                <option value="Press / Media">Press / Media</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] font-mono font-bold text-slate-500 block mb-1">
                Entry Gate Concourse
              </label>
              <select
                value={newAttendeeGate}
                onChange={(e) => setNewAttendeeGate(e.target.value)}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
              >
                {attendance.gates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Entrants Recorded */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Entrants Admitted</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {attendance.totalAdmitted.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold">+184 / 5min</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Recorded across all 4 entry concourses
            </p>
          </div>

          {/* Card 2: Currently Inside Venue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Currently Inside Arena</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {attendance.currentlyInside.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">
                / {attendance.capacityCeiling.toLocaleString()} cap
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  attendance.occupancyPercentage > 85 ? 'bg-rose-500' :
                  attendance.occupancyPercentage > 70 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${attendance.occupancyPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>{attendance.occupancyPercentage}% Occupancy</span>
              <span>{attendance.capacityCeiling - attendance.currentlyInside} Seats Free</span>
            </div>
          </div>

          {/* Card 3: Inflow Velocity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Inflow Velocity</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {attendance.currentInflowPerMinute}
              </span>
              <span className="text-xs font-mono text-slate-500">people / min</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>Outflow: <strong>{attendance.currentOutflowPerMinute}/min</strong></span>
              <span className="text-purple-600 font-bold">Net Influx +{attendance.currentInflowPerMinute - attendance.currentOutflowPerMinute}</span>
            </div>
          </div>

          {/* Card 4: Peak Expected Interval */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Forecast Surge Interval</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-1">
              {attendance.peakHourExpected}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              LSTM neural model anticipating +4,200 entrants during main headline
            </p>
          </div>

        </div>
      </div>

      {/* 3. INFLOW GRAPH & DYNAMIC GATE ACTUATION TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 8-Hour Admission Curve (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Cumulative Attendance & Ingress Velocity Timeline
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Real-time optical turnstile counts plotted against hourly exit telemetry
              </p>
            </div>
            <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 self-start">
              1-Minute Granularity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyInflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminColorInside" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="adminColorEntrants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} fontStyle="bold" />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="inside" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#adminColorInside)" name="Inside Venue" />
                <Area type="monotone" dataKey="entrants" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#adminColorEntrants)" name="Hourly Entrants" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Turnstile Gates Actuation & Control (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Gate Flow & Inflow Actuation
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
              Admin Override
            </span>
          </div>

          <div className="space-y-3">
            {attendance.gates.map((g) => {
              const currentStatus = gateStatuses[g.id] || 'OPEN';

              return (
                <div key={g.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{g.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Inflow: <strong>{g.inflow} people/min</strong> • Total: <strong>{g.total.toLocaleString()}</strong>
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      currentStatus === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      currentStatus === 'RESTRICTED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      currentStatus === 'EVACUATION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {currentStatus}
                    </span>
                  </div>

                  {/* Actuation Control Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleGateActuation(g.id, 'OPEN')}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                        currentStatus === 'OPEN' 
                          ? 'bg-emerald-600 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      OPEN
                    </button>
                    <button
                      onClick={() => handleGateActuation(g.id, 'RESTRICTED')}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                        currentStatus === 'RESTRICTED' 
                          ? 'bg-amber-600 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      RESTRICT
                    </button>
                    <button
                      onClick={() => handleGateActuation(g.id, 'EVACUATION')}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                        currentStatus === 'EVACUATION' 
                          ? 'bg-blue-600 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      EGRESS
                    </button>
                    <button
                      onClick={() => handleGateActuation(g.id, 'LOCKED')}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                        currentStatus === 'LOCKED' 
                          ? 'bg-rose-600 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      LOCK
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. CCTV NEURAL VISION MONITORING & RAPID SQUAD DISPATCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 4 Edge CCTV Streams Telemetry + Active Monitor (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Connected Neural CCTV Feeds & Detection Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All 4 Optical Nodes Active
              </span>
              <button
                type="button"
                onClick={handleRecordCCTVSnapshot}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-mono font-bold transition cursor-pointer"
                title="Log current CCTV detections directly into audit ledger"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Log Frame to DB</span>
              </button>
            </div>
          </div>

          {/* Active CCTV Camera Live HUD Monitor */}
          {(() => {
            const activeCam = cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0];

            return (
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-white space-y-3 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      LIVE STREAM • {activeCam.camNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {activeCam.name}
                    </span>
                  </div>

                  {/* Switch Active Camera */}
                  <div className="flex items-center gap-1">
                    {cameraFeeds.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCamId(c.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                          selectedCamId === c.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {c.camNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Neural Vision Overlay Canvas */}
                <div className="relative h-48 w-full bg-slate-900/90 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-between p-3 select-none">
                  {/* Top HUD Stats */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        REC
                      </span>
                      <span>RTSP://edge-node-{activeCam.id}.lan:554/live</span>
                    </div>
                    <span>{currentTime} IST • 1920x1080 @ {activeCam.fps} FPS</span>
                  </div>

                  {/* Simulated Bounding Boxes */}
                  <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center">
                    {/* Bounding box 1 */}
                    <div className="absolute left-[20%] top-[30%] w-20 h-28 border border-emerald-400/80 rounded bg-emerald-500/10 flex flex-col justify-between p-1 text-[9px] font-mono text-emerald-300">
                      <span>#1042 PERSON</span>
                      <span className="self-end">96% • 1.2m/s</span>
                    </div>
                    {/* Bounding box 2 */}
                    <div className="absolute left-[45%] top-[25%] w-24 h-32 border border-blue-400/80 rounded bg-blue-500/10 flex flex-col justify-between p-1 text-[9px] font-mono text-blue-300">
                      <span>#1043 PERSON</span>
                      <span className="self-end">98% • 1.4m/s</span>
                    </div>
                    {/* Bounding box 3 */}
                    <div className={`absolute right-[22%] top-[35%] w-22 h-26 border rounded flex flex-col justify-between p-1 text-[9px] font-mono ${
                      activeCam.riskLevel === 'CRITICAL' ? 'border-rose-500/90 bg-rose-500/20 text-rose-300 animate-pulse' :
                      activeCam.riskLevel === 'WATCH' ? 'border-amber-400/80 bg-amber-500/10 text-amber-300' :
                      'border-emerald-400/80 bg-emerald-500/10 text-emerald-300'
                    }`}>
                      <span>#1044 DENSITY_CLUSTER</span>
                      <span className="self-end">{activeCam.density}%</span>
                    </div>
                    {/* Crosshair Center */}
                    <div className="w-6 h-6 border-t border-l border-white/30 absolute"></div>
                    <div className="w-6 h-6 border-b border-r border-white/30 absolute"></div>
                  </div>

                  {/* Bottom Telemetry HUD */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono z-10 bg-slate-950/80 p-2 rounded border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span>Detections: <strong className="text-white">{activeCam.simulatedDetections} persons</strong></span>
                      <span>Density: <strong className="text-white">{activeCam.density}%</strong></span>
                      <span>Flow: <strong className="text-white">{activeCam.flowDirection}</strong></span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold border ${
                      activeCam.riskLevel === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      activeCam.riskLevel === 'WATCH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {activeCam.riskLevel} STATUS
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 4 Camera Cards with Click-to-Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cameraFeeds.map((cam) => {
              const isSelected = selectedCamId === cam.id;

              return (
                <div 
                  key={cam.id} 
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`p-3.5 rounded-xl border transition space-y-2 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cam.camNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{cam.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      cam.riskLevel === 'SAFE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      cam.riskLevel === 'WATCH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {cam.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Density</span>
                      <span className="font-bold text-slate-900">{cam.density}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Frame Rate</span>
                      <span className="font-bold text-slate-900">{cam.fps} FPS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Detections</span>
                      <span className="font-bold text-blue-600">{cam.simulatedDetections}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                    <span>Res: {cam.resolution}</span>
                    <span>Flow: {cam.flowDirection}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Direct Security Squad Dispatcher (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Direct Squad Dispatch
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Commander Override
            </span>
          </div>

          <form onSubmit={handleDispatchSquad} className="space-y-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Select Security Squad</label>
              <select
                value={selectedTeamToDispatch}
                onChange={(e) => setSelectedTeamToDispatch(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500 font-mono"
              >
                {securityTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.status}) • {t.membersCount} officers
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Target Sector / Gate</label>
              <select
                value={targetZoneToDispatch}
                onChange={(e) => setTargetZoneToDispatch(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500 font-mono"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Density: {z.density}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH SQUAD IMMEDIATELY</span>
            </button>
          </form>

          {/* Emergency PA & Klaxon Trigger */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                toggleEmergencyMode();
                playAlertSound('critical');
                localDatabase.addAuditLog('EMERGENCY_BROADCAST', 'Commander manually engaged full venue Emergency Evacuation mode', 'CMDR_VANCE', 'CRITICAL');
                refreshAllAdminData();
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition cursor-pointer flex items-center justify-center gap-2 border ${
                emergencyMode 
                  ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{emergencyMode ? 'HALT EMERGENCY BROADCAST' : 'ACTIVATE VENUE KLAXON & PA'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. MASTER DATA LEDGER & COMPLETE RECORDINGS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Ledger Header & Search */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900">
                Master Data Ledger (Recorded History & Telemetry)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Persistent storage recording every ticket verification, incident alarm, and operator action
            </p>
          </div>

          {/* Ledger Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:outline-hidden focus:border-blue-500 w-44"
              />
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
              <button
                onClick={() => setActiveLedgerTab('tickets')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  activeLedgerTab === 'tickets' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Turnstile Passes ({filteredTickets.length})
              </button>
              <button
                onClick={() => setActiveLedgerTab('alerts')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  activeLedgerTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incidents ({alerts.length})
              </button>
              <button
                onClick={() => setActiveLedgerTab('audit')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  activeLedgerTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit Trail ({filteredAuditLogs.length})
              </button>
              <button
                onClick={() => setActiveLedgerTab('teams')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  activeLedgerTab === 'teams' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Security Squads ({securityTeams.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Turnstile Passes */}
        {activeLedgerTab === 'tickets' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Ticket ID</th>
                  <th className="p-3.5">Attendee Name</th>
                  <th className="p-3.5">Pass Tier</th>
                  <th className="p-3.5">Assigned Concourse</th>
                  <th className="p-3.5">Ingress Gate</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Scan Timestamp</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-blue-600">{t.id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{t.attendee}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold">
                        {t.tier}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{t.zone}</td>
                    <td className="p-3.5 text-slate-600">{t.gate}</td>
                    <td className="p-3.5">
                      {t.used ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          ADMITTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          ISSUED / UNUSED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">{t.timestamp || 'Pending Arrival'}</td>
                    <td className="p-3.5 text-right">
                      {!t.used ? (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = tickets.map(item => 
                              item.id === t.id 
                                ? { ...item, used: true, timestamp: new Date().toLocaleTimeString() } 
                                : item
                            );
                            localDatabase.saveTickets(updated);
                            localDatabase.addAuditLog('MANUAL_INGRESS_OVERRIDE', `Admin commander verified and admitted attendee ${t.attendee} (${t.id})`, 'CMDR_VANCE', 'SUCCESS');
                            playAlertSound('info');
                            refreshAllAdminData();
                          }}
                          className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono font-bold transition cursor-pointer shadow-2xs"
                        >
                          Admit Now
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Incident Alerts */}
        {activeLedgerTab === 'alerts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Time</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Sector</th>
                  <th className="p-3.5">Incident Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 text-slate-500 font-semibold">{a.timeFormatted}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        a.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        a.severity === 'WARNING' || a.severity === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{a.zoneName}</td>
                    <td className="p-3.5 font-medium text-slate-800">{a.title}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'ACTIVE' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{a.actionTaken || a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Immutable Audit Trail */}
        {activeLedgerTab === 'audit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Operator</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Event Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 text-slate-400">{l.id}</td>
                    <td className="p-3.5 text-slate-500">{l.timestamp}</td>
                    <td className="p-3.5 font-bold text-blue-700">{l.operator}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{l.action}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        l.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        l.severity === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        l.severity === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {l.severity}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Security Teams */}
        {activeLedgerTab === 'teams' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Squad Name</th>
                  <th className="p-3.5">Team Leader</th>
                  <th className="p-3.5">Assigned Sector</th>
                  <th className="p-3.5">Personnel Count</th>
                  <th className="p-3.5">Operational Status</th>
                  <th className="p-3.5">ETA / Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityTeams.map((tm) => (
                  <tr key={tm.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{tm.name}</td>
                    <td className="p-3.5 text-slate-700">{tm.leader}</td>
                    <td className="p-3.5 font-semibold text-blue-600">{tm.assignedZone}</td>
                    <td className="p-3.5 text-slate-600">{tm.membersCount} officers</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tm.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                        tm.status === 'DISPATCHED' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tm.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {tm.status === 'DISPATCHED' ? `${tm.etaSeconds}s (${tm.distanceMeters}m)` : 'On Station'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
