import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Users, 
  AlertTriangle, 
  Video, 
  Compass, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  Calendar,
  Flame,
  Radio,
  FileText,
  MapPin,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (routeId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [platformTab, setPlatformTab] = useState<'dashboard' | 'monitor' | 'analytics'>('dashboard');

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen">
      
      {/* ─────────────────────────────────────────────────────────────────
          1. HERO — Smarter Crowd Safety. Real-Time Risk Intelligence.
          ───────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Description, Buttons */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                INTELLIGENT SURVEILLANCE & RISK PREDICTION
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1]">
                Smarter Crowd Safety.<br />
                <span className="text-[#2563EB]">Real-Time Risk</span> Intelligence.
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                CrowdIQ helps organizations monitor crowd density, movement, congestion and safety risks in real time—so security teams can respond before situations escalate.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('platform-preview');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] hover:text-[#0F172A] font-semibold text-sm transition-all cursor-pointer shadow-2xs"
                >
                  <span>Explore Platform</span>
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Dashboard Preview (Not a generic AI illustration) */}
            <div className="lg:col-span-6">
              <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-white font-mono text-xs">
                {/* Preview Window Chrome */}
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold ml-2 font-sans">
                      CrowdIQ Operations • Live Console
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SURVEILLANCE ONLINE
                  </span>
                </div>

                {/* Dashboard Preview Internal Content */}
                <div className="p-4 sm:p-5 space-y-4 bg-slate-950">
                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase">Headcount</span>
                      <div className="text-base font-bold text-white mt-0.5">18,542</div>
                      <span className="text-[9px] text-emerald-400">+12% flow</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase">Density Load</span>
                      <div className="text-base font-bold text-amber-400 mt-0.5">78%</div>
                      <span className="text-[9px] text-amber-400">High Zone</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 uppercase">Risk Index</span>
                      <div className="text-base font-bold text-rose-400 mt-0.5">84/100</div>
                      <span className="text-[9px] text-rose-400">Bottleneck</span>
                    </div>
                  </div>

                  {/* Split Screen: Camera YOLO Feed + Sector Heatmap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Camera Feed Thumbnail */}
                    <div className="relative aspect-[16/10] rounded-lg bg-slate-900 overflow-hidden border border-slate-800">
                      <img
                        src="./assets/crowd_detection_cctv.jpg"
                        alt="CCTV surveillance feed"
                        className="w-full h-full object-cover opacity-85"
                        onError={(e) => {
                          e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                        }}
                      />
                      {/* Bounding box simulation */}
                      <div className="absolute top-[28%] left-[34%] w-[20%] h-[40%] border-2 border-emerald-400 bg-emerald-400/10 rounded-xs">
                        <span className="absolute -top-3.5 left-0 bg-emerald-500 text-slate-950 font-bold text-[7px] px-1 rounded-xs">
                          P#42 98%
                        </span>
                      </div>
                      <div className="absolute bottom-1.5 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-slate-300">
                        CAM-02 • Gate 2 Turnstiles
                      </div>
                    </div>

                    {/* Arena Sector Heatmap Thumbnail */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-300">Arena Floorplan</span>
                        <span className="text-rose-400 font-bold">Gate B Surge</span>
                      </div>
                      <div className="space-y-1.5 my-2">
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>Gate A (North)</span>
                          <span className="text-emerald-400 font-bold">38% Safe</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[38%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>Gate B (East)</span>
                          <span className="text-rose-400 font-bold">94% Critical</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full w-[94%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>Central Plaza</span>
                          <span className="text-amber-400 font-bold">82% High</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[82%]"></div>
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-500">
                        Inflow: 214 p/min • Egress: 98 p/min
                      </div>
                    </div>
                  </div>

                  {/* Active Alert Ticker */}
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-[10px] text-rose-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>CRITICAL: Gate 2 Bottleneck Detected (+18 p/min)</span>
                    </span>
                    <span className="font-bold text-rose-400">20:24 IST</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          2. TRUST / CAPABILITY STRIP
          Real-Time Monitoring · Crowd Intelligence · Risk Detection · Incident Management
          ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-mono font-semibold text-[#475569] text-center">
            <span>Real-Time Monitoring</span>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span>Crowd Intelligence</span>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span>Risk Detection</span>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span>Incident Management</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          3. PROBLEM → SOLUTION
          Crowds change quickly. Traditional monitoring doesn't.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Crowds change quickly. Traditional monitoring doesn't.
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              CrowdIQ combines live monitoring, crowd analytics and risk detection into one operational platform.
            </p>
          </div>

          {/* 4 Cards: Monitor, Detect, Alert, Respond */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3 hover:border-[#BFDBFE] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-extrabold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Monitor</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Understand what's happening. Track live crowd headcount, camera feeds, and zone occupancy continuously.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3 hover:border-[#BFDBFE] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-extrabold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Detect</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Identify abnormal density and movement. Flag opposing crowd vectors and bottleneck choke points early.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3 hover:border-[#BFDBFE] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#DC2626] flex items-center justify-center font-extrabold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Alert</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Surface emerging risks. Automated severity alarms categorized by Critical, High, Medium, and Low risk.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3 hover:border-[#BFDBFE] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-extrabold text-sm">
                04
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Respond</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Coordinate security action. Dispatch tactical squads, initiate lane diversions, and log resolutions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          4. PLATFORM PREVIEW
          Live Dashboard (18,542 People, 7 Active Alerts, 24 Cameras, 3 High-Risk Zones)
          Live Monitor | Analytics
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]" id="platform-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB]">
                Operational Interface
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                A Unified Command Platform
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Real software built for operations centers, security directors, and field responders.
              </p>
            </div>

            {/* Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs font-mono text-xs">
              <button
                onClick={() => setPlatformTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  platformTab === 'dashboard'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                Live Dashboard
              </button>
              <button
                onClick={() => setPlatformTab('monitor')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  platformTab === 'monitor'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                Live Monitor
              </button>
              <button
                onClick={() => setPlatformTab('analytics')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  platformTab === 'analytics'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* PREVIEW 1: LIVE DASHBOARD */}
          {platformTab === 'dashboard' && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-sm space-y-6 animate-fadeIn">
              {/* The 4 Specified Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">People Present</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] mt-1">18,542</div>
                  <span className="text-[11px] text-[#16A34A] font-semibold">+8% flow ingress</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Active Alerts</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#DC2626] mt-1">7</div>
                  <span className="text-[11px] text-[#DC2626] font-semibold">2 Critical · 3 High · 2 Med</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Surveillance Cameras</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#16A34A] mt-1">24</div>
                  <span className="text-[11px] text-[#64748B]">All feeds online</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">High-Risk Zones</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#D97706] mt-1">3</div>
                  <span className="text-[11px] text-[#D97706] font-semibold">Gate B, West Gate, Plaza</span>
                </div>
              </div>

              {/* Spatial Floorplan & Telemetry Strip */}
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="font-bold text-[#0F172A] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    Metropolitan Arena Spatial Zone Telemetry
                  </span>
                  <span className="text-[#16A34A] font-bold">● LIVE HUD 30 FPS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-[#CBD5E1]">
                    <div className="flex justify-between font-bold">
                      <span>Gate A Turnstiles</span>
                      <span className="text-[#16A34A]">38% Load</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-1">CAM-01 • Inflow 18/min • Outflow 12/min</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#FCA5A5] bg-[#FEF2F2]/30">
                    <div className="flex justify-between font-bold">
                      <span>Gate B Concourse</span>
                      <span className="text-[#DC2626]">94% Critical</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-1">CAM-02 • Inflow 55/min • Bottleneck Alert</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#CBD5E1]">
                    <div className="flex justify-between font-bold">
                      <span>Central Plaza</span>
                      <span className="text-[#D97706]">82% High</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-1">CAM-04 • Bidirectional opposing turbulence</div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    <span>Open Full Operational Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW 2: LIVE MONITOR */}
          {platformTab === 'monitor' && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Neural Vision Multi-Camera Feed Stream</h3>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">YOLOv8 Edge inference with movement vectors and risk rating</p>
                </div>
                <button
                  onClick={() => onNavigate('monitoring')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer font-mono"
                >
                  <span>Launch Live Monitor →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'CAM-01', name: 'Main Gate Ingress A', zone: 'Gate A', people: 42, density: '38%', risk: 'LOW', riskColor: 'text-[#16A34A]', border: 'border-[#BBF7D0]' },
                  { id: 'CAM-02', name: 'Gate 2 Turnstiles', zone: 'Gate B', people: 67, density: '59%', risk: 'MODERATE', riskColor: 'text-[#D97706]', border: 'border-[#FDE68A]' },
                  { id: 'CAM-04', name: 'Central Arena Plaza', zone: 'Core', people: 84, density: '82%', risk: 'HIGH', riskColor: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
                ].map(cam => (
                  <div key={cam.id} className="rounded-xl border border-[#CBD5E1] bg-[#0F172A] overflow-hidden text-white font-mono text-xs">
                    <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                      <img
                        src="./assets/crowd_detection_cctv.jpg"
                        alt={cam.name}
                        className="w-full h-full object-cover opacity-85"
                        onError={(e) => {
                          e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                        }}
                      />
                      <div className="absolute top-1.5 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[9px]">
                        {cam.id}
                      </div>
                      <div className="absolute bottom-1.5 right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        30 FPS
                      </div>
                    </div>
                    <div className="p-3 space-y-1 bg-slate-950">
                      <div className="font-bold text-white truncate">{cam.name}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Zone: {cam.zone}</span>
                        <span className={`font-bold ${cam.riskColor}`}>{cam.risk} ({cam.density})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW 3: ANALYTICS */}
          {platformTab === 'analytics' && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Historical Telemetry & Capacity Saturation</h3>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">Macro-level crowd trends, surge peaks, and SLA benchmarks</p>
                </div>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer font-mono"
                >
                  <span>Open Full Analytics →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                  <span className="text-[#64748B] uppercase text-[10px] block font-bold">Peak Surge Window</span>
                  <div className="text-xl font-bold text-[#0F172A] mt-1">20:15 - 20:45 IST</div>
                  <span className="text-[10px] text-[#DC2626]">94% density peak at Gate B</span>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                  <span className="text-[#64748B] uppercase text-[10px] block font-bold">Bottleneck Duration</span>
                  <div className="text-xl font-bold text-[#D97706] mt-1">04m 18s</div>
                  <span className="text-[10px] text-[#16A34A]">Resolved via Gate C diversion</span>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                  <span className="text-[#64748B] uppercase text-[10px] block font-bold">Mean Response SLA</span>
                  <div className="text-xl font-bold text-[#16A34A] mt-1">01m 24s</div>
                  <span className="text-[10px] text-[#16A34A]">Target &lt; 03:00 achieved</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          5. CORE FEATURES (6 Cards)
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Platform Features
            </h2>
            <p className="text-base text-[#64748B]">
              Engineered for high-density environments requiring proactive crowd safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Real-Time Monitoring</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Monitor crowd activity across multiple locations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Risk Detection</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Identify dangerous density and abnormal crowd movement.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Smart Alerts</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Prioritize incidents based on severity.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Event Management</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Manage events, zones and monitoring resources.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Incident Management</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Track incidents from detection to resolution.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Analytics & Reports</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Understand crowd patterns and event performance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          6. USE CASES (4 Cards)
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Operational Use Cases
            </h2>
            <p className="text-base text-[#64748B]">
              Proven deployment scenarios where live crowd intelligence protects attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-2 shadow-2xs">
              <h3 className="text-base font-bold text-[#0F172A]">Large Events</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Concerts, festivals, sporting events.
              </p>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-2 shadow-2xs">
              <h3 className="text-base font-bold text-[#0F172A]">Public Spaces</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Stations, markets, venues.
              </p>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-2 shadow-2xs">
              <h3 className="text-base font-bold text-[#0F172A]">Emergency Management</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Monitor congestion and coordinate response.
              </p>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-2 shadow-2xs">
              <h3 className="text-base font-bold text-[#0F172A]">Venue Security</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Monitor entrances, exits and high-density zones.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          7. SIMPLE CTA
          Turn crowd data into actionable safety intelligence.
          [Launch CrowdIQ]
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E2E8F0] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Turn crowd data into actionable safety intelligence.
          </h2>

          <div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
            >
              <span>Launch CrowdIQ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
