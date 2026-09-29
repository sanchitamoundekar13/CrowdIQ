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
  Filter,
  ArrowUpRight,
  Check,
  Radio,
  ExternalLink,
  Camera,
  Download,
  Flame,
  Sun,
  Server,
  Zap,
  HardDrive,
  Users,
  Crosshair,
  Sparkles
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
    risk: 'LOW'
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
    risk: 'MODERATE'
  },
  {
    id: 'CAM-03',
    name: 'North Emergency Egress',
    zone: 'North Exit',
    location: 'Emergency Exit Hallway, Level 1',
    angle: 'Corridor Long Lens Perspective',
    mountHeight: '3.8m Ceiling Conduit',
    fov: '65° Narrow Corridor Zoom',
    perspectiveType: 'Corridor',
    videoUrl: './assets/cctv_crowd_stream_3.webm',
    ip: '192.168.10.103',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam03',
    resolution: '720p HD',
    codec: 'H.264',
    fps: 0,
    bitrate: '0.0 Mbps',
    latencyMs: 999,
    status: 'OFFLINE',
    peopleCount: 0,
    density: 0,
    risk: 'LOW'
  },
  {
    id: 'CAM-04',
    name: 'Central Arena Plaza Core',
    zone: 'Core Arena',
    location: 'Central Plaza Stage, Level 0',
    angle: '360° Dome Panoramic Overlook',
    mountHeight: '12.0m Center Truss Gantry',
    fov: '160° Fish-Eye Dome',
    perspectiveType: 'Panoramic',
    videoUrl: './assets/cctv_crowd_stream_2.webm',
    ip: '192.168.10.104',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam04',
    resolution: '4K UHD',
    codec: 'H.265',
    fps: 25,
    bitrate: '9.4 Mbps',
    latencyMs: 42,
    status: 'ONLINE',
    peopleCount: 84,
    density: 82,
    risk: 'HIGH'
  },
  {
    id: 'CAM-05',
    name: 'South Concourse & Food Mall',
    zone: 'South Wing',
    location: 'South Food Court, Level 1',
    angle: 'Isometric Walkway Angle',
    mountHeight: '5.0m Column Cluster',
    fov: '85° Downward Perspective',
    perspectiveType: 'Isometric',
    videoUrl: './assets/cctv_crowd_stream_1.webm',
    ip: '192.168.10.105',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam05',
    resolution: '1080p FHD',
    codec: 'H.265',
    fps: 30,
    bitrate: '4.8 Mbps',
    latencyMs: 29,
    status: 'ONLINE',
    peopleCount: 53,
    density: 55,
    risk: 'MODERATE'
  },
  {
    id: 'CAM-06',
    name: 'VIP Premium Terrace',
    zone: 'VIP Lounge',
    location: 'Level 2 Mezzanine Corridor',
    angle: 'Balcony Downward Overlook',
    mountHeight: '8.2m Upper Balcony Ledge',
    fov: '75° Angled Downward',
    perspectiveType: 'Downward',
    videoUrl: './assets/cctv_crowd_stream_3.webm',
    ip: '192.168.10.106',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam06',
    resolution: '4K UHD',
    codec: 'H.265',
    fps: 30,
    bitrate: '7.8 Mbps',
    latencyMs: 31,
    status: 'ONLINE',
    peopleCount: 18,
    density: 21,
    risk: 'LOW'
  },
  {
    id: 'CAM-07',
    name: 'Emergency Stairwell #2',
    zone: 'Stairwell',
    location: 'Southwest Stair Landing, Level 2',
    angle: 'Low-Angle Stairwell Egress',
    mountHeight: '2.8m Wall Corner Box',
    fov: '90° Downward Stairs',
    perspectiveType: 'Low-Angle',
    videoUrl: './assets/cctv_crowd_stream_1.webm',
    ip: '192.168.10.107',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam07',
    resolution: '720p HD',
    codec: 'H.264',
    fps: 15,
    bitrate: '2.4 Mbps',
    latencyMs: 45,
    status: 'ONLINE',
    peopleCount: 6,
    density: 14,
    risk: 'LOW'
  },
  {
    id: 'CAM-08',
    name: 'West Gate Turnstiles Ingress',
    zone: 'Gate C',
    location: 'West Gate Turnstile Bank, Level 0',
    angle: 'Perimeter Chokepoint Angle',
    mountHeight: '4.8m Security Mast',
    fov: '110° Wide Inflow',
    perspectiveType: 'Wide',
    videoUrl: './assets/cctv_crowd_stream_2.webm',
    ip: '192.168.10.108',
    rtspUrl: 'rtsp://edge-cv.arena.lan/live/cam08',
    resolution: '1080p FHD',
    codec: 'H.265',
    fps: 30,
    bitrate: '5.6 Mbps',
    latencyMs: 27,
    status: 'ONLINE',
    peopleCount: 91,
    density: 94,
    risk: 'CRITICAL'
  },
];

type LayoutMode = 'grid8' | 'quad' | 'mobile4' | 'single';
type AngleFilter = 'ALL' | 'Overhead' | 'Wide' | 'Corridor' | 'Panoramic' | 'Isometric' | 'Downward' | 'Low-Angle';
type VisionFilter = 'normal' | 'night' | 'thermal';

export const CamerasPage: React.FC = () => {
  const { playAlertSound } = useSimulation();
  const [cameras, setCameras] = useState<CameraNode[]>(INITIAL_CAMERAS);
  const [mobileCameras, setMobileCameras] = useState<MobileCameraNode[]>([]);
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-01');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [angleFilter, setAngleFilter] = useState<AngleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid8');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [visionFilter, setVisionFilter] = useState<VisionFilter>('normal');

  // Real device webcam stream management (Can bind to any selected camera!)
  const [activeWebcamCamId, setActiveWebcamCamId] = useState<string | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  // PTZ Control States
  const [ptzZoom, setPtzZoom] = useState(1);
  const [ptzPan, setPtzPan] = useState(0);
  const [ptzTilt, setPtzTilt] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if routed with active target tracking (e.g. from Events page)
  const [activeLostPersonTracking, setActiveLostPersonTracking] = useState<{ camId: string; targetName: string } | null>(null);

  useEffect(() => {
    const parseUrlHash = () => {
      const hash = window.location.hash;
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const params = new URLSearchParams(hash.slice(queryIdx));
        const camParam = params.get('camId');
        const targetParam = params.get('targetName');
        if (camParam) {
          setSelectedCamId(camParam);
          if (targetParam) {
            setActiveLostPersonTracking({ camId: camParam, targetName: decodeURIComponent(targetParam) });
            setLayoutMode('single');
          }
        }
      }
    };
    parseUrlHash();
    window.addEventListener('hashchange', parseUrlHash);
    return () => window.removeEventListener('hashchange', parseUrlHash);
  }, []);

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

  // Toggle Real Webcam for a specific camera slot
  const handleToggleWebcamForCam = async (camId: string) => {
    if (activeWebcamCamId === camId) {
      // Stop webcam
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
        webcamStreamRef.current = null;
      }
      setActiveWebcamCamId(null);
      setToastMessage(`Switched ${camId} back to default RTSP stream.`);
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      // Start real device camera
      try {
        if (webcamStreamRef.current) {
          webcamStreamRef.current.getTracks().forEach(t => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        webcamStreamRef.current = stream;
        setActiveWebcamCamId(camId);
        playAlertSound('info');
        setToastMessage(`Real camera connected to ${camId}`);
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error('Failed to open device camera', err);
        alert('Could not access device camera. Please check camera permissions in your browser.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Subscribe to Mobile CCTV nodes for real-time mobile streams
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
  const criticalCamsCount = cameras.filter(c => c.risk === 'CRITICAL' || c.risk === 'HIGH').length;
  const onlineMobileCamsCount = mobileCameras.filter(c => c.status === 'ONLINE').length;

  const handleRebootCam = (id: string) => {
    setToastMessage(`Recalibrating RTSP stream on ${id}...`);
    playAlertSound('info');
    setTimeout(() => {
      setToastMessage(`Camera ${id} re-synchronized at 30 FPS.`);
      setTimeout(() => setToastMessage(null), 3000);
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
      peopleCount: 22,
      density: 35,
      risk: 'LOW',
    };
    setCameras([...cameras, addedNode]);
    setIsAddModalOpen(false);
    setSelectedCamId(newId);
    playAlertSound('info');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900">

      {/* ===================================================================
          TOP EXECUTIVE COMMAND BAR
          =================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Surveillance Network Console
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {onlineCamsCount} of {cameras.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                8 fixed optical RTSP feeds • 4 mobile edge nodes • Real-time computer vision body tracking • {currentTime}
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Device Camera / Webcam Toggle on Master */}
          <button
            onClick={() => handleToggleWebcamForCam(selectedCamId)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${activeWebcamCamId === selectedCamId
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-xs animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            title="Connect your local laptop/desktop camera into the surveillance grid"
          >
            <Camera className={`w-3.5 h-3.5 ${activeWebcamCamId === selectedCamId ? 'text-white' : 'text-slate-600'}`} />
            <span>{activeWebcamCamId === selectedCamId ? `Stop Camera (${selectedCamId})` : `Connect Webcam (${selectedCamId})`}</span>
          </button>

          {/* Mobile CCTV Hub Button */}
          <button
            onClick={() => setIsMobileHubOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs cursor-pointer border border-slate-200"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Mobile Nodes</span>
            {onlineMobileCamsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {onlineMobileCamsCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                4
              </span>
            )}
          </button>

          {/* AI Bounding Boxes Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${showOverlays
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CV Analytics: {showOverlays ? 'On' : 'Off'}</span>
          </button>

          {/* Vision Filter Toggle */}
          <button
            onClick={() => {
              setVisionFilter(f => f === 'normal' ? 'night' : f === 'night' ? 'thermal' : 'normal');
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs cursor-pointer border border-slate-200"
            title="Toggle IR Night Vision / Thermal Spectrum"
          >
            {visionFilter === 'night' ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : visionFilter === 'thermal' ? <Flame className="w-3.5 h-3.5 text-rose-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className="capitalize">{visionFilter} Mode</span>
          </button>

          {/* Add Camera Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stream</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center justify-between shadow-xs animate-fadeIn">
          <span className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>{toastMessage}</span>
          </span>
        </div>
      )}

      {/* Jev & Laya AI Active Amber Alert Target Tracking Banner */}
      {activeLostPersonTracking && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-500/40 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Crosshair className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                  AMBER ALERT TRACKING ACTIVE
                </span>
                <span className="text-xs font-bold font-mono text-amber-900">
                  Target: {activeLostPersonTracking.targetName}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Jev &amp; Laya AI facial biometrics and clothing color correlation locked on <strong>{activeLostPersonTracking.camId}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCamId(activeLostPersonTracking.camId);
                setLayoutMode('single');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold shadow-xs transition cursor-pointer"
            >
              Focus PTZ Master View →
            </button>
            <button
              onClick={() => setActiveLostPersonTracking(null)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-mono font-semibold transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          KPI EXECUTIVE METRICS STRIP (4 MODERN CARDS)
          =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Streams</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{onlineCamsCount}</span>
              <span className="text-xs text-slate-400 font-medium">/ {cameras.length} nodes</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              99.8% network health
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Tracked Occupants</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{totalDetectedBodies}</span>
              <span className="text-xs text-blue-600 font-medium">real-time</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Continuous optical CV count
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Elevated Risk Zones</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-rose-600">{criticalCamsCount}</span>
              <span className="text-xs text-slate-400 font-medium">sectors flagged</span>
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 block">
              {criticalCamsCount > 0 ? 'Surge mitigation active' : 'All clear'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Aggregated Bitrate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">42.8</span>
              <span className="text-xs text-slate-500 font-medium">Mbps</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              H.265 • 29ms average latency
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ===================================================================
          UNIFIED CONTROL & FILTER RIBBON (CLEAN, FLAT, PROFESSIONAL)
          =================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">

          {/* Segmented Layout Mode Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setLayoutMode('grid8')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${layoutMode === 'grid8'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Streams ({cameras.length})</span>
            </button>

            <button
              onClick={() => setLayoutMode('quad')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${layoutMode === 'quad'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Quad View (4)</span>
            </button>

            <button
              onClick={() => setLayoutMode('mobile4')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${layoutMode === 'mobile4'
                ? 'bg-white text-emerald-600 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Edge ({mobileCameras.length || 4})</span>
            </button>

            <button
              onClick={() => setLayoutMode('single')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${layoutMode === 'single'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Master Inspector</span>
            </button>
          </div>

          {/* Search, Perspective, & Status Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search camera or zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white w-44 sm:w-56 transition"
              />
            </div>

            {/* Angle Perspective Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={angleFilter}
                onChange={(e) => setAngleFilter(e.target.value as AngleFilter)}
                className="bg-transparent text-slate-700 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Angles & Perspectives</option>
                <option value="Overhead">45° Overhead Ingress</option>
                <option value="Wide">Wide Inflow Concourse</option>
                <option value="Corridor">Corridor Long Lens</option>
                <option value="Panoramic">360° Dome Panoramic</option>
                <option value="Isometric">Isometric Walkway</option>
                <option value="Downward">Balcony Downward</option>
                <option value="Low-Angle">Low-Angle Stairwell</option>
              </select>
            </div>

            {/* Status Segment */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              {['ALL', 'ONLINE', 'HIGH_RISK'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${statusFilter === st
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {st === 'HIGH_RISK' ? 'Alerts Only' : st === 'ALL' ? 'All Status' : 'Online'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Jump Ribbon */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Jump:
          </span>
          {cameras.map((c) => {
            const isSelected = selectedCamId === c.id;
            const isOffline = c.status === 'OFFLINE';
            const isWebcamOn = activeWebcamCamId === c.id;

            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCamId(c.id);
                  if (layoutMode === 'single') {
                    playAlertSound('info');
                  }
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition border cursor-pointer shrink-0 ${isSelected
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500' : isWebcamOn ? 'bg-purple-500 animate-pulse' : c.risk === 'CRITICAL' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                  }`}></span>
                <span>{c.id}</span>
                <span className="text-[10px] text-slate-500 font-normal truncate max-w-[90px]">{c.zone}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                  {c.peopleCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          LAYOUT VIEW 1: ALL 8 ANGLES STREAM MATRIX
          =================================================================== */}
      {layoutMode === 'grid8' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Displaying {filteredCameras.length} Active Surveillance Feeds</span>
            </span>
            <span className="text-slate-600">
              Total Ingress Occupancy: <strong className="text-slate-900">{totalDetectedBodies} persons</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCameras.map((cam) => (
              <RealCameraCardTile
                key={cam.id}
                cam={cam}
                isSelected={selectedCamId === cam.id}
                isWebcamActive={activeWebcamCamId === cam.id}
                webcamStream={webcamStreamRef.current}
                showOverlays={showOverlays}
                visionFilter={visionFilter}
                onToggleWebcam={() => handleToggleWebcamForCam(cam.id)}
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
          LAYOUT VIEW 2: QUAD SPLIT (2x2 HIGH RESOLUTION)
          =================================================================== */}
      {layoutMode === 'quad' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Priority Quad Stream Matrix (Top 4 Critical Ingress & Plaza Sectors)</span>
            </span>
            <span className="text-slate-600">Sectors: Gate A, Gate B, Central Arena, Gate C</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cameras.slice(0, 4).map((cam) => (
              <RealCameraCardTile
                key={cam.id}
                cam={cam}
                isLarge
                isSelected={selectedCamId === cam.id}
                isWebcamActive={activeWebcamCamId === cam.id}
                webcamStream={webcamStreamRef.current}
                showOverlays={showOverlays}
                visionFilter={visionFilter}
                onToggleWebcam={() => handleToggleWebcamForCam(cam.id)}
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
          LAYOUT VIEW 3: 4x MOBILE EDGE NODES
          =================================================================== */}
      {layoutMode === 'mobile4' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Mobile Edge CCTV Deployment Network
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Pair any smartphone instantly via QR code to stream live camera analytics directly to this SOC matrix.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileHubOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs self-start sm:self-auto"
            >
              Pair New Mobile Device
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mobileCameras.map((mCam) => {
              const isOnline = mCam.status === 'ONLINE';
              return (
                <div
                  key={mCam.id}
                  className={`rounded-2xl border overflow-hidden transition-all bg-white shadow-xs ${isOnline ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200'
                    }`}
                >
                  {/* Header */}
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                        {mCam.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                        {mCam.name}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${isOnline
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                      {mCam.status}
                    </span>
                  </div>

                  {/* Viewport */}
                  <div className="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
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
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                          <Smartphone className="w-7 h-7 text-emerald-400 mb-1 animate-pulse" />
                          <span className="text-xs font-bold text-white">Live Phone Streaming</span>
                          <span className="text-[10px] font-mono text-emerald-300">{mCam.deviceInfo}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                        <WifiOff className="w-7 h-7 text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-800">Mobile Node Idle</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">Ready for phone connection</span>
                        <button
                          onClick={() => {
                            window.location.hash = `#/mobile-camera?camId=${mCam.id}`;
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          <span>Open Mobile CCTV</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Detected Bodies Count HUD Badge */}
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px] font-mono text-white">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {mCam.peopleCount} Bodies
                      </span>
                      <span className="text-slate-300">{mCam.fps || 0} FPS</span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="p-3 bg-white text-xs space-y-1.5 border-t border-slate-100">
                    <div className="flex justify-between text-slate-500">
                      <span>Assigned Location:</span>
                      <span className="text-slate-900 truncate max-w-[140px] font-medium">{mCam.location}</span>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                      <span className={`font-semibold text-xs ${mCam.riskLevel === 'CRITICAL' ? 'text-rose-600' :
                        mCam.riskLevel === 'HIGH' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                        Risk: {mCam.riskLevel}
                      </span>
                      <button
                        onClick={() => {
                          window.location.hash = `#/mobile-camera?camId=${mCam.id}`;
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                      >
                        Inspect Feed →
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
          LAYOUT VIEW 4: MASTER INSPECTOR + PTZ CONSOLE (70/30 SPLIT)
          =================================================================== */}
      {layoutMode === 'single' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* Left 8 Cols: Focused Master Angle Feed */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
              {/* Stream Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {activeWebcamCamId === selectedCam.id ? 'REAL-WEBCAM' : selectedCam.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {activeWebcamCamId === selectedCam.id ? 'Live Device Camera Stream' : selectedCam.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-600 border border-slate-200">
                        {selectedCam.angle}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {selectedCam.location} • Mount: {selectedCam.mountHeight} • FOV: {selectedCam.fov}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleWebcamForCam(selectedCam.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${activeWebcamCamId === selectedCam.id
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                      }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{activeWebcamCamId === selectedCam.id ? 'Stop Webcam' : 'Use Webcam'}</span>
                  </button>

                  <button
                    onClick={() => handleRebootCam(selectedCam.id)}
                    title="Recalibrate stream"
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Master Canvas with Real Video Feed */}
              <div className="relative aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden">
                <MasterVideoPlayer
                  cam={selectedCam}
                  isWebcamActive={activeWebcamCamId === selectedCam.id}
                  webcamStream={webcamStreamRef.current}
                  showOverlays={showOverlays}
                  visionFilter={visionFilter}
                  zoom={ptzZoom}
                  pan={ptzPan}
                  tilt={ptzTilt}
                  currentTime={currentTime}
                />
              </div>

              {/* Telemetry Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Perspective Angle</span>
                  <span className="text-blue-600 font-bold mt-0.5 block">{selectedCam.angle}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Elevation Height</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">{selectedCam.mountHeight}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Lens Field of View</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">{selectedCam.fov}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">RTSP Connection</span>
                  <span className="text-emerald-600 font-bold mt-0.5 block">99.8% Healthy</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: PTZ Virtual Controller & Telemetry Inspector */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    PTZ Virtual Servo Controller
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>

              {/* D-Pad Controller */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-3 gap-2 w-44">
                  <div></div>
                  <button
                    onClick={() => setPtzTilt(Math.max(-40, ptzTilt - 10))}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div></div>

                  <button
                    onClick={() => setPtzPan(Math.max(-60, ptzPan - 10))}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setPtzPan(0); setPtzTilt(0); setPtzZoom(1); }}
                    className="p-2.5 rounded-xl bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-xs"
                    title="Reset PTZ Home"
                  >
                    RESET
                  </button>

                  <button
                    onClick={() => setPtzPan(Math.min(60, ptzPan + 10))}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div></div>
                  <button
                    onClick={() => setPtzTilt(Math.min(40, ptzTilt + 10))}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Zoom Controller */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Digital Optical Zoom</span>
                  <span className="text-blue-600 font-bold">{ptzZoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPtzZoom(Math.max(1, ptzZoom - 0.2))}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={ptzZoom}
                    onChange={(e) => setPtzZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <button
                    onClick={() => setPtzZoom(Math.min(3, ptzZoom + 0.2))}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Angle Presets
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'Default Ingress', zoom: 1, pan: 0, tilt: 0 },
                    { name: 'Turnstile Focus', zoom: 2.2, pan: 10, tilt: 15 },
                    { name: 'Wide Angle', zoom: 1.2, pan: -20, tilt: -5 },
                    { name: 'Surge Choke', zoom: 2.8, pan: 25, tilt: 20 },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setPtzZoom(preset.zoom);
                        setPtzPan(preset.pan);
                        setPtzTilt(preset.tilt);
                        playAlertSound('info');
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-medium transition cursor-pointer text-left truncate"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Metadata */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Stream IP:</span>
                  <span className="font-mono text-slate-900">{selectedCam.ip}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>RTSP Endpoint:</span>
                  <span className="font-mono text-slate-900 truncate max-w-[170px]">{selectedCam.rtspUrl}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Resolution & Codec:</span>
                  <span className="text-slate-900 font-medium">{selectedCam.resolution} • {selectedCam.codec}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Filmstrip Dock */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  Multi-Camera Angle Filmstrip
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Click any camera tile to switch master monitor feed
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
                    className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${isFocused
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={c.videoUrl}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/75 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold text-white">
                        {c.id}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-emerald-600 text-white px-1.5 py-0.2 rounded text-[8px] font-mono font-bold">
                        {c.peopleCount}p
                      </div>
                    </div>
                    <div className="p-2 text-[10px] bg-white">
                      <div className="font-bold text-slate-800 truncate">{c.name}</div>
                      <div className="text-slate-400 truncate">{c.zone}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================
          MODAL: ADD NEW CAMERA STREAM (CLEAN WHITE THEME)
          =================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 text-slate-900 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Register Camera Stream
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Camera Name / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. East Concourse Turnstiles 3"
                  value={newCam.name}
                  onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Perspective Angle</label>
                  <select
                    value={newCam.angle}
                    onChange={(e) => setNewCam({ ...newCam, angle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
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
                  <label className="block font-semibold text-slate-600 mb-1">Assigned Zone</label>
                  <select
                    value={newCam.zone}
                    onChange={(e) => setNewCam({ ...newCam, zone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Gate A">Gate A (Main)</option>
                    <option value="Gate B">Gate B (East)</option>
                    <option value="Gate C">Gate C (West)</option>
                    <option value="Core Arena">Core Arena Plaza</option>
                    <option value="South Wing">South Concourse</option>
                    <option value="VIP Lounge">VIP Lounge</option>
                    <option value="North Exit">North Exit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">RTSP Stream Socket URI</label>
                <input
                  type="text"
                  value={newCam.rtspUrl}
                  onChange={(e) => setNewCam({ ...newCam, rtspUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Register Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: 4x MOBILE PHONE CCTV HUB MODAL (WHITE THEME)
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: REAL CAMERA CARD TILE WITH ACTIVE OPTICAL TRACKING & WHITE THEME
// ─────────────────────────────────────────────────────────────────────────────
interface RealCameraCardTileProps {
  cam: CameraNode;
  isSelected?: boolean;
  isLarge?: boolean;
  isWebcamActive?: boolean;
  webcamStream?: MediaStream | null;
  showOverlays?: boolean;
  visionFilter?: VisionFilter;
  onToggleWebcam: () => void;
  onSelect: () => void;
  onInspect: () => void;
  onReboot: () => void;
}

const RealCameraCardTile: React.FC<RealCameraCardTileProps> = ({
  cam,
  isSelected,
  isLarge,
  isWebcamActive,
  webcamStream,
  showOverlays,
  visionFilter = 'normal',
  onToggleWebcam,
  onSelect,
  onInspect,
  onReboot,
}) => {
  const isOffline = cam.status === 'OFFLINE';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [realFps, setRealFps] = useState<number>(cam.fps || 30);
  const [currentTimecode, setCurrentTimecode] = useState<string>('');
  const [snapshotDownloaded, setSnapshotDownloaded] = useState<boolean>(false);

  // Timecode with milliseconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setCurrentTimecode(`${now.toLocaleTimeString()}.${ms.slice(0, 2)}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Set webcam stream if active
  useEffect(() => {
    if (isWebcamActive && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch(e => console.warn(e));
    } else if (!isWebcamActive && videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = cam.videoUrl;
      videoRef.current.play().catch(e => console.warn(e));
    }
  }, [isWebcamActive, webcamStream, cam.videoUrl]);

  // Optical flow / dynamic body detection canvas overlay
  useEffect(() => {
    if (isOffline) return;
    let isRunning = true;
    let frameId: number;

    const renderOverlay = () => {
      if (!isRunning) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (showOverlays) {
            // Dynamic bounding boxes with face detection & biometric landmarks
            const t = performance.now() / 1000;
            const numBoxes = Math.min(5, Math.max(2, Math.round(cam.peopleCount / 20)));

            for (let i = 0; i < numBoxes; i++) {
              const speed = 0.35 + i * 0.12;
              const baseX = (22 + (i * 18) + Math.sin(t * speed + i) * 10);
              const baseY = (26 + (i * 9) + Math.cos(t * speed * 0.8 + i) * 6);
              const boxW = 56;
              const boxH = 118;

              const pxX = (baseX / 100) * canvas.width;
              const pxY = (baseY / 100) * canvas.height;

              // Dedicated Face Bounding Box
              const faceW = boxW * 0.48;
              const faceH = boxH * 0.22;
              const faceX = pxX + (boxW - faceW) / 2;
              const faceY = pxY + boxH * 0.04;

              const isTargetTrack = (cam.id === 'CAM-02' && i === 0);
              const strokeColor = isTargetTrack ? '#10B981' : (cam.risk === 'CRITICAL' ? '#EF4444' : '#00F0FF');

              // Soft translucent body box
              ctx.fillStyle = isTargetTrack ? 'rgba(16, 185, 129, 0.15)' : (cam.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 240, 255, 0.08)');
              ctx.fillRect(pxX, pxY, boxW, boxH);

              // Clean outer border
              ctx.strokeStyle = strokeColor;
              ctx.lineWidth = isTargetTrack ? 2 : 1.5;
              ctx.strokeRect(pxX, pxY, boxW, boxH);

              // High-contrast corner brackets
              const cLen = 7;
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 2;

              ctx.beginPath();
              ctx.moveTo(pxX, pxY + cLen); ctx.lineTo(pxX, pxY); ctx.lineTo(pxX + cLen, pxY);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(pxX + boxW - cLen, pxY); ctx.lineTo(pxX + boxW, pxY); ctx.lineTo(pxX + boxW, pxY + cLen);
              ctx.stroke();

              // Dedicated Face Box & 5 Biometric Landmarks
              ctx.fillStyle = isTargetTrack ? 'rgba(16, 185, 129, 0.22)' : 'rgba(0, 240, 255, 0.16)';
              ctx.fillRect(faceX, faceY, faceW, faceH);
              ctx.strokeStyle = isTargetTrack ? '#10B981' : '#00F0FF';
              ctx.lineWidth = 1.5;
              ctx.strokeRect(faceX, faceY, faceW, faceH);

              // 5 Biometric Landmark Dots (Eyes, Nose, Mouth)
              const lEye = { x: faceX + faceW * 0.33, y: faceY + faceH * 0.38 };
              const rEye = { x: faceX + faceW * 0.67, y: faceY + faceH * 0.38 };
              const nose = { x: faceX + faceW * 0.50, y: faceY + faceH * 0.56 };
              const mL = { x: faceX + faceW * 0.36, y: faceY + faceH * 0.76 };
              const mR = { x: faceX + faceW * 0.64, y: faceY + faceH * 0.76 };

              ctx.fillStyle = '#FFFFFF';
              [lEye, rEye, nose, mL, mR].forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 1.8, 0, 2 * Math.PI);
                ctx.fill();
              });

              // Tag above face box
              ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
              ctx.fillRect(faceX - 2, faceY - 12, faceW + 4, 11);
              ctx.fillStyle = isTargetTrack ? '#34D399' : '#38BDF8';
              ctx.font = 'bold 7px monospace';
              ctx.fillText('FACE: 512-D', faceX, faceY - 3);

              // Below-box label pill
              const label = isTargetTrack ? '🎯 TARGET LOCKED (96%)' : `BODY #${i + 1} (${92 + (i % 7)}%)`;
              const lblW = isTargetTrack ? 120 : boxW + 4;
              const lblX = pxX + (boxW - lblW) / 2;
              ctx.fillStyle = isTargetTrack ? 'rgba(6, 78, 59, 0.95)' : 'rgba(15, 23, 42, 0.88)';
              ctx.fillRect(lblX, pxY + boxH + 2, lblW, 16);
              ctx.strokeStyle = strokeColor;
              ctx.lineWidth = 1;
              ctx.strokeRect(lblX, pxY + boxH + 2, lblW, 16);
              ctx.fillStyle = isTargetTrack ? '#A7F3D0' : '#FFFFFF';
              ctx.font = 'bold 8.5px monospace';
              ctx.fillText(label, lblX + 3, pxY + boxH + 13);
            }
          }
        }
      }
      frameId = requestAnimationFrame(renderOverlay);
    };

    frameId = requestAnimationFrame(renderOverlay);
    return () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    };
  }, [isOffline, showOverlays, cam.peopleCount, cam.risk]);

  // Snapshot Download
  const handleTakeSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = videoRef.current.videoWidth || 1280;
    snapCanvas.height = videoRef.current.videoHeight || 720;
    const sCtx = snapCanvas.getContext('2d');
    if (sCtx) {
      sCtx.drawImage(videoRef.current, 0, 0);
      const dataUrl = snapCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `snapshot_${cam.id}_${Date.now()}.png`;
      a.click();
      setSnapshotDownloaded(true);
      setTimeout(() => setSnapshotDownloaded(false), 2000);
    }
  };

  const getFilterStyle = () => {
    if (visionFilter === 'night') return 'brightness(1.2) contrast(1.3) hue-rotate(85deg) saturate(1.8)';
    if (visionFilter === 'thermal') return 'invert(0.9) hue-rotate(180deg) saturate(2.5)';
    return 'none';
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border overflow-hidden transition-all bg-white flex flex-col cursor-pointer shadow-xs group ${isSelected
        ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
        : 'border-slate-200 hover:border-slate-300'
        }`}
    >
      {/* Tile Header (Clean, minimalist, uncluttered) */}
      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800">
            {isWebcamActive ? 'WEBCAM' : cam.id}
          </span>
          <div>
            <span className="text-xs font-bold text-slate-900 truncate max-w-[130px] block">
              {isWebcamActive ? 'Device Camera' : cam.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${isOffline
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : cam.risk === 'CRITICAL'
              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
              : cam.risk === 'HIGH'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
            {cam.risk}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            title="Focus & Inspect Feed"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stream Viewport (16:9 Clean Monitor) */}
      <div className={`relative ${isLarge ? 'aspect-[16/9]' : 'aspect-[16/10]'} bg-slate-950 overflow-hidden flex items-center justify-center`}>
        {!isOffline ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              src={!isWebcamActive ? cam.videoUrl : undefined}
              className="w-full h-full object-cover"
              style={{ filter: getFilterStyle() }}
            />
            {/* Real Dynamic Canvas Bounding Rectangles */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-white">
            <WifiOff className="w-6 h-6 text-rose-500 mb-1" />
            <span className="text-xs font-semibold text-white">Stream Offline</span>
            <span className="text-[10px] text-slate-400">Signal timeout on IP {cam.ip}</span>
          </div>
        )}

        {/* Live Status Pill & Real FPS */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1.5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {isWebcamActive ? 'WEBCAM' : 'LIVE'}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-white/10">
            {realFps} FPS
          </span>
        </div>

        {/* Quick Toolbar on Card Overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10 opacity-90 group-hover:opacity-100 transition">
          {/* Quick Snapshot */}
          <button
            onClick={handleTakeSnapshot}
            className="p-1.5 rounded-lg bg-slate-900/75 hover:bg-slate-900 text-white text-[10px] transition cursor-pointer border border-white/10 shadow-2xs"
            title="Download Live Snapshot"
          >
            {snapshotDownloaded ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
          </button>

          {/* Quick Real Camera Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWebcam();
            }}
            className={`p-1.5 rounded-lg text-[10px] transition cursor-pointer border border-white/10 shadow-2xs ${isWebcamActive ? 'bg-rose-600 text-white' : 'bg-slate-900/75 hover:bg-slate-900 text-white'
              }`}
            title={isWebcamActive ? 'Disconnect Device Camera' : 'Connect Real Device Camera to This Slot'}
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom HUD: Live People Count & Timecode */}
        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px] font-mono text-white z-10">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {cam.peopleCount} Bodies
          </span>
          <span className="text-slate-300 text-[10px]">{currentTimecode}</span>
        </div>
      </div>

      {/* Card Footer Details Strip */}
      <div className="p-3 bg-white text-xs flex items-center justify-between border-t border-slate-100">
        <div className="text-slate-500 truncate max-w-[140px]">
          <span className="font-semibold text-slate-800">{cam.zone}</span> • {cam.resolution}
        </div>

        <div className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs cursor-pointer">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            className="cursor-pointer"
          >
            Inspect PTZ →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: MASTER VIDEO PLAYER (FOR FOCUS MONITOR VIEW)
// ─────────────────────────────────────────────────────────────────────────────
interface MasterPlayerProps {
  cam: CameraNode;
  isWebcamActive: boolean;
  webcamStream: MediaStream | null;
  showOverlays: boolean;
  visionFilter: VisionFilter;
  zoom: number;
  pan: number;
  tilt: number;
  currentTime: string;
}

const MasterVideoPlayer: React.FC<MasterPlayerProps> = ({
  cam,
  isWebcamActive,
  webcamStream,
  showOverlays,
  visionFilter,
  zoom,
  pan,
  tilt,
  currentTime,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isWebcamActive && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch(e => console.warn(e));
    } else if (!isWebcamActive && videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = cam.videoUrl;
      videoRef.current.play().catch(e => console.warn(e));
    }
  }, [isWebcamActive, webcamStream, cam.videoUrl]);

  const getFilterStyle = () => {
    if (visionFilter === 'night') return 'brightness(1.2) contrast(1.3) hue-rotate(85deg) saturate(1.8)';
    if (visionFilter === 'thermal') return 'invert(0.9) hue-rotate(180deg) saturate(2.5)';
    return 'none';
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showOverlays || cam.status === 'OFFLINE') return;
    let isRunning = true;
    let frameId: number;

    const renderMasterOverlay = () => {
      if (!isRunning) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const t = performance.now() / 1000;
          const isCam02 = cam.id === 'CAM-02';

          // Candidate 1 (Target subject in CAM-02)
          const c1X = canvas.width * (0.34 + Math.sin(t * 0.4) * 0.03);
          const c1Y = canvas.height * (0.28 + Math.cos(t * 0.3) * 0.02);
          const c1W = canvas.width * 0.12;
          const c1H = canvas.height * 0.36;

          // Candidate 2 (Adult bystander in dark attire)
          const c2X = canvas.width * (0.58 + Math.cos(t * 0.35) * 0.03);
          const c2Y = canvas.height * (0.32 + Math.sin(t * 0.25) * 0.02);
          const c2W = canvas.width * 0.11;
          const c2H = canvas.height * 0.33;

          const candidates = [
            {
              id: 'CAN-01',
              label: 'Subject #1',
              x: c1X,
              y: c1Y,
              w: c1W,
              h: c1H,
              isTarget: isCam02,
              faceScore: isCam02 ? 96.4 : 38.2,
              colorScore: isCam02 ? 95.8 : 42.1,
              attire: isCam02 ? 'Bright Yellow Hoodie' : 'Dark Navy Attire',
            },
            {
              id: 'CAN-02',
              label: 'Subject #2',
              x: c2X,
              y: c2Y,
              w: c2W,
              h: c2H,
              isTarget: false,
              faceScore: 31.4,
              colorScore: 34.0,
              attire: 'Navy / Charcoal Utility',
            }
          ];

          candidates.forEach((c) => {
            const isMatch = c.isTarget;
            const themeColor = isMatch ? '#10B981' : '#00F0FF';

            // 1. Full Body Reticle
            ctx.fillStyle = isMatch ? 'rgba(16, 185, 129, 0.14)' : 'rgba(0, 240, 255, 0.08)';
            ctx.fillRect(c.x, c.y, c.w, c.h);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = isMatch ? 2.5 : 1.8;
            ctx.strokeRect(c.x, c.y, c.w, c.h);

            // High contrast corners
            const cLen = Math.min(18, c.w * 0.22);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(c.x, c.y + cLen); ctx.lineTo(c.x, c.y); ctx.lineTo(c.x + cLen, c.y);
            ctx.moveTo(c.x + c.w - cLen, c.y); ctx.lineTo(c.x + c.w, c.y); ctx.lineTo(c.x + c.w, c.y + cLen);
            ctx.moveTo(c.x, c.y + c.h - cLen); ctx.lineTo(c.x, c.y + c.h); ctx.lineTo(c.x + cLen, c.y + c.h);
            ctx.moveTo(c.x + c.w - cLen, c.y + c.h); ctx.lineTo(c.x + c.w, c.y + c.h); ctx.lineTo(c.x + c.w, c.y + c.h - cLen);
            ctx.stroke();

            // 2. Dedicated Face Bounding Box & 5 Biometric Landmarks
            const fW = c.w * 0.48;
            const fH = c.h * 0.23;
            const fX = c.x + (c.w - fW) / 2;
            const fY = c.y + c.h * 0.035;

            ctx.fillStyle = isMatch ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 240, 255, 0.18)';
            ctx.fillRect(fX, fY, fW, fH);
            ctx.strokeStyle = isMatch ? '#10B981' : '#00F0FF';
            ctx.lineWidth = 2;
            ctx.strokeRect(fX, fY, fW, fH);

            const lEye = { x: fX + fW * 0.33, y: fY + fH * 0.38 };
            const rEye = { x: fX + fW * 0.67, y: fY + fH * 0.38 };
            const nose = { x: fX + fW * 0.50, y: fY + fH * 0.56 };
            const mL = { x: fX + fW * 0.36, y: fY + fH * 0.76 };
            const mR = { x: fX + fW * 0.64, y: fY + fH * 0.76 };

            // Triangulation lines
            ctx.strokeStyle = isMatch ? 'rgba(16, 185, 129, 0.6)' : 'rgba(0, 240, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(lEye.x, lEye.y); ctx.lineTo(rEye.x, rEye.y);
            ctx.moveTo(lEye.x, lEye.y); ctx.lineTo(nose.x, nose.y);
            ctx.moveTo(rEye.x, rEye.y); ctx.lineTo(nose.x, nose.y);
            ctx.moveTo(nose.x, nose.y); ctx.lineTo(mL.x, mL.y);
            ctx.moveTo(nose.x, nose.y); ctx.lineTo(mR.x, mR.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // 5 anchor dots
            [lEye, rEye, nose, mL, mR].forEach(pt => {
              ctx.fillStyle = isMatch ? 'rgba(16, 185, 129, 0.5)' : 'rgba(0, 240, 255, 0.5)';
              ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI); ctx.fill();
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI); ctx.fill();
            });

            // Face Biometric Readout
            const fPillW = Math.max(170, fW + 20);
            const fPillX = Math.max(4, fX + (fW - fPillW) / 2);
            const fPillY = Math.max(4, fY - 26);
            ctx.fillStyle = 'rgba(11, 15, 25, 0.94)';
            ctx.fillRect(fPillX, fPillY, fPillW, 23);
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(fPillX, fPillY, fPillW, 23);
            ctx.fillStyle = isMatch ? '#34D399' : '#38BDF8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`👤 FACE BIOMETRIC: ACQUIRED (${c.faceScore}%)`, fPillX + 5, fPillY + 10);
            ctx.fillStyle = '#94A3B8';
            ctx.font = '8px monospace';
            ctx.fillText(`IPD: ${Math.abs(rEye.x - lEye.x).toFixed(1)}px • 512-D VECTOR`, fPillX + 5, fPillY + 19);

            // 3. Torso Attire Reticle
            const tX = c.x + c.w * 0.22;
            const tY = fY + fH + 2;
            const tW = c.w * 0.56;
            const tH = c.h * 0.34;
            ctx.strokeStyle = isMatch ? '#10B981' : 'rgba(245, 158, 11, 0.8)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(tX, tY, tW, tH);
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
            ctx.fillRect(tX, tY + tH - 14, Math.min(tW, 140), 14);
            ctx.fillStyle = '#FBBF24';
            ctx.font = 'bold 8px monospace';
            ctx.fillText(`👕 ATTIRE: ${c.attire} (${c.colorScore}%)`, tX + 3, tY + tH - 3);

            // 4. Autonomous Decision Badge
            const bY = Math.min(canvas.height - 30, c.y + c.h + 5);
            if (isMatch) {
              const bW = Math.max(220, c.w);
              const bX = Math.max(4, Math.min(canvas.width - bW - 4, c.x + (c.w - bW) / 2));
              ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
              ctx.fillRect(bX, bY, bW, 28);
              ctx.strokeStyle = '#10B981';
              ctx.lineWidth = 2;
              ctx.strokeRect(bX, bY, bW, 28);
              ctx.fillStyle = '#A7F3D0';
              ctx.font = 'bold 10px monospace';
              ctx.fillText('🎯 TARGET VERIFIED & LOCKED (96.4%)', bX + 6, bY + 12);
              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 9px monospace';
              ctx.fillText('Leo Sharma (6y) • Yellow Hoodie Matched', bX + 6, bY + 23);
            } else {
              const bW = Math.max(195, c.w);
              const bX = Math.max(4, Math.min(canvas.width - bW - 4, c.x + (c.w - bW) / 2));
              ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
              ctx.fillRect(bX, bY, bW, 26);
              ctx.strokeStyle = '#64748B';
              ctx.lineWidth = 1.2;
              ctx.strokeRect(bX, bY, bW, 26);
              ctx.fillStyle = '#F87171';
              ctx.font = 'bold 9px monospace';
              ctx.fillText('⚠️ AI REJECTED • COLOR_MISMATCH', bX + 6, bY + 11);
              ctx.fillStyle = '#94A3B8';
              ctx.font = '8px monospace';
              ctx.fillText('Dark Navy ≠ Yellow Hoodie Vector', bX + 6, bY + 21);
            }
          });
        }
      }
      frameId = requestAnimationFrame(renderMasterOverlay);
    };

    frameId = requestAnimationFrame(renderMasterOverlay);
    return () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    };
  }, [showOverlays, cam.status, cam.id]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src={!isWebcamActive ? cam.videoUrl : undefined}
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${pan}px, ${tilt}px)`,
          filter: getFilterStyle()
        }}
      />

      {/* Dynamic Face Detection & Jev & Laya AI Decision Canvas */}
      {showOverlays && cam.status !== 'OFFLINE' && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
      )}

      {/* Master Feed Live HUD */}
      <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-mono text-[11px] text-white flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {isWebcamActive ? 'LIVE WEBCAM' : 'LIVE RTSP'} {cam.fps} FPS
        </span>
        <span className="text-slate-300">{cam.resolution}</span>
        <span className="text-slate-300">{cam.bitrate}</span>
        <span className="text-slate-300">Latency: {cam.latencyMs}ms</span>
        <span className="text-sky-400 font-bold">{cam.peopleCount} Bodies Detected</span>
      </div>

      <div className="absolute top-3 right-3 bg-slate-900/80 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white border border-white/10">
        {currentTime}
      </div>
    </div>
  );
};
