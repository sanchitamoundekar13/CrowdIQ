import React from 'react';
import { Cpu, Check, Activity, Radar, Eye, ShieldCheck, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AIAnalysisModules: React.FC = () => {
  const { stage } = useSimulation();

  const modules = [
    { name: 'Person Detection (YOLOv8s)', status: 'Active', latency: '14ms', icon: Eye },
    { name: 'Person Tracking (DeepSORT)', status: 'Active', latency: '8ms', icon: Activity },
    { name: 'Density Analysis (Spatial Grid)', status: 'Active', latency: '6ms', icon: Radar },
    { name: 'Movement Vector Analysis', status: 'Active', latency: '11ms', icon: Activity },
    { name: 'Bottleneck Detection Engine', status: 'Active', latency: '12ms', icon: ShieldCheck },
    { name: 'Dynamic Risk Assessment', status: 'Active', latency: '5ms', icon: Zap },
    { name: 'Congestion Prediction Engine', status: 'Active', latency: '18ms', icon: Cpu },
  ];

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              CrowdIQ Computer Vision Inference Pipeline
            </span>
            <p className="text-[11px] text-[#64748B] font-mono">
              Real-time pipeline diagnostics • 7 Subsystems Active
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-semibold flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-ping" />
          INFERENCE ENGINE 60 FPS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 my-3.5">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between hover:border-[#CBD5E1] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-white border border-[#CBD5E1] text-[#2563EB]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold text-[#0F172A] block truncate max-w-[150px]">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    Latency: {m.latency}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-semibold">
                ACTIVE
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
        <span>Hardware Acceleration: ONNX Runtime / TensorRT Edge Node</span>
        <span className="text-[#16A34A] font-semibold">Zero Pipeline Stalls</span>
      </div>
    </div>
  );
};
