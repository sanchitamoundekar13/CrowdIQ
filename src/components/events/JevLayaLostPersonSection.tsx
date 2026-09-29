import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, 
  Camera, 
  Search, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Maximize2, 
  ExternalLink, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  ArrowRight, 
  Eye, 
  Check, 
  Video,
  X,
  Send,
  Navigation,
  FileText,
  Smartphone,
  Play,
  RotateCcw,
  Sliders,
  Terminal,
  Activity,
  Cpu,
  Target,
  Crosshair
} from 'lucide-react';
import { 
  LostPersonCase, 
  jevLayaAiService, 
  INITIAL_LOST_PERSON_CASES 
} from '../../services/jevLayaAiService';
import { mobileCctvService, MobileCameraNode } from '../../services/mobileCctvService';
import { 
  ReIdTargetProfile, 
  ReIdCandidate, 
  DecisionTelemetryLog,
  PRESET_TARGET_PROFILES, 
  evaluateCandidateWithJevLayaAi, 
  renderJevLayaCanvasOverlay, 
  sampleUpperTorsoColor,
  extractTargetProfileFromImage,
  rgbToHex
} from '../../services/jevLayaReIdEngine';
import { useSimulation } from '../../context/SimulationContext';

interface JevLayaLostPersonSectionProps {
  onNavigateToCamera?: (camId: string, targetName: string) => void;
}

export const JevLayaLostPersonSection: React.FC<JevLayaLostPersonSectionProps> = ({
  onNavigateToCamera,
}) => {
  const { playAlertSound } = useSimulation();
  const [cases, setCases] = useState<LostPersonCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-AMBER-2026-01');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real Phone Cam & Device Webcam Stream State
  const [mobileCameras, setMobileCameras] = useState<MobileCameraNode[]>([]);
  const [videoSource, setVideoSource] = useState<'phone' | 'webcam' | 'cctv'>('cctv');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const cctvVideoRef = useRef<HTMLVideoElement | null>(null);
  const phoneImgRef = useRef<HTMLImageElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Jev & Laya AI Decision-Making Engine State
  const [decisionThreshold, setDecisionThreshold] = useState<number>(80);
  const [activeCandidates, setActiveCandidates] = useState<ReIdCandidate[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<DecisionTelemetryLog[]>([
    {
      id: 'log-init-1',
      timestamp: '12:58:10.104',
      frameNumber: 1204,
      message: 'Jev & Laya AI Multimodal Re-ID Engine online. 512-D neural embeddings initialized.',
      type: 'SCAN',
    },
    {
      id: 'log-init-2',
      timestamp: '12:58:12.450',
      frameNumber: 1272,
      message: 'Target vector profile loaded: Leo Sharma (Bright yellow hoodie, child stature ratio 2.45).',
      type: 'SCAN',
    },
    {
      id: 'log-init-3',
      timestamp: '12:58:14.200',
      frameNumber: 1320,
      message: 'Frame #1320: Candidate #CAN-01 garment RGB [234, 179, 10] matches target yellow profile at 96.4%. DECISION: POSITIVE_MATCH (TARGET LOCKED).',
      type: 'MATCH',
    },
  ]);
  const [isTerminalPaused, setIsTerminalPaused] = useState(false);
  const [targetProfilesMap, setTargetProfilesMap] = useState<Record<string, ReIdTargetProfile>>(PRESET_TARGET_PROFILES);

  // New Case Form State
  const [newCase, setNewCase] = useState({
    personName: '',
    category: 'CHILD' as 'CHILD' | 'ELDERLY' | 'ADULT' | 'MEDICAL',
    age: 8,
    gender: 'Male',
    photoUrl: './assets/sample_lost_child.jpg',
    clothingDescription: '',
    lastSeenZone: 'Core Arena Plaza',
    lastSeenTime: '12:45 PM IST',
    guardianName: '',
    guardianPhone: '',
    urgency: 'CODE AMBER' as 'CODE AMBER' | 'HIGH' | 'MEDIUM',
  });

  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Subscribe to Jev & Laya AI cases
  useEffect(() => {
    const unsub = jevLayaAiService.subscribe((list) => {
      setCases(list);
      if (list.length > 0 && !list.find(c => c.id === selectedCaseId)) {
        setSelectedCaseId(list[0].id);
      }
    });
    return () => unsub();
  }, [selectedCaseId]);

  // Subscribe to live mobile phone camera telemetry & video frames
  useEffect(() => {
    const unsubMobile = mobileCctvService.subscribe((list) => {
      setMobileCameras([...list]);
    });
    return () => unsubMobile();
  }, []);

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0] || INITIAL_LOST_PERSON_CASES[0];

  // Active target profile for current selected case
  const currentTargetProfile: ReIdTargetProfile = targetProfilesMap[activeCase?.id] || {
    id: activeCase?.id || 'DEFAULT',
    name: activeCase?.personName || 'Unknown Target',
    category: activeCase?.category || 'CHILD',
    targetRgb: [234, 179, 8],
    targetHex: '#EAB308',
    targetHue: 45,
    targetSaturation: 95,
    expectedAspectRatio: activeCase?.category === 'CHILD' ? 2.45 : 3.1,
    clothingDescription: activeCase?.clothingDescription || 'Target attire',
    photoUrl: activeCase?.photoUrl || './assets/sample_lost_child.jpg',
  };

  // Find if a real phone is currently streaming on the detected camera slot or any phone slot
  const connectedPhone = mobileCameras.find(
    m => m.id === activeCase?.detectedCameraId && m.status === 'ONLINE' && m.frameData
  ) || mobileCameras.find(m => m.status === 'ONLINE' && m.frameData);

  // Automatically select phone mode if phone is online
  useEffect(() => {
    if (connectedPhone && videoSource === 'cctv') {
      setVideoSource('phone');
    }
  }, [connectedPhone]);

  // Toggle Real Local Webcam
  const handleToggleWebcam = async () => {
    if (isWebcamActive) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
        webcamStreamRef.current = null;
      }
      setIsWebcamActive(false);
      setVideoSource('cctv');
      setToastMessage('Stopped device webcam.');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        webcamStreamRef.current = stream;
        setIsWebcamActive(true);
        setVideoSource('webcam');
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
          await webcamVideoRef.current.play();
        }
        playAlertSound('info');
        setToastMessage('Live device camera connected into Jev & Laya AI Locator!');
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error('Webcam access error', err);
        alert('Could not access camera. Please allow camera permissions in your browser.');
      }
    }
  };

  // Launch Phone Camera in New Window
  const handleOpenPhoneCamera = (camId: string = activeCase?.detectedCameraId || 'CAM-02') => {
    const url = `${window.location.origin}${window.location.pathname}#/mobile-camera?camId=${camId}`;
    window.open(url, '_blank');
    playAlertSound('info');
    setToastMessage(`Opening real phone camera link for ${camId}... Stream will appear here live!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Photo File Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        setUploadedImagePreview(result);
        setNewCase(prev => ({ ...prev, photoUrl: result }));

        // Dynamically analyze the uploaded image with Jev & Laya AI to extract target color vector
        const extracted = await extractTargetProfileFromImage(
          result,
          newCase.personName || 'New Target',
          newCase.category,
          newCase.clothingDescription || 'Uploaded photo profile'
        );

        setTargetProfilesMap(prev => ({
          ...prev,
          [`CUSTOM-${Date.now()}`]: extracted as ReIdTargetProfile,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset loader
  const handleLoadPreset = (type: 'child' | 'elder') => {
    if (type === 'child') {
      setNewCase({
        personName: 'Leo Sharma',
        category: 'CHILD',
        age: 8,
        gender: 'Male',
        photoUrl: './assets/sample_lost_child.jpg',
        clothingDescription: 'Bright yellow hoodie, dark navy backpack strap, blue jeans, dark hair',
        lastSeenZone: 'Core Arena Plaza',
        lastSeenTime: '12:45 PM IST',
        guardianName: 'Priya & Rajesh Sharma',
        guardianPhone: '+91 98201 44829',
        urgency: 'CODE AMBER',
      });
      setUploadedImagePreview('./assets/sample_lost_child.jpg');
    } else {
      setNewCase({
        personName: 'Arthur Jenkins',
        category: 'ELDERLY',
        age: 74,
        gender: 'Male',
        photoUrl: './assets/sample_lost_elder.jpg',
        clothingDescription: 'Navy blue utility jacket, wire glasses, grey hair, dark green collared shirt',
        lastSeenZone: 'South Wing',
        lastSeenTime: '11:30 AM IST',
        guardianName: 'Eleanor Jenkins',
        guardianPhone: '+91 98402 11983',
        urgency: 'HIGH',
      });
      setUploadedImagePreview('./assets/sample_lost_elder.jpg');
    }
  };

  // Run Jev & Laya AI Cross-Camera Search
  const handleRunAiSearch = (caseId?: string) => {
    const targetCaseId = caseId || selectedCaseId;
    setIsScanning(true);
    setScanProgress(10);
    setScanMessage('Initializing Jev & Laya Multimodal Neural Re-ID Engine...');
    playAlertSound('info');

    setTimeout(() => {
      setScanProgress(30);
      setScanMessage('Extracting 512-D facial landmarks and clothing color histograms...');
    }, 600);

    setTimeout(() => {
      setScanProgress(60);
      setScanMessage('Evaluating 8 RTSP CCTV streams and mobile edge nodes across venue...');
    }, 1300);

    setTimeout(() => {
      setScanProgress(85);
      setScanMessage('Candidate correlation found on CAM-02 (Gate 2 Turnstiles)...');
    }, 2000);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      jevLayaAiService.updateCase(targetCaseId, {
        status: 'MATCH_FOUND',
        matchConfidence: 96.4,
        detectedCameraId: 'CAM-02',
        detectedCameraName: 'Gate 2 Turnstiles',
        detectedLocation: 'East Concourse, Level 0',
        detectedTimestamp: 'Just Now',
        detectedVideoUrl: './assets/cctv_crowd_stream_2.webm',
      });
      playAlertSound('critical');
      setToastMessage('🎯 Jev & Laya AI Match Confirmed: Target spotted on CAM-02!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 2600);
  };

  // Dispatch Ground Intercept
  const handleDispatchIntercept = () => {
    if (!activeCase) return;
    jevLayaAiService.updateCase(activeCase.id, {
      status: 'GROUND_INTERCEPT_DISPATCHED',
    });
    playAlertSound('warning');
    setToastMessage(`🚨 Security Ground Team Alpha-1 dispatched to ${activeCase.detectedCameraName}!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Append telemetry log
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    setTelemetryLogs(prev => [
      {
        id: `log-dispatch-${Date.now()}`,
        timestamp: timeStr,
        frameNumber: Math.floor(Math.random() * 5000 + 1000),
        message: `🚨 GROUND INTERCEPT: Tactical Security Unit dispatched to ${activeCase.detectedCameraName} (${activeCase.detectedLocation}) to recover ${activeCase.personName}.`,
        type: 'DISPATCH',
      },
      ...prev.slice(0, 40),
    ]);
  };

  // Safely Reunited
  const handleMarkReunited = () => {
    if (!activeCase) return;
    jevLayaAiService.updateCase(activeCase.id, {
      status: 'REUNITED',
    });
    playAlertSound('info');
    setToastMessage(`🎉 ${activeCase.personName} safely reunited with family. Case marked resolved.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit New Case
  const handleSubmitNewCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.personName.trim()) return;

    const created = jevLayaAiService.addCase({
      personName: newCase.personName,
      category: newCase.category,
      age: Number(newCase.age),
      gender: newCase.gender,
      photoUrl: newCase.photoUrl,
      clothingDescription: newCase.clothingDescription || 'Not specified',
      lastSeenZone: newCase.lastSeenZone,
      lastSeenTime: newCase.lastSeenTime,
      guardianName: newCase.guardianName || 'Family Contact',
      guardianPhone: newCase.guardianPhone || '+91 98000 00000',
      status: 'SCANNING',
      urgency: newCase.urgency,
      matchConfidence: 0,
      detectedCameraId: 'CAM-02',
      detectedCameraName: 'Gate 2 Turnstiles',
      detectedLocation: 'East Concourse, Level 0',
      detectedTimestamp: 'Analyzing live feeds...',
      detectedVideoUrl: './assets/cctv_crowd_stream_2.webm',
      boundingCoordinates: {
        top: 32,
        left: 48,
        width: 14,
        height: 38,
      },
      trajectory: [
        {
          cameraId: 'CAM-01',
          cameraName: 'Main Gate Ingress A',
          zone: 'Gate A',
          time: newCase.lastSeenTime,
          confidence: 94.0,
          status: 'Initial Entry',
          note: 'Initial entry correlation captured.'
        },
        {
          cameraId: 'CAM-02',
          cameraName: 'Gate 2 Turnstiles',
          zone: 'Gate B',
          time: 'Active Sighting',
          confidence: 96.4,
          status: 'Last Confirmed Sighting',
          note: 'Visual confirmation via Jev & Laya AI Re-ID model.'
        }
      ],
    });

    // Profile extractor for the new case
    const profile = await extractTargetProfileFromImage(
      newCase.photoUrl,
      newCase.personName,
      newCase.category,
      newCase.clothingDescription
    );

    setTargetProfilesMap(prev => ({
      ...prev,
      [created.id]: profile,
    }));

    setIsReportModalOpen(false);
    setSelectedCaseId(created.id);
    handleRunAiSearch(created.id);
  };

  // Navigate to Live Monitoring
  const handleOpenInLiveMonitoring = (camId: string, name: string) => {
    if (onNavigateToCamera) {
      onNavigateToCamera(camId, name);
    } else {
      window.location.hash = `#/cameras?camId=${camId}&targetName=${encodeURIComponent(name)}`;
    }
  };

  // =========================================================================
  // REAL-TIME FRAME-BY-FRAME AI DETECTION & JEV & LAYA DECISION MAKING LOOP
  // =========================================================================
  useEffect(() => {
    let animId: number;
    let frameCount = 0;
    let lastLogTime = 0;

    const runDetectionCycle = () => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(runDetectionCycle);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(runDetectionCycle);
        return;
      }

      // 1. Sync canvas resolution with actual display box
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      frameCount++;
      const t = frameCount * 0.04;

      // 2. Multi-Candidate Tracking Localization
      // Depending on whether we are analyzing CCTV video, phone feed, or webcam:
      let rawCandidates: Array<{
        id: string;
        trackLabel: string;
        bbox: { x: number; y: number; w: number; h: number };
        sampledRgb: [number, number, number];
        velocity: { vx: number; vy: number };
      }> = [];

      if (videoSource === 'cctv') {
        // CCTV Mode:
        // We have 4 dynamic candidates in the crowd:
        // Candidate 1: The target match person (e.g. Leo Sharma in yellow hoodie or Arthur Jenkins in navy jacket)
        // Candidate 2, 3, 4: Other attendees in the crowd with contrasting clothing

        const isLeoSharma = currentTargetProfile.id === 'CASE-AMBER-2026-01' || currentTargetProfile.name.includes('Leo');
        const isArthurJenkins = currentTargetProfile.id === 'CASE-AMBER-2026-02' || currentTargetProfile.name.includes('Arthur');

        // Candidate 1: Person walking through the turnstile corridor
        const c1X = 46 + Math.sin(t * 0.35) * 6;
        const c1Y = 32 + Math.cos(t * 0.25) * 4;
        const c1W = isLeoSharma ? 14 : 16;
        const c1H = isLeoSharma ? 35 : 44; // Child vs Adult stature

        // Candidate 2: Adult commuter in dark navy / black coat walking rightwards
        const c2X = 22 + Math.cos(t * 0.4) * 8;
        const c2Y = 28 + Math.sin(t * 0.3) * 3;
        const c2W = 16;
        const c2H = 46;

        // Candidate 3: Attendee in bright red / burgundy jacket near kiosk
        const c3X = 72 - Math.sin(t * 0.3) * 7;
        const c3Y = 36 + Math.cos(t * 0.4) * 3;
        const c3W = 15;
        const c3H = 42;

        // Candidate 4: Commuter in light grey / white shirt entering Gate 2
        const c4X = 35 + Math.sin(t * 0.5) * 5;
        const c4Y = 44 + Math.cos(t * 0.35) * 3;
        const c4W = 14;
        const c4H = 40;

        rawCandidates = [
          {
            id: 'CAN-01',
            trackLabel: 'Candidate #1',
            bbox: { x: c1X, y: c1Y, w: c1W, h: c1H },
            // If case is Leo, Candidate 1 has yellow hoodie RGB; if Arthur, navy jacket
            sampledRgb: isLeoSharma ? [234, 180, 10] : [28, 54, 88],
            velocity: { vx: 0.6, vy: 0.2 },
          },
          {
            id: 'CAN-02',
            trackLabel: 'Candidate #2',
            bbox: { x: c2X, y: c2Y, w: c2W, h: c2H },
            sampledRgb: [26, 44, 76], // Dark Navy / Charcoal
            velocity: { vx: 1.1, vy: 0.4 },
          },
          {
            id: 'CAN-03',
            trackLabel: 'Candidate #3',
            bbox: { x: c3X, y: c3Y, w: c3W, h: c3H },
            sampledRgb: [192, 42, 54], // Red / Burgundy
            velocity: { vx: -0.8, vy: 0.3 },
          },
          {
            id: 'CAN-04',
            trackLabel: 'Candidate #4',
            bbox: { x: c4X, y: c4Y, w: c4W, h: c4H },
            sampledRgb: [180, 186, 192], // Light Grey / Neutral
            velocity: { vx: 0.4, vy: -0.2 },
          },
        ];
      } else if (videoSource === 'phone' && phoneImgRef.current) {
        // Phone Stream Mode: Sample actual image frame from connected smartphone
        const b = { x: 38 + Math.sin(t * 0.5) * 3, y: 22 + Math.cos(t * 0.4) * 2, w: 24, h: 56 };
        const realRgb = sampleUpperTorsoColor(phoneImgRef.current, b);

        rawCandidates = [
          {
            id: 'PHONE-01',
            trackLabel: 'Mobile Node Subject #1',
            bbox: b,
            sampledRgb: realRgb,
            velocity: { vx: 0.2, vy: 0.1 },
          },
        ];
      } else if (videoSource === 'webcam' && webcamVideoRef.current) {
        // Webcam Mode: Sample actual video frame from user device camera
        const b = { x: 36 + Math.sin(t * 0.3) * 2, y: 20 + Math.cos(t * 0.3) * 2, w: 28, h: 60 };
        const realRgb = sampleUpperTorsoColor(webcamVideoRef.current, b);

        rawCandidates = [
          {
            id: 'WEBCAM-01',
            trackLabel: 'Webcam Subject #1',
            bbox: b,
            sampledRgb: realRgb,
            velocity: { vx: 0.1, vy: 0.05 },
          },
        ];
      }

      // 3. Jev & Laya AI Autonomous Decision Evaluation for every candidate
      const evaluatedList: ReIdCandidate[] = rawCandidates.map((raw) =>
        evaluateCandidateWithJevLayaAi(raw, currentTargetProfile, decisionThreshold)
      );

      // 4. Render Military-Grade Tactical Reticles and Decision Overlays on Canvas
      renderJevLayaCanvasOverlay(
        ctx,
        canvas.width,
        canvas.height,
        evaluatedList,
        currentTargetProfile,
        {
          decisionThreshold,
          showScanLine: true,
          scanLineProgress: (frameCount * 1.5) % 100,
          activeCaseStatus: activeCase?.status,
        }
      );

      // 5. Update React Candidates List for the Decision Matrix Table (throttled to ~10 Hz)
      if (frameCount % 6 === 0) {
        setActiveCandidates(evaluatedList);
      }

      // 6. Generate Live Jev & Laya AI Reasoning Telemetry Logs (every 2.5s)
      const nowMs = Date.now();
      if (!isTerminalPaused && nowMs - lastLogTime > 2500) {
        lastLogTime = nowMs;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
        
        const matchedCand = evaluatedList.find(c => c.decision === 'POSITIVE_MATCH');
        const rejectedCands = evaluatedList.filter(c => c.decision === 'REJECTED');

        const newLogEntries: DecisionTelemetryLog[] = [];

        if (matchedCand) {
          newLogEntries.push({
            id: `log-${Date.now()}-match`,
            timestamp: timeStr,
            frameNumber: frameCount,
            message: `🎯 POSITIVE TARGET LOCK: ${matchedCand.id} torso RGB [${matchedCand.sampledRgb.join(', ')}] (${matchedCand.sampledHex}) matches ${currentTargetProfile.name} profile at ${matchedCand.overallConfidence}% (>= ${decisionThreshold}% threshold). Stature ratio: ${matchedCand.statureRatio}:1.`,
            type: 'MATCH',
          });
        }

        if (rejectedCands.length > 0) {
          const sampleRej = rejectedCands[0];
          newLogEntries.push({
            id: `log-${Date.now()}-rej`,
            timestamp: timeStr,
            frameNumber: frameCount,
            message: `⚠️ CANDIDATE REJECTED: ${sampleRej.id} detected as ${sampleRej.detectedColorName} (RGB ${sampleRej.sampledHex}). Score ${sampleRej.overallConfidence}% < ${decisionThreshold}%. Reason: ${sampleRej.decisionReason.slice(0, 95)}...`,
            type: 'REJECT',
          });
        }

        if (newLogEntries.length > 0) {
          setTelemetryLogs(prev => [...newLogEntries, ...prev].slice(0, 50));
        }
      }

      animId = requestAnimationFrame(runDetectionCycle);
    };

    animId = requestAnimationFrame(runDetectionCycle);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    videoSource,
    currentTargetProfile,
    decisionThreshold,
    isTerminalPaused,
    activeCase?.status,
  ]);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center justify-between shadow-xs animate-fadeIn">
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>{toastMessage}</span>
          </span>
        </div>
      )}

      {/* ===================================================================
          JEV & LAYA AI EXECUTIVE HERO BANNER
          =================================================================== */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                CODE AMBER RECOVERY SYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                Jev &amp; Laya AI Engine Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-300" />
                Autonomous Re-ID Decision Making
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Lost Child &amp; Person Re-ID Locator
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload a recent photo of a lost child or family member. Jev &amp; Laya AI correlates biometrics and clothing across live phone camera feeds and CCTV streams to locate their live video footprint.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Report Lost Person / Upload Photo</span>
            </button>

            <button
              onClick={() => handleOpenPhoneCamera(activeCase.detectedCameraId)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              title="Open smartphone camera node to stream live video to this viewer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Connect Phone Cam</span>
            </button>
          </div>
        </div>

        {/* Live Scanning Progress Banner (if active) */}
        {isScanning && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-300 flex items-center gap-2 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                {scanMessage}
              </span>
              <span className="text-white font-bold">{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          ACTIVE CASES SELECTOR TABS
          =================================================================== */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Active Cases:
        </span>
        {cases.map((c) => {
          const isSelected = selectedCaseId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs transition border cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <img 
                src={c.photoUrl} 
                alt={c.personName} 
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
              <span>{c.personName} ({c.age}y)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                c.status === 'MATCH_FOUND' ? 'bg-emerald-100 text-emerald-800' :
                c.status === 'GROUND_INTERCEPT_DISPATCHED' ? 'bg-amber-100 text-amber-800' :
                c.status === 'REUNITED' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
              }`}>
                {c.status === 'MATCH_FOUND' ? 'Spotted' : c.status === 'GROUND_INTERCEPT_DISPATCHED' ? 'Intercepting' : c.status === 'REUNITED' ? 'Reunited' : 'Scanning'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================
          MASTER RECOVERY CONSOLE (2-COLUMN ARCHITECTURAL WHITE LAYOUT)
          =================================================================== */}
      {activeCase && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 4 COLS: CASE PROFILE & BIOMETRIC RE-ID SPECS */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Target Case Dossier
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {activeCase.id}
              </span>
            </div>

            {/* Target Photo with Biometric Facial Landmark Overlay */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
              <img 
                src={activeCase.photoUrl} 
                alt={activeCase.personName} 
                className="w-full h-full object-cover"
              />

              {/* Simulated Biometric Facial Mesh Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-36 h-44 border-2 border-emerald-400 rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                  
                  <div className="absolute top-12 left-10 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute top-12 right-10 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute top-20 left-16 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <div className="absolute top-26 left-12 w-2 h-1 rounded-full bg-emerald-400" />
                  <div className="absolute top-26 right-12 w-2 h-1 rounded-full bg-emerald-400" />

                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap">
                    Jev &amp; Laya Feature Vector Verified
                  </div>
                </div>
              </div>

              {/* Urgency Pill */}
              <div className="absolute top-2.5 left-2.5 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {activeCase.urgency}
              </div>

              {/* Dominant Target Color Swatch Pill */}
              <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 shadow-md">
                <span 
                  className="w-3 h-3 rounded-full border border-white/60" 
                  style={{ backgroundColor: currentTargetProfile.targetHex }}
                />
                <span>Target Vector: {currentTargetProfile.targetHex}</span>
              </div>
            </div>

            {/* Target Information Table */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Full Name:</span>
                <span className="font-bold text-slate-900">{activeCase.personName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Category &amp; Age:</span>
                <span className="font-semibold text-slate-800">{activeCase.category} • {activeCase.age} Years ({activeCase.gender})</span>
              </div>
              <div className="py-1 border-b border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium block">Clothing &amp; Features:</span>
                <span className="font-medium text-slate-900 bg-slate-50 p-2 rounded-lg block border border-slate-100 text-[11px]">
                  {activeCase.clothingDescription}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Last Known Zone:</span>
                <span className="font-semibold text-blue-600">{activeCase.lastSeenZone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Family / Guardian:</span>
                <span className="font-medium text-slate-900">{activeCase.guardianName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Guardian Contact:</span>
                <span className="font-mono font-bold text-slate-900">{activeCase.guardianPhone}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleDispatchIntercept}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Ground Intercept ({activeCase.detectedCameraName})</span>
              </button>

              <button
                onClick={handleMarkReunited}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Safely Reunited &amp; Close Case</span>
              </button>
            </div>
          </div>

          {/* RIGHT 8 COLS: LAST FOOTAGE SPOTTED WITH REAL AI CANVAS DETECTION & DECISION MATRIX */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* LAST SEEN CCTV FOOTAGE PLAYER (WITH REAL PHONE CAM INTEGRATION & DYNAMIC AI CANVAS) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Header with Live Stream Source Switcher */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      LAST SEEN FOOTAGE • {activeCase.detectedCameraId}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {activeCase.detectedCameraName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeCase.detectedLocation} • Confidence: <strong className="text-blue-600">{activeCase.matchConfidence}%</strong>
                  </p>
                </div>

                {/* Video Source Switcher Tabs */}
                <div className="inline-flex items-center p-1 bg-white rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setVideoSource('cctv')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      videoSource === 'cctv'
                        ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Play recorded default CCTV video footage"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Real CCTV Stream</span>
                  </button>

                  <button
                    onClick={() => setVideoSource('phone')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      videoSource === 'phone'
                        ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Real Video stream linked with mobile phone camera"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Real Phone Cam</span>
                    {connectedPhone && (
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={handleToggleWebcam}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      videoSource === 'webcam'
                        ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Connect your local device webcam directly"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isWebcamActive ? 'Webcam Live' : 'Use Webcam'}</span>
                  </button>
                </div>
              </div>

              {/* Real Video Stream Viewport with Dynamic Canvas Overlay */}
              <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden flex items-center justify-center">
                
                {/* 1. Underlying Media Layer */}
                {videoSource === 'cctv' && (
                  <video
                    ref={cctvVideoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={activeCase.detectedVideoUrl}
                    className="w-full h-full object-cover"
                  />
                )}

                {videoSource === 'phone' && (
                  connectedPhone && connectedPhone.frameData ? (
                    <img 
                      ref={phoneImgRef}
                      src={connectedPhone.frameData} 
                      alt="Real Phone CCTV Stream" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div className="max-w-md">
                        <h4 className="text-sm font-bold text-white">
                          Real Phone Camera Node Ready for {activeCase.detectedCameraId}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          No phone is currently streaming to this slot. Launch the phone CCTV node to stream real live camera video from your smartphone or browser window.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <button
                          onClick={() => handleOpenPhoneCamera(activeCase.detectedCameraId)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Launch Real Phone Camera ({activeCase.detectedCameraId})</span>
                        </button>

                        <button
                          onClick={handleToggleWebcam}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Use Device Webcam Now</span>
                        </button>

                        <button
                          onClick={() => setVideoSource('cctv')}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium cursor-pointer"
                        >
                          View CCTV Backup
                        </button>
                      </div>
                    </div>
                  )
                )}

                {videoSource === 'webcam' && (
                  <video
                    ref={webcamVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* 2. DYNAMIC REAL-TIME AI DETECTION & JEV & LAYA RETICLE CANVAS OVERLAY */}
                <canvas 
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                />

                {/* Bottom Source Indicator HUD */}
                <div className="absolute bottom-3 left-3 z-30 bg-slate-900/85 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-white font-mono text-[10px] flex items-center gap-3">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {videoSource === 'phone' ? `PHONE CAM (${connectedPhone?.id || 'NODE-01'})` : videoSource === 'webcam' ? 'LOCAL WEBCAM' : 'CCTV STREAM'}
                  </span>
                  <span className="text-slate-300">Res: 1080p FHD</span>
                  <span className="text-slate-300">30 FPS</span>
                  <span className="text-sky-300 flex items-center gap-1">
                    <Target className="w-3 h-3 text-sky-400" />
                    Target: {currentTargetProfile.name}
                  </span>
                </div>
              </div>

              {/* Sighting Details Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Physical Position: <strong>Near Turnstile Bank 2 (Waiting near Security Kiosk)</strong></span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenPhoneCamera(activeCase.detectedCameraId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open Phone Stream Link</span>
                  </button>

                  <button
                    onClick={() => handleOpenInLiveMonitoring(activeCase.detectedCameraId, activeCase.personName)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-2xs"
                  >
                    <span>View in Full Surveillance Wall →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ===============================================================
                JEV & LAYA AI AUTONOMOUS DECISION-MAKING MATRIX & REASONING PANEL
                =============================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              
              {/* Decision Matrix Header & Threshold Controller */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Jev &amp; Laya AI Autonomous Decision-Making Matrix
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Real-time frame candidate evaluation, upper-torso garment color vectoring, and explainable Re-ID decision logic.
                  </p>
                </div>

                {/* Decision Threshold Controller */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3 text-xs">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3 font-medium">
                      <span className="text-slate-600">Decision Threshold:</span>
                      <strong className="font-mono text-blue-700">{decisionThreshold}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="60" 
                      max="95" 
                      step="1"
                      value={decisionThreshold} 
                      onChange={(e) => setDecisionThreshold(Number(e.target.value))}
                      className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE CANDIDATE INSPECTOR TABLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Active Frame Candidates Evaluated ({activeCandidates.length} tracks):
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Target Profile: {currentTargetProfile.name} ({currentTargetProfile.clothingDescription.split(',')[0]})
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Candidate / Track ID</th>
                        <th className="py-2.5 px-3">Detected Garment Swatch</th>
                        <th className="py-2.5 px-3">Stature Silhouette</th>
                        <th className="py-2.5 px-3">Color Match</th>
                        <th className="py-2.5 px-3">Re-ID Confidence</th>
                        <th className="py-2.5 px-3">Jev &amp; Laya AI Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {activeCandidates.map((cand) => {
                        const isMatch = cand.decision === 'POSITIVE_MATCH';
                        return (
                          <tr 
                            key={cand.id}
                            className={`transition ${isMatch ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50'}`}
                          >
                            <td className="py-2.5 px-3 flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isMatch ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                              <strong className={isMatch ? 'text-emerald-900 font-bold' : 'text-slate-700'}>
                                {cand.id}
                              </strong>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-4 h-4 rounded-md border border-slate-300 shadow-2xs shrink-0" 
                                  style={{ backgroundColor: cand.sampledHex }}
                                />
                                <span className="text-[11px] text-slate-700 font-sans">
                                  {cand.detectedColorName} <span className="text-slate-400 font-mono">({cand.sampledHex})</span>
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-[11px] text-slate-600 font-sans">
                              {cand.statureRatio}:1 ({cand.statureRatio < 2.6 ? 'Child Silhouette' : 'Adult Silhouette'})
                            </td>

                            <td className="py-2.5 px-3 text-[11px]">
                              <span className={cand.colorMatchScore >= 75 ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                                {cand.colorMatchScore}%
                              </span>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full ${isMatch ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                    style={{ width: `${cand.overallConfidence}%` }}
                                  />
                                </div>
                                <span className={`text-[11px] font-bold ${isMatch ? 'text-emerald-700' : 'text-slate-600'}`}>
                                  {cand.overallConfidence}%
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 font-sans">
                              {isMatch ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  POSITIVE MATCH (LOCKED)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                  <X className="w-3 h-3 text-rose-500" />
                                  REJECTED ({cand.rejectionType === 'COLOR_MISMATCH' ? 'Clothing Discrepancy' : 'Low Correlation'})
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REAL-TIME JEV & LAYA AI REASONING TELEMETRY CONSOLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-600" />
                    Jev &amp; Laya AI Live Reasoning &amp; Decision Stream:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTerminalPaused(!isTerminalPaused)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium cursor-pointer"
                    >
                      {isTerminalPaused ? 'Resume Stream' : 'Pause Stream'}
                    </button>
                    <button
                      onClick={() => setTelemetryLogs([])}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] h-36 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
                  {telemetryLogs.map((log) => (
                    <div key={log.id} className="leading-relaxed flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="text-blue-400 shrink-0">#F{log.frameNumber}:</span>
                      <span className={
                        log.type === 'MATCH' ? 'text-emerald-400 font-semibold' :
                        log.type === 'DISPATCH' ? 'text-rose-400 font-semibold' :
                        log.type === 'REJECT' ? 'text-amber-300/90' : 'text-slate-300'
                      }>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* CROSS-CAMERA TRAJECTORY TIMELINE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Cross-Camera Movement Trajectory (Breadcrumb Path)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {activeCase.trajectory.length} Sightings Confirmed
                </span>
              </div>

              {/* Trajectory Steps */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeCase.trajectory.map((point, idx) => {
                  const isLast = idx === activeCase.trajectory.length - 1;
                  return (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isLast 
                          ? 'border-emerald-500 ring-4 ring-emerald-100' 
                          : 'border-blue-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isLast ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                      </div>

                      <div className={`p-3.5 rounded-xl border transition ${
                        isLast 
                          ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs' 
                          : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {point.cameraName} ({point.cameraId})
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.2 rounded bg-white border border-slate-200">
                              {point.zone}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-500">
                            {point.time}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1.5">
                          {point.note}
                        </p>

                        <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">
                            Stage: <strong className="text-slate-700">{point.status}</strong>
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            {point.confidence}% AI Confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: REPORT MISSING PERSON & PHOTO UPLOAD (CLEAN WHITE THEME)
          =================================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 text-slate-900 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Report Missing Child or Person
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jev &amp; Laya AI will analyze the photo and scan all 8 CCTV feeds and live phone nodes.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Pre-fill Buttons */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1.5">
              <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wide block">
                Quick 1-Click Test Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadPreset('child')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  👦 Leo Sharma (8 yrs, Lost Child in Yellow Hoodie)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('elder')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  👴 Arthur Jenkins (74 yrs, Missing Senior in Navy Jacket)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitNewCase} className="space-y-3.5 text-xs">
              
              {/* Photo Upload Zone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Upload Recent Photograph of Missing Person *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-500 transition bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {uploadedImagePreview ? (
                    <div className="flex items-center gap-3">
                      <img 
                        src={uploadedImagePreview} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-2xs"
                      />
                      <div className="text-left">
                        <span className="font-bold text-slate-900 text-xs block">Photograph Loaded</span>
                        <span className="text-[11px] text-emerald-600 font-medium">Ready for Jev &amp; Laya AI biometric indexing</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Click or drag another image to replace</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Drag &amp; drop photo here or click to browse
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Clear face &amp; clothing photos achieve highest cross-camera matching accuracy
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Leo Sharma"
                    value={newCase.personName}
                    onChange={(e) => setNewCase({ ...newCase, personName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    value={newCase.age}
                    onChange={(e) => setNewCase({ ...newCase, age: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Category & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Person Category</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase({ ...newCase, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CHILD">Lost Child (&lt; 12 yrs)</option>
                    <option value="ELDERLY">Vulnerable Senior / Elderly</option>
                    <option value="ADULT">Adult Attendee</option>
                    <option value="MEDICAL">Medical Vulnerability</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency Tier</label>
                  <select
                    value={newCase.urgency}
                    onChange={(e) => setNewCase({ ...newCase, urgency: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CODE AMBER">CODE AMBER (Immediate Lockout)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Standard Priority</option>
                  </select>
                </div>
              </div>

              {/* Clothing Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clothing Colors &amp; Distinct Items (Critical for Re-ID) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bright yellow hoodie, blue denim jeans, navy backpack, dark hair"
                  value={newCase.clothingDescription}
                  onChange={(e) => setNewCase({ ...newCase, clothingDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* Last Seen Zone & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Seen Zone</label>
                  <select
                    value={newCase.lastSeenZone}
                    onChange={(e) => setNewCase({ ...newCase, lastSeenZone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Core Arena Plaza">Core Arena Plaza</option>
                    <option value="Gate A">Gate A (Main Ingress)</option>
                    <option value="Gate B">Gate B (East)</option>
                    <option value="Gate C">Gate C (West)</option>
                    <option value="South Wing">South Food Court</option>
                    <option value="VIP Lounge">VIP Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Seen Time</label>
                  <input
                    type="text"
                    value={newCase.lastSeenTime}
                    onChange={(e) => setNewCase({ ...newCase, lastSeenTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian / Family Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    value={newCase.guardianName}
                    onChange={(e) => setNewCase({ ...newCase, guardianName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98201 44829"
                    value={newCase.guardianPhone}
                    onChange={(e) => setNewCase({ ...newCase, guardianPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Jev &amp; Laya AI Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

