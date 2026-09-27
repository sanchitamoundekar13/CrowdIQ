import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Layers, Map, Video, AlertTriangle, Navigation, Shield, DoorOpen, Lock } from 'lucide-react';

// ── Zone data with heatmap density values ──────────────────────────────────
const ZONES = [
  { id:'main-gate',    name:'Main Gate',        x:10,  y:72, w:18, h:14, density:38, capacity:200, people:76,  risk:'LOW',      status:'OPEN',        cameras:2, inflow:12, outflow:8  },
  { id:'gate-b',       name:'Gate B (East)',     x:72,  y:10, w:16, h:14, density:62, capacity:180, people:112, risk:'MODERATE', status:'CONSTRAINED', cameras:1, inflow:18, outflow:11 },
  { id:'central',      name:'Central Plaza',     x:32,  y:35, w:36, h:28, density:85, capacity:500, people:425, risk:'HIGH',     status:'DIVERTING',   cameras:3, inflow:42, outflow:28 },
  { id:'north-exit',   name:'North Exit',        x:38,  y:5,  w:24, h:10, density:22, capacity:150, people:33,  risk:'LOW',      status:'OPEN',        cameras:1, inflow:4,  outflow:14 },
  { id:'west-gate',    name:'West Gate',         x:5,   y:38, w:12, h:22, density:91, capacity:180, people:164, risk:'CRITICAL', status:'AT CAPACITY', cameras:2, inflow:55, outflow:12 },
  { id:'vip-lounge',   name:'VIP Lounge',        x:68,  y:38, w:22, h:22, density:28, capacity:80,  people:22,  risk:'LOW',      status:'OPEN',        cameras:2, inflow:5,  outflow:3  },
  { id:'south-wing',   name:'South Concourse',   x:30,  y:76, w:40, h:16, density:55, capacity:300, people:165, risk:'MODERATE', status:'CONSTRAINED', cameras:2, inflow:22, outflow:18 },
  { id:'stairwell',    name:'Emergency Stairwell',x:57, y:32, w:10, h:12, density:14, capacity:60,  people:8,   risk:'LOW',      status:'OPEN',        cameras:1, inflow:2,  outflow:4  },
];

const RISK_CFG: Record<string,{color:string;bg:string;border:string;heatBg:string;emoji:string;label:string}> = {
  LOW:      {color:'#16A34A',bg:'#F0FDF4',border:'#BBF7D0',heatBg:'rgba(22,163,74,0.18)',  emoji:'🟢',label:'Low'},
  MODERATE: {color:'#D97706',bg:'#FFFBEB',border:'#FDE68A',heatBg:'rgba(217,119,6,0.22)',  emoji:'🟡',label:'Moderate'},
  HIGH:     {color:'#DC2626',bg:'#FEF2F2',border:'#FCA5A5',heatBg:'rgba(220,38,38,0.28)',  emoji:'🔴',label:'High'},
  CRITICAL: {color:'#9A3412',bg:'#FFF1ED',border:'#F97316',heatBg:'rgba(154,52,18,0.38)',  emoji:'🔴',label:'Critical'},
};

// Map layer toggles
const LAYER_OPTS = [
  { key:'density',    label:'Density',          icon:<Layers className="w-3.5 h-3.5"/>,      color:'#7C3AED' },
  { key:'movement',   label:'Crowd Movement',   icon:<Navigation className="w-3.5 h-3.5"/>,  color:'#2563EB' },
  { key:'risk',       label:'Risk Zones',       icon:<AlertTriangle className="w-3.5 h-3.5"/>,color:'#DC2626' },
  { key:'cameras',    label:'Camera Locations', icon:<Video className="w-3.5 h-3.5"/>,       color:'#059669' },
  { key:'entries',    label:'Entry/Exit Points',icon:<DoorOpen className="w-3.5 h-3.5"/>,    color:'#D97706' },
  { key:'emergency',  label:'Emergency Exits',  icon:<Shield className="w-3.5 h-3.5"/>,      color:'#16A34A' },
  { key:'restricted', label:'Restricted Zones', icon:<Lock className="w-3.5 h-3.5"/>,        color:'#475569' },
];

// Entry/Exit points
const ENTRY_EXITS = [
  { label:'Gate A', x:'12%', y:'80%', type:'entry' },
  { label:'Gate B', x:'75%', y:'8%',  type:'entry' },
  { label:'Gate C', x:'5%',  y:'45%', type:'entry' },
  { label:'N Exit', x:'42%', y:'2%',  type:'exit'  },
  { label:'S Exit', x:'48%', y:'96%', type:'exit'  },
];

// Emergency exit markers
const EMERGENCY_EXITS = [
  { label:'E1', x:'3%',  y:'25%' },
  { label:'E2', x:'92%', y:'25%' },
  { label:'E3', x:'48%', y:'97%' },
  { label:'E4', x:'3%',  y:'72%' },
];

// Camera positions
const CAMERA_POSITIONS = [
  { id:'CAM-01', x:'15%', y:'78%', risk:'LOW'      },
  { id:'CAM-02', x:'76%', y:'15%', risk:'MODERATE' },
  { id:'CAM-03', x:'43%', y:'5%',  risk:'LOW'      },
  { id:'CAM-04', x:'48%', y:'50%', risk:'HIGH'     },
  { id:'CAM-05', x:'50%', y:'84%', risk:'MODERATE' },
  { id:'CAM-06', x:'80%', y:'50%', risk:'LOW'      },
  { id:'CAM-07', x:'60%', y:'38%', risk:'LOW'      },
  { id:'CAM-08', x:'8%',  y:'48%', risk:'CRITICAL' },
];

function getHeatColor(density: number): string {
  if (density >= 85) return 'rgba(154,52,18,0.55)';
  if (density >= 70) return 'rgba(220,38,38,0.40)';
  if (density >= 50) return 'rgba(217,119,6,0.32)';
  return 'rgba(22,163,74,0.22)';
}

function getDensityLabel(density: number): string {
  if (density >= 85) return 'Critical';
  if (density >= 70) return 'High';
  if (density >= 50) return 'Moderate';
  return 'Low';
}

export function VenueMapPage() {
  const { zones: simZones } = useSimulation();
  const [selectedId, setSelectedId] = useState<string | null>('central');
  const [layers, setLayers] = useState<Record<string,boolean>>({
    density: true, movement: false, risk: true, cameras: true,
    entries: true, emergency: false, restricted: false,
  });
  const [ts, setTs] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTs(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleLayer = (key: string) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  const selected = ZONES.find(z => z.id === selectedId);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">Zones Map</span>
            <span className="text-[11px] font-semibold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />LIVE DENSITY
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Crowd Density Heatmap</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            Spatial crowd density, risk zones, camera placement &amp; emergency corridors • {ts}
          </p>
        </div>
        {/* Heatmap legend */}
        <div className="flex items-center gap-3 text-xs">
          {[
            { emoji:'🟢', label:'Low',      bg:'rgba(22,163,74,0.15)',    border:'#BBF7D0' },
            { emoji:'🟡', label:'Moderate', bg:'rgba(217,119,6,0.15)',    border:'#FDE68A' },
            { emoji:'🟠', label:'High',     bg:'rgba(220,38,38,0.15)',    border:'#FCA5A5' },
            { emoji:'🔴', label:'Critical', bg:'rgba(154,52,18,0.20)',    border:'#F97316' },
          ].map((l, i) => (
            <div key={i} style={{ background: l.bg, borderColor: l.border }} className="flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold text-[#0F172A]">
              {l.emoji} {l.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ── Left: Map Controls + Canvas ── */}
        <div className="xl:col-span-8 space-y-4">
          {/* Layer Controls */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-3">Map Layers</h3>
            <div className="flex flex-wrap gap-2">
              {LAYER_OPTS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => toggleLayer(opt.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    layers[opt.key]
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                  style={layers[opt.key] ? { background: opt.color, borderColor: opt.color } : {}}
                >
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Canvas */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="bg-[#0F172A] px-4 py-2 flex items-center gap-3 border-b border-slate-700">
              <Map className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200 text-sm font-bold font-mono">Metropolitan Arena — Floor Plan</span>
              <span className="ml-auto text-[11px] font-mono text-slate-400">Scale 1:400 • {ZONES.length} monitored zones</span>
            </div>

            {/* SVG Map */}
            <div className="relative bg-[#1A2332]" style={{ height: 480 }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Venue outer boundary */}
                <rect x="3" y="3" width="94" height="94" rx="2" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5"/>

                {/* ── DENSITY HEATMAP ZONES ── */}
                {ZONES.map(zone => (
                  <g key={zone.id} onClick={() => setSelectedId(zone.id === selectedId ? null : zone.id)} style={{ cursor: 'pointer' }}>
                    {/* Zone fill */}
                    <rect
                      x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                      rx="1.5"
                      fill={layers.density ? getHeatColor(zone.density) : 'rgba(51,65,85,0.3)'}
                      stroke={selectedId === zone.id ? '#60A5FA' : (layers.risk ? (RISK_CFG[zone.risk]?.color || '#64748B') : 'rgba(100,116,139,0.4)')}
                      strokeWidth={selectedId === zone.id ? '0.8' : '0.35'}
                      opacity={0.9}
                    />
                    {/* Zone label */}
                    <text
                      x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 - 1.5}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="2.2" fill="rgba(255,255,255,0.85)" fontWeight="bold"
                    >
                      {zone.name.length > 14 ? zone.name.slice(0, 13) + '…' : zone.name}
                    </text>
                    {/* Density % */}
                    <text
                      x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 2}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="1.8" fill="rgba(255,255,255,0.65)"
                    >
                      {zone.density}% • {zone.people}p
                    </text>
                  </g>
                ))}

                {/* ── MOVEMENT ARROWS ── */}
                {layers.movement && ZONES.filter(z => z.inflow > 10).map(zone => (
                  <g key={`mv-${zone.id}`}>
                    <line
                      x1={zone.x + zone.w / 2} y1={zone.y + zone.h}
                      x2={zone.x + zone.w / 2} y2={zone.y + zone.h + 4}
                      stroke="rgba(96,165,250,0.7)" strokeWidth="0.4" strokeDasharray="0.8,0.6"
                      markerEnd="url(#arrowBlue)"
                    />
                  </g>
                ))}

                {/* ── CAMERA MARKERS ── */}
                {layers.cameras && CAMERA_POSITIONS.map(cam => {
                  const cfg = RISK_CFG[cam.risk] || RISK_CFG.LOW;
                  const px = parseFloat(cam.x) / 100 * 100;
                  const py = parseFloat(cam.y) / 100 * 100;
                  return (
                    <g key={cam.id}>
                      <circle cx={px} cy={py} r="2" fill={cfg.color} stroke="white" strokeWidth="0.4" opacity="0.9"/>
                      <text x={px + 2.5} y={py + 0.7} fontSize="1.6" fill="rgba(148,163,184,0.9)">{cam.id}</text>
                    </g>
                  );
                })}

                {/* ── ENTRY / EXIT MARKERS ── */}
                {layers.entries && ENTRY_EXITS.map((pt, i) => {
                  const px = parseFloat(pt.x) / 100 * 100;
                  const py = parseFloat(pt.y) / 100 * 100;
                  const col = pt.type === 'entry' ? '#16A34A' : '#D97706';
                  return (
                    <g key={i}>
                      <rect x={px - 3} y={py - 1.5} width={6} height={3} rx="0.8" fill={col} opacity="0.85"/>
                      <text x={px} y={py + 0.6} textAnchor="middle" fontSize="1.5" fill="white" fontWeight="bold">{pt.label}</text>
                    </g>
                  );
                })}

                {/* ── EMERGENCY EXIT MARKERS ── */}
                {layers.emergency && EMERGENCY_EXITS.map((pt, i) => {
                  const px = parseFloat(pt.x) / 100 * 100;
                  const py = parseFloat(pt.y) / 100 * 100;
                  return (
                    <g key={i}>
                      <circle cx={px} cy={py} r="2.2" fill="#16A34A" stroke="white" strokeWidth="0.5" opacity="0.9"/>
                      <text x={px} y={py + 0.7} textAnchor="middle" fontSize="1.6" fill="white" fontWeight="bold">{pt.label}</text>
                    </g>
                  );
                })}

                {/* ── RESTRICTED ZONE HATCHING ── */}
                {layers.restricted && (
                  <>
                    <rect x="58" y="32" width="10" height="12" rx="1" fill="rgba(71,85,105,0.3)" stroke="#475569" strokeWidth="0.5" strokeDasharray="1,0.8"/>
                    <text x="63" y="38.5" textAnchor="middle" fontSize="1.8" fill="#94A3B8">RESTRICTED</text>
                  </>
                )}

                {/* Arrow marker def */}
                <defs>
                  <marker id="arrowBlue" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="rgba(96,165,250,0.8)"/>
                  </marker>
                </defs>
              </svg>

              {/* Compass */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0F172A]/80 border border-slate-600 flex items-center justify-center">
                <span className="text-blue-300 text-xs font-bold font-mono">N</span>
              </div>
            </div>

            {/* Map legend footer */}
            <div className="bg-[#0F172A] px-4 py-2 border-t border-slate-700 flex items-center gap-4 flex-wrap">
              {layers.cameras && <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/>Camera node</span>}
              {layers.entries && <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400"><span className="w-3 h-1.5 rounded bg-green-600 inline-block"/>Entry</span>}
              {layers.entries && <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400"><span className="w-3 h-1.5 rounded bg-amber-600 inline-block"/>Exit</span>}
              {layers.emergency && <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400"><span className="w-2 h-2 rounded-full bg-green-500 border border-white inline-block"/>Emergency exit</span>}
              <span className="ml-auto text-[10px] font-mono text-slate-500">Click zone to inspect</span>
            </div>
          </div>
        </div>

        {/* ── Right: Zone Inspector ── */}
        <div className="xl:col-span-4 space-y-4">
          {/* Selected Zone Detail */}
          {selected ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div style={{ background: RISK_CFG[selected.risk]?.bg, borderColor: RISK_CFG[selected.risk]?.border }}
                className="border-b px-4 py-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#64748B] font-mono">{selected.id.replace('-', ' ').toUpperCase()}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      selected.status === 'AT CAPACITY' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      selected.status === 'DIVERTING' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      selected.status === 'CONSTRAINED' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      Status: {selected.status}
                    </span>
                  </div>
                </div>
                <span style={{ color: RISK_CFG[selected.risk]?.color, background: 'white', borderColor: RISK_CFG[selected.risk]?.border }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono shrink-0">
                  {RISK_CFG[selected.risk]?.emoji} {RISK_CFG[selected.risk]?.label} Risk
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Density bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-[#64748B]">Crowd Density</span>
                    <span className="font-bold text-[#0F172A]">{selected.density}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${selected.density}%`,
                      background: selected.density >= 85 ? '#9A3412' : selected.density >= 70 ? '#DC2626' : selected.density >= 50 ? '#D97706' : '#16A34A'
                    }}/>
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1 font-mono text-right">
                    {getDensityLabel(selected.density)} density level
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label:'People Present', value:selected.people, sub:`of ${selected.capacity} capacity` },
                    { label:'Inflow Rate',    value:`${selected.inflow}/min`, sub:'entering/minute' },
                    { label:'Outflow Rate',   value:`${selected.outflow}/min`, sub:'leaving/minute' },
                    { label:'CCTV Coverage',  value:`${selected.cameras} cam`, sub:'monitoring active' },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#F8FAFC] rounded-xl p-3">
                      <div className="text-[9px] text-[#94A3B8] uppercase tracking-wide">{s.label}</div>
                      <div className="text-base font-extrabold text-[#0F172A] font-mono mt-0.5">{s.value}</div>
                      <div className="text-[9px] text-[#94A3B8]">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Net flow indicator */}
                <div className={`p-3 rounded-xl border ${selected.inflow - selected.outflow > 10 ? 'bg-[#FEF2F2] border-[#FCA5A5]' : 'bg-[#F0FDF4] border-[#BBF7D0]'}`}>
                  <div className="text-[11px] font-mono font-bold text-[#0F172A]">Net Flow</div>
                  <div className={`text-lg font-extrabold font-mono ${selected.inflow - selected.outflow > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                    {selected.inflow - selected.outflow > 0 ? '+' : ''}{selected.inflow - selected.outflow} / min
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">
                    {selected.inflow - selected.outflow > 10 ? '⚠ Crowd accumulating — monitor closely' : '✓ Flow balanced'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs text-center">
              <Map className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#64748B]">Click a zone on the map</p>
              <p className="text-xs text-[#94A3B8] mt-1">to inspect crowd density and telemetry</p>
            </div>
          )}

          {/* Zone List */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">All Zones ({ZONES.length})</h3>
              <span className="text-[11px] text-[#94A3B8] font-mono">{ts}</span>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {ZONES.sort((a, b) => b.density - a.density).map(zone => {
                const cfg = RISK_CFG[zone.risk];
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedId(zone.id === selectedId ? null : zone.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                      selectedId === zone.id ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div style={{ background: cfg.heatBg, borderColor: cfg.border }} className="w-10 h-8 rounded-lg border flex items-center justify-center shrink-0">
                      <span style={{ color: cfg.color }} className="text-xs font-extrabold font-mono">{zone.density}%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0F172A] truncate">{zone.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${zone.density}%`,
                            background: zone.density >= 85 ? '#9A3412' : zone.density >= 70 ? '#DC2626' : zone.density >= 50 ? '#D97706' : '#16A34A'
                          }}/>
                        </div>
                        <span className="text-[10px] font-mono text-[#64748B] shrink-0">{zone.people}p</span>
                      </div>
                    </div>
                    <span style={{ color: cfg.color }} className="text-[10px] font-bold font-mono shrink-0">{cfg.emoji} {cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
