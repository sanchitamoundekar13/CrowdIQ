import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Video, 
  Wifi, 
  WifiOff, 
  Sliders, 
  Plus, 
  Maximize2, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Search, 
  Eye, 
  CheckCircle2, 
  Compass, 
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Smartphone,
} from 'lucide-react';

import { MobileCctvHubModal } from '../components/live/MobileCctvHubModal';

interface CameraNode {

  id: string;
  name: string;
  zone: string;
  location: string;
  ip: string;
  rtspUrl: string;
  resolution: string;
  codec: string;
  fps: number;
  bitrate: string;
  latencyMs: number;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  peopleCount: number;
  density: number;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

const INITIAL_CAMERAS: CameraNode[] = [
  { id: 'CAM-01', name: 'Main Gate Ingress A', zone: 'Gate A', location: 'North Entrance, Level 0', ip: '192.168.10.101', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam01', resolution: '1080p FHD', codec: 'H.265', fps: 30, bitrate: '4.2 Mbps', latencyMs: 28, status: 'ONLINE', peopleCount: 42, density: 38, risk: 'LOW' },
  { id: 'CAM-02', name: 'Gate 2 Turnstiles', zone: 'Gate B', location: 'East Concourse, Level 0', ip: '192.168.10.102', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam02', resolution: '4K UHD', codec: 'H.265', fps: 30, bitrate: '8.6 Mbps', latencyMs: 34, status: 'ONLINE', peopleCount: 67, density: 59, risk: 'MODERATE' },
  { id: 'CAM-03', name: 'North Emergency Exit', zone: 'North Exit', location: 'Emergency Egress, Level 1', ip: '192.168.10.103', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam03', resolution: '1080p FHD', codec: 'H.264', fps: 0, bitrate: '0.0 Mbps', latencyMs: 0, status: 'OFFLINE', peopleCount: 0, density: 0, risk: 'LOW' },
  { id: 'CAM-04', name: 'Central Arena Plaza', zone: 'Core', location: 'Central Concourse, Level 0', ip: '192.168.10.104', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam04', resolution: '4K UHD', codec: 'H.265', fps: 28, bitrate: '9.1 Mbps', latencyMs: 42, status: 'ONLINE', peopleCount: 84, density: 82, risk: 'HIGH' },
  { id: 'CAM-05', name: 'South Concourse & Food', zone: 'South Wing', location: 'South Walkway, Level 1', ip: '192.168.10.105', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam05', resolution: '1080p FHD', codec: 'H.265', fps: 30, bitrate: '4.8 Mbps', latencyMs: 25, status: 'ONLINE', peopleCount: 53, density: 55, risk: 'MODERATE' },
  { id: 'CAM-06', name: 'VIP Lounge Mezzanine', zone: 'VIP', location: 'Executive Suite, Level 3', ip: '192.168.10.106', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam06', resolution: '4K UHD', codec: 'H.265', fps: 30, bitrate: '7.4 Mbps', latencyMs: 19, status: 'ONLINE', peopleCount: 18, density: 21, risk: 'LOW' },
  { id: 'CAM-07', name: 'Emergency Stairwell B', zone: 'Stairwell', location: 'Fire Staircase, Level 2', ip: '192.168.10.107', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam07', resolution: '720p HD', codec: 'H.264', fps: 20, bitrate: '2.1 Mbps', latencyMs: 31, status: 'ONLINE', peopleCount: 6, density: 14, risk: 'LOW' },
  { id: 'CAM-08', name: 'West Gate Turnstiles', zone: 'Gate C', location: 'West Terminal, Level 0', ip: '192.168.10.108', rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam08', resolution: '1080p FHD', codec: 'H.265', fps: 30, bitrate: '5.4 Mbps', latencyMs: 36, status: 'ONLINE', peopleCount: 91, density: 94, risk: 'CRITICAL' },
];

export const CamerasPage: React.FC = () => {
  const { playAlertSound } = useSimulation();
  const [cameras, setCameras] = useState<CameraNode[]>(INITIAL_CAMERAS);
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-04');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'2x2' | '4x4' | 'single'>('2x2');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  const [ptzZoom, setPtzZoom] = useState(1);
  const [rebootMessage, setRebootMessage] = useState<string | null>(null);

  // New Camera Form
  const [newCam, setNewCam] = useState({
    name: '',
    zone: 'Gate A',
    location: '',
    ip: '192.168.10.109',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam09',
    resolution: '1080p FHD',
  });

  const selectedCam = cameras.find(c => c.id === selectedCamId) || cameras[0];

  const filteredCameras = cameras.filter(c => {
    const matchesFilter = statusFilter === 'ALL' ? true : c.status === statusFilter;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRebootCam = (id: string) => {
    setRebootMessage(`Restarting RTSP stream pipeline on ${id}...`);
    playAlertSound('info');
    setTimeout(() => {
      setRebootMessage(`Camera ${id} successfully recalibrated and streaming at 30 FPS.`);
      setTimeout(() => setRebootMessage(null), 3000);
    }, 1500);
  };

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCam.name.trim()) return;
    const newId = `CAM-0${cameras.length + 1}`;
    const addedNode: CameraNode = {
      id: newId,
      name: newCam.name,
      zone: newCam.zone,
      location: newCam.location || 'Concourse Area',
      ip: newCam.ip,
      rtspUrl: newCam.rtspUrl,
      resolution: newCam.resolution,
      codec: 'H.265',
      fps: 30,
      bitrate: '5.2 Mbps',
      latencyMs: 30,
      status: 'ONLINE',
      peopleCount: 12,
      density: 25,
      risk: 'LOW'
    };
    setCameras([...cameras, addedNode]);
    setIsAddModalOpen(false);
    setSelectedCamId(newId);
    playAlertSound('info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[#2563EB]" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Camera Hardware & Stream Infrastructure
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            RTSP feeds, Edge YOLOv8 neural vision pipelines, PTZ controls, and camera device health
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileHubOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Connect 4x Mobile CCTV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Camera</span>
          </button>
        </div>
      </div>


      {rebootMessage && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>{rebootMessage}</span>
          </span>
        </div>
      )}

      {/* Main Grid: Left Primary Feed + PTZ / Telemetry (8 Cols) & Right Camera List (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Focused Live Feed & PTZ Controller */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Main Monitor Viewport */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {selectedCam.id}
                </span>
                <span className="text-xs font-bold font-mono text-white truncate max-w-[200px] sm:max-w-none">
                  {selectedCam.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  • {selectedCam.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                    showOverlays 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  AI Bounding: {showOverlays ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => handleRebootCam(selectedCam.id)}
                  title="Recalibrate RTSP stream"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src="./assets/crowd_detection_cctv.jpg"
                alt={selectedCam.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `scale(${ptzZoom})` }}
                onError={(e) => {
                  e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                }}
              />

              {/* Simulated YOLO AI Bounding Boxes */}
              {showOverlays && selectedCam.status !== 'OFFLINE' && (
                <>
                  <div className="absolute top-[28%] left-[34%] w-[8%] h-[24%] border-2 border-emerald-400 bg-emerald-500/10 rounded-xs pointer-events-none">
                    <span className="absolute -top-4 left-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded-xs">
                      P#12 94%
                    </span>
                  </div>
                  <div className="absolute top-[32%] left-[45%] w-[9%] h-[26%] border-2 border-emerald-400 bg-emerald-500/10 rounded-xs pointer-events-none">
                    <span className="absolute -top-4 left-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded-xs">
                      P#13 97%
                    </span>
                  </div>
                  <div className="absolute top-[30%] left-[58%] w-[10%] h-[28%] border-2 border-rose-500 bg-rose-500/20 rounded-xs pointer-events-none animate-pulse">
                    <span className="absolute -top-4 left-0 bg-rose-600 text-white font-mono text-[8px] font-bold px-1 rounded-xs">
                      TURBULENCE
                    </span>
                  </div>
                </>
              )}

              {selectedCam.status === 'OFFLINE' && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4">
                  <WifiOff className="w-12 h-12 text-rose-500 mb-2" />
                  <span className="text-sm font-bold font-mono text-white">RTSP SIGNAL LOSS / OFFLINE</span>
                  <span className="text-xs font-mono text-slate-400 mt-1">Check switch port at {selectedCam.ip}</span>
                </div>
              )}

              {/* Live HUD Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[11px] text-white flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE {selectedCam.fps} FPS
                </span>
                <span className="text-slate-300">{selectedCam.resolution}</span>
                <span className="text-slate-300">{selectedCam.bitrate}</span>
                <span className="text-slate-300">Ping: {selectedCam.latencyMs}ms</span>
                <span className="text-blue-300 font-bold">{selectedCam.peopleCount} Persons</span>
              </div>
            </div>

            {/* Hardware & Stream Details Strip */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">IP Address</span>
                <span className="text-white font-bold">{selectedCam.ip}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">RTSP Endpoint</span>
                <span className="text-blue-400 font-bold truncate block">{selectedCam.rtspUrl}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Video Codec</span>
                <span className="text-white font-bold">{selectedCam.codec} / RTSP</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Current Risk</span>
                <span className={`font-bold ${
                  selectedCam.risk === 'CRITICAL' ? 'text-rose-400' :
                  selectedCam.risk === 'HIGH' ? 'text-amber-400' :
                  selectedCam.risk === 'MODERATE' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {selectedCam.risk} ({selectedCam.density}%)
                </span>
              </div>
            </div>
          </div>

          {/* PTZ Pan/Tilt/Zoom & Calibration Pad */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  PTZ Directional Control & Optical Zoom
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                Active Axis: Pan ±180° • Tilt -20°/+90°
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Direction Pad */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase mb-2">Directional Pan / Tilt</span>
                <div className="grid grid-cols-3 gap-1.5 w-36">
                  <div></div>
                  <button className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#EFF6FF] text-[#0F172A] flex items-center justify-center cursor-pointer transition">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div></div>
                  <button className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#EFF6FF] text-[#0F172A] flex items-center justify-center cursor-pointer transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-mono text-[10px] font-bold flex items-center justify-center">
                    PTZ
                  </div>
                  <button className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#EFF6FF] text-[#0F172A] flex items-center justify-center cursor-pointer transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div></div>
                  <button className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#EFF6FF] text-[#0F172A] flex items-center justify-center cursor-pointer transition">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Optical Zoom Controls & Presets */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#475569] mb-1.5">
                    <span>Optical Zoom Level</span>
                    <span className="text-[#2563EB]">{ptzZoom.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPtzZoom(Math.max(1, ptzZoom - 0.2))}
                      className="p-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-[#475569]" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={ptzZoom}
                      onChange={(e) => setPtzZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-[#2563EB] cursor-pointer"
                    />
                    <button 
                      onClick={() => setPtzZoom(Math.min(3, ptzZoom + 0.2))}
                      className="p-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-[#475569]" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-1.5">
                    PTZ Presets
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {['Concourse Ingress', 'Turnstile Gate', 'Queue Buffer', 'Wide Angle'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setPtzZoom(preset === 'Turnstile Gate' ? 2 : preset === 'Queue Buffer' ? 1.5 : 1);
                          playAlertSound('info');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#2563EB] transition cursor-pointer text-[11px]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Inventory & Status List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Camera Network ({cameras.length})
              </h3>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                {cameras.filter(c => c.status === 'ONLINE').length} Online • {cameras.filter(c => c.status === 'OFFLINE').length} Offline
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-lg text-xs font-mono">
              {['ALL', 'ONLINE', 'OFFLINE'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    statusFilter === st ? 'bg-white text-[#2563EB] shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cameras by ID, name, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
            />
          </div>

          {/* Camera List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCameras.map((cam) => {
              const isSelected = selectedCamId === cam.id;
              const isOffline = cam.status === 'OFFLINE';

              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 shadow-xs' 
                      : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0F172A]">{cam.id}</span>
                        <span className="text-xs font-semibold text-[#334155]">{cam.name}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono block mt-0.5">
                        {cam.location} • {cam.zone}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase ${
                      isOffline 
                        ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' 
                        : 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                    }`}>
                      {cam.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mt-2 pt-2 border-t border-[#F1F5F9]">
                    <span>{cam.fps} FPS • {cam.resolution}</span>
                    <span className={`font-bold ${
                      cam.risk === 'CRITICAL' ? 'text-[#DC2626]' :
                      cam.risk === 'HIGH' ? 'text-[#D97706]' : 'text-[#16A34A]'
                    }`}>
                      {cam.peopleCount}p • {cam.density}% density
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add New Camera Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-extrabold text-[#0F172A] text-base">Add New Camera Stream</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Camera Label / Name</label>
                <input
                  type="text"
                  placeholder="e.g. East Concourse Turnstiles 3"
                  value={newCam.name}
                  onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Zone Assignment</label>
                  <select
                    value={newCam.zone}
                    onChange={(e) => setNewCam({ ...newCam, zone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    <option value="Gate A">Gate A</option>
                    <option value="Gate B">Gate B</option>
                    <option value="Gate C">Gate C</option>
                    <option value="Core">Core Plaza</option>
                    <option value="VIP">VIP Suite</option>
                    <option value="Stairwell">Stairwell</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Stream Resolution</label>
                  <select
                    value={newCam.resolution}
                    onChange={(e) => setNewCam({ ...newCam, resolution: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    <option value="1080p FHD">1080p FHD (30 FPS)</option>
                    <option value="4K UHD">4K UHD (30 FPS)</option>
                    <option value="720p HD">720p HD (60 FPS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Static IP Address</label>
                <input
                  type="text"
                  value={newCam.ip}
                  onChange={(e) => setNewCam({ ...newCam, ip: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">RTSP Stream URL</label>
                <input
                  type="text"
                  value={newCam.rtspUrl}
                  onChange={(e) => setNewCam({ ...newCam, rtspUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                >
                  Save & Connect Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4x Mobile Phone CCTV Control Hub Modal */}
      <MobileCctvHubModal
        isOpen={isMobileHubOpen}
        onClose={() => setIsMobileHubOpen(false)}
        onNavigateMobileCamera={(camId) => {
          window.location.hash = `#/mobile-camera?camId=${camId}`;
        }}
      />
    </div>
  );
};

