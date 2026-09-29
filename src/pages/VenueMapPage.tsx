import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Layers, 
  Map as MapIcon, 
  Video, 
  AlertTriangle, 
  Navigation, 
  Shield, 
  DoorOpen, 
  Lock, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Activity, 
  Users, 
  TrendingUp, 
  Compass, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  Flame, 
  Clock, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';

// ── Detailed Zone Data for Realistic Venue Mapping ──────────────────────────
export interface VenueZone {
  id: string;
  name: string;
  shortCode: string;
  zoneCategory: 'Ingress' | 'Core Plaza' | 'Concourse' | 'Egress' | 'VIP' | 'Vertical Transit';
  level: string;
  x: number;      // % on map
  y: number;
  w: number;
  h: number;
  density: number; // 0 - 100%
  capacity: number;
  people: number;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'CONSTRAINED' | 'DIVERTING' | 'AT CAPACITY';
  cameras: string[];
  inflow: number;  // persons/min
  outflow: number; // persons/min
  flowDirection: string;
  evacuationSLA: string;
  bottleneckReason?: string;
  hotspotCoords?: { cx: number; cy: number; r: number }[];
}

const VENUE_ZONES: VenueZone[] = [
  {
    id: 'main-gate',
    name: 'Gate A — Main Ingress',
    shortCode: 'GATE-A',
    zoneCategory: 'Ingress',
    level: 'Level 0',
    x: 8,
    y: 70,
    w: 22,
    h: 18,
    density: 38,
    capacity: 220,
    people: 84,
    risk: 'LOW',
    status: 'OPEN',
    cameras: ['CAM-01'],
    inflow: 24,
    outflow: 18,
    flowDirection: 'Northbound → Central Plaza',
    evacuationSLA: '1.2 mins',
    hotspotCoords: [{ cx: 19, cy: 79, r: 8 }],
  },
  {
    id: 'south-concourse',
    name: 'South Concourse & Food Hall',
    shortCode: 'S-CONC',
    zoneCategory: 'Concourse',
    level: 'Level 0',
    x: 34,
    y: 72,
    w: 36,
    h: 16,
    density: 55,
    capacity: 320,
    people: 176,
    risk: 'MODERATE',
    status: 'CONSTRAINED',
    cameras: ['CAM-05'],
    inflow: 28,
    outflow: 22,
    flowDirection: 'Bidirectional West ↔ East',
    evacuationSLA: '2.1 mins',
    hotspotCoords: [{ cx: 52, cy: 80, r: 10 }],
  },
  {
    id: 'west-gate',
    name: 'West Gate Turnstiles',
    shortCode: 'WEST-GT',
    zoneCategory: 'Ingress',
    level: 'Level 0',
    x: 6,
    y: 34,
    w: 18,
    h: 28,
    density: 91,
    capacity: 180,
    people: 164,
    risk: 'CRITICAL',
    status: 'AT CAPACITY',
    cameras: ['CAM-08'],
    inflow: 56,
    outflow: 13,
    flowDirection: 'Choked Eastbound to Plaza',
    evacuationSLA: '4.8 mins',
    bottleneckReason: 'Turnstile inflow rate exceeds security gate clearance speed by +43 persons/min.',
    hotspotCoords: [{ cx: 15, cy: 48, r: 12 }, { cx: 20, cy: 40, r: 9 }],
  },
  {
    id: 'central-plaza',
    name: 'Central Arena Arena & Core Stage',
    shortCode: 'CTRL-PLAZA',
    zoneCategory: 'Core Plaza',
    level: 'Level 0',
    x: 28,
    y: 28,
    w: 42,
    h: 36,
    density: 85,
    capacity: 550,
    people: 468,
    risk: 'HIGH',
    status: 'DIVERTING',
    cameras: ['CAM-04'],
    inflow: 64,
    outflow: 38,
    flowDirection: 'Swirling Convergent Turbulence',
    evacuationSLA: '3.6 mins',
    bottleneckReason: 'Opposing crowd vectors from West Gate & East Wing creating static kernel.',
    hotspotCoords: [{ cx: 48, cy: 46, r: 18 }, { cx: 38, cy: 38, r: 11 }],
  },
  {
    id: 'gate-b',
    name: 'Gate B — East Ingress & Concourse',
    shortCode: 'GATE-B',
    zoneCategory: 'Ingress',
    level: 'Level 0',
    x: 74,
    y: 8,
    w: 20,
    h: 22,
    density: 62,
    capacity: 200,
    people: 124,
    risk: 'MODERATE',
    status: 'CONSTRAINED',
    cameras: ['CAM-02'],
    inflow: 32,
    outflow: 21,
    flowDirection: 'Southwest → Central Plaza',
    evacuationSLA: '1.9 mins',
    hotspotCoords: [{ cx: 84, cy: 19, r: 10 }],
  },
  {
    id: 'vip-lounge',
    name: 'VIP Premium Terrace',
    shortCode: 'VIP-LUX',
    zoneCategory: 'VIP',
    level: 'Level 1',
    x: 74,
    y: 36,
    w: 20,
    h: 28,
    density: 28,
    capacity: 90,
    people: 25,
    risk: 'LOW',
    status: 'OPEN',
    cameras: ['CAM-06'],
    inflow: 6,
    outflow: 4,
    flowDirection: 'Lounge Static Dispersion',
    evacuationSLA: '1.0 mins',
    hotspotCoords: [{ cx: 84, cy: 50, r: 8 }],
  },
  {
    id: 'north-exit',
    name: 'North Emergency Egress Corridor',
    shortCode: 'N-EXIT',
    zoneCategory: 'Egress',
    level: 'Level 0',
    x: 36,
    y: 6,
    w: 28,
    h: 16,
    density: 22,
    capacity: 180,
    people: 40,
    risk: 'LOW',
    status: 'OPEN',
    cameras: ['CAM-03'],
    inflow: 5,
    outflow: 22,
    flowDirection: 'Rapid Northbound Outflow',
    evacuationSLA: '0.8 mins',
    hotspotCoords: [{ cx: 50, cy: 14, r: 8 }],
  },
  {
    id: 'emergency-stair',
    name: 'Emergency Stairwell #2 (Southwest)',
    shortCode: 'STAIR-2',
    zoneCategory: 'Vertical Transit',
    level: 'Level 0-2',
    x: 74,
    y: 70,
    w: 18,
    h: 18,
    density: 16,
    capacity: 80,
    people: 13,
    risk: 'LOW',
    status: 'OPEN',
    cameras: ['CAM-07'],
    inflow: 3,
    outflow: 5,
    flowDirection: 'Direct Vertical Outflow',
    evacuationSLA: '0.9 mins',
    hotspotCoords: [{ cx: 83, cy: 79, r: 6 }],
  },
];

const RISK_THEME: Record<string, {
  color: string;
  bgLight: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  heatCenter: string;
  heatOuter: string;
  emoji: string;
  label: string;
}> = {
  LOW: {
    color: '#16A34A',
    bgLight: '#F0FDF4',
    border: '#BBF7D0',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    heatCenter: 'rgba(34, 197, 94, 0.45)',
    heatOuter: 'rgba(34, 197, 94, 0.03)',
    emoji: '🟢',
    label: 'Safe',
  },
  MODERATE: {
    color: '#D97706',
    bgLight: '#FFFBEB',
    border: '#FDE68A',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    heatCenter: 'rgba(245, 158, 11, 0.55)',
    heatOuter: 'rgba(245, 158, 11, 0.04)',
    emoji: '🟡',
    label: 'Moderate',
  },
  HIGH: {
    color: '#DC2626',
    bgLight: '#FEF2F2',
    border: '#FCA5A5',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    heatCenter: 'rgba(239, 68, 68, 0.65)',
    heatOuter: 'rgba(239, 68, 68, 0.05)',
    emoji: '🟠',
    label: 'High Density',
  },
  CRITICAL: {
    color: '#991B1B',
    bgLight: '#FFF1F2',
    border: '#FECDD3',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    heatCenter: 'rgba(185, 28, 28, 0.78)',
    heatOuter: 'rgba(185, 28, 28, 0.08)',
    emoji: '🔴',
    label: 'Bottleneck Surge',
  },
};

// Floorplan Camera Radar Cones & Positions
const MAP_CAMERAS = [
  { id: 'CAM-01', x: 19, y: 77, angle: 330, fov: 65, zone: 'main-gate' },
  { id: 'CAM-02', x: 84, y: 17, angle: 210, fov: 70, zone: 'gate-b' },
  { id: 'CAM-03', x: 50, y: 12, angle: 180, fov: 60, zone: 'north-exit' },
  { id: 'CAM-04', x: 49, y: 44, angle: 270, fov: 80, zone: 'central-plaza' },
  { id: 'CAM-05', x: 52, y: 78, angle: 90,  fov: 65, zone: 'south-concourse' },
  { id: 'CAM-06', x: 84, y: 48, angle: 180, fov: 60, zone: 'vip-lounge' },
  { id: 'CAM-07', x: 83, y: 77, angle: 270, fov: 55, zone: 'emergency-stair' },
  { id: 'CAM-08', x: 15, y: 46, angle: 45,  fov: 75, zone: 'west-gate' },
];

// Doors, Turnstiles & Emergency Exits
const DOORS_AND_EXITS = [
  { label: 'TURNSTILE A', x: 19, y: 88, type: 'entry', desc: '4 Biometric E-Gates' },
  { label: 'TURNSTILE B', x: 94, y: 19, type: 'entry', desc: '3 Standard Turnstiles' },
  { label: 'TURNSTILE C', x: 6,  y: 48, type: 'entry', desc: 'Bottleneck Turnstile' },
  { label: 'EXIT NORTH',  x: 50, y: 5,  type: 'exit',  desc: 'Primary Emergency Outflow' },
  { label: 'EXIT SOUTH',  x: 52, y: 92, type: 'exit',  desc: 'Concourse Egress' },
  { label: 'FIRE EXIT 1', x: 6,  y: 20, type: 'fire',  desc: 'Stairwell Egress' },
  { label: 'FIRE EXIT 2', x: 94, y: 80, type: 'fire',  desc: 'East Perimeter Exit' },
];

export function VenueMapPage() {
  const { zones: simZones } = useSimulation();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('central-plaza');
  const [activeFloor, setActiveFloor] = useState<'Level 0' | 'Level 1'>('Level 0');
  const [mapMode, setMapMode] = useState<'heatmap' | 'flow' | 'evacuation' | 'architectural'>('heatmap');
  
  // Interactive layer controls
  const [layers, setLayers] = useState({
    heatGlows: true,
    movementVectors: true,
    cameraCones: true,
    zoneBoundaries: true,
    entryExitPoints: true,
    occupancyBars: true,
  });

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [ts, setTs] = useState<string>(new Date().toLocaleTimeString());
  const [rerouteActive, setRerouteActive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setTs(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedZone = VENUE_ZONES.find(z => z.id === selectedZoneId) || VENUE_ZONES[3];
  const selectedTheme = RISK_THEME[selectedZone.risk] || RISK_THEME.LOW;

  // Venue-wide calculations
  const totalCapacity = VENUE_ZONES.reduce((acc, z) => acc + z.capacity, 0);
  const totalOccupants = VENUE_ZONES.reduce((acc, z) => acc + z.people, 0);
  const averageDensity = Math.round((totalOccupants / totalCapacity) * 100);
  const criticalZonesCount = VENUE_ZONES.filter(z => z.risk === 'CRITICAL' || z.risk === 'HIGH').length;

  return (
    <div className="space-y-6 pb-12 font-sans text-[#0F172A]">
      {/* ─────────────────────────────────────────────────────────────────
          1. HEADER BAR — White Clean Architectural Header
          ───────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#BFDBFE]">
              Spatial GIS Mapping
            </span>
            <span className="text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-md border border-[#BBF7D0] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              LIVE THERMAL DENSITY ENGINE ACTIVE
            </span>
            {rerouteActive && (
              <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-md border border-[#FCA5A5] flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                ACTIVE CROWD DIVERSION IN EFFECT
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Metropolitan Arena • Spatial Crowd Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-mono">
            High-fidelity white-theme floorplan, Gaussian thermal blooms, vector movement flows &amp; bottleneck triage • {ts}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] flex items-center gap-1">
            <button
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'heatmap'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Thermal Heatmap</span>
            </button>

            <button
              onClick={() => setMapMode('flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'flow'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
              <span>Flow &amp; Vectors</span>
            </button>

            <button
              onClick={() => setMapMode('evacuation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'evacuation'
                  ? 'bg-white text-[#16A34A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Egress &amp; Exits</span>
            </button>
          </div>

          {/* Quick Reroute Action */}
          <button
            onClick={() => setRerouteActive(r => !r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              rerouteActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-white hover:bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rerouteActive ? 'animate-spin' : ''}`} />
            <span>{rerouteActive ? 'Cancel Diversion' : 'Simulate Diversion'}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          2. KPI STRIP — Venue Occupancy Overview
          ───────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs">
          <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#2563EB]" /> Total Headcount
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A] font-mono mt-1">
            {totalOccupants.toLocaleString()} <span className="text-xs font-semibold text-[#64748B]">/ {totalCapacity.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
            {averageDensity}% Venue Saturation
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs">
          <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" /> Pinch Points
          </div>
          <div className="text-2xl font-extrabold text-[#DC2626] font-mono mt-1">
            {criticalZonesCount} Zones
          </div>
          <div className="text-[11px] text-[#B91C1C] font-semibold mt-0.5">
            West Gate (91%) &amp; Plaza (85%)
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs">
          <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" /> Evacuation SLA
          </div>
          <div className="text-2xl font-extrabold text-[#D97706] font-mono mt-1">
            3.2 mins
          </div>
          <div className="text-[11px] text-[#475569] font-medium mt-0.5">
            Target benchmark: &lt; 4.5 mins
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs">
          <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#64748B] flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-[#16A34A]" /> Sensor Mesh
          </div>
          <div className="text-2xl font-extrabold text-[#16A34A] font-mono mt-1">
            8 / 8 Active
          </div>
          <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
            Zero telemetry latency
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          3. MAIN INTERACTIVE MAP & DETAIL INSPECTOR
          ───────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Architectural Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Map Tool Ribbon */}
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Floor Level Toggle */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#64748B] uppercase text-[10px]">Floorplan Level:</span>
              <button
                onClick={() => setActiveFloor('Level 0')}
                className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                  activeFloor === 'Level 0'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                Level 0 (Concourse &amp; Arena)
              </button>
              <button
                onClick={() => setActiveFloor('Level 1')}
                className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                  activeFloor === 'Level 1'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                Level 1 (VIP &amp; Terrace)
              </button>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setLayers(l => ({ ...l, heatGlows: !l.heatGlows }))}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-bold cursor-pointer transition ${
                  layers.heatGlows
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
                }`}
              >
                🔥 Heat Blobs
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, movementVectors: !l.movementVectors }))}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-bold cursor-pointer transition ${
                  layers.movementVectors
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
                }`}
              >
                🧭 Vectors
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, cameraCones: !l.cameraCones }))}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-bold cursor-pointer transition ${
                  layers.cameraCones
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
                }`}
              >
                📹 CCTV Radar
              </button>
              <button
                onClick={() => setLayers(l => ({ ...l, entryExitPoints: !l.entryExitPoints }))}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-bold cursor-pointer transition ${
                  layers.entryExitPoints
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
                }`}
              >
                🚪 Gates &amp; Exits
              </button>
            </div>
          </div>

          {/* White Architectural Canvas Container */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm overflow-hidden flex flex-col">
            
            {/* Canvas Header Chrome */}
            <div className="bg-[#F8FAFC] px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <MapIcon className="w-4 h-4 text-[#2563EB]" />
                <span className="font-extrabold text-[#0F172A] font-sans text-sm">
                  Metropolitan Arena • Architectural Blueprint &amp; Density Heatmap
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#CBD5E1] text-[#475569] font-bold">
                  Scale 1:400
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748B]">Click any zone to inspect</span>
                <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></div>
              </div>
            </div>

            {/* SVG Architectural Floorplan with White Background and Technical Grid */}
            <div className="relative bg-[#FFFFFF] w-full aspect-[16/11] sm:aspect-[16/10] overflow-hidden select-none">
              
              {/* Subtle Blueprint Dot Grid Background */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* ── SVG DEFS: Thermal Gradients & Blur Filters ── */}
                <defs>
                  {/* Gaussian Blur for Real Fluid Heatmap Dissipation */}
                  <filter id="thermalGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Hot Critical Thermal Radial Gradient */}
                  <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#F97316" stopOpacity="0.55" />
                    <stop offset="75%" stopColor="#FBBF24" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                  </radialGradient>

                  {/* High Thermal Radial Gradient */}
                  <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.80" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.50" />
                    <stop offset="80%" stopColor="#FCD34D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                  </radialGradient>

                  {/* Moderate Thermal Radial Gradient */}
                  <radialGradient id="heatModerate" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.65" />
                    <stop offset="60%" stopColor="#EAB308" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </radialGradient>

                  {/* Safe Cool Thermal Radial Gradient */}
                  <radialGradient id="heatSafe" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.55" />
                    <stop offset="65%" stopColor="#34D399" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </radialGradient>

                  {/* Camera Radar FOV Cone Gradient */}
                  <radialGradient id="radarCone" cx="0%" cy="0%" r="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
                  </radialGradient>

                  {/* Flow Arrow Head Markers */}
                  <marker id="arrowBlue" viewBox="0 0 6 6" refX="4" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB" />
                  </marker>
                  <marker id="arrowRed" viewBox="0 0 6 6" refX="4" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626" />
                  </marker>
                  <marker id="arrowGreen" viewBox="0 0 6 6" refX="4" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#16A34A" />
                  </marker>
                </defs>

                {/* ── ARCHITECTURAL PERIMETER WALLS & FOUNDATION ── */}
                {/* Outer Arena Boundary */}
                <rect 
                  x="3" 
                  y="3" 
                  width="94" 
                  height="94" 
                  rx="4" 
                  fill="#FAFAFA" 
                  stroke="#CBD5E1" 
                  strokeWidth="0.8" 
                />
                
                {/* Structural Inner Walls & Corridors */}
                <path 
                  d="M 28 6 L 28 92 M 72 6 L 72 92 M 6 32 L 94 32 M 6 66 L 94 66" 
                  stroke="#E2E8F0" 
                  strokeWidth="0.6" 
                  strokeDasharray="1.5,1.5" 
                />

                {/* ── LAYER 1: THERMAL GAUSSIAN HEAT BLOOMS (PROPER HEATMAP) ── */}
                {layers.heatGlows && mapMode !== 'architectural' && (
                  <g filter="url(#thermalGlow)" opacity="0.9">
                    {VENUE_ZONES.map((zone) => {
                      const grad = 
                        zone.risk === 'CRITICAL' ? 'url(#heatCritical)' :
                        zone.risk === 'HIGH' ? 'url(#heatHigh)' :
                        zone.risk === 'MODERATE' ? 'url(#heatModerate)' :
                        'url(#heatSafe)';

                      return (
                        <g key={`glow-${zone.id}`}>
                          {zone.hotspotCoords?.map((spot, idx) => (
                            <circle
                              key={idx}
                              cx={spot.cx}
                              cy={spot.cy}
                              r={spot.r * (rerouteActive && zone.id === 'west-gate' ? 0.7 : 1)}
                              fill={grad}
                            />
                          ))}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ── LAYER 2: CAMERA RADAR COVERAGE CONES ── */}
                {layers.cameraCones && (
                  <g>
                    {MAP_CAMERAS.map((cam) => {
                      const rad = (cam.angle * Math.PI) / 180;
                      const fovRad = (cam.fov * Math.PI) / 180;
                      const len = 16;
                      const x1 = cam.x + Math.cos(rad - fovRad / 2) * len;
                      const y1 = cam.y + Math.sin(rad - fovRad / 2) * len;
                      const x2 = cam.x + Math.cos(rad + fovRad / 2) * len;
                      const y2 = cam.y + Math.sin(rad + fovRad / 2) * len;

                      return (
                        <g key={cam.id} className="pointer-events-none">
                          {/* FOV Cone Path */}
                          <path
                            d={`M ${cam.x} ${cam.y} L ${x1} ${y1} A ${len} ${len} 0 0 1 ${x2} ${y2} Z`}
                            fill="url(#radarCone)"
                            stroke="#3B82F6"
                            strokeWidth="0.25"
                            strokeDasharray="0.8,0.8"
                          />
                          {/* Camera Icon Pin */}
                          <circle cx={cam.x} cy={cam.y} r="1.6" fill="#1E293B" stroke="#FFFFFF" strokeWidth="0.4" />
                          <circle cx={cam.x} cy={cam.y} r="0.6" fill="#10B981" />
                          <text x={cam.x} y={cam.y - 2.2} fontSize="1.6" textAnchor="middle" fill="#1E293B" fontWeight="bold" fontFamily="monospace">
                            {cam.id}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ── LAYER 3: ZONE ROOM BOUNDARIES & ARCHITECTURAL CARDS ── */}
                {VENUE_ZONES.map((zone) => {
                  const isSelected = zone.id === selectedZoneId;
                  const cfg = RISK_THEME[zone.risk] || RISK_THEME.LOW;

                  return (
                    <g
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className="cursor-pointer transition-transform duration-150 group"
                    >
                      {/* Zone Room Fill Box */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.w}
                        height={zone.h}
                        rx="2"
                        fill="#FFFFFF"
                        fillOpacity={mapMode === 'architectural' ? 0.95 : 0.72}
                        stroke={isSelected ? '#2563EB' : cfg.border}
                        strokeWidth={isSelected ? '0.9' : '0.4'}
                        className="group-hover:stroke-[#2563EB] transition-colors"
                      />

                      {/* Selected Zone Focus Halo */}
                      {isSelected && (
                        <rect
                          x={zone.x - 0.6}
                          y={zone.y - 0.6}
                          width={zone.w + 1.2}
                          height={zone.h + 1.2}
                          rx="2.6"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="0.4"
                          strokeDasharray="1.5,1"
                          className="animate-pulse"
                        />
                      )}

                      {/* Room Header Strip */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.w}
                        height="4"
                        rx="2"
                        fill={cfg.bgLight}
                        stroke={cfg.border}
                        strokeWidth="0.3"
                      />

                      {/* Zone Short Name */}
                      <text
                        x={zone.x + 1.5}
                        y={zone.y + 2.8}
                        fontSize="2.1"
                        fontWeight="bold"
                        fill="#0F172A"
                        fontFamily="sans-serif"
                      >
                        {zone.shortCode}
                      </text>

                      {/* Density Badge in Room */}
                      <rect
                        x={zone.x + zone.w - 7}
                        y={zone.y + 0.8}
                        width="6"
                        height="2.5"
                        rx="0.6"
                        fill={cfg.badgeBg}
                        stroke={cfg.border}
                        strokeWidth="0.2"
                      />
                      <text
                        x={zone.x + zone.w - 4}
                        y={zone.y + 2.5}
                        fontSize="1.6"
                        fontWeight="bold"
                        fill={cfg.badgeText}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {zone.density}%
                      </text>

                      {/* Full Zone Name */}
                      <text
                        x={zone.x + zone.w / 2}
                        y={zone.y + zone.h * 0.45}
                        fontSize="1.9"
                        fontWeight="600"
                        fill="#1E293B"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {zone.name.split('—')[0]}
                      </text>

                      {/* Headcount pill */}
                      <text
                        x={zone.x + zone.w / 2}
                        y={zone.y + zone.h * 0.65}
                        fontSize="1.6"
                        fill="#64748B"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        👥 {zone.people} / {zone.capacity}
                      </text>

                      {/* Mini Capacity Load Bar at Bottom of Room */}
                      {layers.occupancyBars && (
                        <>
                          <rect
                            x={zone.x + 2}
                            y={zone.y + zone.h - 2.5}
                            width={zone.w - 4}
                            height="1"
                            rx="0.5"
                            fill="#E2E8F0"
                          />
                          <rect
                            x={zone.x + 2}
                            y={zone.y + zone.h - 2.5}
                            width={Math.min(zone.w - 4, ((zone.w - 4) * zone.density) / 100)}
                            height="1"
                            rx="0.5"
                            fill={cfg.color}
                          />
                        </>
                      )}

                      {/* Critical Bottleneck Warning Icon on Room */}
                      {zone.risk === 'CRITICAL' && (
                        <g transform={`translate(${zone.x + zone.w - 3.8}, ${zone.y + zone.h - 5})`}>
                          <circle cx="1.5" cy="1.5" r="1.8" fill="#DC2626" />
                          <text x="1.5" y="2.2" fontSize="1.8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">!</text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* ── LAYER 4: CROWD MOVEMENT FLOW VECTORS ── */}
                {layers.movementVectors && (
                  <g className="pointer-events-none">
                    {/* Gate A to Central Plaza Flow */}
                    <path
                      d="M 19 70 Q 24 55 35 48"
                      stroke="#2563EB"
                      strokeWidth="0.6"
                      strokeDasharray="1.5,1"
                      fill="none"
                      markerEnd="url(#arrowBlue)"
                    />
                    
                    {/* Gate B to Central Plaza Flow */}
                    <path
                      d="M 74 20 Q 58 26 48 35"
                      stroke="#2563EB"
                      strokeWidth="0.6"
                      strokeDasharray="1.5,1"
                      fill="none"
                      markerEnd="url(#arrowBlue)"
                    />

                    {/* West Gate Inflow (High Pressure / Bottleneck Vector) */}
                    <path
                      d="M 15 48 L 28 48"
                      stroke="#DC2626"
                      strokeWidth="0.8"
                      strokeDasharray="1.5,0.8"
                      fill="none"
                      markerEnd="url(#arrowRed)"
                    />

                    {/* Central Plaza to North Exit (Evacuation Flow) */}
                    <path
                      d="M 46 28 L 46 16"
                      stroke={rerouteActive ? '#16A34A' : '#2563EB'}
                      strokeWidth={rerouteActive ? '0.9' : '0.6'}
                      strokeDasharray="1.5,1"
                      fill="none"
                      markerEnd={rerouteActive ? 'url(#arrowGreen)' : 'url(#arrowBlue)'}
                    />

                    {/* South Concourse to Stairwell */}
                    <path
                      d="M 68 80 L 74 80"
                      stroke="#16A34A"
                      strokeWidth="0.6"
                      strokeDasharray="1.5,1"
                      fill="none"
                      markerEnd="url(#arrowGreen)"
                    />
                  </g>
                )}

                {/* ── LAYER 5: DOORS, TURNSTILES & EMERGENCY EXITS ── */}
                {layers.entryExitPoints && (
                  <g className="pointer-events-none">
                    {DOORS_AND_EXITS.map((door, i) => {
                      const isEntry = door.type === 'entry';
                      const isExit = door.type === 'exit';
                      const color = isEntry ? '#2563EB' : isExit ? '#16A34A' : '#DC2626';

                      return (
                        <g key={i}>
                          <rect
                            x={door.x - 4}
                            y={door.y - 1.4}
                            width="8"
                            height="2.8"
                            rx="0.8"
                            fill="#FFFFFF"
                            stroke={color}
                            strokeWidth="0.4"
                          />
                          <text
                            x={door.x}
                            y={door.y + 0.6}
                            fontSize="1.3"
                            fontWeight="bold"
                            fill={color}
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {door.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>

              {/* Floating Architectural Compass & Scale */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl border border-[#CBD5E1] shadow-xs flex items-center gap-2 text-[10px] font-mono font-bold text-[#334155]">
                <Compass className="w-4 h-4 text-[#2563EB]" />
                <span>NORTH • GRID-ALIGN</span>
              </div>
            </div>

            {/* Map Canvas Footer: Color-Coded Thermal Gradient Spectrum Legend */}
            <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0F172A] font-mono text-[11px] uppercase tracking-wider">
                  Heatmap Spectrum:
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-32 rounded-full overflow-hidden flex shadow-2xs border border-[#CBD5E1]">
                    <div className="h-full w-1/4 bg-[#16A34A]" title="0-40% Safe"></div>
                    <div className="h-full w-1/4 bg-[#EAB308]" title="40-60% Moderate"></div>
                    <div className="h-full w-1/4 bg-[#F97316]" title="60-80% High Density"></div>
                    <div className="h-full w-1/4 bg-[#DC2626]" title="80-100% Critical Bottleneck"></div>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">0% Safe → 100% Bottleneck</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-[#475569] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span> Safe Zone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span> Moderate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block"></span> High / Choke
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span> CCTV Node
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            4. RIGHT COLUMN (4 Cols): ZONE INTELLIGENCE INSPECTOR
            ───────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Selected Zone Telemetry Card */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-xs overflow-hidden">
            {/* Header with Zone Risk Color */}
            <div 
              style={{ background: selectedTheme.bgLight, borderColor: selectedTheme.border }}
              className="border-b p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#64748B] font-bold">
                  <span>{selectedZone.level}</span>
                  <span>•</span>
                  <span>{selectedZone.zoneCategory}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-0.5">
                  {selectedZone.name}
                </h3>
              </div>

              <span 
                style={{ color: selectedTheme.badgeText, background: selectedTheme.badgeBg, borderColor: selectedTheme.border }}
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0"
              >
                {selectedTheme.emoji} {selectedTheme.label}
              </span>
            </div>

            {/* Zone Vital Gauges */}
            <div className="p-5 space-y-4">
              
              {/* Density Capacity Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#64748B] font-bold">Density Saturation</span>
                  <span className="font-extrabold text-[#0F172A]">{selectedZone.density}%</span>
                </div>
                <div className="h-3 rounded-full bg-[#E2E8F0] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedZone.density}%`,
                      background: selectedTheme.color,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1 font-mono">
                  <span>{selectedZone.people} people inside</span>
                  <span>Max safe capacity: {selectedZone.capacity}</span>
                </div>
              </div>

              {/* 4 Metrics Tiles */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[10px] font-bold font-mono uppercase text-[#64748B]">Inflow Velocity</span>
                  <div className="text-lg font-extrabold font-mono text-[#0F172A] mt-0.5">
                    {selectedZone.inflow} <span className="text-xs font-normal text-[#64748B]">p/min</span>
                  </div>
                  <span className="text-[10px] text-[#16A34A] font-medium">Entering sector</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[10px] font-bold font-mono uppercase text-[#64748B]">Outflow Velocity</span>
                  <div className="text-lg font-extrabold font-mono text-[#0F172A] mt-0.5">
                    {selectedZone.outflow} <span className="text-xs font-normal text-[#64748B]">p/min</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-medium">Leaving sector</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[10px] font-bold font-mono uppercase text-[#64748B]">Net Accumulation</span>
                  <div className={`text-lg font-extrabold font-mono mt-0.5 ${
                    selectedZone.inflow - selectedZone.outflow > 10 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                  }`}>
                    {selectedZone.inflow - selectedZone.outflow > 0 ? '+' : ''}{selectedZone.inflow - selectedZone.outflow} /min
                  </div>
                  <span className="text-[10px] text-[#64748B] font-medium">
                    {selectedZone.inflow - selectedZone.outflow > 10 ? 'Surging' : 'Stable flow'}
                  </span>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[10px] font-bold font-mono uppercase text-[#64748B]">Evacuation Time</span>
                  <div className="text-lg font-extrabold font-mono text-[#0F172A] mt-0.5">
                    {selectedZone.evacuationSLA}
                  </div>
                  <span className="text-[10px] text-[#64748B] font-medium">Clearance estimate</span>
                </div>
              </div>

              {/* Bottleneck Diagnostic Reason */}
              {selectedZone.bottleneckReason && (
                <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs space-y-1">
                  <div className="font-bold text-[#991B1B] flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Bottleneck Kernel Detected</span>
                  </div>
                  <p className="text-[#7F1D1D] leading-relaxed text-[11px]">
                    {selectedZone.bottleneckReason}
                  </p>
                </div>
              )}

              {/* Connected Camera Coverage */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <div className="text-[10px] font-bold uppercase font-mono text-[#64748B] mb-2 flex items-center justify-between">
                  <span>Assigned CCTV Optical Sensor</span>
                  <span className="text-[#16A34A]">● 30 FPS ONLINE</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-mono text-xs font-bold text-[#0F172A]">
                      {selectedZone.cameras.join(', ')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      window.location.hash = '#/monitoring';
                    }}
                    className="text-xs font-mono font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    View Stream →
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setRerouteActive(true);
                    alert(`Emergency divert initiated for ${selectedZone.name}. Outflow routed towards North Exit.`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs font-mono transition cursor-pointer shadow-xs active:scale-98"
                >
                  ⚡ Trigger Crowd Reroute from This Zone
                </button>
              </div>
            </div>
          </div>

          {/* Quick Zone Selector Directory */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#0F172A]">
                All Venue Sectors ({VENUE_ZONES.length})
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">Sorted by Density</span>
            </div>

            <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
              {VENUE_ZONES.slice()
                .sort((a, b) => b.density - a.density)
                .map((z) => {
                  const cfg = RISK_THEME[z.risk] || RISK_THEME.LOW;
                  const isSel = z.id === selectedZoneId;

                  return (
                    <button
                      key={z.id}
                      onClick={() => setSelectedZoneId(z.id)}
                      className={`w-full text-left p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSel ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          style={{ background: cfg.badgeBg, color: cfg.badgeText, borderColor: cfg.border }}
                          className="w-10 h-7 rounded-lg border font-mono font-extrabold text-xs flex items-center justify-center shrink-0"
                        >
                          {z.density}%
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-[#0F172A] truncate">{z.name}</div>
                          <div className="text-[10px] text-[#64748B] font-mono">{z.shortCode} • {z.people} occupants</div>
                        </div>
                      </div>

                      <span 
                        style={{ color: cfg.color }}
                        className="text-[10px] font-bold font-mono shrink-0"
                      >
                        {cfg.label}
                      </span>
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
