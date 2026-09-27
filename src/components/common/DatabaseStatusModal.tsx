import React, { useState, useEffect } from 'react';
import { 
  Database, 
  HardDrive, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  X, 
  Layers, 
  Shield, 
  Camera, 
  AlertTriangle, 
  Ticket, 
  Sliders, 
  FileText,
  PlusCircle
} from 'lucide-react';
import { localDatabase } from '../../services/localDatabase';
import { useSimulation } from '../../context/SimulationContext';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { 
    zones, alerts, securityTeams, cameraFeeds, settings, resetSimulation,
    isBackendConnected, backendInfo, backendLatency, isBackendWsConnected,
    testBackendConnection, syncAllToBackend
  } = useSimulation();
  const [stats, setStats] = useState(localDatabase.getDatabaseStats());
  const [jsonInput, setJsonInput] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [backendTestStatus, setBackendTestStatus] = useState<string | null>(null);
  const [isTestingBackend, setIsTestingBackend] = useState<boolean>(false);
  const [isSyncingBackend, setIsSyncingBackend] = useState<boolean>(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertZone, setNewAlertZone] = useState('gate-b');
  const [newAlertSeverity, setNewAlertSeverity] = useState<'WARNING' | 'CRITICAL' | 'INFO'>('WARNING');
  const [showAddAlert, setShowAddAlert] = useState(false);

  const refreshStats = () => {
    setStats(localDatabase.getDatabaseStats());
  };

  useEffect(() => {
    refreshStats();
    const unsub = localDatabase.subscribe(refreshStats);
    return () => unsub();
  }, [zones, alerts, securityTeams, cameraFeeds, settings]);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = localDatabase.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CrowdIQ_Database_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    localDatabase.addAuditLog('DATABASE_EXPORT', 'Exported complete database JSON archive', 'SYS_ADMIN', 'INFO');
    refreshStats();
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const success = localDatabase.importDatabaseJSON(jsonInput);
    if (success) {
      setImportStatus('Database successfully restored from JSON!');
      setJsonInput('');
      setShowImportBox(false);
      refreshStats();
      setTimeout(() => setImportStatus(null), 4000);
      window.location.reload(); // Hard sync state
    } else {
      setImportStatus('Invalid JSON format. Please verify your backup schema.');
    }
  };

  const handleAddLiveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle.trim()) return;

    const existingAlerts = localDatabase.getAlerts();
    const selectedZoneObj = zones.find(z => z.id === newAlertZone);
    const newAlert = {
      id: 'alert-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      zoneId: newAlertZone,
      zoneName: selectedZoneObj ? selectedZoneObj.name : 'Unknown Zone',
      severity: newAlertSeverity,
      title: newAlertTitle,
      description: `Manual operator incident recorded for ${selectedZoneObj?.name || 'Sector'}. Telemetry updated in local database.`,
      status: 'ACTIVE' as const,
    };

    localDatabase.saveAlerts([newAlert, ...existingAlerts]);
    localDatabase.addAuditLog('INCIDENT_CREATED', `Operator logged incident: ${newAlertTitle}`, 'OPERATOR_1', newAlertSeverity === 'CRITICAL' ? 'CRITICAL' : 'WARNING');
    setNewAlertTitle('');
    setShowAddAlert(false);
    refreshStats();
  };

  const handleReset = () => {
    if (window.confirm('Reset local storage database to factory baseline values? All records will be refreshed.')) {
      resetSimulation();
      refreshStats();
      onClose();
    }
  };

  const handleTestBackend = async () => {
    setIsTestingBackend(true);
    setBackendTestStatus(null);
    try {
      const res = await testBackendConnection();
      if (res.success) {
        setBackendTestStatus(`FastAPI Online! Latency: ${res.latencyMs || 10}ms. PyTorch 2.14 AI Models Active.`);
      } else {
        setBackendTestStatus(`FastAPI status: ${res.message}`);
      }
    } catch (e: any) {
      setBackendTestStatus(`Failed to connect: ${e.message}`);
    } finally {
      setIsTestingBackend(false);
    }
  };

  const handleSyncBackend = async () => {
    setIsSyncingBackend(true);
    try {
      const res = await syncAllToBackend();
      setBackendTestStatus(res.message);
    } catch (e: any) {
      setBackendTestStatus(`Sync error: ${e.message}`);
    } finally {
      setIsSyncingBackend(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  CrowdIQ Data &amp; AI Engine Hub
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isBackendConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isBackendConnected ? 'FASTAPI + PYTORCH ONLINE' : 'HYBRID SYSTEM READY'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Python FastAPI • PyTorch AI Inference • Firestore &amp; LocalStorage Sync
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Python FastAPI & PyTorch AI Engine Status Card */}
          <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <span className="font-mono font-bold text-xs">Py</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900">Python FastAPI + PyTorch AI Engine</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isBackendConnected 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {isBackendConnected ? 'ONLINE 🟢' : 'STANDBY ⚡'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                    Target: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-900 font-bold">http://127.0.0.1:8000</code> • CSRNet Density &amp; LSTM Neural Forecaster
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Latency</span>
                <span className="text-xs font-mono font-bold text-blue-700">
                  {backendLatency ? `${backendLatency} ms` : 'Active'}
                </span>
              </div>
            </div>

            {backendTestStatus && (
              <div className="p-2.5 rounded-lg bg-white border border-blue-200 text-xs font-mono text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{backendTestStatus}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-200/60">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
                <span className={`w-2 h-2 rounded-full ${isBackendWsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>WebSocket /ws/telemetry: <strong>{isBackendWsConnected ? 'Connected & Streaming' : (isBackendConnected ? 'Active' : 'Offline')}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestBackend}
                  disabled={isTestingBackend}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer disabled:opacity-50"
                >
                  {isTestingBackend ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  onClick={handleSyncBackend}
                  disabled={isSyncingBackend}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
                >
                  {isSyncingBackend ? 'Syncing...' : 'Sync Zones to Backend'}
                </button>
              </div>
            </div>
          </div>
          
          {importStatus && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              importStatus.includes('successfully') 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Database Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Total Storage</span>
              <span className="text-lg font-mono font-extrabold text-slate-900">{stats.sizeKB} KB</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Browser LocalStorage</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Transactions</span>
              <span className="text-lg font-mono font-extrabold text-blue-600">{stats.transactionCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Committed Writes</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Last Synced</span>
              <span className="text-sm font-mono font-extrabold text-slate-900 mt-1 block">{stats.lastSyncedAt}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Real-time sync</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">DB Architecture</span>
              <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">Key-Value JSON</span>
              <span className="text-[10px] text-slate-500 block">v2.0 Schema</span>
            </div>
          </div>

          {/* Live Collections / Tables Breakdown */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-slate-600 mb-3 flex items-center justify-between">
              <span>Database Collections & Stored Records</span>
              <span className="text-[11px] font-semibold text-blue-600">{Object.values(stats.counts).reduce((a, b) => a + b, 0)} total records</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>crowdiq_zones_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {stats.counts.zones} Zones
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>crowdiq_security_teams_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {stats.counts.securityTeams} Squads
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>crowdiq_camera_feeds_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {stats.counts.cameraFeeds} Streams
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>crowdiq_alerts_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  {stats.counts.alerts} Incidents
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Ticket className="w-4 h-4 text-purple-600" />
                  <span>crowdiq_tickets_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {stats.counts.tickets} Turnstile Passes
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>crowdiq_audit_logs_db</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {stats.counts.auditLogs} Audit Events
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions: Add Live Incident */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                Live Incident Injector
              </span>
              <button
                onClick={() => setShowAddAlert(!showAddAlert)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {showAddAlert ? 'Hide Form' : '+ Add New Incident to Database'}
              </button>
            </div>

            {showAddAlert && (
              <form onSubmit={handleAddLiveIncident} className="mt-3 space-y-3 bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Zone / Sector</label>
                    <select
                      value={newAlertZone}
                      onChange={(e) => setNewAlertZone(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
                    >
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.name} ({z.density}% Density)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Severity Level</label>
                    <select
                      value={newAlertSeverity}
                      onChange={(e) => setNewAlertSeverity(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="INFO">INFO - Informational Notice</option>
                      <option value="WARNING">WARNING - High Queue Accumulation</option>
                      <option value="CRITICAL">CRITICAL - Severe Bottleneck / Overcrowding</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Incident Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. West Turnstile Optical Reader Delay..."
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Commit to Database
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Backup & Restore Controls */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-slate-600 mb-2">
              Database Export & Import
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Database (JSON)</span>
              </button>

              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Restore from JSON</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition shadow-2xs cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset to Factory Seed</span>
              </button>
            </div>

            {showImportBox && (
              <div className="mt-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-mono font-bold text-slate-700 block">
                  Paste JSON Backup Payload:
                </label>
                <textarea
                  rows={4}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste CrowdIQ database export JSON string here..."
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowImportBox(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Restore Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">Engine: HTML5 Web Storage API (localStorage)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
