import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  Activity, 
  Gauge, 
  Radio, 
  ArrowRight, 
  Video, 
  Maximize2, 
  CheckCircle, 
  Compass, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  MapPin,
  Bell
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function LiveDashboardSection() {
  const {
    zones,
    selectedZone,
    selectedZoneId,
    selectZone,
    cameraFeeds,
    alerts,
    stage,
    isSimulating,
    startSurgeSimulation,
    resetSimulation,
    approveRecommendation,
    recommendationApproved,
    totalPeople,
    averageDensity,
    activeAlertsCount,
    currentTime
  } = useSimulation();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'heatmap' | 'cameras' | 'alerts'
  const [selectedCameraId, setSelectedCameraId] = useState('cam-02');

  // Progression display mapping
  const stages = [
    { key: 'NORMAL', label: 'NORMAL' },
    { key: 'BUILDING', label: 'MODERATE DENSITY' },
    { key: 'WARNING', label: 'HIGH DENSITY' },
    { key: 'CRITICAL', label: 'CRITICAL CONGESTION' }
  ];

  const currentStageIndex = 
    stage === 'CRITICAL' ? 3 :
    stage === 'WARNING' ? 2 :
    stage === 'BUILDING' ? 1 :
    stage === 'RECOVERY' || stage === 'SAFE' ? 0 : 0;

  // Zone color styling based on safety thresholds
  const getZoneStyle = (density, isSelected) => {
    let bg = 'rgba(22, 163, 74, 0.12)';
    let border = '#16A34A';
    let text = '#15803D';
    let level = 'SAFE';

    if (density >= 85) {
      bg = 'rgba(220, 38, 38, 0.16)';
      border = '#DC2626';
      text = '#B91C1C';
      level = 'CRITICAL';
    } else if (density >= 70) {
      bg = 'rgba(245, 158, 11, 0.16)';
      border = '#F59E0B';
      text = '#B45309';
      level = 'HIGH';
    } else if (density >= 50) {
      bg = 'rgba(234, 179, 8, 0.14)';
      border = '#EAB308';
      text = '#A16207';
      level = 'MODERATE';
    }

    return {
      background: bg,
      borderColor: isSelected ? '#2563EB' : border,
      borderWidth: isSelected ? '2px' : '1px',
      color: text,
      level
    };
  };

  return (
    <section className="bg-white py-12 lg:py-16 border-b border-[#E2E8F0]" id="live-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Demo Simulation Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider text-[#2563EB] uppercase">
                Interactive Surveillance Suite
              </span>
              <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FCA5A5] px-2 py-0.5 rounded">
                DEMO SIMULATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Live Security Operations Dashboard
            </h2>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              Real-time crowd flow analysis, computer vision bounding box feeds, spatial venue heatmap, and risk-weighted incident triage.
            </p>
          </div>

          {/* Simulation Control Bar */}
          <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 flex flex-wrap items-center gap-3 shadow-sm">
            <button
              onClick={startSurgeSimulation}
              disabled={isSimulating || (stage !== 'NORMAL' && stage !== 'SAFE')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stage === 'NORMAL' || stage === 'SAFE'
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm active:scale-95'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Surge...' : 'Start Simulation'}</span>
            </button>

            <button
              onClick={resetSimulation}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#475569] transition-colors cursor-pointer"
              title="Reset to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Simulation Progression Stepper */}
        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              Simulation Lifecycle Progression
            </span>
            <span className="text-xs text-[#64748B]">
              Current Stage: <strong className="text-[#0F172A]">{stage}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stages.map((st, idx) => {
              const isActive = idx === currentStageIndex;
              const isPast = idx < currentStageIndex;
              return (
                <div 
                  key={st.key}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isActive
                      ? idx === 3 
                        ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] font-bold'
                        : idx === 2
                        ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#D97706] font-bold'
                        : 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-bold'
                      : isPast
                      ? 'bg-white border-[#CBD5E1] text-[#64748B]'
                      : 'bg-white/50 border-[#E2E8F0] text-[#94A3B8]'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase mb-0.5">Stage 0{idx + 1}</div>
                  <div className="text-xs">{st.label}</div>
                </div>
              );
            })}
          </div>

          {/* Intervention Callout when Congestion Occurs */}
          {(stage === 'CRITICAL' || stage === 'WARNING') && !recommendationApproved && (
            <div className="mt-4 p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#92400E]">
                    Automated Hazard Mitigator: Inflow Overload at Gate B
                  </div>
                  <div className="text-xs text-[#B45309]">
                    Recommendation: Deploy Security Team 04 to Gate B turnstiles & redirect 40% inflow to Gate C.
                  </div>
                </div>
              </div>
              <button
                onClick={approveRecommendation}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
              >
                Approve & Execute Reroute
              </button>
            </div>
          )}

          {stage === 'SAFE' && (
            <div className="mt-4 p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs font-semibold text-[#16A34A]">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Congestion averted successfully! Crowd density at Gate B normalized to 68% and flow stabilized.</span>
            </div>
          )}
        </div>

        {/* Part A: 6 Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">People Detected</span>
            <div className="text-xl font-extrabold font-mono text-[#0F172A] mt-1">{totalPeople.toLocaleString()}</div>
            <span className="text-[10px] text-[#16A34A] font-medium">+8% flow</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Current Density</span>
            <div className="text-xl font-extrabold font-mono text-[#0F172A] mt-1">{averageDensity}%</div>
            <span className="text-[10px] text-[#64748B]">Capacity load</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Avg Movement</span>
            <div className="text-xl font-extrabold font-mono text-[#0F172A] mt-1">1.2 m/s</div>
            <span className="text-[10px] text-[#0F766E] font-medium">Laminar velocity</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Risk Score</span>
            <div className="text-xl font-extrabold font-mono text-[#0F172A] mt-1">
              {stage === 'CRITICAL' ? '92' : stage === 'WARNING' ? '74' : '38'}<span className="text-xs text-[#64748B]">/100</span>
            </div>
            <span className="text-[10px] text-[#64748B]">Composite index</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Active Cameras</span>
            <div className="text-xl font-extrabold font-mono text-[#16A34A] mt-1">4 / 4</div>
            <span className="text-[10px] text-[#64748B]">Zero feed drops</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Active Alerts</span>
            <div className="text-xl font-extrabold font-mono text-[#DC2626] mt-1">{activeAlertsCount}</div>
            <span className="text-[10px] text-[#DC2626] font-medium">Triage queue</span>
          </div>
        </div>

        {/* Main Grid: B. Venue Heatmap (Left 7 Cols) + C & D. Cameras & Alerts (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Part B: Venue Heatmap & Floor Plan (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  Venue Heatmap & Spatial Zones
                </h3>
                <span className="text-xs text-[#64748B]">Interactive floor plan with real-time zone occupancy and crowd flow vectors</span>
              </div>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-[#16A34A]"><span className="w-2 h-2 rounded bg-[#16A34A]"></span>Safe</span>
                <span className="flex items-center gap-1 text-[#CA8A04]"><span className="w-2 h-2 rounded bg-[#EAB308]"></span>Moderate</span>
                <span className="flex items-center gap-1 text-[#D97706]"><span className="w-2 h-2 rounded bg-[#F59E0B]"></span>High</span>
                <span className="flex items-center gap-1 text-[#DC2626]"><span className="w-2 h-2 rounded bg-[#DC2626]"></span>Critical</span>
              </div>
            </div>

            {/* SVG Venue Map Canvas */}
            <div className="relative aspect-[16/10] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg overflow-hidden p-2 select-none">
              <svg className="w-full h-full" viewBox="0 0 850 540">
                {/* Structural Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="850" height="540" fill="url(#grid)" />

                {/* Outer Venue Perimeter */}
                <rect x="25" y="25" width="800" height="490" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6,4" />
                <text x="40" y="52" fill="#94A3B8" fontSize="12" fontFamily="monospace" fontWeight="bold">ARENA PERIMETER FENCE</text>

                {/* Zones Rendering */}
                {zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const style = getZoneStyle(zone.density, isSelected);
                  const { x, y, width, height } = zone.coordinates;

                  return (
                    <g 
                      key={zone.id} 
                      onClick={() => selectZone(zone.id)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx="8"
                        fill={style.background}
                        stroke={style.borderColor}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                      />

                      {/* Header in Zone */}
                      <rect x={x} y={y} width={width} height="24" rx="8" fill="rgba(255,255,255,0.7)" />
                      <text x={x + 10} y={y + 16} fill="#0F172A" fontSize="11" fontWeight="700">
                        {zone.shortName}
                      </text>

                      {/* Density Badge */}
                      <rect x={x + width - 52} y={y + 4} width="44" height="16" rx="4" fill="#FFFFFF" stroke={style.borderColor} strokeWidth="1" />
                      <text x={x + width - 30} y={y + 16} fill={style.color} fontSize="10" fontWeight="bold" textAnchor="middle">
                        {zone.density}%
                      </text>

                      {/* Population Counter */}
                      <text x={x + 10} y={y + 44} fill="#475569" fontSize="11" fontWeight="600">
                        {zone.currentPeople.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                      </text>

                      {/* Movement vector text */}
                      <text x={x + 10} y={y + 64} fill="#64748B" fontSize="9.5" fontFamily="monospace">
                        Flow: {zone.flowDirection}
                      </text>

                      {/* Status indicator bar inside zone */}
                      <rect x={x + 10} y={y + height - 14} width={width - 20} height="5" rx="2.5" fill="#E2E8F0" />
                      <rect 
                        x={x + 10} 
                        y={y + height - 14} 
                        width={Math.min(width - 20, ((width - 20) * zone.density) / 100)} 
                        height="5" 
                        rx="2.5" 
                        fill={style.borderColor} 
                      />
                    </g>
                  );
                })}

                {/* Animated Crowd Flow Direction Arrows */}
                <g stroke="#2563EB" strokeWidth="2.5" fill="none" strokeDasharray="6,4">
                  {/* Gate A to Arena */}
                  <path d="M 270 135 L 310 240" />
                  {/* Gate B to Arena */}
                  <path d="M 580 135 L 550 240" />
                  {/* Gate C to Concourse */}
                  <path d="M 270 445 L 310 445" />
                  {/* Exit flow */}
                  <path d="M 550 320 L 580 430" />
                </g>

                {/* Vector arrowhead markers */}
                <polygon points="310,240 302,230 316,233" fill="#2563EB" />
                <polygon points="550,240 558,230 544,233" fill="#2563EB" />
              </svg>
            </div>

            {/* Selected Zone Inspector Strip */}
            {selectedZone && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-[#0F172A]">{selectedZone.name}</span>
                  <span className="text-[#64748B] ml-2">({selectedZone.category})</span>
                </div>
                <div className="flex items-center gap-4 text-[#475569]">
                  <span>Inflow: <strong className="text-[#0F172A]">{selectedZone.inflow}/min</strong></span>
                  <span>Outflow: <strong className="text-[#0F172A]">{selectedZone.outflow}/min</strong></span>
                  <span>Forecast +4m: <strong className="text-[#2563EB]">{selectedZone.predictedDensityIn4Min || selectedZone.density}%</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Part C & D: Camera Cards & Alert Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Part C: Camera Monitoring Grid (4 Cameras) */}
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#2563EB]" />
                  Camera Monitoring (4 Feeds)
                </h3>
                <span className="text-[11px] font-mono text-[#16A34A] font-semibold">● 4 ONLINE</span>
              </div>

              {/* 4 Camera Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cameraFeeds.map((cam) => {
                  const isCritical = cam.riskLevel === 'CRITICAL';
                  const isHigh = cam.riskLevel === 'HIGH';
                  const isWatch = cam.riskLevel === 'WATCH';
                  const isSel = selectedCameraId === cam.id;

                  return (
                    <div
                      key={cam.id}
                      onClick={() => setSelectedCameraId(cam.id)}
                      className={`rounded-lg border p-2.5 transition-all cursor-pointer ${
                        isSel 
                          ? 'border-[#2563EB] bg-[#EFF6FF]/40 shadow-sm' 
                          : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {/* Video Preview thumbnail with CCTV stamp */}
                      <div className="relative aspect-[16/9] bg-[#0F172A] rounded overflow-hidden mb-2">
                        <img
                          src="./assets/crowd_detection_cctv.jpg"
                          alt={cam.name}
                          className="w-full h-full object-cover opacity-80"
                          onError={(e) => {
                            e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                          }}
                        />
                        <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] px-1 rounded">
                          {cam.camNumber}
                        </div>
                        <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/70 text-emerald-400 font-mono text-[9px] px-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE
                        </div>
                      </div>

                      {/* Camera Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#0F172A] truncate">{cam.name}</div>
                          <div className="text-[10px] text-[#64748B]">Zone: {cam.zoneId}</div>
                        </div>
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${
                          isCritical 
                            ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                            : isHigh 
                            ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                            : isWatch
                            ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                            : 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                        }`}>
                          {cam.riskLevel}
                        </span>
                      </div>

                      {/* People count & Flow */}
                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#475569] font-mono">
                        <span>Ppl: <strong>{cam.simulatedDetections}</strong></span>
                        <span>Density: <strong>{cam.density}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part D: Security Incident Alert Panel */}
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2563EB]" />
                  Active Alert Panel
                </h3>
                <span className="text-xs text-[#64748B] font-mono">{alerts.length} incidents logged</span>
              </div>

              {/* Specified Alert #1042 Example Card */}
              <div className="border border-[#FCA5A5] bg-[#FEF2F2] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#DC2626]">ALERT #1042</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#DC2626] text-white uppercase">
                      CRITICAL ALERT
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#991B1B]">13:42:18</span>
                </div>

                <div className="font-bold text-xs text-[#991B1B]">
                  High-density congestion detected
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#7F1D1D] font-mono pt-1">
                  <div>Location: <strong>Gate 3 (Gate B)</strong></div>
                  <div>Density: <strong>8.2 persons/m²</strong></div>
                </div>

                <div className="pt-2 border-t border-[#FECACA] flex items-center justify-between text-xs">
                  <span className="text-[#991B1B]">
                    Action: <strong>Open alternate exit</strong>
                  </span>
                  <span className="text-[10px] font-semibold text-[#DC2626] bg-white px-2 py-0.5 rounded border border-[#FCA5A5]">
                    Investigating
                  </span>
                </div>
              </div>

              {/* Dynamic Incident Feed */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {alerts.slice(0, 3).map((alt) => {
                  const isCrit = alt.severity === 'CRITICAL';
                  const isHigh = alt.severity === 'HIGH';
                  return (
                    <div 
                      key={alt.id}
                      className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0F172A] truncate max-w-[200px]">{alt.title}</span>
                        <span className="font-mono text-[10px] text-[#64748B]">{alt.timeFormatted}</span>
                      </div>
                      <p className="text-[#475569] text-[11px] line-clamp-1">{alt.description}</p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
