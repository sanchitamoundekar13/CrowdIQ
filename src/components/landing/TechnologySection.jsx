import React from 'react';
import { 
  Code2, 
  Cpu, 
  Database, 
  Layers, 
  Network, 
  Scan, 
  GitFork, 
  ShieldCheck, 
  Terminal,
  Activity
} from 'lucide-react';

export function TechnologySection() {
  const techStack = [
    {
      name: 'YOLO',
      category: 'Inference',
      role: 'Real-time object/person detection',
      description: 'Single-stage convolutional neural network optimized for low-latency person detection in dense multi-camera feeds.'
    },
    {
      name: 'DeepSORT',
      category: 'Tracking',
      role: 'Multi-object tracking across frames',
      description: 'Combines Kalman filtering with deep visual appearance embeddings to persist individual track IDs through occlusions.'
    },
    {
      name: 'OpenCV',
      category: 'Vision Core',
      role: 'Surveillance stream preprocessing',
      description: 'Handles frame ingestion, geometric perspective transforms, spatial cropping, and optical flow vector computation.'
    },
    {
      name: 'Python',
      category: 'Backend',
      role: 'Pipeline orchestration & risk modeling',
      description: 'Asynchronous event loop executing CV pipelines, spatial calculations, and security rule engines.'
    },
    {
      name: 'Redis',
      category: 'State Store',
      role: 'Fast real-time state/data handling',
      description: 'In-memory pub/sub message broker managing sub-millisecond telemetry cache between camera nodes.'
    },
    {
      name: 'WebSocket',
      category: 'Networking',
      role: 'Real-time dashboard updates',
      description: 'Bidirectional streaming protocol dispatching live crowd densities, bounding boxes, and alert frames to client consoles.'
    },
    {
      name: 'Computer Vision',
      category: 'Spatial Math',
      role: 'Density and bottleneck detection',
      description: 'Converts 2D pixel coordinates into real-world square meter density ratios and bottleneck flow rates.'
    },
    {
      name: 'Risk Engine',
      category: 'Decision Logic',
      role: 'Predictive surge classification',
      description: 'Deterministic multi-factor hazard scoring factoring inflow/outflow delta, density slope, and venue capacity.'
    }
  ];

  return (
    <section className="bg-[#F7F9FC] py-16 lg:py-20 border-b border-[#E2E8F0]" id="technology">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-3">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Production-Grade Computer Vision Technologies
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Built with hardened open-source computer vision libraries, low-latency telemetry streaming, and reliable state engines.
          </p>
        </div>

        {/* 8 Technical Stack Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {techStack.map((tech) => (
            <div 
              key={tech.name}
              className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">{tech.name}</span>
                  <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    {tech.category}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#0F766E] mb-2">{tech.role}</div>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                <span>Production Ready</span>
                <span className="text-[#16A34A] font-semibold">● Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Benchmark Specs Strip */}
        <div className="mt-10 bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold font-mono text-[#0F172A]">&lt; 30 ms</div>
            <div className="text-xs text-[#64748B] mt-0.5">Average Inference Latency</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-[#0F172A]">30 FPS</div>
            <div className="text-xs text-[#64748B] mt-0.5">High-Framerate Stream Analysis</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-[#0F172A]">0 PII</div>
            <div className="text-xs text-[#64748B] mt-0.5">Privacy-First (No Face ID Stored)</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-[#0F172A]">100% Light</div>
            <div className="text-xs text-[#64748B] mt-0.5">Clean Control-Room Ergonomics</div>
          </div>
        </div>

      </div>
    </section>
  );
}
