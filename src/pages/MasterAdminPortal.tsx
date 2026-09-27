import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  User, 
  Users, 
  Radio, 
  AlertTriangle, 
  Video, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Save, 
  RefreshCw, 
  Sliders, 
  MapPin, 
  Zap, 
  LogOut,
  Send,
  Eye,
  Settings,
  Server,
  Database,
  Terminal,
  Activity,
  Download,
  Upload,
  Cpu,
  HardDrive,
  Wifi,
  ExternalLink,
  ChevronRight,
  Shield,
  Clock,
  Layers,
  FileText,
  UserPlus,
  AlertOctagon,
  Volume2
} from 'lucide-react';

interface Operator {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SAFETY_CHIEF' | 'DISPATCH_OFFICER' | 'VISION_ANALYST';
  status: 'ACTIVE' | 'OFFLINE';
  clearanceLevel: string;
  lastLogin: string;
}

export function MasterAdminPortal({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    zones,
    updateZone,
    addZone,
    deleteZone,
    alerts,
    addAlert,
    resolveAlert,
    deleteAlert,
    acknowledgeAlert,
    securityTeams,
    addSecurityTeam,
    updateSecurityTeam,
    deleteSecurityTeam,
    dispatchSecurityTeam,
    cameraFeeds,
    addCameraFeed,
    updateCameraFeed,
    deleteCameraFeed,
    settings,
    updateSettings,
    emergencyMode,
    toggleEmergencyMode,
    resetSimulation,
    totalPeople,
    averageDensity,
    activeAlertsCount,
    highRiskZonesCount,
    playAlertSound,
    addToast,
    currentTime
  } = useSimulation();

  // Authentication State
  const [masterPasscode, setMasterPasscode] = useState('MASTER-ROOT-2026');
  const [authError, setAuthError] = useState('');

  // Active Admin Navigation Section
  const [activeSection, setActiveSection] = useState<
    'overview' | 'zones' | 'cameras' | 'squads' | 'incidents' | 'operators' | 'settings' | 'raw_state'
  >('overview');

  // Simulated Live Diagnostics Telemetry
  const [diagnostics, setDiagnostics] = useState({
    cpuLoad: 18,
    memoryUsed: '1.42 GB',
    edgeFps: 124,
    activeSockets: 4,
    inferenceLatency: '11.8 ms'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDiagnostics({
        cpuLoad: Math.floor(Math.random() * 8) + 16,
        memoryUsed: '1.42 GB',
        edgeFps: Math.floor(Math.random() * 6) + 122,
        activeSockets: 4,
        inferenceLatency: (Math.random() * 2 + 10.5).toFixed(1) + ' ms'
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Authorized Operators State
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 'usr-1',
      name: 'Dr. Evelyn Carter',
      email: 'e.carter@crowdiq.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      clearanceLevel: 'LEVEL 5 (ROOT)',
      lastLogin: 'Active Now'
    },
    {
      id: 'usr-2',
      name: 'Commander Marcus Vance',
      email: 'm.vance@security.arena.org',
      role: 'SAFETY_CHIEF',
      status: 'ACTIVE',
      clearanceLevel: 'LEVEL 4 (TACTICAL)',
      lastLogin: '12m ago'
    },
    {
      id: 'usr-3',
      name: 'Elena Rostova',
      email: 'e.rostova@vision.crowdiq.com',
      role: 'VISION_ANALYST',
      status: 'ACTIVE',
      clearanceLevel: 'LEVEL 3 (ANALYTICS)',
      lastLogin: '1h ago'
    },
    {
      id: 'usr-4',
      name: 'Sgt. David Chen',
      email: 'd.chen@patrol.arena.org',
      role: 'DISPATCH_OFFICER',
      status: 'OFFLINE',
      clearanceLevel: 'LEVEL 2 (DISPATCH)',
      lastLogin: 'Yesterday'
    }
  ]);

  // Form states
  const [newZoneForm, setNewZoneForm] = useState({
    name: 'Sector E - South Promenade',
    shortName: 'Promenade',
    category: 'FACILITY' as const,
    currentPeople: 450,
    maxCapacity: 1200,
    density: 38,
    inflow: 35,
    outflow: 35,
    riskLevel: 'SAFE' as const,
    flowDirection: '⇌ Bidirectional'
  });

  const [newAlertForm, setNewAlertForm] = useState({
    title: '',
    severity: 'WARNING' as const,
    zoneId: zones[0]?.id || 'gate-b',
    description: '',
    actionTaken: ''
  });

  const [newSquadForm, setNewSquadForm] = useState({
    name: 'Ghost Recon Squad 07',
    leader: 'Capt. R. Hernandez',
    assignedZone: 'Sector Floor',
    membersCount: 4,
    status: 'AVAILABLE' as const,
    distanceMeters: 40,
    etaSeconds: 25
  });

  const [newCameraForm, setNewCameraForm] = useState({
    camNumber: `CAM-0${cameraFeeds.length + 1}`,
    name: 'Perimeter West Gate Surveillance',
    zoneId: zones[0]?.id || 'gate-a',
    status: 'ONLINE' as const,
    fps: 30,
    resolution: '4K UltraHD',
    simulatedDetections: 48,
    density: 58,
    flowRate: 95,
    flowDirection: 'Inward Corridor',
    riskLevel: 'WATCH' as const
  });

  const [newOperatorForm, setNewOperatorForm] = useState({
    name: '',
    email: '',
    role: 'DISPATCH_OFFICER' as const,
    clearanceLevel: 'LEVEL 2 (DISPATCH)'
  });

  // Handle Authentication
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPasscode.trim()) {
      setAuthError('Master Passcode cannot be blank.');
      return;
    }
    loginAdmin('root@crowdiq.internal', masterPasscode);
    setAuthError('');
  };

  const handleQuickUnlock = () => {
    setMasterPasscode('MASTER-ROOT-2026');
    loginAdmin('root@crowdiq.internal', 'MASTER-ROOT-2026');
    setAuthError('');
  };

  // Add Operator
  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperatorForm.name.trim() || !newOperatorForm.email.trim()) return;

    const newOp: Operator = {
      id: 'usr-' + Date.now(),
      name: newOperatorForm.name,
      email: newOperatorForm.email,
      role: newOperatorForm.role,
      status: 'ACTIVE',
      clearanceLevel: newOperatorForm.clearanceLevel,
      lastLogin: 'Never'
    };

    setOperators(prev => [...prev, newOp]);
    addToast('success', 'Operator Created', `${newOp.name} registered with ${newOp.role} access.`);
    setNewOperatorForm({
      name: '',
      email: '',
      role: 'DISPATCH_OFFICER',
      clearanceLevel: 'LEVEL 2 (DISPATCH)'
    });
  };

  // Export Raw State to JSON
  const handleExportStateJSON = () => {
    const fullState = {
      exportTimestamp: new Date().toISOString(),
      platform: 'CrowdIQ Master Admin Root',
      settings,
      zones,
      cameraFeeds,
      securityTeams,
      alerts,
      operators
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CrowdIQ_Master_State_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Backup Exported', 'Full JSON platform state snapshot downloaded.');
  };

  // =========================================================================
  // VIEW 1: MASTER ADMIN SECURITY GATEWAY (AUTHENTICATION)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-[#0F172A]">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-mono uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
              MASTER ROOT GATEWAY
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Master Admin Console
            </h1>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Dedicated high-clearance administrative environment. Root access grants total authority to inject data, manipulate CCTV matrices, and dispatch security forces.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#475569] uppercase font-bold mb-1">
                Root Security Passcode / Cryptographic Token
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={masterPasscode}
                  onChange={(e) => setMasterPasscode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB] focus:bg-white placeholder:text-[#94A3B8]"
                  placeholder="MASTER-ROOT-2026"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs font-mono tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>AUTHENTICATE & ENTER ROOT CONSOLE</span>
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2.5 rounded-lg bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>1-Click Unlock Master Root Session</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="w-full py-2 text-center text-xs text-[#64748B] hover:text-[#0F172A] transition font-mono cursor-pointer"
              >
                ← Return to Public Surveillance Platform
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED SEPARATED MASTER ADMIN CONSOLE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A]">
      
      {/* Top Standalone Master Command Bar */}
      <header className="bg-white text-[#0F172A] border-b border-[#E2E8F0] sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        
        {/* Left: Root Brand & Clearance Stamp */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight font-mono text-[#0F172A]">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#EF4444] text-white px-1.5 py-0.2 rounded uppercase">
                ROOT MASTER
              </span>
              <span className="hidden sm:inline-block text-xs text-[#64748B] font-mono">
                Clearance: Level 5
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] font-mono">
              Centralized Infrastructure, Data Ingestion & Force Dispatch Console
            </p>
          </div>
        </div>

        {/* Center: Live Telemetry Micro-Badges */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>CPU: <strong className="text-[#0F172A]">{diagnostics.cpuLoad}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
            <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Inference: <strong className="text-[#0F172A]">{diagnostics.inferenceLatency}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Node Clock: <strong className="text-[#0F172A]">{currentTime}</strong></span>
          </div>
        </div>

        {/* Right: Platform Actions */}
        <div className="flex items-center gap-2.5">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-mono font-semibold text-[#0F172A] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">Live Operations</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => onNavigate('overview')}
              className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-mono font-semibold text-[#0F172A] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">Exit to Platform</span>
            </button>
          )}

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Main Body: Master Admin Two-Column Layout (Sidebar Navigation + Dynamic Workstation) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* =========================================================================
            MASTER ADMIN SIDEBAR NAVIGATION
            ========================================================================= */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E2E8F0] p-4 space-y-6 shrink-0">
          
          {/* Operator Badge */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Logged In Role</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            </div>
            <div className="font-extrabold text-xs text-[#0F172A]">Super Administrator</div>
            <div className="text-[11px] font-mono text-[#2563EB]">root@crowdiq.internal</div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-mono">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'overview' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Command Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('zones')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'zones' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>Sectors & Inflow ({zones.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('cameras')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'cameras' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4" />
                <span>CCTV Optical Feeds ({cameraFeeds.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('squads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'squads' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Tactical Squads ({securityTeams.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('incidents')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'incidents' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Incidents & Alarms ({alerts.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('operators')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'operators' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Access & Operators ({operators.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'settings' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Venue Master Config</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSection('raw_state')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition font-semibold cursor-pointer ${
                activeSection === 'raw_state' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Database & JSON Sync</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>

          {/* Quick System Tools */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold font-mono text-[#64748B] uppercase block">
              Emergency Override
            </span>

            <button
              onClick={toggleEmergencyMode}
              className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                emergencyMode 
                  ? 'bg-[#DC2626] text-white animate-pulse' 
                  : 'bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626]'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{emergencyMode ? 'LOCKDOWN ACTIVE' : 'TRIGGER LOCKDOWN'}</span>
            </button>

            <button
              onClick={resetSimulation}
              className="w-full py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Default State</span>
            </button>
          </div>

        </aside>

        {/* =========================================================================
            MASTER ADMIN WORKSTATION VIEWPORT
            ========================================================================= */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* SECTION 1: COMMAND OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                    Master System Overview & Control Terminal
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                    Node: CENTRAL-SERVER-01 • Active Event: {settings.eventName} • All Data Ingestion Pipelines Operational
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportStateJSON}
                    className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-mono font-semibold text-[#0F172A] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Download JSON Snapshot</span>
                  </button>
                </div>
              </div>

              {/* Aggregated KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
                  <span className="text-[#64748B] text-[10px] uppercase font-bold block">Venue Population</span>
                  <div className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalPeople.toLocaleString()}</div>
                  <span className="text-[11px] text-[#64748B]">Capacity: {settings.venueCapacity.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
                  <span className="text-[#64748B] text-[10px] uppercase font-bold block">Venue Mean Density</span>
                  <div className="text-2xl font-extrabold text-[#2563EB] mt-1">{averageDensity}%</div>
                  <span className="text-[11px] text-[#16A34A] font-semibold">Normal threshold: &lt;75%</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
                  <span className="text-[#64748B] text-[10px] uppercase font-bold block">High Risk Sectors</span>
                  <div className={`text-2xl font-extrabold mt-1 ${highRiskZonesCount > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                    {highRiskZonesCount} / {zones.length}
                  </div>
                  <span className="text-[11px] text-[#64748B]">Automated mitigation ready</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
                  <span className="text-[#64748B] text-[10px] uppercase font-bold block">Surveillance Feeds</span>
                  <div className="text-2xl font-extrabold text-[#16A34A] mt-1">{cameraFeeds.length} Active</div>
                  <span className="text-[11px] text-[#16A34A]">Edge RTSP streams connected</span>
                </div>
              </div>

              {/* Quick Preset Data Scenario Injectors */}
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                  <Zap className="w-4 h-4 text-[#D97706]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Master Chaos & Scenario Ingestion Presets
                  </h3>
                </div>
                <p className="text-xs text-[#64748B]">
                  Simulate instant extreme condition events across the entire application with one click.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    onClick={() => {
                      zones.forEach(z => {
                        updateZone(z.id, {
                          density: 42,
                          currentPeople: Math.round(z.maxCapacity * 0.42),
                          inflow: 45,
                          outflow: 45,
                          riskLevel: 'SAFE'
                        });
                      });
                      addToast('success', 'Scenario Injected', 'Nominal baseline applied to all sectors.');
                    }}
                    className="p-3 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7] text-left transition cursor-pointer"
                  >
                    <div className="font-bold text-xs text-[#16A34A] font-mono">1. Nominal Baseline</div>
                    <div className="text-[11px] text-[#15803D] mt-0.5">All sectors safe, 42% density, laminar flows.</div>
                  </button>

                  <button
                    onClick={() => {
                      updateZone('gate-b', {
                        density: 88,
                        currentPeople: 1760,
                        inflow: 195,
                        outflow: 65,
                        riskLevel: 'CRITICAL',
                        flowDirection: '→ Inward Surge'
                      });
                      addAlert({
                        title: 'Turnstile Congestion Surge at Gate B',
                        severity: 'CRITICAL',
                        zoneId: 'gate-b',
                        zoneName: 'Gate B',
                        description: 'Gate B turnstiles exceeding 8.4 persons/m². Bottleneck forming at concourse threshold.',
                        actionTaken: 'Deploying Squad 04 to initiate partition reroute.',
                        status: 'ACTIVE'
                      });
                    }}
                    className="p-3 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-left transition cursor-pointer"
                  >
                    <div className="font-bold text-xs text-[#DC2626] font-mono">2. Gate B Bottleneck Surge</div>
                    <div className="text-[11px] text-[#B91C1C] mt-0.5">Injects 88% critical density and generates emergency alert.</div>
                  </button>

                  <button
                    onClick={() => {
                      updateZone('concourse', {
                        density: 84,
                        currentPeople: 2520,
                        inflow: 170,
                        outflow: 75,
                        riskLevel: 'HIGH',
                        flowDirection: '⇌ Stagnant Vortex'
                      });
                      addAlert({
                        title: 'Concourse Stagnation Warning',
                        severity: 'HIGH',
                        zoneId: 'concourse',
                        zoneName: 'Concourse Corridor',
                        description: 'Pedestrian velocity dropped below 0.3 m/s in main connecting spine.',
                        actionTaken: 'Opening partition gates 4A and 4B.',
                        status: 'ACTIVE'
                      });
                    }}
                    className="p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] text-left transition cursor-pointer"
                  >
                    <div className="font-bold text-xs text-[#D97706] font-mono">3. Concourse Corridor Spill</div>
                    <div className="text-[11px] text-[#B45309] mt-0.5">Injects 84% high density and stagnant flow alert.</div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 2: SECTORS & INFLOW CONTROL */}
          {activeSection === 'zones' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs">
                <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                  Venue Sectors & Density Telemetry Control Matrix
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                  Modify live parameters for any sector. Updates dynamically propagate to the Heatmap, Dashboard, and Prediction engines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                      <div>
                        <span className="font-bold text-sm text-[#0F172A]">{zone.name}</span>
                        <span className="block text-[10px] text-[#64748B] font-mono">ID: {zone.id} • {zone.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        zone.riskLevel === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' :
                        zone.riskLevel === 'HIGH' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]' :
                        'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                      }`}>
                        {zone.riskLevel}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <div className="flex justify-between text-[#475569] mb-1">
                          <span>Density Level:</span>
                          <strong className="text-[#0F172A] font-bold">{zone.density}%</strong>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="120"
                          value={zone.density}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateZone(zone.id, {
                              density: val,
                              riskLevel: val >= 85 ? 'CRITICAL' : val >= 70 ? 'HIGH' : val >= 50 ? 'WATCH' : 'SAFE'
                            });
                          }}
                          className="w-full accent-[#2563EB] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#64748B]">People Count:</span>
                        <input
                          type="number"
                          value={zone.currentPeople}
                          onChange={(e) => updateZone(zone.id, { currentPeople: Number(e.target.value) })}
                          className="w-24 p-1 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-right font-bold text-[#0F172A]"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#64748B]">Max Capacity:</span>
                        <input
                          type="number"
                          value={zone.maxCapacity}
                          onChange={(e) => updateZone(zone.id, { maxCapacity: Number(e.target.value) })}
                          className="w-24 p-1 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-right font-bold text-[#0F172A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="block text-[10px] text-[#64748B]">Inflow/min:</span>
                          <input
                            type="number"
                            value={zone.inflow}
                            onChange={(e) => updateZone(zone.id, { inflow: Number(e.target.value) })}
                            className="w-full p-1 rounded border border-[#CBD5E1] bg-[#F8FAFC] font-semibold"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#64748B]">Outflow/min:</span>
                          <input
                            type="number"
                            value={zone.outflow}
                            onChange={(e) => updateZone(zone.id, { outflow: Number(e.target.value) })}
                            className="w-full p-1 rounded border border-[#CBD5E1] bg-[#F8FAFC] font-semibold"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="block text-[10px] text-[#64748B] mb-0.5">Flow Direction:</span>
                        <input
                          type="text"
                          value={zone.flowDirection}
                          onChange={(e) => updateZone(zone.id, { flowDirection: e.target.value })}
                          className="w-full p-1.5 rounded border border-[#CBD5E1] bg-[#F8FAFC] font-semibold text-[#0F172A]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: CCTV OPTICAL FEEDS */}
          {activeSection === 'cameras' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form: Add CCTV Node (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                  <Video className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Register New CCTV Camera Node
                  </h3>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  addCameraFeed(newCameraForm);
                  setNewCameraForm({
                    camNumber: `CAM-0${cameraFeeds.length + 2}`,
                    name: 'North Concourse Portal',
                    zoneId: zones[0]?.id || 'gate-a',
                    status: 'ONLINE',
                    fps: 30,
                    resolution: '4K UltraHD',
                    simulatedDetections: 45,
                    density: 50,
                    flowRate: 85,
                    flowDirection: 'Inward Corridor',
                    riskLevel: 'SAFE'
                  });
                }} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Camera Code</label>
                      <input
                        type="text"
                        value={newCameraForm.camNumber}
                        onChange={(e) => setNewCameraForm({ ...newCameraForm, camNumber: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Resolution</label>
                      <select
                        value={newCameraForm.resolution}
                        onChange={(e) => setNewCameraForm({ ...newCameraForm, resolution: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        <option value="4K UltraHD">4K UltraHD</option>
                        <option value="1080p 60Hz">1080p 60Hz</option>
                        <option value="720p HD">720p HD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Camera Location Name</label>
                    <input
                      type="text"
                      value={newCameraForm.name}
                      onChange={(e) => setNewCameraForm({ ...newCameraForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Assigned Zone</label>
                      <select
                        value={newCameraForm.zoneId}
                        onChange={(e) => setNewCameraForm({ ...newCameraForm, zoneId: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Feed Status</label>
                      <select
                        value={newCameraForm.status}
                        onChange={(e) => setNewCameraForm({ ...newCameraForm, status: e.target.value as any })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        <option value="ONLINE">ONLINE</option>
                        <option value="STANDBY">STANDBY</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>LINK CAMERA INTO MATRIX</span>
                  </button>
                </form>
              </div>

              {/* Roster: Manage Cameras (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Active Surveillance Matrix ({cameraFeeds.length} Nodes)
                  </h3>
                </div>

                <div className="space-y-3">
                  {cameraFeeds.map((cam) => (
                    <div key={cam.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] font-bold text-[10px]">
                            {cam.camNumber}
                          </span>
                          <strong className="text-[#0F172A]">{cam.name}</strong>
                          <span className="text-[10px] text-[#64748B]">Zone: {cam.zoneId}</span>
                        </div>
                        <div className="text-[11px] text-[#475569] mt-0.5">
                          Res: <strong>{cam.resolution}</strong> • Tracked: <strong>{cam.simulatedDetections}</strong> • Density: <strong>{cam.density}%</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={cam.status}
                          onChange={(e) => updateCameraFeed(cam.id, { status: e.target.value as any })}
                          className="p-1.5 rounded border border-[#CBD5E1] bg-white text-[11px] font-bold text-[#0F172A]"
                        >
                          <option value="ONLINE">ONLINE</option>
                          <option value="STANDBY">STANDBY</option>
                          <option value="OFFLINE">OFFLINE</option>
                        </select>

                        <button
                          onClick={() => deleteCameraFeed(cam.id)}
                          className="p-1.5 rounded hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                          title="Delete Camera Node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 4: TACTICAL SQUADS */}
          {activeSection === 'squads' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form: Commission Squad (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                  <Plus className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Commission New Security Squad
                  </h3>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  addSecurityTeam(newSquadForm);
                  setNewSquadForm({
                    name: `Squad 0${securityTeams.length + 2}`,
                    leader: 'Officer in Charge',
                    assignedZone: 'Main Concourse',
                    membersCount: 4,
                    status: 'AVAILABLE',
                    distanceMeters: 55,
                    etaSeconds: 35
                  });
                }} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Squad Name</label>
                    <input
                      type="text"
                      value={newSquadForm.name}
                      onChange={(e) => setNewSquadForm({ ...newSquadForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Squad Leader</label>
                      <input
                        type="text"
                        value={newSquadForm.leader}
                        onChange={(e) => setNewSquadForm({ ...newSquadForm, leader: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Officers Count</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={newSquadForm.membersCount}
                        onChange={(e) => setNewSquadForm({ ...newSquadForm, membersCount: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Assigned Sector</label>
                      <select
                        value={newSquadForm.assignedZone}
                        onChange={(e) => setNewSquadForm({ ...newSquadForm, assignedZone: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.name}>{z.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Initial Status</label>
                      <select
                        value={newSquadForm.status}
                        onChange={(e) => setNewSquadForm({ ...newSquadForm, status: e.target.value as any })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="ARRIVED">ARRIVED</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>REGISTER SQUAD ON ROSTER</span>
                  </button>
                </form>
              </div>

              {/* Roster: Manage Squads (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Active Security Squads Fleet ({securityTeams.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {securityTeams.map((sq) => (
                    <div key={sq.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#0F172A] text-sm">{sq.name}</strong>
                          <span className="text-[10px] text-[#64748B]">Lead: {sq.leader}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                            {sq.membersCount} Officers
                          </span>
                        </div>
                        <div className="text-[11px] text-[#475569] mt-0.5">
                          Assigned: <strong>{sq.assignedZone}</strong> • Status: <strong>{sq.status}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={sq.status}
                          onChange={(e) => updateSecurityTeam(sq.id, { status: e.target.value as any })}
                          className="p-1.5 rounded border border-[#CBD5E1] bg-white text-[11px] font-bold text-[#0F172A]"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="ARRIVED">ARRIVED</option>
                        </select>

                        <button
                          onClick={() => deleteSecurityTeam(sq.id)}
                          className="p-1.5 rounded hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                          title="Decommission Squad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 5: INCIDENTS & ALARMS */}
          {activeSection === 'incidents' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form: Dispatch Alert (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Broadcast Custom System Alert
                  </h3>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAlertForm.title.trim()) return;
                  const targetZone = zones.find(z => z.id === newAlertForm.zoneId) || zones[0];
                  addAlert({
                    title: newAlertForm.title,
                    severity: newAlertForm.severity,
                    zoneId: newAlertForm.zoneId,
                    zoneName: targetZone.name,
                    description: newAlertForm.description || `Custom alert broadcast in ${targetZone.name}.`,
                    actionTaken: newAlertForm.actionTaken || 'Tactical force deployed to investigate.',
                    status: 'ACTIVE'
                  });
                  setNewAlertForm({
                    title: '',
                    severity: 'WARNING',
                    zoneId: zones[0]?.id || 'gate-b',
                    description: '',
                    actionTaken: ''
                  });
                }} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Incident Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Turnstile Barrier Jam at Sector Gate A"
                      value={newAlertForm.title}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Severity</label>
                      <select
                        value={newAlertForm.severity}
                        onChange={(e) => setNewAlertForm({ ...newAlertForm, severity: e.target.value as any })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        <option value="CRITICAL">CRITICAL (Emergency)</option>
                        <option value="HIGH">HIGH (Severe)</option>
                        <option value="WARNING">WARNING (Elevated)</option>
                        <option value="ACTION">ACTION (Notice)</option>
                        <option value="INFO">INFO (Info)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#475569] font-bold uppercase mb-1">Target Sector</label>
                      <select
                        value={newAlertForm.zoneId}
                        onChange={(e) => setNewAlertForm({ ...newAlertForm, zoneId: e.target.value })}
                        className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Telemetry Description</label>
                    <textarea
                      rows={2}
                      value={newAlertForm.description}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, description: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      placeholder="Sensor threshold breached..."
                    />
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Prescribed Countermeasure</label>
                    <input
                      type="text"
                      value={newAlertForm.actionTaken}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, actionTaken: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      placeholder="e.g. Open partition turnstiles"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>BROADCAST TO ALL OPERATORS</span>
                  </button>
                </form>
              </div>

              {/* Roster: Manage Alerts (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Incident Log ({alerts.length} Records)
                  </h3>
                </div>

                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {alerts.map((alt) => (
                    <div key={alt.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            alt.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' : 'bg-[#EFF6FF] text-[#2563EB]'
                          }`}>
                            {alt.severity}
                          </span>
                          <strong className="text-[#0F172A]">{alt.title}</strong>
                        </div>
                        <span className="text-[#94A3B8] text-[10px]">{alt.timeFormatted}</span>
                      </div>

                      <p className="text-[#475569] text-[11px]">{alt.description}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                        <span className="text-[#0F766E] text-[11px]">Action: {alt.actionTaken || 'None specified'}</span>
                        <div className="flex items-center gap-2">
                          {alt.status !== 'RESOLVED' && (
                            <button
                              onClick={() => resolveAlert(alt.id)}
                              className="px-2 py-0.5 rounded bg-[#16A34A] text-white text-[10px] font-bold hover:bg-[#15803D] cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alt.id)}
                            className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626] cursor-pointer"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 6: ACCESS CONTROL & OPERATORS */}
          {activeSection === 'operators' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form: Add Operator (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                  <UserPlus className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Provision New Operator Account
                  </h3>
                </div>

                <form onSubmit={handleAddOperator} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Operator Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Capt. Sarah Jenkins"
                      value={newOperatorForm.name}
                      onChange={(e) => setNewOperatorForm({ ...newOperatorForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Official Email</label>
                    <input
                      type="email"
                      placeholder="s.jenkins@arena.org"
                      value={newOperatorForm.email}
                      onChange={(e) => setNewOperatorForm({ ...newOperatorForm, email: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Role & Clearance</label>
                    <select
                      value={newOperatorForm.role}
                      onChange={(e) => {
                        const r = e.target.value as any;
                        const clearance = r === 'SUPER_ADMIN' ? 'LEVEL 5 (ROOT)' :
                          r === 'SAFETY_CHIEF' ? 'LEVEL 4 (TACTICAL)' :
                          r === 'VISION_ANALYST' ? 'LEVEL 3 (ANALYTICS)' : 'LEVEL 2 (DISPATCH)';
                        setNewOperatorForm({ ...newOperatorForm, role: r, clearanceLevel: clearance });
                      }}
                      className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    >
                      <option value="DISPATCH_OFFICER">DISPATCH OFFICER (Level 2)</option>
                      <option value="VISION_ANALYST">CCTV VISION ANALYST (Level 3)</option>
                      <option value="SAFETY_CHIEF">SAFETY CHIEF (Level 4)</option>
                      <option value="SUPER_ADMIN">SUPER ADMINISTRATOR (Level 5 Root)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>PROVISION OPERATOR ACCESS</span>
                  </button>
                </form>
              </div>

              {/* Operators Table (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                    Authorized Personnel Roster ({operators.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {operators.map((op) => (
                    <div key={op.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#0F172A] text-sm">{op.name}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                            {op.clearanceLevel}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#475569] mt-0.5">
                          {op.email} • Last active: <strong>{op.lastLogin}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          op.status === 'ACTIVE' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
                        }`}>
                          {op.status}
                        </span>

                        {op.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => {
                              setOperators(prev => prev.filter(o => o.id !== op.id));
                              addToast('info', 'Operator Revoked', `Access revoked for ${op.name}.`);
                            }}
                            className="p-1.5 rounded hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 7: VENUE MASTER CONFIG */}
          {activeSection === 'settings' && (
            <div className="max-w-2xl bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <Settings className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  Venue Master Parameters & Thresholds
                </h3>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                addToast('success', 'Configuration Saved', 'Venue master parameters have been locked.');
              }} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Venue / Event Title</label>
                  <input
                    type="text"
                    value={settings.eventName}
                    onChange={(e) => updateSettings({ eventName: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Total Capacity Cap</label>
                    <input
                      type="number"
                      value={settings.venueCapacity}
                      onChange={(e) => updateSettings({ venueCapacity: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">High Risk Threshold (%)</label>
                    <input
                      type="number"
                      value={settings.highRiskThreshold}
                      onChange={(e) => updateSettings({ highRiskThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#475569] font-bold uppercase mb-1">Critical Threshold (%)</label>
                    <input
                      type="number"
                      value={settings.criticalThreshold}
                      onChange={(e) => updateSettings({ criticalThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE VENUE PARAMETERS</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 8: DATABASE & RAW JSON SYNC */}
          {activeSection === 'raw_state' && (
            <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Raw State Synchronization & Database Importer
                  </h3>
                </div>

                <button
                  onClick={handleExportStateJSON}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON Backup</span>
                </button>
              </div>

              <p className="text-xs text-[#64748B] font-mono leading-relaxed">
                Direct inspect of active memory graph holding all venue sectors, CCTV nodes, dispatched security squads, and logged alert triage arrays.
              </p>

              {/* Code Mirror Preview */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 overflow-x-auto max-h-[380px] border border-[#CBD5E1] shadow-inner">
                <pre className="text-[#0F172A] font-mono text-[11px] leading-relaxed">
                  {JSON.stringify({
                    platform: 'CrowdIQ',
                    clearance: 'ROOT_MASTER_ACCESS',
                    timestamp: new Date().toISOString(),
                    telemetrySummary: {
                      totalSectors: zones.length,
                      totalPeople,
                      meanDensity: averageDensity,
                      activeCameras: cameraFeeds.length,
                      tacticalSquads: securityTeams.length,
                      incidentAlertsCount: alerts.length
                    },
                    sampleSectors: zones.map(z => ({ id: z.id, name: z.name, density: z.density, people: z.currentPeople })),
                    cameraNodes: cameraFeeds.map(c => ({ id: c.id, code: c.camNumber, name: c.name, status: c.status })),
                    activeSquads: securityTeams.map(s => ({ id: s.id, name: s.name, status: s.status, lead: s.leader }))
                  }, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
