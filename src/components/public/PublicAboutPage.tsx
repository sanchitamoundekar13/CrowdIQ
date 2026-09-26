import React from 'react';
import { Shield, Target, Users2, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface PublicAboutPageProps {
  onLaunchPlatform: () => void;
}

export const PublicAboutPage: React.FC<PublicAboutPageProps> = ({ onLaunchPlatform }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#0F172A]">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
          Mission & Vision
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
          About CrowdIQ Platform
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl leading-relaxed">
          CrowdIQ was engineered to transform passive surveillance infrastructure into proactive crowd safety intelligence. We combine edge computer vision, physical hydrodynamic crowd modeling, and structured incident response workflows to prevent stampedes before they start.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">
            Zero-Stampede Imperative
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Every crowd crush incident in history had identifiable leading indicators: localized deceleration, opposing vectors, and density threshold breaches. Our mission is detecting these precursors early.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">
            Action Over Dashboards
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Data alone cannot save lives. CrowdIQ pairs computer vision metrics directly with real-time field communication, security team positioning, and attendee digital pass advisories.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">
            Privacy by Design
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            CrowdIQ processes anonymous headcount numbers, velocities, and bounding boxes. We never store personal biometrics, facial recognition profiles, or sensitive attendee surveillance data.
          </p>
        </div>
      </div>

      {/* Engineering Standards */}
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">
          Engineering & Reliability Standards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
            <span className="text-xl font-mono font-extrabold text-[#2563EB]">99.98%</span>
            <div className="text-xs font-bold text-[#0F172A] mt-1">Uptime SLA</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">High availability failover</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
            <span className="text-xl font-mono font-extrabold text-[#16A34A]">&lt; 35ms</span>
            <div className="text-xs font-bold text-[#0F172A] mt-1">Inference Latency</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">YOLOv8 edge model</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
            <span className="text-xl font-mono font-extrabold text-[#2563EB]">120+</span>
            <div className="text-xs font-bold text-[#0F172A] mt-1">Camera Stream Capacity</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">RTSP hardware acceleration</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
            <span className="text-xl font-mono font-extrabold text-[#16A34A]">RBAC</span>
            <div className="text-xs font-bold text-[#0F172A] mt-1">5-Role Security Matrix</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Enforced at DB level</div>
          </div>
        </div>
      </div>
    </div>
  );
};
