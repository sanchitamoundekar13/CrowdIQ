import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useSimulation } from '../context/SimulationContext';
import { mobileCctvService, DEFAULT_MOBILE_CAMERAS } from '../services/mobileCctvService';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Grid, 
  Maximize2, 
  Cpu, 
  Activity, 
  Layers, 
  Camera, 
  Video,
  Smartphone,
  RefreshCw,
  ShieldAlert,
  FlipHorizontal,
  Copy,
  Check,
  Sliders,
  Users,
  Radio,
  ExternalLink,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface RiskEngine {
  density: number;    // % 0-100
  velocity: number;   // crowd velocity score
  congestion: number; // bottleneck score
  flowInstability: number; // turbulence score
  score: number;      // composite 0-100
  reason: string;
}

interface DetectedPerson {
  bbox: [number, number, number, number]; // [x, y, width, height]
  score: number;
}

const CAMERAS = [
  { id:'CAM-01', name:'Main Gate',       zone:'Gate A',     location:'North Entrance, Level 0',   status:'ONLINE',  fps:30, res:'1080p',  people:42, density:3.8, direction:'North to Concourse',  risk:'LOW',      videoUrl: './assets/cctv_crowd_stream_1.webm', re:{ density:38, velocity:22, congestion:30, flowInstability:18, score:27, reason:'Normal inflow at Main Gate. Crowd is moving steadily northward with no opposing flow detected.' } },
  { id:'CAM-02', name:'Gate 2',          zone:'Gate B',     location:'East Wing, Level 0',         status:'ONLINE',  fps:30, res:'4K UHD', people:67, density:5.4, direction:'East to West',         risk:'MODERATE', videoUrl: './assets/cctv_crowd_stream_2.webm', re:{ density:59, velocity:48, congestion:54, flowInstability:41, score:51, reason:'Moderate crowd build-up at Gate B. Inflow exceeding outflow by ~8 persons/min. Monitor closely.' } },
  { id:'CAM-03', name:'North Exit',      zone:'North Exit', location:'Emergency Exit, Level 1',    status:'OFFLINE', fps:0,  res:'N/A',    people:0,  density:0.0, direction:'Signal Loss',           risk:'LOW',      videoUrl: './assets/cctv_crowd_stream_3.webm', re:{ density:0, velocity:0, congestion:0, flowInstability:0, score:0, reason:'Camera offline. Risk assessment unavailable — physical inspection recommended.' } },
  { id:'CAM-04', name:'Central Plaza',   zone:'Core',       location:'Central Arena, Level 0',     status:'ONLINE',  fps:25, res:'4K UHD', people:84, density:7.1, direction:'South to Plaza',        risk:'HIGH',     videoUrl: './assets/cctv_crowd_stream_2.webm', re:{ density:82, velocity:61, congestion:91, flowInstability:73, score:84, reason:'High density + opposing crowd movement detected near Central Plaza. Congestion kernel identified at south entry point. Recommend crowd redirect.' } },
  { id:'CAM-05', name:'South Concourse', zone:'South Wing', location:'South Concourse, Level 1',   status:'ONLINE',  fps:30, res:'1080p',  people:53, density:4.9, direction:'West to South',         risk:'MODERATE', videoUrl: './assets/cctv_crowd_stream_1.webm', re:{ density:55, velocity:44, congestion:48, flowInstability:38, score:47, reason:'South Concourse showing moderate congestion. Bidirectional flow observed — slight turbulence near food vendor area.' } },
  { id:'CAM-06', name:'VIP Lounge',      zone:'VIP',        location:'Premium Level, Level 3',     status:'ONLINE',  fps:30, res:'4K UHD', people:18, density:2.1, direction:'Static Lounge',         risk:'LOW',      videoUrl: './assets/cctv_crowd_stream_3.webm', re:{ density:21, velocity:8,  congestion:12, flowInstability:9,  score:14, reason:'VIP zone nominal. Crowd density well within safe thresholds. No anomalous movement patterns detected.' } },
  { id:'CAM-07', name:'Emergency Stair', zone:'Stairwell',  location:'Emergency Stairs, Level 2',  status:'ONLINE',  fps:15, res:'720p',   people:6,  density:1.3, direction:'Upward to Level 2',     risk:'LOW',      videoUrl: './assets/cctv_crowd_stream_1.webm', re:{ density:14, velocity:19, congestion:8,  flowInstability:11, score:13, reason:'Stairwell usage within normal parameters. Unidirectional upward flow detected — no bottleneck risk.' } },
  { id:'CAM-08', name:'West Gate',       zone:'Gate C',     location:'West Entrance, Level 0',     status:'ONLINE',  fps:30, res:'1080p',  people:91, density:8.4, direction:'West to Central',       risk:'CRITICAL', videoUrl: './assets/cctv_crowd_stream_2.webm', re:{ density:94, velocity:78, congestion:96, flowInstability:88, score:92, reason:'CRITICAL: Extreme crowd pressure at West Gate. Density exceeds safe threshold. Opposing flows creating dangerous turbulence. Immediate intervention required.' } },
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
              <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${f.value}%`, background: barColor(f.value) }}
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] font-mono">{f.desc}</span>
            </div>
          ))}
        </div>

        {/* AI diagnostic summary */}
        <div className="border-t lg:border-t-0 lg:border-l border-[#E2E8F0] lg:pl-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1 font-mono">
              Diagnostic Rationale
            </div>
            <p className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
              {re.reason}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span>Model: DeepSORT v3.2</span>
            <span className="text-emerald-600 font-bold">● Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL AI CAMERA VIEWER (SAME ARCHITECTURE AS MOBILE-CAMERA NODE)
// Powered by TensorFlow.js COCO-SSD Human Body Detector with Live Bounding Boxes
// ─────────────────────────────────────────────────────────────────────────────
interface RealAiCameraViewerProps {
  cam: typeof CAMERAS[0];
  sourceMode: 'webcam' | 'cctv';
  onToggleSource: () => void;
  onPeopleDetected?: (count: number, density: number, risk: string) => void;
}

function RealAiCameraViewer({ cam, sourceMode, onToggleSource, onPeopleDetected }: RealAiCameraViewerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const isDetectingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // Vision telemetry
  const [peopleCount, setPeopleCount] = useState<number>(cam.people);
  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.40);
  const [density, setDensity] = useState<number>(Math.round(cam.density * 10));
  const [fps, setFps] = useState<number>(cam.fps || 30);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>(cam.risk as any);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Initialize TensorFlow.js & COCO-SSD
  useEffect(() => {
    let isMounted = true;
    setModelLoading(true);
    setModelError(null);

    const initModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (isMounted) {
          modelRef.current = loadedModel;
          setModelLoading(false);
          console.log('✅ RealCamera: TensorFlow.js COCO-SSD initialized.');
        }
      } catch (err: any) {
        console.error('Failed to load TensorFlow model:', err);
        if (isMounted) {
          setModelError(err.message || 'Failed to initialize vision model.');
          setModelLoading(false);
        }
      }
    };

    initModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Setup Video Source (Webcam or CCTV Video file)
  const setupVideoSource = async () => {
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    const video = videoRef.current;
    if (!video) return;

    if (sourceMode === 'webcam') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();
        setIsStreaming(true);
      } catch (err: any) {
        console.error('Webcam permission error:', err);
        setCameraError(`Camera error: ${err.message || 'Permission denied or webcam in use.'}`);
        setIsStreaming(false);
      }
    } else {
      // CCTV Video Stream
      video.srcObject = null;
      video.src = cam.videoUrl;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      try {
        await video.play();
        setIsStreaming(true);
      } catch (err) {
        console.error('Video playback error:', err);
      }
    }
  };

  useEffect(() => {
    setupVideoSource();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sourceMode, facingMode, cam.videoUrl]);

  // 3. Real-Time Detection & High-Tech HUD Canvas Loop (Exact style as MobileCameraNodePage)
  useEffect(() => {
    if (!isStreaming || modelLoading) return;

    let isMounted = true;
    let lastTelemetryPush = 0;

    const detectAndRender = async () => {
      if (!isMounted || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState >= 2 && ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw camera video feed frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Compute real FPS
        const now = performance.now();
        frameCountRef.current += 1;
        if (now - lastTimeRef.current >= 1000) {
          const currentFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
          setFps(currentFps);
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }

        // Run real AI body detection using TensorFlow COCO-SSD
        let realPersons: DetectedPerson[] = [];

        if (modelRef.current && !isDetectingRef.current) {
          isDetectingRef.current = true;
          try {
            const predictions = await modelRef.current.detect(video);
            // Filter strictly for human bodies ('person' class) above confidence threshold
            realPersons = predictions
              .filter((p) => p.class === 'person' && p.score >= confidenceThreshold)
              .map((p) => ({
                bbox: p.bbox,
                score: p.score,
              }));

            setDetectedPersons(realPersons);
            setPeopleCount(realPersons.length);
          } catch (e) {
            console.warn('Frame detection step error:', e);
          } finally {
            isDetectingRef.current = false;
          }
        } else {
          realPersons = detectedPersons;
        }

        // Calculate density & risk based on real detected people
        const realCount = realPersons.length;
        const calculatedDensity = Math.min(100, Math.round((realCount / 10) * 100));
        setDensity(calculatedDensity);

        const calculatedRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' =
          calculatedDensity >= 80 ? 'CRITICAL' :
          calculatedDensity >= 60 ? 'HIGH' :
          calculatedDensity >= 35 ? 'MODERATE' : 'LOW';

        setRiskLevel(calculatedRisk);

        if (onPeopleDetected) {
          onPeopleDetected(realCount, calculatedDensity, calculatedRisk);
        }

        // Visual HUD Styling Colors
        const hudColor = calculatedRisk === 'CRITICAL' ? '#EF4444' :
                         calculatedRisk === 'HIGH' ? '#F97316' :
                         calculatedRisk === 'MODERATE' ? '#F59E0B' : '#00F0FF';

        // 4. Render Human Body Rectangle & Below "DETECTED BODY" Badge
        realPersons.forEach((person, index) => {
          let [x, y, w, h] = person.bbox;

          // Ensure vertical human body rectangular proportions
          if (h < w * 1.3) {
            const adjustedH = Math.max(h, w * 1.45);
            const deltaH = adjustedH - h;
            y = Math.max(0, y - deltaH * 0.2);
            h = Math.min(canvas.height - y - 28, adjustedH);
          }

          // Subtle glowing translucent body fill inside rectangle
          ctx.fillStyle = calculatedRisk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.08)' :
                          calculatedRisk === 'HIGH' ? 'rgba(249, 115, 22, 0.08)' :
                          'rgba(0, 240, 255, 0.08)';
          ctx.fillRect(x, y, w, h);

          // Human Body Bounding Rectangle
          ctx.strokeStyle = hudColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x, y, w, h);

          // High-contrast corner brackets on the rectangle
          const cornerLen = Math.min(20, w * 0.25, h * 0.15);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(x, y + cornerLen);
          ctx.lineTo(x, y);
          ctx.lineTo(x + cornerLen, y);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(x + w - cornerLen, y);
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + cornerLen);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(x, y + h - cornerLen);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x + cornerLen, y + h);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(x + w - cornerLen, y + h);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x + w, y + h - cornerLen);
          ctx.stroke();

          // Label Badge Below Box
          const badgeText = `DETECTED BODY • P#${index + 1} (${Math.round(person.score * 100)}%)`;
          const badgeW = Math.max(160, w);
          const badgeX = x + (w - badgeW) / 2;
          const badgeY = Math.min(canvas.height - 24, y + h + 4);

          // Badge Background
          ctx.fillStyle = 'rgba(11, 15, 25, 0.92)';
          ctx.fillRect(badgeX, badgeY, badgeW, 22);

          // Badge Border
          ctx.strokeStyle = hudColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(badgeX, badgeY, badgeW, 22);

          // Badge Text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(badgeText, badgeX + 8, badgeY + 15);
        });

        // 5. Render Top Neural HUD Overlay Banner
        ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
        ctx.fillRect(0, 0, canvas.width, 38);

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`📷 ${cam.id} | TENSORFLOW.JS BODY DETECTOR`, 14, 24);

        ctx.fillStyle = realCount > 0 ? '#10B981' : '#94A3B8';
        ctx.fillText(`HUMAN BODIES: ${realCount}`, canvas.width - 180, 24);

        // 6. Broadcast Telemetry & Frame Snapshot
        if (now - lastTelemetryPush > 400) {
          lastTelemetryPush = now;
          const frameSnapshot = canvas.toDataURL('image/jpeg', 0.5);

          mobileCctvService.updateTelemetry({
            id: cam.id,
            name: cam.name,
            location: cam.location,
            peopleCount: realCount,
            density: calculatedDensity,
            fps: fps || 30,
            riskLevel: calculatedRisk,
            deviceInfo: sourceMode === 'webcam' ? `Webcam (${facingMode})` : 'CCTV RTSP Loop',
            frameData: frameSnapshot,
            facingMode,
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectAndRender);
    };

    animationFrameRef.current = requestAnimationFrame(detectAndRender);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, modelLoading, cam.id, facingMode, confidenceThreshold, fps, sourceMode]);

  const handleCopyMobileLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/mobile-camera?camId=${cam.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#070A12] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col font-sans select-none text-white">
      {/* Top Controls Header */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${modelLoading ? 'bg-amber-400 animate-ping' : 'bg-[#10B981] animate-pulse'}`}></span>
          <div>
            <div className="text-sm font-extrabold text-white font-mono flex items-center gap-2">
              <span>{cam.id} • {cam.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/30">
                {sourceMode === 'webcam' ? '🔴 REAL WEBCAM' : '📹 CCTV STREAM'}
              </span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono">
              {modelLoading ? 'Initializing TensorFlow Lite Neural Detector...' : 'TensorFlow.js Real-time Body Detection Active'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Switch Source: Webcam <-> CCTV Video */}
          <button
            onClick={onToggleSource}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              sourceMode === 'webcam'
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{sourceMode === 'webcam' ? 'Switch to CCTV Stream' : 'Use Real Device Camera'}</span>
          </button>

          {/* Flip camera if webcam */}
          {sourceMode === 'webcam' && (
            <button
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white transition cursor-pointer"
              title="Flip Front / Rear Camera"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* AI Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              showSettings ? 'bg-[#2563EB] border-[#3B82F6] text-white' : 'bg-[#1E293B] border-[#334155] text-[#94A3B8]'
            }`}
            title="AI Vision Sensitivity Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Open Mobile Node */}
          <button
            onClick={() => {
              window.location.hash = `#/mobile-camera?camId=${cam.id}`;
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-mono text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Mobile Node</span>
          </button>
        </div>
      </div>

      {/* AI Settings Drawer */}
      {showSettings && (
        <div className="bg-[#0B0F19] border-b border-[#1E293B] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[#94A3B8] uppercase text-[10px]">AI Confidence Threshold:</span>
            <input
              type="range"
              min="0.30"
              max="0.80"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-36 accent-[#2563EB] cursor-pointer"
            />
            <span className="font-bold text-[#00F0FF]">{Math.round(confidenceThreshold * 100)}%</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <Cpu className="w-4 h-4 text-[#10B981]" />
            Engine: TensorFlow.js Lite MobileNet v2 Person Detector
          </div>
        </div>
      )}

      {/* Main Viewport & Canvas */}
      <div className="relative aspect-[16/9] sm:aspect-[16/10] bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Hidden video element supplying raw camera frames */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* Processed AI Vision Canvas */}
        <canvas ref={canvasRef} className="w-full h-full object-contain" />

        {/* Loading Weights Overlay */}
        {modelLoading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 space-y-3 z-20">
            <RefreshCw className="w-10 h-10 text-[#00F0FF] animate-spin" />
            <h3 className="text-sm font-bold font-mono text-white">Loading Neural Vision Weights...</h3>
            <p className="text-xs text-[#94A3B8] font-mono text-center max-w-xs">
              Initializing TensorFlow MobileNet on-device person detector. Please hold on...
            </p>
          </div>
        )}

        {/* Camera Permission Error Overlay */}
        {cameraError && (
          <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
            <ShieldAlert className="w-14 h-14 text-[#EF4444]" />
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-white">Camera Offline</h3>
              <p className="text-xs text-[#94A3B8] font-mono">{cameraError}</p>
            </div>
            <button
              onClick={setupVideoSource}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer font-mono"
            >
              <RefreshCw className="w-4 h-4" /> Grant / Retry Camera
            </button>
          </div>
        )}

        {/* Live Status Tag */}
        {isStreaming && !modelLoading && (
          <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#10B981]/50 flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-mono font-extrabold text-[#10B981]">
              LIVE: {cam.id}
            </span>
          </div>
        )}

        {/* Floating Telemetry Stats Bar (Exact Style from Mobile Node) */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] rounded-xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 z-10">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-[#00F0FF]" /> Detected Bodies
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#00F0FF]">
              {peopleCount} <span className="text-xs font-normal text-[#64748B]">Bodies</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
              Density
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {density}%
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
              Risk Index
            </div>
            <span className={`text-xs font-extrabold font-mono px-2.5 py-1 rounded-md border ${
              riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
              riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
              riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
              'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {riskLevel}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
              FPS
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {fps || 30}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time DETECTED BODIES Live Tray (Exact Style as Mobile Node) */}
      <div className="bg-[#0B0F19] border-t border-[#1E293B] px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${peopleCount > 0 ? 'bg-[#10B981] animate-ping' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#00F0FF]" />
              DETECTED BODIES: <span className="text-base text-[#00F0FF]">{peopleCount}</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            {peopleCount > 0 ? 'Human body recognition active' : 'Waiting for persons to enter frame...'}
          </span>
        </div>

        {/* Live Detected Body Cards */}
        {detectedPersons.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {detectedPersons.map((p, idx) => (
              <div 
                key={idx} 
                className="shrink-0 bg-[#1E293B] border border-[#00F0FF]/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="font-bold text-white">Body #{idx + 1}</span>
                <span className="text-[10px] text-[#00F0FF] bg-[#0F172A] px-1.5 py-0.5 rounded border border-[#00F0FF]/20">
                  {Math.round(p.score * 100)}% match
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  [W: {Math.round(p.bbox[2])}px × H: {Math.round(p.bbox[3])}px]
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] font-mono text-slate-500 italic py-1 flex items-center gap-2">
            <span>⚪ 0 Human Bodies detected. Stand in front of camera or load crowd feed.</span>
          </div>
        )}
      </div>

      {/* Footer Share Node */}
      <div className="bg-[#0F172A] border-t border-[#1E293B] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#94A3B8] font-mono">
          <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
          Live Neural Telemetry Streamed to CrowdIQ Operations Command
        </div>

        <button
          onClick={handleCopyMobileLink}
          className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white font-mono font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#3B82F6]" />}
          {copied ? 'Link Copied!' : `Copy Node #${cam.id} Link`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LIVE CAMERAS PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function LiveCamerasPage() {
  useSimulation();
  const [selectedId, setSelectedId] = useState('CAM-01');
  const [viewMode, setViewMode] = useState<'detail' | 'grid'>('detail');
  const [sourceMode, setSourceMode] = useState<'webcam' | 'cctv'>('webcam');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [ts, setTs] = useState(new Date().toLocaleTimeString());
  
  // Realtime detections across cameras
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const t = setInterval(() => setTs(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const rawSelected = CAMERAS.find(c => c.id === selectedId) || CAMERAS[0];
  const selected = {
    ...rawSelected,
    people: liveCounts[rawSelected.id] !== undefined ? liveCounts[rawSelected.id] : rawSelected.people
  };

  const filtered = filterRisk === 'ALL' ? CAMERAS : CAMERAS.filter(c => c.risk === filterRisk);
  const online = CAMERAS.filter(c => c.status === 'ONLINE').length;
  const totalDet = CAMERAS.filter(c => c.status === 'ONLINE').reduce((s, c) => s + (liveCounts[c.id] ?? c.people), 0);
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
    { label: 'AI Detector',        val: 'TensorFlow.js COCO-SSD',             isRisk: false, hi: true  },
    { label: 'Last Updated',       val: ts,                                   isRisk: false, hi: false },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* ── Top Header ── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">Live Monitor</span>
            <span className="text-[11px] font-semibold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />REAL-TIME TENSORFLOW.JS BODY DETECTOR
            </span>
            {hiRisk > 0 && (
              <span className="text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />{hiRisk} HIGH RISK
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">CCTV Surveillance &amp; Crowd Monitor</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">Real-time device camera / CCTV streams with neural bounding boxes &amp; density analytics • {ts}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Webcam vs CCTV */}
          <button
            onClick={() => setSourceMode(m => m === 'webcam' ? 'cctv' : 'webcam')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
              sourceMode === 'webcam'
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs animate-pulse'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{sourceMode === 'webcam' ? '🔴 Live Device Webcam' : '📹 Use Real Device Camera'}</span>
          </button>

          <span className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-green-500" />{online}/{CAMERAS.length} active
          </span>
          
          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'detail' : 'grid')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] text-white cursor-pointer hover:bg-[#1D4ED8] transition font-mono"
          >
            {viewMode === 'grid'
              ? <><Maximize2 className="w-3.5 h-3.5" />AI Node View</>
              : <><Grid className="w-3.5 h-3.5" />Grid View</>}
          </button>
          
          <button
            onClick={() => {
              window.location.hash = '#/cameras';
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition cursor-pointer font-mono"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>🪟 Video Wall</span>
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Feeds',   value: `${online}/${CAMERAS.length}`, sub: sourceMode === 'webcam' ? 'Live Device Camera' : 'CCTV Streams', color: '#059669', bg: '#F0FDF4' },
          { label: 'Total Detected', value: totalDet,                       sub: 'persons tracked',    color: '#2563EB', bg: '#EFF6FF' },
          { label: 'High Risk',      value: hiRisk,                          sub: 'cameras flagged',    color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Avg Density',    value: `${avgD}/m²`,                   sub: 'venue average',      color: '#D97706', bg: '#FFFBEB' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-xs">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B] mb-1">{s.label}</div>
            <div style={{ color: s.color }} className="text-2xl font-extrabold font-mono">{s.value}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── DETAIL VIEW: EXACT SAME AI CAMERA NODE AS MOBILE-CAMERA ── */}
      {viewMode === 'detail' && (
        <div className="space-y-4">
          {/* Camera Slot Selector Bar */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 flex items-center justify-between gap-3 flex-wrap shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#64748B]">Active AI Slot:</span>
              {CAMERAS.slice(0, 4).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition cursor-pointer border ${
                    c.id === selectedId
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                      : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#EFF6FF]'
                  }`}
                >
                  {c.id} • {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.location.hash = `#/mobile-camera?camId=${selectedId}`;
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-lg border border-[#BFDBFE] hover:bg-[#DBEAFE] transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open Direct on Phone (#{selectedId}) →</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Real AI Camera Viewer (2 Cols) */}
            <div className="lg:col-span-2">
              <RealAiCameraViewer
                cam={selected}
                sourceMode={sourceMode}
                onToggleSource={() => setSourceMode(m => m === 'webcam' ? 'cctv' : 'webcam')}
                onPeopleDetected={(count) => {
                  setLiveCounts(prev => ({ ...prev, [selected.id]: count }));
                }}
              />
            </div>

            {/* Live Telemetry & Inspector (1 Col) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB]">Live Node Telemetry</h3>
                  <span className="text-[10px] font-mono font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] px-2 py-0.5 rounded">
                    ACTIVE SENSOR
                  </span>
                </div>

                <div className="space-y-2.5">
                  {tele.map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-[#F1F5F9] last:border-0">
                      <span className="text-[11px] text-[#64748B] font-mono shrink-0">{row.label}</span>
                      {row.isRisk ? (
                        <span
                          style={{ color: RISK[row.val]?.color, background: RISK[row.val]?.bg, borderColor: RISK[row.val]?.border }}
                          className="text-[11px] font-bold px-2 py-0.5 rounded border font-mono"
                        >
                          {RISK[row.val]?.emoji} {row.val}
                        </span>
                      ) : (
                        <span className={`text-[11px] font-mono font-bold text-right ${row.hi ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                          {row.val}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
                <div className="text-[10px] font-mono text-[#64748B] uppercase">Mobile QR / Direct Link</div>
                <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#334155] flex items-center justify-between">
                  <span className="truncate">#/mobile-camera?camId={selected.id}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/mobile-camera?camId=${selected.id}`);
                      alert('Direct Mobile Node link copied to clipboard!');
                    }}
                    className="text-[#2563EB] hover:underline font-bold shrink-0 ml-2 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID VIEW (8 CCTV CAMERAS) ── */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Filter by risk:</span>
              {['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition cursor-pointer ${
                    filterRisk === r ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-[#64748B]">Click any feed to open in AI Node View</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(cam => (
              <div
                key={cam.id}
                onClick={() => {
                  setSelectedId(cam.id);
                  setViewMode('detail');
                }}
                className={`bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden cursor-pointer hover:border-[#2563EB] transition group ${
                  cam.id === selectedId ? 'ring-2 ring-[#2563EB]' : ''
                }`}
              >
                <div className="p-3 bg-[#0B1120] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">{cam.id}</span>
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">{cam.name}</span>
                  </div>
                  <span
                    style={{ background: RISK[cam.risk]?.bg, color: RISK[cam.risk]?.color, borderColor: RISK[cam.risk]?.border }}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono"
                  >
                    {cam.risk}
                  </span>
                </div>
                
                {/* Video Preview */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  <video
                    src={cam.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {liveCounts[cam.id] ?? cam.people} bodies
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300">
                    {cam.fps} FPS
                  </div>
                </div>
                
                <div className="p-2.5 bg-white text-[10px] font-mono text-[#64748B] flex items-center justify-between border-t border-[#E2E8F0]">
                  <span>{cam.zone} • {cam.location.split(',')[0]}</span>
                  <span className="text-[#2563EB] font-bold">Inspect AI Feed →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Risk Engine Panel ── */}
      <RiskEnginePanel cam={selected} />
    </div>
  );
}
