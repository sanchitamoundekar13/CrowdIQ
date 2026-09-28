import React, { useState, useEffect, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Video, 
  Wifi, 
  WifiOff, 
  Sliders, 
  Plus, 
  Maximize2, 
  Minimize2,
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
  LayoutGrid,
  Grid,
  Monitor,
  Maximize,
  Filter,
  ArrowUpRight,
  Check,
  Radio,
  ExternalLink,
  Camera
} from 'lucide-react';

import { MobileCctvHubModal } from '../components/live/MobileCctvHubModal';
import { mobileCctvService, MobileCameraNode } from '../services/mobileCctvService';

export interface CameraNode {
  id: string;
  name: string;
  zone: string;
  location: string;
  angle: string;
  mountHeight: string;
  fov: string;
  perspectiveType: 'Overhead' | 'Wide' | 'Corridor' | 'Panoramic' | 'Isometric' | 'Downward' | 'Low-Angle' | 'Mobile';
  videoUrl: string;
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
  detectedBodies: Array<{
    id: string;
    box: { top: string; left: string; width: string; height: string };
    score: number;
    label: string;
  }>;
}

const INITIAL_CAMERAS: CameraNode[] = [
  { 
    id: 'CAM-01', 
    name: 'Main Gate Ingress A', 
    zone: 'Gate A', 
    location: 'North Entrance, Level 0', 
    angle: '45° Overhead Ingress',
    mountHeight: '6.5m Gate Arch',
    fov: '95° Downward Inflow',
    perspectiveType: 'Overhead',
    videoUrl: './assets/cctv_crowd_stream_1.webm',
    ip: '192.168.10.101', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam01', 
    resolution: '1080p FHD', 
    codec: 'H.265', 
    fps: 30, 
    bitrate: '4.2 Mbps', 
    latencyMs: 28, 
    status: 'ONLINE', 
    peopleCount: 42, 
    density: 38, 
    risk: 'LOW',
    detectedBodies: [
      { id: 'b1', box: { top: '24%', left: '32%', width: '10%', height: '30%' }, score: 96, label: 'Person #1' },
      { id: 'b2', box: { top: '28%', left: '46%', width: '9%', height: '28%' }, score: 93, label: 'Person #2' },
      { id: 'b3', box: { top: '35%', left: '60%', width: '11%', height: '32%' }, score: 91, label: 'Person #3' },
    ]
  },
  { 
    id: 'CAM-02', 
    name: 'Gate 2 Turnstiles', 
    zone: 'Gate B', 
    location: 'East Concourse, Level 0', 
    angle: 'Concourse Wide Perspective',
    mountHeight: '4.2m East Wall Bracket',
    fov: '120° Panoramic Wide',
    perspectiveType: 'Wide',
    videoUrl: './assets/cctv_crowd_stream_2.webm',
    ip: '192.168.10.102', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam02', 
    resolution: '4K UHD', 
    codec: 'H.265', 
    fps: 30, 
    bitrate: '8.6 Mbps', 
    latencyMs: 34, 
    status: 'ONLINE', 
    peopleCount: 67, 
    density: 59, 
    risk: 'MODERATE',
    detectedBodies: [
      { id: 'b1', box: { top: '30%', left: '22%', width: '11%', height: '30%' }, score: 95, label: 'Person #1' },
      { id: 'b2', box: { top: '32%', left: '42%', width: '10%', height: '28%' }, score: 89, label: 'Person #2' },
      { id: 'b3', box: { top: '26%', left: '68%', width: '12%', height: '34%' }, score: 94, label: 'Person #3' },
    ]
  },
  { 
    id: 'CAM-03', 
    name: 'North Emergency Exit', 
    zone: 'North Exit', 
    location: 'Emergency Egress, Level 1', 
    angle: 'Corridor Long Lens',
    mountHeight: '3.5m Ceiling Center',
    fov: '45° Telephoto Corridor',
    perspectiveType: 'Corridor',
    videoUrl: './assets/cctv_crowd_stream_3.webm',
    ip: '192.168.10.103', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam03', 
    resolution: '1080p FHD', 
    codec: 'H.264', 
    fps: 0, 
    bitrate: '0.0 Mbps', 
    latencyMs: 0, 
    status: 'OFFLINE', 
    peopleCount: 0, 
    density: 0, 
    risk: 'LOW',
    detectedBodies: []
  },
  { 
    id: 'CAM-04', 
    name: 'Central Arena Plaza', 
    zone: 'Core', 
    location: 'Central Concourse, Level 0', 
    angle: '360° Dome Panoramic',
    mountHeight: '12.0m Central Truss',
    fov: '360° Fisheye Center',
    perspectiveType: 'Panoramic',
    videoUrl: './assets/cctv_crowd_stream_2.webm',
    ip: '192.168.10.104', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam04', 
    resolution: '4K UHD', 
    codec: 'H.265', 
    fps: 28, 
    bitrate: '9.1 Mbps', 
    latencyMs: 42, 
    status: 'ONLINE', 
    peopleCount: 84, 
    density: 82, 
    risk: 'HIGH',
    detectedBodies: [
      { id: 'b1', box: { top: '35%', left: '38%', width: '9%', height: '24%' }, score: 98, label: 'Person #1' },
      { id: 'b2', box: { top: '38%', left: '50%', width: '10%', height: '26%' }, score: 92, label: 'Person #2' },
      { id: 'b3', box: { top: '42%', left: '62%', width: '9%', height: '25%' }, score: 96, label: 'Person #3' },
      { id: 'b4', box: { top: '48%', left: '28%', width: '11%', height: '28%' }, score: 90, label: 'Person #4' },
    ]
  },
  { 
    id: 'CAM-05', 
    name: 'South Concourse & Food', 
    zone: 'South Wing', 
    location: 'South Walkway, Level 1', 
    angle: 'Isometric Walkway Angle',
    mountHeight: '5.0m South Structural Pillar',
    fov: '75° Oblique Diagonal',
    perspectiveType: 'Isometric',
    videoUrl: './assets/cctv_crowd_stream_1.webm',
    ip: '192.168.10.105', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam05', 
    resolution: '1080p FHD', 
    codec: 'H.265', 
    fps: 30, 
    bitrate: '4.8 Mbps', 
    latencyMs: 25, 
    status: 'ONLINE', 
    peopleCount: 53, 
    density: 55, 
    risk: 'MODERATE',
    detectedBodies: [
      { id: 'b1', box: { top: '24%', left: '42%', width: '10%', height: '28%' }, score: 91, label: 'Person #1' },
      { id: 'b2', box: { top: '28%', left: '56%', width: '10%', height: '28%' }, score: 88, label: 'Person #2' },
    ]
  },
  { 
    id: 'CAM-06', 
    name: 'VIP Lounge Mezzanine', 
    zone: 'VIP', 
    location: 'Executive Suite, Level 3', 
    angle: 'Balcony Downward Overlook',
    mountHeight: '8.0m Mezzanine Railing',
    fov: '60° Downward Elevated',
    perspectiveType: 'Downward',
    videoUrl: './assets/cctv_crowd_stream_3.webm',
    ip: '192.168.10.106', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam06', 
    resolution: '4K UHD', 
    codec: 'H.265', 
    fps: 30, 
    bitrate: '7.4 Mbps', 
    latencyMs: 19, 
    status: 'ONLINE', 
    peopleCount: 18, 
    density: 21, 
    risk: 'LOW',
    detectedBodies: [
      { id: 'b1', box: { top: '34%', left: '42%', width: '9%', height: '26%' }, score: 94, label: 'Person #1' },
      { id: 'b2', box: { top: '36%', left: '58%', width: '8%', height: '24%' }, score: 97, label: 'Person #2' },
    ]
  },
  { 
    id: 'CAM-07', 
    name: 'Emergency Stairwell B', 
    zone: 'Stairwell', 
    location: 'Fire Staircase, Level 2', 
    angle: 'Low-Angle Stairwell Egress',
    mountHeight: '2.5m Landing Wall',
    fov: '90° Stair Chokepoint',
    perspectiveType: 'Low-Angle',
    videoUrl: './assets/cctv_crowd_stream_1.webm',
    ip: '192.168.10.107', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam07', 
    resolution: '720p HD', 
    codec: 'H.264', 
    fps: 20, 
    bitrate: '2.1 Mbps', 
    latencyMs: 31, 
    status: 'ONLINE', 
    peopleCount: 6, 
    density: 14, 
    risk: 'LOW',
    detectedBodies: [
      { id: 'b1', box: { top: '38%', left: '46%', width: '13%', height: '36%' }, score: 93, label: 'Person #1' },
    ]
  },
  { 
    id: 'CAM-08', 
    name: 'West Gate Turnstiles', 
    zone: 'Gate C', 
    location: 'West Terminal, Level 0', 
    angle: 'Perimeter Chokepoint Angle',
    mountHeight: '7.0m Perimeter Mast',
    fov: '110° Barrier Converging',
    perspectiveType: 'Wide',
    videoUrl: './assets/cctv_crowd_stream_2.webm',
    ip: '192.168.10.108', 
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam08', 
    resolution: '1080p FHD', 
    codec: 'H.265', 
    fps: 30, 
    bitrate: '5.4 Mbps', 
    latencyMs: 36, 
    status: 'ONLINE', 
    peopleCount: 91, 
    density: 94, 
    risk: 'CRITICAL',
    detectedBodies: [
      { id: 'b1', box: { top: '26%', left: '28%', width: '11%', height: '32%' }, score: 97, label: 'Person #1' },
      { id: 'b2', box: { top: '29%', left: '44%', width: '10%', height: '30%' }, score: 95, label: 'Person #2' },
      { id: 'b3', box: { top: '33%', left: '64%', width: '12%', height: '34%' }, score: 92, label: 'Person #3' },
    ]
  },
];

type LayoutMode = 'grid8' | 'quad' | 'mobile4' | 'single' | 'all12';
type AngleFilter = 'ALL' | 'Overhead' | 'Wide' | 'Corridor' | 'Panoramic' | 'Isometric' | 'Downward' | 'Low-Angle';

export const CamerasPage: React.FC = () => {
  const { playAlertSound } = useSimulation();
  const [cameras, setCameras] = useState<CameraNode[]>(INITIAL_CAMERAS);
  const [mobileCameras, setMobileCameras] = useState<MobileCameraNode[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-01');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [angleFilter, setAngleFilter] = useState<AngleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid8'); // Default: All 8 Angles in One Window!
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // Real device webcam stream support
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  // PTZ Control States
  const [ptzZoom, setPtzZoom] = useState(1);
  const [ptzPan, setPtzPan] = useState(0);
  const [ptzTilt, setPtzTilt] = useState(0);
  const [rebootMessage, setRebootMessage] = useState<string | null>(null);

  // New Camera Form
  const [newCam, setNewCam] = useState({
    name: '',
    zone: 'Gate A',
    location: '',
    angle: '45° Overhead Ingress',
    ip: '192.168.10.109',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam09',
    resolution: '1080p FHD',
  });

  // Real Webcam handler
  const handleToggleWebcam = async () => {
    if (isWebcamActive) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
        webcamStreamRef.current = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        webcamStreamRef.current = stream;
        setIsWebcamActive(true);
        setLayoutMode('single'); // Switch to master monitor to inspect
        playAlertSound('info');
        setTimeout(() => {
          if (webcamVideoRef.current) {
            webcamVideoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error('Failed to open device camera', err);
        alert('Could not access device camera. Please check camera permissions in your browser.');
      }
    }
  };

  useEffect(() => {
    if (isWebcamActive && webcamVideoRef.current && webcamStreamRef.current) {
      webcamVideoRef.current.srcObject = webcamStreamRef.current;
    }
  }, [isWebcamActive, selectedCamId, layoutMode]);

  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Subscribe to Mobile CCTV nodes for real-time body counts and stream snapshots
  useEffect(() => {
    const unsubscribe = mobileCctvService.subscribe((list) => {
      setMobileCameras([...list]);
    });
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const selectedCam = cameras.find(c => c.id === selectedCamId) || cameras[0];

  const filteredCameras = cameras.filter(c => {
    const matchesFilter = statusFilter === 'ALL' 
      ? true 
      : statusFilter === 'HIGH_RISK' 
      ? (c.risk === 'HIGH' || c.risk === 'CRITICAL')
      : c.status === statusFilter;
      
    const matchesAngle = angleFilter === 'ALL' ? true : c.perspectiveType === angleFilter;
    
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.angle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesAngle && matchesSearch;
  });

  const totalDetectedBodies = cameras
    .filter(c => c.status === 'ONLINE')
    .reduce((sum, c) => sum + c.peopleCount, 0);

  const onlineCamsCount = cameras.filter(c => c.status === 'ONLINE').length;
  const onlineMobileCamsCount = mobileCameras.filter(c => c.status === 'ONLINE').length;

  const handleRebootCam = (id: string) => {
    setRebootMessage(`Restarting RTSP stream & recalibrating angle on ${id}...`);
    playAlertSound('info');
    setTimeout(() => {
      setRebootMessage(`Camera ${id} successfully recalibrated and recording at 30 FPS.`);
      setTimeout(() => setRebootMessage(null), 3000);
    }, 1200);
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
      angle: newCam.angle,
      mountHeight: '4.5m Wall Bracket',
      fov: '90° Wide Angle',
      perspectiveType: 'Wide',
      videoUrl: './assets/cctv_crowd_stream_1.webm',
      ip: newCam.ip,
      rtspUrl: newCam.rtspUrl,
      resolution: newCam.resolution,
      codec: 'H.265',
      fps: 30,
      bitrate: '5.2 Mbps',
      latencyMs: 30,
      status: 'ONLINE',
      peopleCount: 15,
      density: 28,
      risk: 'LOW',
      detectedBodies: [
        { id: 'b1', box: { top: '30%', left: '45%', width: '10%', height: '28%' }, score: 94, label: 'Person #1' }
      ]
    };
    setCameras([...cameras, addedNode]);
    setIsAddModalOpen(false);
    setSelectedCamId(newId);
    playAlertSound('info');
  };

  return (
    <div className={`space-y-5 pb-12 animate-fadeIn ${isTheaterMode ? 'fixed inset-0 z-50 bg-[#060C1A] p-4 sm:p-6 overflow-y-auto' : ''}`}>
      
      {/* ===================================================================
          WINDOW HEADER: OPERATIONS TITLE & ACTIONS
          =================================================================== */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/50 flex items-center justify-center text-[#3B82F6]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono uppercase">
                  Multi-Camera SOC Video Wall & Angle Controller
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  {onlineCamsCount}/8 REAL RECORDINGS STREAMING
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Real camera recordings, live continuous pedestrian tracking & 4 mobile CCTV feeds in one window
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Device Camera / Webcam Toggle */}
          <button
            onClick={handleToggleWebcam}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
              isWebcamActive
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isWebcamActive ? '🔴 Stop Real Webcam' : '📹 Use Real Device Camera'}</span>
          </button>

          {/* Mobile CCTV Hub Button */}
          <button
            onClick={() => setIsMobileHubOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer border border-[#10B981]/40"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 4x Mobile CCTV</span>
            {onlineMobileCamsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                {onlineMobileCamsCount}
              </span>
            )}
          </button>

          {/* AI Bounding Boxes Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
              showOverlays 
                ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/50' 
                : 'bg-[#1E293B] text-[#94A3B8] border-[#334155]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Body Boxes: {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition border border-[#334155] cursor-pointer"
            title={isTheaterMode ? 'Exit Full Window' : 'Full Window Wall'}
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Add Camera Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* Reboot Message Toast */}
      {rebootMessage && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            <span>{rebootMessage}</span>
          </span>
        </div>
      )}

      {/* ===================================================================
          UNIFIED ONE-WINDOW VIDEO WALL CONTAINER
          =================================================================== */}
      <div className="bg-[#0B1120] rounded-2xl border border-[#1E293B] p-4 sm:p-5 shadow-2xl space-y-4">
        
        {/* TOP BAR OF THE CAMERA WINDOW: VIEW MODE SELECTOR & ANGLE FILTERS */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          
          {/* Layout Mode Selector (The core operator window view switcher) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#111C35] p-1.5 rounded-xl border border-[#1E293B]">
            <span className="text-[11px] font-mono font-bold text-[#64748B] px-2 uppercase tracking-wide">
              Display Window:
            </span>
            
            <button
              onClick={() => setLayoutMode('grid8')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                layoutMode === 'grid8'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>🪟 All 8 Angles Grid</span>
            </button>

            <button
              onClick={() => setLayoutMode('quad')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                layoutMode === 'quad'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>🔲 Quad Split (2x2)</span>
            </button>

            <button
              onClick={() => setLayoutMode('mobile4')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                layoutMode === 'mobile4'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 4x Mobile Phone Nodes</span>
            </button>

            <button
              onClick={() => setLayoutMode('single')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                layoutMode === 'single'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>📺 Focus + Filmstrip</span>
            </button>

            <button
              onClick={() => setLayoutMode('all12')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                layoutMode === 'all12'
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🌐 12-Stream Super Wall</span>
            </button>
          </div>

          {/* Quick Filters: Angle Category & Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Angle Perspective Filter */}
            <div className="flex items-center gap-1 bg-[#111C35] px-2 py-1 rounded-lg border border-[#1E293B] text-xs font-mono">
              <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
              <select
                value={angleFilter}
                onChange={(e) => setAngleFilter(e.target.value as AngleFilter)}
                className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0F172A] text-white">All Angles & Perspectives</option>
                <option value="Overhead" className="bg-[#0F172A] text-white">45° Overhead Ingress</option>
                <option value="Wide" className="bg-[#0F172A] text-white">Wide Perspective Concourse</option>
                <option value="Corridor" className="bg-[#0F172A] text-white">Corridor Long Lens</option>
                <option value="Panoramic" className="bg-[#0F172A] text-white">360° Dome Panoramic</option>
                <option value="Isometric" className="bg-[#0F172A] text-white">Isometric Walkway</option>
                <option value="Downward" className="bg-[#0F172A] text-white">Balcony Downward</option>
                <option value="Low-Angle" className="bg-[#0F172A] text-white">Low-Angle Stairwell</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#111C35] p-0.5 rounded-lg border border-[#1E293B] text-xs font-mono">
              {['ALL', 'ONLINE', 'HIGH_RISK'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-[#2563EB] text-white' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {st === 'HIGH_RISK' ? '⚠️ High Risk' : st}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-[#64748B] absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search camera angle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2.5 py-1 rounded-lg bg-[#111C35] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-[#2563EB] w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* QUICK JUMP ACCESS RIBBON: ALL CAMERAS AT A GLANCE */}
        <div className="bg-[#111C35]/70 rounded-xl p-2.5 border border-[#1E293B] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider pl-1 pr-2 border-r border-[#1E293B]">
              Quick Access:
            </span>
            {cameras.map((c) => {
              const isSelected = selectedCamId === c.id;
              const isOffline = c.status === 'OFFLINE';
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCamId(c.id);
                    if (layoutMode === 'single') {
                      playAlertSound('info');
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB]/30 border-[#3B82F6] text-white shadow-xs'
                      : 'bg-[#0B1120] border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#334155]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    isOffline ? 'bg-[#EF4444]' : c.risk === 'CRITICAL' ? 'bg-[#F97316] animate-pulse' : 'bg-[#10B981]'
                  }`}></span>
                  <span className="font-bold text-white">{c.id}</span>
                  <span className="text-[10px] text-[#94A3B8] max-w-[110px] truncate">{c.angle.split(' ')[0]}</span>
                  <span className="px-1 py-0.2 rounded bg-black/40 text-[9px] text-[#38BDF8] font-bold">
                    {c.peopleCount}p
                  </span>
                </button>
              );
            })}

            {/* Mobile Camera Quick Jump Badges */}
            {mobileCameras.map((mc, idx) => {
              const isOnline = mc.status === 'ONLINE';
              return (
                <button
                  key={`quick-mob-${mc.id}`}
                  onClick={() => {
                    setLayoutMode('mobile4');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition border bg-[#064E3B]/40 border-[#059669]/50 text-[#34D399] hover:bg-[#064E3B] cursor-pointer"
                >
                  <Smartphone className="w-3 h-3 text-[#34D399]" />
                  <span>MOB-0{idx + 1}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-slate-600'}`}></span>
                  <span className="text-[9px] text-[#6EE7B7]">{mc.peopleCount}p</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            VIEWPORT 1: ALL 8 ANGLES GRID (8-UP SOC WALL - REAL VIDEO RECORDINGS)
            =================================================================== */}
        {layoutMode === 'grid8' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Active 8-Stream Video Recording Matrix • Continuous Movement & Body Tracking</span>
              </span>
              <span>Total Detected Bodies: <strong className="text-[#34D399]">{totalDetectedBodies} persons</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCameras.map((cam) => (
                <CameraTileCard
                  key={cam.id}
                  cam={cam}
                  isSelected={selectedCamId === cam.id}
                  showOverlays={showOverlays}
                  onSelect={() => {
                    setSelectedCamId(cam.id);
                  }}
                  onInspect={() => {
                    setSelectedCamId(cam.id);
                    setLayoutMode('single');
                  }}
                  onReboot={() => handleRebootCam(cam.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEWPORT 2: QUAD SPLIT (2x2 LARGE REAL RECORDING MONITORS)
            =================================================================== */}
        {layoutMode === 'quad' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
                <span>High-Definition Quad Recording Split (Top 4 Critical Ingress & Plaza Angles)</span>
              </span>
              <span>Focusing Priority Zones: <strong className="text-white">Gate A, Gate B, Core Plaza, Gate C</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cameras.slice(0, 4).map((cam) => (
                <CameraTileCard
                  key={cam.id}
                  cam={cam}
                  isLarge
                  isSelected={selectedCamId === cam.id}
                  showOverlays={showOverlays}
                  onSelect={() => setSelectedCamId(cam.id)}
                  onInspect={() => {
                    setSelectedCamId(cam.id);
                    setLayoutMode('single');
                  }}
                  onReboot={() => handleRebootCam(cam.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEWPORT 3: 4x MOBILE PHONE CCTV NODES GRID
            =================================================================== */}
        {layoutMode === 'mobile4' && (
          <div className="space-y-4">
            <div className="bg-[#059669]/10 border border-[#059669]/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/30 flex items-center justify-center text-[#34D399]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-white">
                    4x Mobile Phone CCTV Camera Array (Live AI Body Detectors)
                  </h3>
                  <p className="text-[11px] text-[#A7F3D0] font-mono">
                    Any mobile phone can scan the QR code to become a real-time CCTV body counting node.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileHubOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono font-bold transition cursor-pointer self-start sm:self-auto"
              >
                Scan Pair QR Codes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mobileCameras.map((mCam) => {
                const isOnline = mCam.status === 'ONLINE';
                return (
                  <div
                    key={mCam.id}
                    className={`rounded-2xl border overflow-hidden transition-all bg-[#0F172A] ${
                      isOnline ? 'border-[#10B981]/50 shadow-lg shadow-[#10B981]/5' : 'border-[#334155]'
                    }`}
                  >
                    {/* Header */}
                    <div className="p-3 bg-[#111C35] border-b border-[#1E293B] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#059669]/20 text-[#34D399] border border-[#059669]/30">
                          {mCam.id}
                        </span>
                        <span className="text-xs font-bold font-mono text-white truncate max-w-[140px]">
                          {mCam.name}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                        isOnline 
                          ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/30' 
                          : 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/30'
                      }`}>
                        {mCam.status}
                      </span>
                    </div>

                    {/* Stream Viewport */}
                    <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
                      {isOnline && mCam.frameData ? (
                        <img 
                          src={mCam.frameData} 
                          alt={mCam.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : isOnline ? (
                        <div className="w-full h-full relative bg-slate-900 flex flex-col items-center justify-center">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            src="./assets/cctv_crowd_stream_1.webm"
                            className="w-full h-full object-cover opacity-70"
                          />
                          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-3 text-center">
                            <Smartphone className="w-8 h-8 text-[#34D399] mb-1 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-white">Live Phone Streaming</span>
                            <span className="text-[10px] font-mono text-[#A7F3D0]">{mCam.deviceInfo}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#070D19]">
                          <WifiOff className="w-8 h-8 text-slate-600 mb-2" />
                          <span className="text-xs font-mono font-bold text-slate-400">Mobile Node Offline</span>
                          <span className="text-[10px] font-mono text-slate-500 mt-1">Ready for phone connection</span>
                          <button
                            onClick={() => {
                              window.location.hash = `#/mobile-camera?camId=${mCam.id}`;
                            }}
                            className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-mono font-bold cursor-pointer"
                          >
                            <span>Open as CCTV</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Detected Bodies Count HUD Badge */}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px] font-mono text-white">
                        <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                          🎯 BODIES: {mCam.peopleCount}
                        </span>
                        <span className="text-[#94A3B8]">{mCam.fps || 0} FPS</span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-3 bg-[#111C35] text-[10px] font-mono space-y-1.5 border-t border-[#1E293B]">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Perspective:</span>
                        <span className="text-white font-bold">Mobile Handheld / Tripod</span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Assigned Location:</span>
                        <span className="text-white truncate max-w-[130px]">{mCam.location}</span>
                      </div>
                      <div className="pt-1 flex items-center justify-between border-t border-[#1E293B]">
                        <span className={`font-bold ${
                          mCam.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                          mCam.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          Risk: {mCam.riskLevel}
                        </span>
                        <button
                          onClick={() => {
                            window.location.hash = `#/mobile-camera?camId=${mCam.id}`;
                          }}
                          className="text-[#38BDF8] hover:underline font-bold"
                        >
                          Launch Feed →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEWPORT 4: 12-STREAM SUPER WALL (8 VENUE + 4 MOBILE REAL RECORDINGS)
            =================================================================== */}
        {layoutMode === 'all12' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
                <span>Super Video Wall: All 8 Venue Angles + All 4 Mobile CCTV Nodes (12 Feeds)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {cameras.map((cam) => (
                <CameraTileCard
                  key={cam.id}
                  cam={cam}
                  isSelected={selectedCamId === cam.id}
                  showOverlays={showOverlays}
                  onSelect={() => setSelectedCamId(cam.id)}
                  onInspect={() => {
                    setSelectedCamId(cam.id);
                    setLayoutMode('single');
                  }}
                  onReboot={() => handleRebootCam(cam.id)}
                />
              ))}

              {mobileCameras.map((mCam) => (
                <div
                  key={`super-${mCam.id}`}
                  className="rounded-xl border border-[#059669]/40 bg-[#0F172A] overflow-hidden text-white"
                >
                  <div className="p-2 bg-[#064E3B]/40 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#34D399]">📱 {mCam.id} (Mobile)</span>
                    <span className="text-[10px] text-[#A7F3D0]">{mCam.status}</span>
                  </div>
                  <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      src="./assets/cctv_crowd_stream_1.webm"
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute bottom-1 left-2 text-[10px] font-mono text-[#34D399] font-bold">
                      Bodies: {mCam.peopleCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEWPORT 5: FOCUS MASTER + MULTI-ANGLE FILMSTRIP DOCK (REAL VIDEO)
            =================================================================== */}
        {layoutMode === 'single' && (
          <div className="space-y-4">
            
            {/* Master Feed Viewport + PTZ Control */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left 8 Cols: Focused Master Angle Feed */}
              <div className="lg:col-span-8 bg-[#070D19] rounded-2xl border border-[#1E293B] overflow-hidden shadow-2xl">
                {/* Stream Header */}
                <div className="p-3.5 bg-[#111C35] border-b border-[#1E293B] flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#2563EB]/30 text-[#38BDF8] border border-[#2563EB]/40">
                      {isWebcamActive ? 'REAL-WEBCAM' : selectedCam.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-white">
                          {isWebcamActive ? 'Live Device Camera Feed' : selectedCam.name}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                          {isWebcamActive ? '🔴 WEBCAM LIVE' : `📐 ${selectedCam.angle}`}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#94A3B8] font-mono">
                        {selectedCam.location} • Mount: {selectedCam.mountHeight} • FOV: {selectedCam.fov}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleWebcam}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                        isWebcamActive ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isWebcamActive ? 'Stop Webcam' : 'Use Webcam'}</span>
                    </button>

                    <button
                      onClick={() => handleRebootCam(selectedCam.id)}
                      title="Recalibrate stream"
                      className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] transition cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Master Canvas with Zoom/Pan - Real Video Recording */}
                <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
                  {isWebcamActive ? (
                    <video
                      ref={webcamVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ 
                        transform: `scale(${ptzZoom}) translate(${ptzPan}px, ${ptzTilt}px)` 
                      }}
                    />
                  ) : (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={selectedCam.videoUrl}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ 
                        transform: `scale(${ptzZoom}) translate(${ptzPan}px, ${ptzTilt}px)` 
                      }}
                    />
                  )}

                  {/* AI Bounding Boxes on Master Feed */}
                  {showOverlays && selectedCam.status !== 'OFFLINE' && (
                    <>
                      {selectedCam.detectedBodies.map((b) => (
                        <div
                          key={b.id}
                          className="absolute border-2 border-[#10B981] bg-[#10B981]/15 rounded-xs pointer-events-none transition-all duration-300"
                          style={{
                            top: b.box.top,
                            left: b.box.left,
                            width: b.box.width,
                            height: b.box.height,
                          }}
                        >
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-[#34D399] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-xs border border-[#10B981]/60 shadow-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                            <span>{b.label} ({b.score}%)</span>
                          </div>
                        </div>
                      ))}

                      {selectedCam.risk === 'CRITICAL' && (
                        <div className="absolute top-[20%] right-[10%] px-3 py-1.5 rounded-lg bg-rose-600/90 text-white font-mono text-xs font-extrabold animate-pulse border border-rose-400">
                          ⚠️ SURGE CHOKEPOINT ALERT
                        </div>
                      )}
                    </>
                  )}

                  {selectedCam.status === 'OFFLINE' && (
                    <div className="absolute inset-0 bg-[#070D19]/90 flex flex-col items-center justify-center p-4">
                      <WifiOff className="w-12 h-12 text-[#EF4444] mb-2" />
                      <span className="text-sm font-bold font-mono text-white">RTSP SIGNAL LOSS / OFFLINE</span>
                      <span className="text-xs font-mono text-slate-400 mt-1">Check switch port at {selectedCam.ip}</span>
                    </div>
                  )}

                  {/* Master Feed Live HUD */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[11px] text-white flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                      {isWebcamActive ? 'LIVE WEBCAM' : 'LIVE CCTV'} {selectedCam.fps} FPS
                    </span>
                    <span className="text-slate-300">{selectedCam.resolution}</span>
                    <span className="text-slate-300">{selectedCam.bitrate}</span>
                    <span className="text-slate-300">Ping: {selectedCam.latencyMs}ms</span>
                    <span className="text-[#38BDF8] font-bold">🎯 {selectedCam.peopleCount} Bodies Detected</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white">
                    {currentTime}
                  </div>
                </div>

                {/* Telemetry Strip */}
                <div className="p-3.5 bg-[#111C35] border-t border-[#1E293B] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-white">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase block">Angle Perspective</span>
                    <span className="text-[#38BDF8] font-bold">{selectedCam.angle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase block">Mount Elevation</span>
                    <span className="text-white font-bold">{selectedCam.mountHeight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase block">Lens FOV</span>
                    <span className="text-white font-bold">{selectedCam.fov}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase block">Risk Assessment</span>
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

              {/* Right 4 Cols: PTZ Directional Controller & Presets */}
              <div className="lg:col-span-4 bg-[#111C35] rounded-2xl border border-[#1E293B] p-4 text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#38BDF8]" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      PTZ Pan, Tilt & Optical Zoom
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    Active: {selectedCam.id}
                  </span>
                </div>

                {/* Direction Pad */}
                <div className="flex flex-col items-center justify-center py-1">
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase mb-2">
                    Directional Pan / Tilt Controller
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 w-36">
                    <div></div>
                    <button 
                      onClick={() => setPtzTilt(Math.max(-40, ptzTilt - 10))}
                      className="p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] text-white flex items-center justify-center cursor-pointer transition active:scale-95"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div></div>

                    <button 
                      onClick={() => setPtzPan(Math.max(-60, ptzPan - 10))}
                      className="p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] text-white flex items-center justify-center cursor-pointer transition active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => { setPtzPan(0); setPtzTilt(0); setPtzZoom(1); }}
                      className="p-2.5 rounded-lg bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-[#1D4ED8]"
                      title="Reset PTZ Home"
                    >
                      HOME
                    </button>

                    <button 
                      onClick={() => setPtzPan(Math.min(60, ptzPan + 10))}
                      className="p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] text-white flex items-center justify-center cursor-pointer transition active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <div></div>
                    <button 
                      onClick={() => setPtzTilt(Math.min(40, ptzTilt + 10))}
                      className="p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] text-white flex items-center justify-center cursor-pointer transition active:scale-95"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div></div>
                  </div>
                </div>

                {/* Zoom Controller */}
                <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#94A3B8]">
                    <span>Optical Zoom</span>
                    <span className="text-[#38BDF8]">{ptzZoom.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPtzZoom(Math.max(1, ptzZoom - 0.2))}
                      className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-[#94A3B8]" />
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
                      className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </button>
                  </div>
                </div>

                {/* Angle Presets */}
                <div className="pt-2 border-t border-[#1E293B]">
                  <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block mb-1.5">
                    Angle Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { name: '45° Overhead', zoom: 1, pan: 0, tilt: 0 },
                      { name: 'Turnstile Choke', zoom: 2.2, pan: 10, tilt: 15 },
                      { name: 'Wide Inflow', zoom: 1.2, pan: -20, tilt: -5 },
                      { name: 'Surge Zoom', zoom: 2.8, pan: 25, tilt: 20 },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPtzZoom(preset.zoom);
                          setPtzPan(preset.pan);
                          setPtzTilt(preset.tilt);
                          playAlertSound('info');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] hover:border-[#3B82F6] hover:text-[#38BDF8] text-[11px] transition cursor-pointer text-left truncate"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Filmstrip: All Other 7 Camera Angles in Real Video Playback */}
            <div className="bg-[#111C35] rounded-2xl border border-[#1E293B] p-4 text-white space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Multi-Angle Filmstrip (Click any angle to focus master monitor)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748B]">
                  8 Venue Angles + 4 Mobile Nodes Ready
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
                {cameras.map((c) => {
                  const isFocused = selectedCamId === c.id;
                  return (
                    <div
                      key={`filmstrip-${c.id}`}
                      onClick={() => {
                        setSelectedCamId(c.id);
                        playAlertSound('info');
                      }}
                      className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${
                        isFocused 
                          ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/40 scale-102 bg-[#1E293B]' 
                          : 'border-[#1E293B] hover:border-[#334155] bg-[#0F172A]'
                      }`}
                    >
                      <div className="relative aspect-[16/9] bg-black overflow-hidden">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          src={c.videoUrl}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[8px] font-mono font-bold text-white">
                          {c.id}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-[#10B981]/90 text-black px-1 py-0.2 rounded text-[8px] font-mono font-extrabold">
                          {c.peopleCount}p
                        </div>
                      </div>
                      <div className="p-1.5 text-[9px] font-mono truncate">
                        <div className="font-bold text-white truncate">{c.name}</div>
                        <div className="text-[#38BDF8] truncate">{c.angle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ===================================================================
          MODAL 1: ADD NEW CAMERA STREAM MODAL
          =================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F172A] rounded-2xl border border-[#334155] shadow-2xl max-w-md w-full p-6 space-y-4 text-white animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-extrabold text-white text-base font-mono">
                  Add Camera View & Angle Stream
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Camera Label / Name</label>
                <input
                  type="text"
                  placeholder="e.g. East Concourse Turnstiles 3"
                  value={newCam.name}
                  onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#334155] bg-[#111C35] text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#94A3B8] uppercase mb-1">Angle / Perspective</label>
                  <select
                    value={newCam.angle}
                    onChange={(e) => setNewCam({ ...newCam, angle: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#334155] bg-[#111C35] text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="45° Overhead Ingress">45° Overhead Ingress</option>
                    <option value="Concourse Wide Perspective">Concourse Wide</option>
                    <option value="Corridor Long Lens">Corridor Long Lens</option>
                    <option value="360° Dome Panoramic">360° Dome Panoramic</option>
                    <option value="Isometric Walkway Angle">Isometric Walkway</option>
                    <option value="Balcony Downward Overlook">Balcony Downward</option>
                    <option value="Low-Angle Stairwell Egress">Low-Angle Stairwell</option>
                    <option value="Perimeter Chokepoint Angle">Perimeter Chokepoint</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#94A3B8] uppercase mb-1">Zone Assignment</label>
                  <select
                    value={newCam.zone}
                    onChange={(e) => setNewCam({ ...newCam, zone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#334155] bg-[#111C35] text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="Gate A">Gate A</option>
                    <option value="Gate B">Gate B</option>
                    <option value="Gate C">Gate C</option>
                    <option value="Core">Core Plaza</option>
                    <option value="VIP">VIP Suite</option>
                    <option value="Stairwell">Stairwell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Static IP Address</label>
                <input
                  type="text"
                  value={newCam.ip}
                  onChange={(e) => setNewCam({ ...newCam, ip: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#334155] bg-[#111C35] text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">RTSP Stream URL</label>
                <input
                  type="text"
                  value={newCam.rtspUrl}
                  onChange={(e) => setNewCam({ ...newCam, rtspUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#334155] bg-[#111C35] text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#334155] bg-[#111C35] hover:bg-[#1E293B] text-slate-300 font-bold"
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

      {/* ===================================================================
          MODAL 2: 4x MOBILE PHONE CCTV HUB MODAL
          =================================================================== */}
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

// ── COMPONENT: CAMERA TILE CARD IN VIDEO WALL (REAL VIDEO RECORDING) ────────
interface CameraTileProps {
  cam: CameraNode;
  isSelected?: boolean;
  isLarge?: boolean;
  showOverlays?: boolean;
  onSelect: () => void;
  onInspect: () => void;
  onReboot: () => void;
}

const CameraTileCard: React.FC<CameraTileProps> = ({
  cam,
  isSelected,
  isLarge,
  showOverlays,
  onSelect,
  onInspect,
  onReboot,
}) => {
  const isOffline = cam.status === 'OFFLINE';

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border overflow-hidden transition-all bg-[#0F172A] flex flex-col cursor-pointer ${
        isSelected
          ? 'border-[#38BDF8] shadow-lg shadow-[#38BDF8]/10 ring-1 ring-[#38BDF8]'
          : 'border-[#1E293B] hover:border-[#334155]'
      }`}
    >
      {/* Tile Header */}
      <div className="p-3 bg-[#111C35] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30">
            {cam.id}
          </span>
          <div>
            <span className="text-xs font-bold font-mono text-white truncate max-w-[130px] block">
              {cam.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${
            isOffline 
              ? 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/30' 
              : cam.risk === 'CRITICAL'
              ? 'bg-[#F97316]/20 text-[#FB923C] border-[#F97316]/30 animate-pulse'
              : 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/30'
          }`}>
            {cam.risk}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            title="Focus & PTZ Control"
            className="p-1 rounded bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white transition"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Angle & Mount Sub-bar */}
      <div className="px-3 py-1 bg-[#090F1D] border-b border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono">
        <span className="text-[#38BDF8] font-bold truncate">
          📐 {cam.angle}
        </span>
        <span className="text-[#64748B] truncate">
          {cam.mountHeight}
        </span>
      </div>

      {/* Stream Viewport with Real Camera Recording & Body Bounding Rectangles */}
      <div className={`relative ${isLarge ? 'aspect-[16/9]' : 'aspect-[16/10]'} bg-black overflow-hidden flex items-center justify-center`}>
        {!isOffline ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={cam.videoUrl}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-103"
          />
        ) : (
          <div className="absolute inset-0 bg-[#070D19]/90 flex flex-col items-center justify-center p-2 text-center">
            <WifiOff className="w-6 h-6 text-[#EF4444] mb-1" />
            <span className="text-[11px] font-mono font-bold text-white">FEED OFFLINE</span>
            <span className="text-[9px] font-mono text-slate-400">Signal timeout</span>
          </div>
        )}

        {/* AI Bounding Rectangles on live feed */}
        {showOverlays && !isOffline && cam.detectedBodies && (
          <>
            {cam.detectedBodies.map((b) => (
              <div
                key={b.id}
                className="absolute border border-[#10B981] bg-[#10B981]/15 rounded-xs pointer-events-none"
                style={{
                  top: b.box.top,
                  left: b.box.left,
                  width: b.box.width,
                  height: b.box.height,
                }}
              >
                {/* User preference: Rectangle and below detect bodies badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-[#34D399] font-mono text-[7px] font-bold px-1 rounded-2xs border border-[#10B981]/60 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                  <span>{b.label}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Live Status Pill & Bodies Detected Counter */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs px-2 py-1 rounded-lg border border-white/10 flex items-center justify-between text-[10px] font-mono text-white">
          <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            🎯 BODIES: {cam.peopleCount}
          </span>
          <span className="text-slate-300">{cam.fps} FPS</span>
        </div>

        {/* Rec Indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>LIVE CCTV</span>
        </div>
      </div>

      {/* Footer Details Strip */}
      <div className="p-2.5 bg-[#111C35] text-[10px] font-mono flex items-center justify-between border-t border-[#1E293B]">
        <div className="text-[#94A3B8] truncate max-w-[120px]">
          {cam.zone} • {cam.resolution}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            className="text-[#38BDF8] hover:underline font-bold"
          >
            Inspect PTZ →
          </button>
        </div>
      </div>
    </div>
  );
};
