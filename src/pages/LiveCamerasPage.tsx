import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Wifi, WifiOff, Compass, AlertTriangle, Grid, Maximize2, Cpu, TrendingUp, Activity } from 'lucide-react';

interface RiskEngine {
  density: number;    // % 0-100
  velocity: number;   // crowd velocity score
  congestion: number; // bottleneck score
  flowInstability: number; // turbulence score
  score: number;      // composite 0-100
  reason: string;
}

const CAMERAS = [
  { id:'CAM-01', name:'Main Gate',       zone:'Gate A',     location:'North Entrance, Level 0',   status:'ONLINE',  fps:30, res:'1080p',  people:42, density:3.8, direction:'North to Concourse',  risk:'LOW',      re:{ density:38, velocity:22, congestion:30, flowInstability:18, score:27, reason:'Normal inflow at Main Gate. Crowd is moving steadily northward with no opposing flow detected.' } },
  { id:'CAM-02', name:'Gate 2',          zone:'Gate B',     location:'East Wing, Level 0',         status:'ONLINE',  fps:30, res:'4K UHD', people:67, density:5.4, direction:'East to West',         risk:'MODERATE', re:{ density:59, velocity:48, congestion:54, flowInstability:41, score:51, reason:'Moderate crowd build-up at Gate B. Inflow exceeding outflow by ~8 persons/min. Monitor closely.' } },
  { id:'CAM-03', name:'North Exit',      zone:'North Exit', location:'Emergency Exit, Level 1',    status:'OFFLINE', fps:0,  res:'N/A',    people:0,  density:0.0, direction:'Signal Loss',           risk:'LOW',      re:{ density:0, velocity:0, congestion:0, flowInstability:0, score:0, reason:'Camera offline. Risk assessment unavailable — physical inspection recommended.' } },
  { id:'CAM-04', name:'Central Plaza',   zone:'Core',       location:'Central Arena, Level 0',     status:'ONLINE',  fps:25, res:'4K UHD', people:84, density:7.1, direction:'South to Plaza',        risk:'HIGH',     re:{ density:82, velocity:61, congestion:91, flowInstability:73, score:84, reason:'High density + opposing crowd movement detected near Central Plaza. Congestion kernel identified at south entry point. Recommend crowd redirect.' } },
  { id:'CAM-05', name:'South Concourse', zone:'South Wing', location:'South Concourse, Level 1',   status:'ONLINE',  fps:30, res:'1080p',  people:53, density:4.9, direction:'West to South',         risk:'MODERATE', re:{ density:55, velocity:44, congestion:48, flowInstability:38, score:47, reason:'South Concourse showing moderate congestion. Bidirectional flow observed — slight turbulence near food vendor area.' } },
  { id:'CAM-06', name:'VIP Lounge',      zone:'VIP',        location:'Premium Level, Level 3',     status:'ONLINE',  fps:30, res:'4K UHD', people:18, density:2.1, direction:'Static Lounge',         risk:'LOW',      re:{ density:21, velocity:8,  congestion:12, flowInstability:9,  score:14, reason:'VIP zone nominal. Crowd density well within safe thresholds. No anomalous movement patterns detected.' } },
  { id:'CAM-07', name:'Emergency Stair', zone:'Stairwell',  location:'Emergency Stairs, Level 2',  status:'ONLINE',  fps:15, res:'720p',   people:6,  density:1.3, direction:'Upward to Level 2',     risk:'LOW',      re:{ density:14, velocity:19, congestion:8,  flowInstability:11, score:13, reason:'Stairwell usage within normal parameters. Unidirectional upward flow detected — no bottleneck risk.' } },
  { id:'CAM-08', name:'West Gate',       zone:'Gate C',     location:'West Entrance, Level 0',     status:'ONLINE',  fps:30, res:'1080p',  people:91, density:8.4, direction:'West to Central',       risk:'CRITICAL', re:{ density:94, velocity:78, congestion:96, flowInstability:88, score:92, reason:'CRITICAL: Extreme crowd pressure at West Gate. Density exceeds safe threshold. Opposing flows creating dangerous turbulence. Immediate intervention required.' } },
];

const RISK: Record<string,{color:string;bg:string;border:string;emoji:string}> = {
  LOW:      {color:'#16A34A',bg:'#F0FDF4',border:'#BBF7D0',emoji:'🟢'},
  MODERATE: {color:'#D97706',bg:'#FFFBEB',border:'#FDE68A',emoji:'🟡'},
  HIGH:     {color:'#DC2626',bg:'#FEF2F2',border:'#FCA5A5',emoji:'🔴'},
  CRITICAL: {color:'#9A3412',bg:'#FFF1ED',border:'#F97316',emoji:'🔴'},
};

// ── Risk Engine Pipeline Panel ───────────────────────────────────────────
function RiskEnginePanel({ cam }: { cam: typeof CAMERAS[0] }) {
  const re = cam.re;
  const riskCfg = RISK[cam.risk] || RISK.LOW;

  const factors: { label: string; value: number; desc: string }[] = [
    { label: 'Density',          value: re.density,         desc: 'persons/m² vs. capacity threshold' },
    { label: 'Velocity',         value: re.velocity,        desc: 'mean crowd speed & direction variance' },
    { label: 'Congestion',       value: re.congestion,      desc: 'bottleneck kernel pressure index' },
    { label: 'Flow Instability', value: re.flowInstability, desc: 'bidirectional turbulence coefficient' },
  ];

  function barColor(v: number): string {
    if (v >= 80) return '#DC2626';
    if (v >= 60) return '#D97706';
    if (v >= 40) return '#EAB308';
    return '#16A34A';
  }

  const scoreColor = re.score >= 80 ? '#DC2626' : re.score >= 60 ? '#D97706' : re.score >= 40 ? '#EAB308' : '#16A34A';
  const scoreBg    = re.score >= 80 ? '#FEF2F2' : re.score >= 60 ? '#FFFBEB' : re.score >= 40 ? '#FEFCE8' : '#F0FDF4';

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
              Risk Assessment
              <span className="text-[10px] font-mono text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded">YOLOv8 → DeepSORT → Risk Engine</span>
            </div>
            <div className="text-[10px] text-[#64748B] font-mono mt-0.5">{cam.id} · {cam.name} · {cam.zone}</div>
          </div>
        </div>
        {/* Current Risk badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wide">Current Risk</div>
            <span
              style={{ color: riskCfg.color, background: riskCfg.bg, borderColor: riskCfg.border }}
              className="inline-block text-sm font-extrabold px-3 py-0.5 rounded-lg border font-mono mt-0.5"
            >
              {riskCfg.emoji} {cam.risk}
            </span>
          </div>
          {/* Score ring */}
          <div
            style={{ background: scoreBg, border: `2px solid ${scoreColor}` }}
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center"
          >
            <span style={{ color: scoreColor }} className="text-lg font-extrabold font-mono leading-none">{re.score}</span>
            <span style={{ color: scoreColor }} className="text-[9px] font-bold font-mono opacity-70">/100</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Factor bars */}
        <div className="lg:col-span-2 space-y-3">
          {factors.map((f, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#374151] font-mono">{f.label}</span>
                <span className="font-bold font-mono" style={{ color: barColor(f.value) }}>{f.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${f.value}%`, background: barColor(f.value) }}
                />
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5 font-mono">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Score + Reason */}
        <div className="space-y-3">
          {/* Score bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#374151] font-mono">Risk Score</span>
              <span className="font-extrabold font-mono" style={{ color: scoreColor }}>{re.score}/100</span>
            </div>
            <div className="h-3 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${re.score}%`, background: scoreColor }}
              />
            </div>
          </div>

          {/* Pipeline chips */}
          <div className="flex items-center gap-1 flex-wrap">
            {['Camera Feed', 'YOLOv8', 'DeepSORT', 'Risk Engine'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="text-[10px] font-mono font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">{step}</span>
                {i < arr.length - 1 && <span className="text-[#CBD5E1] text-[10px]">›</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Reason box */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed font-mono ${
            cam.risk === 'CRITICAL' ? 'bg-[#FFF1ED] border-[#F97316] text-[#9A3412]' :
            cam.risk === 'HIGH'     ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]' :
            cam.risk === 'MODERATE' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' :
                                      'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]'
          }`}>
            <div className="flex items-center gap-1 font-bold mb-1 text-[10px] uppercase tracking-wide opacity-70">
              <Activity className="w-3 h-3" />Reason
            </div>
            {re.reason}
          </div>
        </div>
      </div>
    </div>
  );
}

function Feed({ cam, tall }: { cam: typeof CAMERAS[0]; tall: boolean }) {
  const [ts, setTs] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTs(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  if (cam.status === 'OFFLINE') {
    return (
      <div className={`bg-[#060C1A] ${tall ? 'h-56' : 'h-36'} flex flex-col items-center justify-center gap-2`}>
        <WifiOff className="w-7 h-7 text-slate-600" />
        <span className="text-slate-500 text-xs font-mono font-bold">FEED OFFLINE</span>
        <span className="text-slate-600 text-[10px] font-mono">{cam.id}</span>
      </div>
    );
  }

  const barW = Math.min(100, (cam.density / 10) * 100);
  const barColor = cam.density > 7 ? '#DC2626' : cam.density > 5 ? '#D97706' : cam.density > 3 ? '#EAB308' : '#16A34A';

  return (
    <div
      className={`relative overflow-hidden ${tall ? 'h-56' : 'h-36'} bg-[#060C1A]`}
      style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 21px,rgba(37,99,235,0.06) 22px),repeating-linear-gradient(90deg,transparent,transparent 21px,rgba(37,99,235,0.06) 22px)' }}
    >
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent animate-bounce"
        style={{ top: '45%', animationDuration: '3.5s' }}
      />
      {Array.from({ length: Math.min(cam.people, 16) }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full border border-blue-400/40 bg-blue-500/15"
          style={{ left: `${8 + ((i * 71) % 80)}%`, top: `${10 + ((i * 53) % 70)}%` }}
        />
      ))}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <span className="bg-black/80 text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          REC {cam.fps}fps
        </span>
        <span className="bg-black/80 text-[10px] font-mono text-blue-300 px-2 py-0.5 rounded">{cam.res}</span>
      </div>
      <div className="absolute top-2 right-2">
        <span
          style={{ background: RISK[cam.risk]?.bg, color: RISK[cam.risk]?.color, borderColor: RISK[cam.risk]?.border }}
          className="text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono"
        >
          {cam.risk}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/85 px-2.5 py-1.5">
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-blue-300 font-bold">{cam.people} persons detected</span>
          <span className="text-slate-400">{ts}</span>
        </div>
        <div className="h-1 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${barW}%`, background: barColor }} />
        </div>
      </div>
    </div>
  );
}

export function LiveCamerasPage() {
  useSimulation();
  const [selectedId, setSelectedId] = useState('CAM-04');
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [ts, setTs] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTs(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const selected = CAMERAS.find(c => c.id === selectedId) || CAMERAS[3];
  const filtered = filterRisk === 'ALL' ? CAMERAS : CAMERAS.filter(c => c.risk === filterRisk);
  const online = CAMERAS.filter(c => c.status === 'ONLINE').length;
  const totalDet = CAMERAS.filter(c => c.status === 'ONLINE').reduce((s, c) => s + c.people, 0);
  const avgD = (CAMERAS.filter(c => c.status === 'ONLINE').reduce((s, c) => s + c.density, 0) / online).toFixed(1);
  const hiRisk = CAMERAS.filter(c => c.risk === 'HIGH' || c.risk === 'CRITICAL').length;

  const tele = [
    { label: 'Camera ID',          val: selected.id,                          isRisk: false, hi: false },
    { label: 'Location',           val: selected.location,                    isRisk: false, hi: false },
    { label: 'Zone',               val: selected.zone,                        isRisk: false, hi: false },
    { label: 'People Detected',    val: `${selected.people} persons`,         isRisk: false, hi: true  },
    { label: 'Crowd Density',      val: `${selected.density.toFixed(1)} /m²`, isRisk: false, hi: false },
    { label: 'Movement Direction', val: selected.direction,                   isRisk: false, hi: false },
    { label: 'Risk Level',         val: selected.risk,                        isRisk: true,  hi: false },
    { label: 'Camera Status',      val: selected.status,                      isRisk: false, hi: false },
    { label: 'FPS',                val: `${selected.fps} fps`,                isRisk: false, hi: false },
    { label: 'Resolution',         val: selected.res,                         isRisk: false, hi: false },
    { label: 'Last Updated',       val: ts,                                   isRisk: false, hi: false },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">Live Monitor</span>
            <span className="text-[11px] font-semibold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />STREAMING
            </span>
            {hiRisk > 0 && (
              <span className="text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />{hiRisk} HIGH RISK
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">CCTV Surveillance &amp; Crowd Monitor</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">Real-time feeds — person detection, density, movement vectors • {ts}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-green-500" />{online}/{CAMERAS.length} active
          </span>
          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'detail' : 'grid')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] text-white cursor-pointer hover:bg-[#1D4ED8] transition"
          >
            {viewMode === 'grid'
              ? <><Maximize2 className="w-3.5 h-3.5" />Detail View</>
              : <><Grid className="w-3.5 h-3.5" />Grid View</>}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Online Cameras', value: `${online}/${CAMERAS.length}`, sub: 'streams active',   color: '#059669', bg: '#F0FDF4' },
          { label: 'Total Detected', value: totalDet,                       sub: 'persons in frame',  color: '#2563EB', bg: '#EFF6FF' },
          { label: 'High Risk',      value: hiRisk,                          sub: 'cameras flagged',  color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Avg Density',    value: `${avgD}/m²`,                   sub: 'venue average',    color: '#D97706', bg: '#FFFBEB' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-xs">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B] mb-1">{s.label}</div>
            <div style={{ color: s.color }} className="text-2xl font-extrabold font-mono">{s.value}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Risk Engine Panel ── always visible, tracks selected or highest-risk camera ── */}
      <RiskEnginePanel cam={viewMode === 'detail' ? selected : (CAMERAS.filter(c => c.status === 'ONLINE').sort((a,b) => b.re.score - a.re.score)[0] || CAMERAS[7])} />

      {/* ── Detail View ── */}
      {viewMode === 'detail' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="bg-[#060C1A] px-4 py-2.5 flex items-center gap-3 border-b border-slate-800">
            <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded">{selected.id}</span>
            <span className="text-white text-sm font-bold">{selected.name}</span>
            <span className="text-slate-400 text-[11px] font-mono truncate">{selected.location}</span>
            <div className="ml-auto shrink-0">
              {selected.status === 'ONLINE'
                ? <span className="text-[11px] text-green-400 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />LIVE</span>
                : <span className="text-[11px] text-red-400 font-mono">OFFLINE</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2"><Feed cam={selected} tall={true} /></div>
            <div className="border-t lg:border-t-0 lg:border-l border-[#E2E8F0] p-5 overflow-y-auto" style={{ maxHeight: 370 }}>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] mb-3">Live Telemetry</h3>
              {tele.map((row, i) => (
                <div key={i} className="flex items-start justify-between gap-2 py-2.5 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-[11px] text-[#64748B] font-mono shrink-0">{row.label}</span>
                  {row.isRisk
                    ? <span style={{ color: RISK[row.val]?.color, background: RISK[row.val]?.bg, borderColor: RISK[row.val]?.border }}
                        className="text-[11px] font-bold px-2 py-0.5 rounded border font-mono">{RISK[row.val]?.emoji} {row.val}</span>
                    : <span className={`text-[11px] font-mono font-bold text-right ${row.hi ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{row.val}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#E2E8F0] p-3 flex items-center gap-2 flex-wrap bg-[#F8FAFC]">
            <span className="text-[11px] font-mono text-[#64748B]">Switch Camera:</span>
            {CAMERAS.map(c => (
              <button key={c.id} onClick={() => c.status === 'ONLINE' && setSelectedId(c.id)} disabled={c.status === 'OFFLINE'}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded transition cursor-pointer
                  ${c.id === selectedId ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#2563EB]'}
                  ${c.status === 'OFFLINE' ? 'opacity-40 cursor-not-allowed' : ''}`}>{c.id}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#64748B]">Filter by risk:</span>
            {['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(r => (
              <button key={r} onClick={() => setFilterRisk(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer
                  ${filterRisk === r ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                {r === 'ALL' ? 'All Cameras' : `${RISK[r]?.emoji || ''} ${r}`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filtered.map(cam => {
              const cfg = RISK[cam.risk] || RISK.LOW;
              const isSel = selectedId === cam.id;
              return (
                <div key={cam.id}
                  onClick={() => { if (cam.status === 'ONLINE') { setSelectedId(cam.id); setViewMode('detail'); } }}
                  className={`bg-white rounded-xl border overflow-hidden transition-all duration-150
                    ${cam.status === 'ONLINE' ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                    ${isSel ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}>
                  <Feed cam={cam} tall={false} />
                  <div className="p-3.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="text-xs font-bold font-mono text-[#2563EB]">{cam.id}</div>
                        <h4 className="text-sm font-bold text-[#0F172A]">{cam.name}</h4>
                      </div>
                      {cam.status === 'ONLINE'
                        ? <span className="text-[10px] font-bold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0] flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />ONLINE
                          </span>
                        : <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-full border border-[#FCA5A5] mt-0.5">OFFLINE</span>}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono mb-2.5 truncate">{cam.location}</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                      {[
                        { label: 'People',  val: `${cam.people}`,     hi: cam.people > 70 },
                        { label: 'Density', val: `${cam.density}/m²`, hi: cam.density > 6 },
                        { label: 'FPS',     val: `${cam.fps}`,        hi: false },
                        { label: 'Zone',    val: cam.zone,            hi: false },
                      ].map((m, i) => (
                        <div key={i} className="bg-[#F8FAFC] rounded-lg p-2">
                          <div className="text-[9px] text-[#94A3B8] uppercase tracking-wide">{m.label}</div>
                          <div className={`text-xs font-bold font-mono mt-0.5 truncate ${m.hi ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Compass className="w-3 h-3 text-[#64748B] shrink-0" />
                      <span className="text-[10px] font-mono text-[#64748B] truncate">{cam.direction}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                      <span style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono">{cfg.emoji} {cam.risk}</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">{ts}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
