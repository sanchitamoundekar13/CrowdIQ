import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function ProblemSolutionSection({ onLaunchDashboard }) {
  return (
    <section className="bg-white py-16 lg:py-20 border-b border-[#E2E8F0]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-3">
            <span>OPERATIONAL CHALLENGE & SYSTEM SOLUTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Designed for Modern Event & Venue Security
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            A direct comparison between manual camera monitoring and continuous spatial computer vision.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Problem Card */}
          <div className="bg-[#FFF5F5] rounded-xl border border-[#FED7D7] p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#C53030]">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-extrabold text-sm uppercase tracking-wide">The Problem</span>
              </div>

              <h3 className="text-lg lg:text-xl font-bold text-[#742A2A] mb-3">
                Manual Visual Surveillance Leaves Dangerous Blindspots
              </h3>

              <p className="text-sm lg:text-base text-[#742A2A] leading-relaxed">
                "Security teams often monitor multiple CCTV feeds manually, making it difficult to identify dangerous crowd buildup early."
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-[#9B2C2C]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></span>
                  <span>Human attention span decays across multi-screen video walls</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></span>
                  <span>Surge bottlenecks are typically identified only after physical crushes begin</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]"></span>
                  <span>No automated calculations of density thresholds or inflow rates</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FEB2B2] text-xs font-mono text-[#9B2C2C]">
              Outcome: Reactive incident response with minimal intervention lead time.
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#16A34A]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-extrabold text-sm uppercase tracking-wide">The Solution</span>
              </div>

              <h3 className="text-lg lg:text-xl font-bold text-[#14532D] mb-3">
                Autonomous Computer Vision Telemetry & Early Warning
              </h3>

              <p className="text-sm lg:text-base text-[#14532D] leading-relaxed">
                "CrowdIQ converts surveillance feeds into crowd density, movement, congestion and risk information that security teams can act on."
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-[#15803D]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  <span>Continuous 30 FPS inference across all perimeter and gate feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  <span>Predictive 4-minute warning alerts before crowd densities reach hazardous levels</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  <span>Integrated decision recommendations for turnstile gating and squad deployment</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#86EFAC] flex items-center justify-between">
              <span className="text-xs font-mono text-[#15803D]">
                Outcome: Proactive early prevention of crowd safety hazards.
              </span>
              <button
                onClick={onLaunchDashboard}
                className="text-xs font-bold text-[#15803D] hover:text-[#14532D] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Live View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
