import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { Video, Maximize2, Activity, Eye, Shield, Radio, Sparkles } from 'lucide-react';

export const LiveCamerasPage: React.FC = () => {
  const { cameraFeeds, zones, stage } = useSimulation();
  const [selectedCam, setSelectedCam] = useState<string>('cam-02');

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              CCTV Multi-Stream Vision Matrix
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Real-time Edge Vision • YOLOv8 Person Detection & DeepSORT Kinematic Vectors
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#16A34A]" />
            4 Active RTSP Streams
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-semibold">
            DEMO SIMULATION
          </span>
        </div>
      </div>

      {/* 4-Camera CCTV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {cameraFeeds.map((cam) => {
          const zone = zones.find(z => z.id === cam.zoneId);
          const isSelected = selectedCam === cam.id;

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className={`relative rounded-xl border bg-white overflow-hidden shadow-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                  : 'border-[#CBD5E1] hover:border-[#94A3B8]'
              }`}
            >
              {/* Camera Header Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2563EB]">{cam.camNumber}</span>
                  <span className="text-[#CBD5E1]">•</span>
                  <span className="text-[#0F172A] font-semibold">{cam.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B]">{cam.resolution}</span>
                  <RiskBadge level={cam.riskLevel} />
                </div>
              </div>

              {/* Video Simulated Canvas */}
              <div className="relative h-64 bg-[#0F172A] flex items-center justify-center overflow-hidden select-none">
                <img
                  src="./assets/crowd_detection_cctv.jpg"
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.currentTarget.src = '/CrowdIQ/assets/crowd_detection_cctv.jpg';
                  }}
                />

                {/* SVG Bounding Box Overlays */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 360">
                  <g stroke="#2563EB" strokeWidth="2" fill="rgba(37, 99, 235, 0.12)">
                    <rect x="180" y="110" width="38" height="95" rx="2" />
                    <rect x="235" y="130" width="36" height="90" rx="2" />
                    <rect x="290" y="105" width="40" height="100" rx="2" />
                    <rect x="350" y="135" width="38" height="92" rx="2" />
                    <rect x="410" y="120" width="36" height="88" rx="2" />
                  </g>
                  {/* Trajectory dots */}
                  <circle cx="199" cy="157" r="3" fill="#10B981" />
                  <circle cx="253" cy="175" r="3" fill="#10B981" />
                  <circle cx="310" cy="155" r="3" fill="#10B981" />
                </svg>

                {/* HUD Top Left Pill */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded text-white font-mono text-[10px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>REC • {cam.fps} FPS</span>
                </div>

                {/* HUD Bottom Telemetry */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-[#CBD5E1] rounded-lg p-2 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase block">Detections</span>
                      <span className="font-bold text-[#0F172A]">{cam.simulatedDetections}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase block">Density</span>
                      <span className="font-bold text-[#0F172A]">{cam.density}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase block">Flow Rate</span>
                      <span className="font-bold text-[#0F766E]">{cam.flowRate}/min</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#475569] font-semibold">{cam.flowDirection}</span>
                </div>
              </div>

              {/* Feed Diagnostics Footer */}
              <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>Inference: YOLOv8s TensorRT (12ms)</span>
                <span className="text-[#16A34A] font-semibold">Feed Status: Healthy</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
