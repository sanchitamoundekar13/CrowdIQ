import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';

export function CrowdIQFooter({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-14 pb-10 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F1F5F9]">
          
          {/* Brand & Mission Statement (4 cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
              </div>
              <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                Security Platform
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-sm">
              Intelligent crowd monitoring and safety intelligence. High-throughput edge computer vision, dynamic spatial heatmaps, and automated tactical team dispatching.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer text-xs font-medium"
                title="Scroll back to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top</span>
              </button>
            </div>
          </div>

          {/* Platform Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('overview')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Overview & Introduction
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Operations Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> CCTV Live Monitoring
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dispatch')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Security Dispatch & Track
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('analytics')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Crowd Flow Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('alerts')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Incident & Alert Registry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="text-[#2563EB] hover:underline font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#2563EB]">›</span> Admin Data & Control Portal
                </button>
              </li>
            </ul>
          </div>

          {/* System Architecture Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Architecture & Tech</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('how-it-works')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> How CrowdIQ Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('technology')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Technical Specifications
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> YOLOv8 Object Detection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> DeepSORT Kinematic Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#94A3B8]">›</span> Spatial Venue Heatmap
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Controls (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Direct Launch</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full text-center px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition shadow-xs cursor-pointer"
              >
                Open Dashboard →
              </button>
              <button
                onClick={() => onNavigate('dispatch')}
                className="w-full text-center px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer"
              >
                Dispatch Squads
              </button>
            </div>
            <div className="pt-2 text-[11px] text-[#94A3B8] leading-tight">
              Metropolitan Arena Surveillance Grid • Active Node
            </div>
          </div>
        </div>

        {/* Center-Aligned Copyright Section */}
        <div className="pt-8 flex flex-col items-center justify-center text-center space-y-2">
          <p className="font-semibold text-[#0F172A] text-sm">
            © 2026 CrowdIQ. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            CrowdIQ — Intelligent Crowd Safety & Security Operations Platform
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold text-[#16A34A] mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
