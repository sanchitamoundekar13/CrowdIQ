import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  User, 
  Radio, 
  AlertTriangle, 
  Video, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Save, 
  RefreshCw, 
  Sliders, 
  Users, 
  MapPin, 
  Zap, 
  LogOut,
  Send,
  Eye,
  Settings
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function AdminPortalPage({ onNavigate }) {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    zones,
    updateZone,
    addZone,
    alerts,
    addAlert,
    resolveAlert,
    deleteAlert,
    securityTeams,
    addSecurityTeam,
    updateSecurityTeam,
    deleteSecurityTeam,
    cameraFeeds,
    addCameraFeed,
    updateCameraFeed,
    deleteCameraFeed,
    settings,
    updateSettings,
    totalPeople,
    averageDensity,
    activeAlertsCount,
    highRiskZonesCount
  } = useSimulation();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@crowdiq.com');
  const [loginPassword, setLoginPassword] = useState('crowdiq2026');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState('zones'); // 'zones' | 'alerts' | 'squads' | 'cameras' | 'venue'

  // Form States for creating new items
  const [newAlertForm, setNewAlertForm] = useState({
    title: '',
    severity: 'WARNING',
    zoneId: 'gate-b',
    description: '',
    actionTaken: ''
  });

  const [newSquadForm, setNewSquadForm] = useState({
    name: 'Echo Unit 05',
    leader: 'Sgt. M. Jenkins',
    assignedZone: 'Gate B',
    membersCount: 4,
    status: 'AVAILABLE',
    distanceMeters: 65,
    etaSeconds: 40
  });

  const [newCameraForm, setNewCameraForm] = useState({
    camNumber: 'CAM-05',
    name: 'Concourse West Corridor',
    zoneId: 'concourse',
    status: 'ONLINE',
    fps: 30,
    resolution: '4K UltraHD',
    simulatedDetections: 35,
    density: 64,
    flowRate: 88,
    flowDirection: 'East → Central Arena',
    riskLevel: 'WATCH'
  });

  const [venueSettingsForm, setVenueSettingsForm] = useState({
    eventName: settings.eventName,
    venueCapacity: settings.venueCapacity,
    highRiskThreshold: settings.highRiskThreshold,
    criticalThreshold: settings.criticalThreshold,
  });

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both administrative email and password.');
      return;
    }
    loginAdmin(loginEmail, loginPassword);
    setLoginError('');
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = () => {
    setLoginEmail('admin@crowdiq.com');
    setLoginPassword('crowdiq2026');
    loginAdmin('admin@crowdiq.com', 'crowdiq2026');
    setLoginError('');
  };

  // Handle Adding an Alert
  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!newAlertForm.title.trim()) return;

    const matchedZone = zones.find(z => z.id === newAlertForm.zoneId) || zones[0];
    addAlert({
      title: newAlertForm.title,
      severity: newAlertForm.severity,
      zoneId: newAlertForm.zoneId,
      zoneName: matchedZone.name,
      description: newAlertForm.description || `Sensor and edge vision threshold exceeded in ${matchedZone.name}.`,
      actionTaken: newAlertForm.actionTaken || 'Tactical team dispatched to verify checkpoint.',
      status: 'ACTIVE'
    });

    setNewAlertForm({
      title: '',
      severity: 'WARNING',
      zoneId: 'gate-b',
      description: '',
      actionTaken: ''
    });
  };

  // Handle Adding a Security Squad
  const handleCreateSquad = (e) => {
    e.preventDefault();
    if (!newSquadForm.name.trim()) return;

    addSecurityTeam({
      name: newSquadForm.name,
      leader: newSquadForm.leader,
      assignedZone: newSquadForm.assignedZone,
      membersCount: Number(newSquadForm.membersCount) || 4,
      status: newSquadForm.status,
      distanceMeters: Number(newSquadForm.distanceMeters) || 50,
      etaSeconds: Number(newSquadForm.etaSeconds) || 30
    });

    setNewSquadForm({
      name: `Squad ${securityTeams.length + 1}`,
      leader: 'Officer in Charge',
      assignedZone: 'Main Concourse',
      membersCount: 4,
      status: 'AVAILABLE',
      distanceMeters: 75,
      etaSeconds: 45
    });
  };

  // Handle Adding a Camera
  const handleCreateCamera = (e) => {
    e.preventDefault();
    if (!newCameraForm.name.trim()) return;

    addCameraFeed({
      camNumber: newCameraForm.camNumber,
      name: newCameraForm.name,
      zoneId: newCameraForm.zoneId,
      status: newCameraForm.status,
      fps: Number(newCameraForm.fps) || 30,
      resolution: newCameraForm.resolution,
      simulatedDetections: Number(newCameraForm.simulatedDetections) || 40,
      density: Number(newCameraForm.density) || 50,
      flowRate: Number(newCameraForm.flowRate) || 80,
      flowDirection: newCameraForm.flowDirection,
      riskLevel: newCameraForm.riskLevel
    });

    setNewCameraForm({
      camNumber: `CAM-0${cameraFeeds.length + 1}`,
      name: 'New Sector Optical Node',
      zoneId: 'arena',
      status: 'ONLINE',
      fps: 30,
      resolution: '4K UltraHD',
      simulatedDetections: 45,
      density: 55,
      flowRate: 90,
      flowDirection: 'Inward Flow',
      riskLevel: 'WATCH'
    });
  };

  // Apply Venue Settings Form
  const handleSaveVenueSettings = (e) => {
    e.preventDefault();
    updateSettings({
      eventName: venueSettingsForm.eventName,
      venueCapacity: Number(venueSettingsForm.venueCapacity),
      highRiskThreshold: Number(venueSettingsForm.highRiskThreshold),
      criticalThreshold: Number(venueSettingsForm.criticalThreshold)
    });
  };

  // Preset Scenario Injections
  const handleApplyPreset = (type) => {
    if (type === 'normal') {
      zones.forEach(z => {
        updateZone(z.id, {
          density: 45,
          currentPeople: Math.round(z.maxCapacity * 0.45),
          inflow: 45,
          outflow: 45,
          riskLevel: 'SAFE'
        });
      });
    } else if (type === 'surge') {
      updateZone('gate-b', {
        density: 88,
        currentPeople: 1760,
        inflow: 185,
        outflow: 70,
        riskLevel: 'CRITICAL',
        flowDirection: '→ Inward Surge'
      });
      addAlert({
        title: 'Emergency Inflow Congestion at Gate B',
        severity: 'CRITICAL',
        zoneId: 'gate-b',
        zoneName: 'Gate B',
        description: 'Gate B turnstiles exceeding 8.4 persons/m² density threshold. Immediate dispatch required.',
        actionTaken: 'Dispatching Tactical Squad 04 and rerouting queue to Gate C.',
        status: 'ACTIVE'
      });
    } else if (type === 'concourse_bottleneck') {
      updateZone('concourse', {
        density: 82,
        currentPeople: 2460,
        inflow: 160,
        outflow: 85,
        riskLevel: 'HIGH',
        flowDirection: '⇌ Stagnant Vortex'
      });
      addAlert({
        title: 'Concourse Bottleneck Warning',
        severity: 'HIGH',
        zoneId: 'concourse',
        zoneName: 'Concourse Corridor',
        description: 'Pedestrian velocity dropped below 0.3 m/s in main connecting spine.',
        actionTaken: 'Opening partition gates 4A and 4B.',
        status: 'ACTIVE'
      });
    }
  };

  // -------------------------------------------------------------
  // VIEW A: LOGIN SCREEN (When not authenticated)
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="py-12 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Admin & Operations Portal
            </h1>
            <p className="text-xs text-[#64748B]">
              Enter administrator credentials to insert data, adjust venue telemetry, manage cameras, and dispatch squads.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#475569] font-bold uppercase mb-1">Administrative Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@crowdiq.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#475569] font-bold uppercase mb-1">Passcode / Secret Key</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>AUTHENTICATE & ENTER PORTAL</span>
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-[#F1F5F9] text-center space-y-2">
            <p className="text-[11px] text-[#94A3B8]">For evaluation & testing purposes:</p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 rounded-lg bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>One-Click Quick Login as Safety Chief</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: AUTHENTICATED ADMIN MANAGEMENT CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Top Header Banner */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
              Command Management Engine
            </span>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              READ / WRITE ACCESS GRANTED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            CrowdIQ Administrator Portal
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Insert and modify venue telemetry, live camera streams, security dispatch squads, and incident registries in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] transition cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>View Live Dashboard</span>
            </button>
          )}

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Live System Summary Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Total Monitored People</span>
          <span className="text-xl font-extrabold text-[#0F172A]">{totalPeople.toLocaleString()}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Average Venue Density</span>
          <span className="text-xl font-extrabold text-[#2563EB]">{averageDensity}%</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Active Alerts Logged</span>
          <span className={`text-xl font-extrabold ${activeAlertsCount > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {activeAlertsCount}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Active Security Squads</span>
          <span className="text-xl font-extrabold text-[#0F172A]">{securityTeams.length} Squads</span>
        </div>
      </div>

      {/* Quick Scenario Injector */}
      <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-[#0F172A] block flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#D97706]" />
            Quick Data Scenarios:
          </span>
          <span className="text-[#64748B] text-[11px]">Inject instant conditions across the entire application with one click.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleApplyPreset('normal')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#16A34A] font-bold text-xs font-mono transition cursor-pointer"
          >
            ● Reset All to Safe (45%)
          </button>
          <button
            onClick={() => handleApplyPreset('surge')}
            className="px-3 py-1.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] hover:bg-[#FEE2E2] text-[#DC2626] font-bold text-xs font-mono transition cursor-pointer"
          >
            ▲ Inject Gate B Critical Surge (88%)
          </button>
          <button
            onClick={() => handleApplyPreset('concourse_bottleneck')}
            className="px-3 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] text-[#D97706] font-bold text-xs font-mono transition cursor-pointer"
          >
            ◆ Inject Concourse Bottleneck (82%)
          </button>
        </div>
      </div>

      {/* Management Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#CBD5E1] pb-3 text-xs font-mono font-bold">
        <button
          onClick={() => setAdminTab('zones')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            adminTab === 'zones'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sectors & Density ({zones.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('alerts')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            adminTab === 'alerts'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Incident Alarms ({alerts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('squads')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            adminTab === 'squads'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Squads ({securityTeams.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('cameras')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            adminTab === 'cameras'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>CCTV Matrix ({cameraFeeds.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('venue')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            adminTab === 'venue'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Venue Settings</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: SECTORS & DENSITY INJECTOR
          ======================================================== */}
      {adminTab === 'zones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Live Venue Sectors Telemetry Control
            </h2>
            <span className="text-xs text-[#64748B]">Changes update the entire platform immediately</span>
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
                    zone.riskLevel === 'CRITICAL'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                      : zone.riskLevel === 'HIGH'
                      ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                      : 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                  }`}>
                    {zone.riskLevel}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Density Slider */}
                  <div>
                    <div className="flex justify-between text-[#475569] mb-1">
                      <span>Crowd Density:</span>
                      <strong className="text-[#0F172A]">{zone.density}%</strong>
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

                  {/* Current People Count Input */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Headcount:</span>
                    <input
                      type="number"
                      value={zone.currentPeople}
                      onChange={(e) => updateZone(zone.id, { currentPeople: Number(e.target.value) })}
                      className="w-24 p-1.5 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-right font-bold text-[#0F172A]"
                    />
                  </div>

                  {/* Capacity Limit */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Capacity Cap:</span>
                    <input
                      type="number"
                      value={zone.maxCapacity}
                      onChange={(e) => updateZone(zone.id, { maxCapacity: Number(e.target.value) })}
                      className="w-24 p-1.5 rounded border border-[#CBD5E1] bg-[#F8FAFC] text-right font-bold text-[#0F172A]"
                    />
                  </div>

                  {/* Flow Rates */}
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

                  {/* Risk Level Selector */}
                  <div className="pt-1">
                    <span className="block text-[10px] text-[#64748B] mb-0.5">Override Risk Level:</span>
                    <select
                      value={zone.riskLevel}
                      onChange={(e) => updateZone(zone.id, { riskLevel: e.target.value })}
                      className="w-full p-1.5 rounded border border-[#CBD5E1] bg-[#F8FAFC] font-semibold text-[#0F172A]"
                    >
                      <option value="SAFE">SAFE (Nominal)</option>
                      <option value="WATCH">WATCH (Elevated)</option>
                      <option value="HIGH">HIGH (Congestion)</option>
                      <option value="CRITICAL">CRITICAL (Stampede Risk)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INCIDENT & ALERT GENERATOR
          ======================================================== */}
      {adminTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form: Insert New Alert (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Dispatch New Incident Alert
              </h3>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Turnstile Barrier Surge at Gate A"
                  value={newAlertForm.title}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Severity</label>
                  <select
                    value={newAlertForm.severity}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, severity: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ACTION">ACTION</option>
                    <option value="INFO">INFO</option>
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
                <label className="block text-[#475569] font-bold uppercase mb-1">Incident Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed telemetry observations..."
                  value={newAlertForm.description}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Prescribed Countermeasure</label>
                <input
                  type="text"
                  placeholder="e.g. Redirect 30% inflow to alternate turnstiles"
                  value={newAlertForm.actionTaken}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, actionTaken: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST ALERT SYSTEM-WIDE</span>
              </button>
            </form>
          </div>

          {/* Right Table: Active Alerts in System (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Current Active & Historical Alerts ({alerts.length})
              </h3>
              <span className="text-xs text-[#64748B] font-mono">{activeAlertsCount} Unresolved</span>
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
                    <span className="text-[#0F766E] text-[11px]">Action: {alt.actionTaken}</span>
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
                        title="Delete alert"
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

      {/* ========================================================
          TAB 3: SECURITY SQUAD FLEET COMMANDER
          ======================================================== */}
      {adminTab === 'squads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Squad Registration Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <Plus className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Commission New Security Squad
              </h3>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Squad Name</label>
                <input
                  type="text"
                  placeholder="e.g. Delta Unit 05"
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
                    placeholder="Officer Lead"
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
                  <label className="block text-[#475569] font-bold uppercase mb-1">Initial Sector</label>
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
                  <label className="block text-[#475569] font-bold uppercase mb-1">Squad Status</label>
                  <select
                    value={newSquadForm.status}
                    onChange={(e) => setNewSquadForm({ ...newSquadForm, status: e.target.value })}
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

          {/* Squad List & Modifiers (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Active Squad Fleet Management ({securityTeams.length})
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
                      Sector: <strong>{sq.assignedZone}</strong> • Status: <strong>{sq.status}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={sq.status}
                      onChange={(e) => updateSecurityTeam(sq.id, { status: e.target.value })}
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

      {/* ========================================================
          TAB 4: CCTV VIDEO STREAM MATRIX
          ======================================================== */}
      {adminTab === 'cameras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Camera Addition Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <Video className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Register New CCTV Camera Node
              </h3>
            </div>

            <form onSubmit={handleCreateCamera} className="space-y-3 text-xs font-mono">
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
                <label className="block text-[#475569] font-bold uppercase mb-1">Camera Label / Location</label>
                <input
                  type="text"
                  value={newCameraForm.name}
                  onChange={(e) => setNewCameraForm({ ...newCameraForm, name: e.target.value })}
                  placeholder="e.g. North Concourse Entrance"
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
                  <label className="block text-[#475569] font-bold uppercase mb-1">Status</label>
                  <select
                    value={newCameraForm.status}
                    onChange={(e) => setNewCameraForm({ ...newCameraForm, status: e.target.value })}
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
                <span>LINK CAMERA INTO SURVEILLANCE MATRIX</span>
              </button>
            </form>
          </div>

          {/* Camera Grid & Controls (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                Surveillance Feeds Matrix ({cameraFeeds.length})
              </h3>
            </div>

            <div className="space-y-3">
              {cameraFeeds.map((cam) => (
                <div key={cam.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#0F172A] text-white font-bold text-[10px]">
                        {cam.camNumber}
                      </span>
                      <strong className="text-[#0F172A]">{cam.name}</strong>
                      <span className="text-[10px] text-[#64748B]">Zone: {cam.zoneId}</span>
                    </div>
                    <div className="text-[11px] text-[#475569] mt-0.5">
                      Res: <strong>{cam.resolution}</strong> • Detections: <strong>{cam.simulatedDetections}</strong> • Density: <strong>{cam.density}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={cam.status}
                      onChange={(e) => updateCameraFeed(cam.id, { status: e.target.value })}
                      className="p-1.5 rounded border border-[#CBD5E1] bg-white text-[11px] font-bold text-[#0F172A]"
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="STANDBY">STANDBY</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>

                    <button
                      onClick={() => deleteCameraFeed(cam.id)}
                      className="p-1.5 rounded hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                      title="Remove Camera"
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

      {/* ========================================================
          TAB 5: VENUE & EVENT MASTER SETTINGS
          ======================================================== */}
      {adminTab === 'venue' && (
        <div className="max-w-2xl bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <Settings className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#0F172A]">
              Venue & Event System Parameters
            </h3>
          </div>

          <form onSubmit={handleSaveVenueSettings} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#475569] font-bold uppercase mb-1">Active Event Title</label>
              <input
                type="text"
                value={venueSettingsForm.eventName}
                onChange={(e) => setVenueSettingsForm({ ...venueSettingsForm, eventName: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Max Venue Capacity</label>
                <input
                  type="number"
                  value={venueSettingsForm.venueCapacity}
                  onChange={(e) => setVenueSettingsForm({ ...venueSettingsForm, venueCapacity: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">High Risk Threshold (%)</label>
                <input
                  type="number"
                  value={venueSettingsForm.highRiskThreshold}
                  onChange={(e) => setVenueSettingsForm({ ...venueSettingsForm, highRiskThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Critical Threshold (%)</label>
                <input
                  type="number"
                  value={venueSettingsForm.criticalThreshold}
                  onChange={(e) => setVenueSettingsForm({ ...venueSettingsForm, criticalThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CONFIGURATION PARAMETERS</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
