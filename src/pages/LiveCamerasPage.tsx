import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Video, 
  Activity, 
  Radio, 
  Eye, 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  ArrowRight,
  Camera,
  Grid,
  Square,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles
} from 'lucide-react';

export const LiveCamerasPage: React.FC = () => {
  const { cameraFeeds, zones, totalPeople, addToast, playAlertSound } = useSimulation();

  const [selectedCamId, setSelectedCamId] = useState<string>(cameraFeeds[1]?.id || cameraFeeds[0]?.id || 'cam-02');
  const [viewLayout, setViewLayout] = useState<'focus' | 'quad'>('focus'); // 'focus' | 'quad'
  
  // Interactive Overlays Toggles
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showFlowVectors, setShowFlowVectors] = useState<boolean>(true);
  const [showThermalOverlay, setShowThermalOverlay] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  const activeCam = cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0];

  const onlineFeedsCount = cameraFeeds.filter(c => c.status === 'ONLINE').length;

  const handleCaptureSnapshot = () => {
    playAlertSound('success');
    addToast('success', 'CCTV Snapshot Captured', `High-resolution frame saved from ${activeCam?.camNumber} (${activeCam?.name}).`);
  };

  const handlePTZ = (direction: 'up' | 'down' | 'left' | 'right' | 'reset') => {
    if (direction === 'up') setPanOffset(prev => ({ ...prev, y: Math.max(-25, prev.y - 8) }));
    if (direction === 'down') setPanOffset(prev => ({ ...prev, y: Math.min(25, prev.y + 8) }));
    if (direction === 'left') setPanOffset(prev => ({ ...prev, x: Math.max(-25, prev.x - 8) }));
    if (direction === 'right') setPanOffset(prev => ({ ...prev, x: Math.min(25, prev.x + 8) }));
    if (direction === 'reset') {
      setPanOffset({ x: 0, y: 0 });
      setZoomLevel(1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Video className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Live Monitoring & Edge Computer Vision Matrix
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time CCTV Feeds with YOLOv8 Person Detection, DeepSORT Tracking, and Optical Flow Analysis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#16A34A] animate-pulse" />
            <span>{onlineFeedsCount} / {cameraFeeds.length} Streams Online</span>
          </span>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-lg border border-[#CBD5E1] bg-white p-0.5">
            <button
              onClick={() => setViewLayout('focus')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewLayout === 'focus' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Focus View</span>
            </button>
            <button
              onClick={() => setViewLayout('quad')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewLayout === 'quad' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Quad Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: FOCUS VIEW (Featured Stream + Interactive HUD + Side Roster) */}
      {viewLayout === 'focus' && (
        <div className="space-y-6">
          
          {/* Main Video Viewport & Controls */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm overflow-hidden">
            {/* Camera Metadata Strip */}
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-bold text-xs">
                  {activeCam?.camNumber}
                </span>
                <span className="font-bold text-[#0F172A] text-sm">{activeCam?.name}</span>
                <span className="text-[#94A3B8]">|</span>
                <span className="text-[#475569]">Res: {activeCam?.resolution}</span>
                <span className="text-[#94A3B8]">|</span>
                <span className="text-[#475569]">{activeCam?.fps} FPS</span>
              </div>

              {/* Live Overlay Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                    showBoundingBoxes ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]' : 'bg-white border-[#CBD5E1] text-[#94A3B8]'
                  }`}
                >
                  YOLO Boxes: {showBoundingBoxes ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setShowFlowVectors(!showFlowVectors)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                    showFlowVectors ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]' : 'bg-white border-[#CBD5E1] text-[#94A3B8]'
                  }`}
                >
                  Flow Vectors: {showFlowVectors ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setShowThermalOverlay(!showThermalOverlay)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                    showThermalOverlay ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]' : 'bg-white border-[#CBD5E1] text-[#94A3B8]'
                  }`}
                >
                  Thermal Heatmap: {showThermalOverlay ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={handleCaptureSnapshot}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Snapshot</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Primary Video Feed Player (8 Cols) */}
              <div className="lg:col-span-8 bg-[#0F172A] relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden select-none">
                {/* Background CCTV Video Stream Thumbnail */}
                <img 
                  src="./assets/crowd_detection_cctv.jpg" 
                  alt="Live CCTV Camera Feed" 
                  className={`w-full h-full object-cover transition-transform duration-300 ${showThermalOverlay ? 'hue-rotate-90 saturate-200' : 'opacity-85'}`}
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                  }}
                />

                {/* Simulated AI Overlays (YOLO Bounding Boxes & DeepSORT Velocity Vectors) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
                  <defs>
                    <marker id="cam-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                    </marker>
                    <marker id="cam-arrow-warn" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
                    </marker>
                  </defs>

                  {showBoundingBoxes && (
                    <>
                      {/* Person 01 */}
                      <g>
                        <rect x="210" y="140" width="58" height="135" rx="3" stroke="#2563EB" strokeWidth="2.5" fill="rgba(37, 99, 235, 0.15)" />
                        <rect x="210" y="118" width="85" height="20" rx="3" fill="#2563EB" />
                        <text x="215" y="132" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 01</text>
                        {showFlowVectors && (
                          <>
                            <line x1="239" y1="205" x2="285" y2="205" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#cam-arrow)" />
                            <circle cx="239" cy="205" r="3.5" fill="#10B981" />
                          </>
                        )}
                      </g>

                      {/* Person 02 (Surging) */}
                      <g>
                        <rect x="360" y="125" width="62" height="145" rx="3" stroke="#DC2626" strokeWidth="2.5" fill="rgba(220, 38, 38, 0.2)" />
                        <rect x="360" y="103" width="105" height="20" rx="3" fill="#DC2626" />
                        <text x="365" y="117" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Surge #02 [94%]</text>
                        {showFlowVectors && (
                          <>
                            <line x1="391" y1="195" x2="445" y2="235" stroke="#F59E0B" strokeWidth="2.5" markerEnd="url(#cam-arrow-warn)" />
                            <circle cx="391" cy="195" r="4" fill="#F59E0B" />
                          </>
                        )}
                      </g>

                      {/* Person 03 */}
                      <g>
                        <rect x="520" y="150" width="56" height="130" rx="3" stroke="#2563EB" strokeWidth="2.5" fill="rgba(37, 99, 235, 0.15)" />
                        <rect x="520" y="128" width="85" height="20" rx="3" fill="#2563EB" />
                        <text x="525" y="142" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 03</text>
                        {showFlowVectors && (
                          <>
                            <line x1="548" y1="215" x2="590" y2="215" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#cam-arrow)" />
                            <circle cx="548" cy="215" r="3.5" fill="#10B981" />
                          </>
                        )}
                      </g>
                    </>
                  )}
                </svg>

                {/* Top Overlay HUD Stamp */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/75 backdrop-blur-xs text-white font-mono text-xs px-2.5 py-1 rounded-md border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold">LIVE TELEMETRY STREAM</span>
                  <span className="text-gray-400">|</span>
                  <span>{activeCam?.camNumber}</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white font-mono text-[11px] px-2.5 py-1 rounded-md border border-white/10">
                  Latency: <strong>12ms</strong>
                </div>

                {/* Bottom Left Stream Watermark */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white font-mono text-[11px] px-3 py-1.5 rounded-lg border border-white/10">
                  Sector: <strong>{activeCam?.zoneId}</strong> • Optical Flow: <strong>{activeCam?.flowDirection}</strong>
                </div>

                {/* PTZ Motorized Overlay Controls */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs p-1.5 rounded-xl border border-white/15 flex items-center gap-1.5">
                  <button 
                    onClick={() => handlePTZ('left')}
                    className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                    title="Pan Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handlePTZ('up')}
                      className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                      title="Tilt Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handlePTZ('down')}
                      className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                      title="Tilt Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handlePTZ('right')}
                    className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                    title="Pan Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-6 bg-white/20 mx-1"></div>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(2.5, +(prev + 0.25).toFixed(2)))}
                    className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(1, +(prev - 0.25).toFixed(2)))}
                    className="p-1 rounded text-white hover:bg-white/20 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handlePTZ('reset')}
                    className="px-1.5 py-0.5 rounded text-[10px] text-white/80 hover:bg-white/20 transition font-mono cursor-pointer"
                    title="Reset PTZ"
                  >
                    1x
                  </button>
                </div>
              </div>

              {/* Side Telemetry & Camera Feeds List (4 Cols) */}
              <div className="lg:col-span-4 p-5 space-y-4 bg-white border-t lg:border-t-0 lg:border-l border-[#E2E8F0] font-mono text-xs">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] pb-2 border-b border-[#F1F5F9]">
                    Camera Telemetry Matrix
                  </h3>
                  
                  <div className="space-y-2.5 pt-3">
                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Real-time Density:</span>
                      <strong className="text-base text-[#0F172A]">{activeCam?.density}%</strong>
                    </div>

                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Pedestrians Tracked:</span>
                      <strong className="text-base text-[#2563EB]">{activeCam?.simulatedDetections} persons</strong>
                    </div>

                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Flow Velocity:</span>
                      <strong className="text-[#0F172A]">{activeCam?.flowRate} ppl/min</strong>
                    </div>

                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Camera Status:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                        {activeCam?.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Assigned Sector:</span>
                      <strong className="text-[#0F172A]">{activeCam?.zoneId}</strong>
                    </div>
                  </div>
                </div>

                {/* All Cameras Selector Grid */}
                <div className="pt-2 border-t border-[#F1F5F9]">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-2">
                    Switch Active Feed ({cameraFeeds.length})
                  </span>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {cameraFeeds.map((cam) => {
                      const isSel = selectedCamId === cam.id;
                      return (
                        <div
                          key={cam.id}
                          onClick={() => setSelectedCamId(cam.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                            isSel 
                              ? 'border-[#2563EB] bg-[#EFF6FF]' 
                              : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px] text-[#0F172A]">{cam.camNumber}</span>
                              <span className="text-[11px] text-[#64748B] truncate max-w-[120px]">{cam.name}</span>
                            </div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">
                              Ppl: <strong>{cam.simulatedDetections}</strong> • {cam.density}%
                            </div>
                          </div>

                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            cam.status === 'ONLINE' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                          }`}>
                            {cam.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW MODE 2: QUAD MATRIX (Simultaneous Multi-stream Wall) */}
      {viewLayout === 'quad' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameraFeeds.map((cam) => (
            <div 
              key={cam.id}
              className="bg-white rounded-xl border border-[#CBD5E1] shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#2563EB] text-white font-bold text-[10px]">
                    {cam.camNumber}
                  </span>
                  <span className="font-bold text-[#0F172A]">{cam.name}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                  cam.status === 'ONLINE' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                }`}>
                  {cam.status}
                </span>
              </div>

              {/* Video Thumbnail with live HUD */}
              <div className="relative aspect-[16/9] bg-[#0F172A] overflow-hidden">
                <img 
                  src="./assets/crowd_detection_cctv.jpg" 
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                  }}
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                  Ppl: <strong>{cam.simulatedDetections}</strong> • Density: <strong>{cam.density}%</strong>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-2.5 bg-white flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B] text-[11px]">Res: {cam.resolution}</span>
                <button
                  onClick={() => {
                    setSelectedCamId(cam.id);
                    setViewLayout('focus');
                  }}
                  className="text-[#2563EB] hover:underline font-semibold text-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Expand Feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
