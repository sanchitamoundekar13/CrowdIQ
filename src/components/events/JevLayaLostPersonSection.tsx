import React, { useState, useEffect, useRef } from 'react';
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
  FileText
} from 'lucide-react';
import { 
  LostPersonCase, 
  jevLayaAiService, 
  INITIAL_LOST_PERSON_CASES 
} from '../../services/jevLayaAiService';
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

  // Video player ref
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  useEffect(() => {
    const unsub = jevLayaAiService.subscribe((list) => {
      setCases(list);
      if (list.length > 0 && !list.find(c => c.id === selectedCaseId)) {
        setSelectedCaseId(list[0].id);
      }
    });
    return () => unsub();
  }, [selectedCaseId]);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0] || INITIAL_LOST_PERSON_CASES[0];

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImagePreview(result);
        setNewCase(prev => ({ ...prev, photoUrl: result }));
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
      setToastMessage('🎯 Jev & Laya AI Match Confirmed: Target spotted at CAM-02 Gate 2 Turnstiles!');
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
  const handleSubmitNewCase = (e: React.FormEvent) => {
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
                Jev &amp; Laya AI Engine
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Lost Child &amp; Person Re-ID Locator
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload a recent photo of a lost child or family member. Jev &amp; Laya AI extracts biometrics, clothing histograms, and body silhouettes to track their movement across all 8 CCTV streams and pinpoint their exact live location.
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
              onClick={() => handleRunAiSearch()}
              disabled={isScanning}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isScanning 
                  ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isScanning ? 'Scanning Feeds...' : 'Re-Run AI Scan'}</span>
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
                  {/* Corner marks */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                  
                  {/* AI Facial Keypoint Dots */}
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

          {/* RIGHT 8 COLS: LAST FOOTAGE SPOTTED & CROSS-CAMERA TRAJECTORY */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* LAST SEEN CCTV FOOTAGE PLAYER */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Header */}
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
                    {activeCase.detectedLocation} • Timestamp: {activeCase.detectedTimestamp}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    Match Confidence: {activeCase.matchConfidence}%
                  </span>

                  {/* Button to Link with Live Monitoring */}
                  <button
                    onClick={() => handleOpenInLiveMonitoring(activeCase.detectedCameraId, activeCase.personName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                    title="Open live continuous camera stream in surveillance matrix"
                  >
                    <span>Track in Live Monitoring</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real Video Stream Viewport with Bounding Box Overlay */}
              <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={activeCase.detectedVideoUrl}
                  className="w-full h-full object-cover"
                />

                {/* Simulated Target Detection Bounding Box on Footage */}
                <div 
                  className="absolute pointer-events-none border-2 border-emerald-400 bg-emerald-500/15 rounded-sm animate-pulse transition-all duration-300"
                  style={{
                    top: `${activeCase.boundingCoordinates.top}%`,
                    left: `${activeCase.boundingCoordinates.left}%`,
                    width: `${activeCase.boundingCoordinates.width}%`,
                    height: `${activeCase.boundingCoordinates.height}%`,
                  }}
                >
                  {/* High Contrast Corner Brackets */}
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

                  {/* Identification Tag Above Box */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-400 flex items-center gap-1.5 whitespace-nowrap shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    🎯 MATCH: {activeCase.personName} ({activeCase.matchConfidence}%)
                  </div>
                </div>

                {/* HUD Overlay Bottom */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-white font-mono text-[10px] flex items-center gap-3">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    JEV &amp; LAYA RE-ID ACTIVE
                  </span>
                  <span className="text-slate-300">Feed: {activeCase.detectedCameraId} (1080p FHD)</span>
                  <span className="text-slate-300">30 FPS</span>
                </div>
              </div>

              {/* Sighting Details Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Physical Position: <strong>Near Turnstile Bank 2 (Waiting near Security Kiosk)</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenInLiveMonitoring(activeCase.detectedCameraId, activeCase.personName)}
                    className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View in Full Surveillance Wall →
                  </button>
                </div>
              </div>
            </div>

            {/* CROSS-CAMERA TRAJECTORY TIMELINE ("WHERE WAS HE, AND WHERE IS HE NOW?") */}
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
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isLast 
                          ? 'border-emerald-500 ring-4 ring-emerald-100' 
                          : 'border-blue-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isLast ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                      </div>

                      {/* Content Card */}
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
                    Jev &amp; Laya AI will analyze the photo and scan all 8 CCTV feeds.
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
