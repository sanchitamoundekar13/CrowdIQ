import React, { useState } from 'react';
import { 
  Eye, 
  Scan, 
  Layers, 
  Sliders, 
  Crosshair, 
  Activity, 
  Radio, 
  Cpu, 
  CheckCircle,
  TrendingUp,
  Maximize2
} from 'lucide-react';

export function ComputerVisionSection() {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showCentroids, setShowCentroids] = useState(true);
  const [showFlowVectors, setShowFlowVectors] = useState(true);

  return (
    <section className="bg-white py-16 lg:py-20 border-b border-[#E2E8F0]" id="computer-vision">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-3">
            <span>SURVEILLANCE FRAME INFERENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How CrowdIQ Interprets Surveillance Footage
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Surveillance frames are converted into bounding box coordinates, pedestrian tracking vectors, and spatial density heat values in real time.
          </p>
        </div>

        {/* Main 2-Column CV Inspection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: CCTV Frame with Person 01, Person 02, Person 03 (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-xl border border-[#CBD5E1] shadow-md overflow-hidden">
            
            {/* Camera Header Overlay */}
            <div className="bg-[#1E293B] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-mono font-bold tracking-wider">CCTV_FEED_02 :: GATE_B_INSPECTION</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
                <span>TIME: 13:42:18</span>
                <span className="text-emerald-400 font-semibold">CONF: 0.93</span>
              </div>
            </div>

            {/* Video Frame Canvas with Live Annotations */}
            <div className="relative aspect-[16/10] bg-[#0A0E17] overflow-hidden select-none">
              <img
                src="./assets/crowd_detection_cctv.jpg"
                alt="Computer Vision Pedestrian Detection"
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                }}
              />

              {/* Bounding Box SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
                {/* Person 01 */}
                {showBoundingBoxes && (
                  <g>
                    <rect x="210" y="140" width="55" height="130" rx="3" fill="rgba(37, 99, 235, 0.15)" stroke="#2563EB" strokeWidth="2.5" />
                    <rect x="210" y="118" width="95" height="22" rx="3" fill="#2563EB" />
                    <text x="216" y="133" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 01</text>
                    {showCentroids && <circle cx="237" cy="205" r="4" fill="#10B981" />}
                    {showFlowVectors && (
                      <g>
                        <line x1="237" y1="205" x2="270" y2="205" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
                        <polygon points="274,205 268,201 268,209" fill="#10B981" />
                      </g>
                    )}
                  </g>
                )}

                {/* Person 02 */}
                {showBoundingBoxes && (
                  <g>
                    <rect x="315" y="165" width="50" height="120" rx="3" fill="rgba(37, 99, 235, 0.15)" stroke="#2563EB" strokeWidth="2.5" />
                    <rect x="315" y="143" width="95" height="22" rx="3" fill="#2563EB" />
                    <text x="321" y="158" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 02</text>
                    {showCentroids && <circle cx="340" cy="225" r="4" fill="#10B981" />}
                    {showFlowVectors && (
                      <g>
                        <line x1="340" y1="225" x2="375" y2="223" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
                        <polygon points="379,223 373,219 373,227" fill="#10B981" />
                      </g>
                    )}
                  </g>
                )}

                {/* Person 03 */}
                {showBoundingBoxes && (
                  <g>
                    <rect x="410" y="180" width="54" height="135" rx="3" fill="rgba(37, 99, 235, 0.15)" stroke="#2563EB" strokeWidth="2.5" />
                    <rect x="410" y="158" width="95" height="22" rx="3" fill="#2563EB" />
                    <text x="416" y="173" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 03</text>
                    {showCentroids && <circle cx="437" cy="247" r="4" fill="#10B981" />}
                    {showFlowVectors && (
                      <g>
                        <line x1="437" y1="247" x2="472" y2="245" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
                        <polygon points="476,245 470,241 470,249" fill="#10B981" />
                      </g>
                    )}
                  </g>
                )}

                {/* Background tracked persons */}
                {showBoundingBoxes && (
                  <>
                    <rect x="140" y="210" width="45" height="110" rx="3" fill="rgba(96, 165, 250, 0.1)" stroke="#60A5FA" strokeWidth="1.5" />
                    <rect x="510" y="190" width="48" height="115" rx="3" fill="rgba(96, 165, 250, 0.1)" stroke="#60A5FA" strokeWidth="1.5" />
                    <rect x="580" y="215" width="46" height="112" rx="3" fill="rgba(96, 165, 250, 0.1)" stroke="#60A5FA" strokeWidth="1.5" />
                  </>
                )}

                {/* Perspective optical flow grid line */}
                <path d="M 120 420 C 300 400, 500 400, 700 420" fill="none" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" strokeDasharray="4,4" />
              </svg>

              {/* Bottom Telemetry HUD */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm border border-slate-700 rounded px-2.5 py-1 text-[11px] font-mono text-emerald-400">
                FLOW VECTOR: EAST → WEST (+1.32 m/s)
              </div>
            </div>

            {/* Frame Controls Toggles */}
            <div className="bg-[#1E293B] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Annotation Filters:</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBoundingBoxes}
                    onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                    className="rounded text-[#2563EB]"
                  />
                  <span>Bounding Boxes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCentroids}
                    onChange={(e) => setShowCentroids(e.target.checked)}
                    className="rounded text-[#2563EB]"
                  />
                  <span>Centroids</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFlowVectors}
                    onChange={(e) => setShowFlowVectors(e.target.checked)}
                    className="rounded text-[#2563EB]"
                  />
                  <span>Vectors</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Explicit Required CV Telemetry Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#0F172A]">Current Frame Telemetry</h3>
                <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                  SYNCHRONIZED
                </span>
              </div>

              {/* Explicit Required Metrics */}
              <div className="space-y-3">
                
                {/* Metric 1: People Detected: 47 */}
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569] uppercase">People Detected:</span>
                  <span className="text-lg font-extrabold font-mono text-[#0F172A]">47</span>
                </div>

                {/* Metric 2: Average Density: 5.4/m² */}
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569] uppercase">Average Density:</span>
                  <span className="text-lg font-extrabold font-mono text-[#0F172A]">5.4 / m²</span>
                </div>

                {/* Metric 3: Movement Direction: East → West */}
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569] uppercase">Movement Direction:</span>
                  <span className="text-sm font-bold font-mono text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded border border-[#CCFBF1]">
                    East → West
                  </span>
                </div>

                {/* Metric 4: Current Risk: MODERATE */}
                <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#92400E] uppercase">Current Risk:</span>
                  <span className="text-sm font-extrabold font-mono text-[#D97706] bg-white px-2.5 py-0.5 rounded border border-[#FDE68A]">
                    MODERATE
                  </span>
                </div>

              </div>

              {/* Technical Pipeline Specs */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs text-[#64748B]">
                <div className="flex items-center justify-between">
                  <span>Tracking Pipeline:</span>
                  <span className="font-mono text-[#0F172A] font-semibold">DeepSORT Kalman Filter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Inference Frame Rate:</span>
                  <span className="font-mono text-[#16A34A] font-semibold">35.7 FPS (28ms)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>False-Positive Rejection:</span>
                  <span className="font-mono text-[#0F172A] font-semibold">Non-Maximum Suppression (0.45)</span>
                </div>
              </div>

            </div>

            {/* Note on Authenticity */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Real-time bounding box coordinates and centroid velocities map directly into the risk classification engine.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
