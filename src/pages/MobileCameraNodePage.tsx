import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { mobileCctvService, DEFAULT_MOBILE_CAMERAS } from '../services/mobileCctvService';
import { 
  Camera, 
  Smartphone, 
  RefreshCw, 
  ShieldAlert, 
  ArrowLeft, 
  FlipHorizontal, 
  Eye, 
  Radio, 
  Copy, 
  Check, 
  Cpu, 
  Sliders,
  Users
} from 'lucide-react';

interface DetectedPerson {
  bbox: [number, number, number, number]; // [x, y, width, height]
  score: number;
}

export function MobileCameraNodePage({ onNavigate }: { onNavigate?: (route: string) => void }) {
  // Parse query string or hash for camId (e.g. #/mobile-camera?camId=CAM-01)
  const getInitialCamId = () => {
    const hash = window.location.hash;
    if (hash.includes('camId=')) {
      const match = hash.match(/camId=(CAM-0[1-4])/i);
      if (match) return match[1].toUpperCase();
    }
    return 'CAM-01';
  };

  const [selectedCamId, setSelectedCamId] = useState<string>(getInitialCamId());
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);

  // Real-time AI Vision State
  const [peopleCount, setPeopleCount] = useState<number>(0);
  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.42);
  const [density, setDensity] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('LOW');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const isDetectingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  const activeCamInfo = DEFAULT_MOBILE_CAMERAS.find((c) => c.id === selectedCamId) || DEFAULT_MOBILE_CAMERAS[0];

  // 1. Initialize TensorFlow.js & COCO-SSD Human Body Model
  useEffect(() => {
    let isMounted = true;
    setModelLoading(true);
    setModelError(null);

    const initModel = async () => {
      try {
        await tf.ready();
        // Load lite mobilenet for ultra-fast mobile body detection
        const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (isMounted) {
          modelRef.current = loadedModel;
          setModelLoading(false);
          console.log('✅ TensorFlow.js COCO-SSD Human Body Model initialized successfully.');
        }
      } catch (err: any) {
        console.error('Failed to load TensorFlow model:', err);
        if (isMounted) {
          setModelError(err.message || 'Failed to load neural vision weights.');
          setModelLoading(false);
        }
      }
    };

    initModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Camera Stream
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg(`Camera error: ${err.message || 'Permission denied or camera in use.'}`);
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsStreaming(false);
    mobileCctvService.resetCamera(selectedCamId);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [selectedCamId, facingMode]);

  // 3. Real-Time Neural Human Body Detection & Canvas Rendering Loop
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

        // Visual HUD Styling Colors
        const hudColor = calculatedRisk === 'CRITICAL' ? '#EF4444' :
                         calculatedRisk === 'HIGH' ? '#F97316' :
                         calculatedRisk === 'MODERATE' ? '#F59E0B' : '#00F0FF';

        // 4. Render Human Body Rectangle & Below "DETECTED BODY" Badge
        realPersons.forEach((person, index) => {
          let [x, y, w, h] = person.bbox;

          // Ensure vertical human body rectangular proportions (height should properly frame the body)
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

          // Center Torso Tracking Reticle
          const centerX = x + w / 2;
          const centerY = y + h * 0.38;
          ctx.fillStyle = hudColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
          ctx.fill();

          // -----------------------------------------------------------------
          // BELOW THE RECTANGLE: "DETECTED BODY" BADGE
          // -----------------------------------------------------------------
          const scorePct = Math.round(person.score * 100);
          const badgeText = `🟢 DETECTED BODY: Person #${index + 1} (${scorePct}%)`;

          const badgeY = Math.min(canvas.height - 24, y + h + 6);
          const badgeW = badgeText.length * 7.5 + 16;
          const badgeX = Math.max(4, Math.min(canvas.width - badgeW - 4, x + (w / 2) - (badgeW / 2)));

          // Badge Background
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
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
        ctx.fillText(`📷 ${selectedCamId} | TENSORFLOW.JS BODY DETECTOR`, 14, 24);

        ctx.fillStyle = realCount > 0 ? '#10B981' : '#94A3B8';
        ctx.fillText(`HUMAN BODIES: ${realCount}`, canvas.width - 180, 24);

        // 6. Broadcast Telemetry & Frame Snapshot every 300ms
        if (now - lastTelemetryPush > 300) {
          lastTelemetryPush = now;
          const frameSnapshot = canvas.toDataURL('image/jpeg', 0.55);

          mobileCctvService.updateTelemetry({
            id: selectedCamId,
            name: activeCamInfo.name,
            location: activeCamInfo.location,
            peopleCount: realCount,
            density: calculatedDensity,
            fps: fps || 30,
            riskLevel: calculatedRisk,
            deviceInfo: `${navigator.platform || 'Phone'} (${facingMode === 'environment' ? 'Rear Cam' : 'Front Cam'})`,
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
  }, [isStreaming, modelLoading, selectedCamId, facingMode, confidenceThreshold, fps, detectedPersons]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/mobile-camera?camId=${selectedCamId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col font-sans select-none">
      {/* Top Mobile Bar */}
      <header className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('cameras')}
              className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition cursor-pointer"
              title="Return to Cameras Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${modelLoading ? 'bg-amber-400 animate-ping' : 'bg-[#10B981] animate-pulse'}`}></span>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-mono">
                <Smartphone className="w-4 h-4 text-[#3B82F6]" />
                CrowdIQ CCTV Node
              </h1>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-mono">
              {modelLoading ? 'Loading AI Model Weights...' : 'TensorFlow.js Human Body Counting Active'}
            </p>
          </div>
        </div>

        {/* Slot Selector & Settings */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCamId}
            onChange={(e) => setSelectedCamId(e.target.value)}
            className="bg-[#1E293B] border border-[#334155] text-xs font-mono font-bold text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="CAM-01">Slot 1 (Main Gate)</option>
            <option value="CAM-02">Slot 2 (Gate B)</option>
            <option value="CAM-03">Slot 3 (West Exit)</option>
            <option value="CAM-04">Slot 4 (Plaza Core)</option>
          </select>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              showSettings ? 'bg-[#2563EB] border-[#3B82F6] text-white' : 'bg-[#1E293B] border-[#334155] text-[#94A3B8]'
            }`}
            title="AI Detection Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="bg-[#0F172A] border-b border-[#1E293B] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono animate-fadeIn">
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

      {/* Main Video & AI Detection Viewport */}
      <main className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Hidden video element supplying raw camera frames */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* Processed AI Vision Canvas */}
        <canvas ref={canvasRef} className="w-full h-full object-contain max-h-[75vh]" />

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

        {/* Camera Permission / Error overlay */}
        {errorMsg && (
          <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
            <ShieldAlert className="w-14 h-14 text-[#EF4444]" />
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-white">Camera Offline</h3>
              <p className="text-xs text-[#94A3B8] font-mono">{errorMsg}</p>
            </div>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Grant / Retry Camera
            </button>
          </div>
        )}

        {/* Live Status Indicators */}
        {isStreaming && !modelLoading && (
          <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#10B981]/50 flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-mono font-extrabold text-[#10B981]">
              LIVE: {selectedCamId}
            </span>
          </div>
        )}

        {/* Camera Flip Control */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="p-2.5 rounded-full bg-black/75 backdrop-blur-md border border-[#334155] text-white hover:bg-[#1E293B] transition cursor-pointer"
            title="Flip Camera (Front / Rear)"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Telemetry Stats Bar */}
        <div className="absolute bottom-4 left-4 right-4 bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 z-10">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-[#00F0FF]" /> Detected Bodies
            </div>
            <div className="text-2xl font-black font-mono text-[#00F0FF]">
              {peopleCount} <span className="text-xs font-normal text-[#64748B]">Bodies</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider">
              Density
            </div>
            <div className="text-xl font-bold font-mono text-white">
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
      </main>

      {/* Real-time DETECTED BODIES Live Tray Below Camera */}
      <section className="bg-[#0B0F19] border-t border-[#1E293B] px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${peopleCount > 0 ? 'bg-[#10B981] animate-ping' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#00F0FF]" />
              DETECTED BODIES: <span className="text-base text-[#00F0FF]">{peopleCount}</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            {peopleCount > 0 ? 'Human body recognition active' : 'Waiting for person to enter frame...'}
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
            <span>⚪ 0 Human Bodies detected. Stand in front of camera to detect body.</span>
          </div>
        )}
      </section>


      {/* Bottom Share Link Bar */}
      <footer className="bg-[#0F172A] border-t border-[#1E293B] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#94A3B8] font-mono">
          <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
          Live Neural Telemetry Streamed to CrowdIQ Operations Command
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white font-mono font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#3B82F6]" />}
          {copied ? 'Link Copied!' : `Copy Node #${selectedCamId} Link`}
        </button>
      </footer>
    </div>
  );
}
