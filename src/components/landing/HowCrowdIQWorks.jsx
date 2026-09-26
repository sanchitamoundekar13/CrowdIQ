import React from 'react';
import { 
  Camera, 
  Scan, 
  GitFork, 
  BarChart2, 
  Cpu, 
  BellRing, 
  ArrowRight, 
  ArrowDown, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

export function HowCrowdIQWorks() {
  const steps = [
    {
      num: '01',
      title: 'CCTV Feed',
      subtitle: 'Video Ingestion',
      icon: Camera,
      tech: 'RTSP / IP Video',
      description: 'Captures multi-angle surveillance video streams from entrance turnstiles, concourses, and arena perimeters.'
    },
    {
      num: '02',
      title: 'YOLO',
      subtitle: 'Object Detection',
      icon: Scan,
      tech: 'YOLOv8 Edge Model',
      description: 'Detects people and objects in surveillance frames with sub-30ms inference times.'
    },
    {
      num: '03',
      title: 'DeepSORT',
      subtitle: 'Multi-Object Tracking',
      icon: GitFork,
      tech: 'Kalman Filter + Re-ID',
      description: 'Tracks detected individuals across consecutive frames, preserving trajectory and velocity vectors.'
    },
    {
      num: '04',
      title: 'Crowd Analysis',
      subtitle: 'Spatial Analytics',
      icon: BarChart2,
      tech: 'Density / Optical Flow',
      description: 'Measures density, movement and crowd flow across defined venue boundary coordinates.'
    },
    {
      num: '05',
      title: 'Risk Engine',
      subtitle: 'Hazard Modeling',
      icon: Cpu,
      tech: 'Predictive Classifier',
      description: 'Evaluates congestion and assigns a risk level (Low, Medium, High, Critical) before stampede thresholds are reached.'
    },
    {
      num: '06',
      title: 'Alert & Dashboard',
      subtitle: 'Operational Dispatch',
      icon: BellRing,
      tech: 'WebSocket Realtime',
      description: 'Surfaces incidents for security teams with automated turnstile gating and squad deployment advice.'
    }
  ];

  return (
    <section className="bg-[#F7F9FC] py-16 lg:py-20 border-b border-[#E2E8F0]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-3">
            <span>ENGINEERING PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            From Camera Feed to Actionable Alert
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            CrowdIQ runs an end-to-end edge computer vision and spatial inference architecture engineered for real-time security operations.
          </p>
        </div>

        {/* Technical Architecture Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.title}
                className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      STAGE {step.num}
                    </span>
                    <span className="font-mono text-[11px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {step.tech}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">{step.title}</h3>
                  <div className="text-xs font-semibold text-[#0F766E] mb-2">{step.subtitle}</div>
                  
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                  <span>Latency: &lt; 28ms</span>
                  {index < steps.length - 1 ? (
                    <span className="text-[#2563EB] font-bold flex items-center gap-1">
                      Next Step <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-[#16A34A] font-bold">Closed Loop</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dataflow Spec Banner */}
        <div className="mt-10 bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#0F172A]">Deterministic Fallback & Privacy-Safe Ingestion</div>
              <div className="text-[#64748B]">All processing runs on spatial centroids without storing facial identities or PII.</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Throughput: 120 FPS Aggregated</span>
            <span>•</span>
            <span>Edge Hardware: TensorRT / ONNX</span>
          </div>
        </div>

      </div>
    </section>
  );
}
