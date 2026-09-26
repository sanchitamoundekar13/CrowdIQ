import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Play, 
  Camera, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Layers, 
  AlertTriangle 
} from 'lucide-react';

export function CrowdIQHero({ onLaunchDashboard, onViewDemo }) {
  // Live fluctuating telemetry for realistic camera feed HUD
  const [telemetry, setTelemetry] = useState({
    peopleCount: 47,
    densityPct: 72,
    densityPerM2: 5.4,
    flowRate: 112,
    risk: 'MODERATE'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newCount = Math.max(38, Math.min(58, prev.peopleCount + delta));
        const newPct = Math.round((newCount / 65) * 100);
        return {
          peopleCount: newCount,
          densityPct: newPct,
          densityPerM2: +(newCount * 0.115).toFixed(1),
          flowRate: Math.max(90, Math.min(130, prev.flowRate + Math.floor(Math.random() * 7) - 3)),
          risk: newPct > 80 ? 'HIGH' : newPct > 60 ? 'MODERATE' : 'LOW'
        };
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] pt-12 pb-16 lg:pt-16 lg:pb-20" id="overview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Supporting text & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              SURVEILLANCE INTELLIGENCE & SAFETY
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              See Crowd Risks Before They Become Incidents.
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
              CrowdIQ analyzes crowd density, movement and congestion from surveillance feeds to help security teams identify potentially dangerous situations earlier.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#CBD5E1] shadow-sm transition-all duration-150 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
                <span>View System Demo</span>
              </button>
            </div>

            {/* Practical feature badges */}
            <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Edge Video Inference</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Dynamic Bottleneck Prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Automated Squad Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: CCTV Feed Preview & CV Bounding Boxes */}
          <div className="lg:col-span-6">
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] overflow-hidden">
              
              {/* CCTV Feed Top Bar */}
              <div className="bg-[#0F172A] px-4 py-2.5 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping"></span>
                  <span className="font-mono font-semibold tracking-wide">CAM-02 • GATE B CONCOURSE</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
                  <span>1080p @ 30 FPS</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">FEED LIVE</span>
                </div>
              </div>

              {/* Feed Visual Canvas Container with Detected Bounding Boxes */}
              <div className="relative aspect-[16/10] bg-[#1E293B] overflow-hidden">
                <img
                  src="./assets/crowd_detection_cctv.jpg"
                  alt="CrowdIQ CCTV Surveillance Computer Vision"
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                  }}
                />

                {/* SVG Overlay: Real Bounding Boxes, Centroids & Velocity Vectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
                  {/* Bounding Box 1 */}
                  <g>
                    <rect x="230" y="160" width="46" height="110" rx="3" fill="rgba(37, 99, 235, 0.12)" stroke="#2563EB" strokeWidth="2" />
                    <rect x="230" y="142" width="86" height="18" rx="2" fill="#2563EB" />
                    <text x="235" y="155" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">Person 01 [0.94]</text>
                    <circle cx="253" cy="215" r="3" fill="#10B981" />
                    <line x1="253" y1="215" x2="275" y2="215" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" />
                  </g>

                  {/* Bounding Box 2 */}
                  <g>
                    <rect x="310" y="180" width="42" height="105" rx="3" fill="rgba(37, 99, 235, 0.12)" stroke="#2563EB" strokeWidth="2" />
                    <rect x="310" y="162" width="86" height="18" rx="2" fill="#2563EB" />
                    <text x="315" y="175" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">Person 02 [0.91]</text>
                    <circle cx="331" cy="232" r="3" fill="#10B981" />
                    <line x1="331" y1="232" x2="355" y2="230" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" />
                  </g>

                  {/* Bounding Box 3 */}
                  <g>
                    <rect x="385" y="195" width="44" height="112" rx="3" fill="rgba(37, 99, 235, 0.12)" stroke="#2563EB" strokeWidth="2" />
                    <rect x="385" y="177" width="86" height="18" rx="2" fill="#2563EB" />
                    <text x="390" y="190" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">Person 03 [0.89]</text>
                    <circle cx="407" cy="251" r="3" fill="#10B981" />
                    <line x1="407" y1="251" x2="430" y2="248" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" />
                  </g>

                  {/* Additional tracking boxes */}
                  <rect x="160" y="210" width="38" height="95" rx="3" fill="rgba(37, 99, 235, 0.08)" stroke="#60A5FA" strokeWidth="1.5" />
                  <rect x="460" y="200" width="42" height="102" rx="3" fill="rgba(37, 99, 235, 0.08)" stroke="#60A5FA" strokeWidth="1.5" />
                  <rect x="530" y="225" width="40" height="98" rx="3" fill="rgba(37, 99, 235, 0.08)" stroke="#60A5FA" strokeWidth="1.5" />
                  
                  {/* Ingress flow indicator */}
                  <path d="M 180 380 Q 350 360 520 380" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="6,4" />
                </svg>

                {/* Overlaid Live Telemetry HUD Strip */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] rounded-lg p-2.5 shadow-md flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#64748B]">People Count</div>
                      <div className="text-sm font-bold font-mono text-[#0F172A]">{telemetry.peopleCount}</div>
                    </div>
                    <div className="h-6 w-px bg-[#E2E8F0]"></div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#64748B]">Density</div>
                      <div className="text-sm font-bold font-mono text-[#0F172A]">{telemetry.densityPct}% <span className="text-[10px] font-normal text-[#64748B]">({telemetry.densityPerM2}/m²)</span></div>
                    </div>
                    <div className="h-6 w-px bg-[#E2E8F0]"></div>
                    <div className="hidden sm:block">
                      <div className="text-[10px] uppercase font-bold text-[#64748B]">Vector Flow</div>
                      <div className="text-xs font-semibold text-[#0F766E]">East → Concourse</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] hidden sm:inline">Risk:</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono uppercase ${
                      telemetry.risk === 'HIGH' 
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' 
                        : telemetry.risk === 'MODERATE'
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                    }`}>
                      {telemetry.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feed Bottom Status & Diagnostic Info */}
              <div className="bg-[#F8FAFC] px-4 py-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  YOLOv8 Person Detection + DeepSORT Multi-Object Tracking Active
                </span>
                <span className="font-mono text-[#475569]">Inference: 26ms</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
