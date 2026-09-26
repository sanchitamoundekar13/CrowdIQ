import React from 'react';
import { Shield, ArrowUp, Activity } from 'lucide-react';

export function CrowdIQFooter({ onNavigateSection, onLaunchDashboard }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-12 pb-8 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#F1F5F9]">
          
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] max-w-sm">
              Intelligent crowd safety and spatial risk prevention platform. Edge computer vision for venue security operations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button 
              onClick={() => onNavigateSection('overview')}
              className="text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button 
              onClick={() => onNavigateSection('live-monitoring')}
              className="text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Live Monitoring
            </button>
            <button 
              onClick={() => onNavigateSection('how-it-works')}
              className="text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => onNavigateSection('computer-vision')}
              className="text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Computer Vision
            </button>
            <button 
              onClick={() => onNavigateSection('technology')}
              className="text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Technology
            </button>
            <button 
              onClick={onLaunchDashboard}
              className="text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              Live Dashboard →
            </button>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Hackathon Authenticity Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]">
          <p>
            Hackathon Engineering Prototype • Demonstrating edge computer vision crowd safety telemetry. Simulated video and telemetry values are labeled accordingly.
          </p>
          <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>All System Services Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
