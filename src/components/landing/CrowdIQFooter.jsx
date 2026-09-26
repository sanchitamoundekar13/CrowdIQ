import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';

export function CrowdIQFooter({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-10 pb-8 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#F1F5F9]">
          
          {/* Brand & Mission Statement (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
              </div>
              <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                Security Operations
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-sm font-mono">
              Real-time crowd intelligence, venue capacity management, optical turnstile tracking, and tactical security coordination.
            </p>
            <div className="pt-1">
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

          {/* Platform Navigation (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform Modules</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Dashboard
              </button>
              <button 
                onClick={() => onNavigate('monitoring')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Live Monitor
              </button>
              <button 
                onClick={() => onNavigate('events')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Events
              </button>
              <button 
                onClick={() => onNavigate('zones')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Zones
              </button>
              <button 
                onClick={() => onNavigate('analytics')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Analytics
              </button>
              <button 
                onClick={() => onNavigate('alerts')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Alerts
              </button>
              <button 
                onClick={() => onNavigate('incidents')}
                className="text-left text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer py-1"
              >
                › Incidents
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className="text-left text-[#2563EB] font-bold hover:underline transition-colors cursor-pointer py-1"
              >
                🔒 Admin Portal
              </button>
            </div>
          </div>

          {/* Fast Status (3 cols) */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Grid Telemetry</h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-[#16A34A] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Online
                </span>
                <span>TLS 1.3</span>
              </div>
              <p className="text-slate-500">
                Venue Node: Metropolitan Arena Concourse 4
              </p>
            </div>
          </div>
        </div>

        {/* Center-Aligned Copyright Section */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-semibold text-[#0F172A] text-xs">
            © 2026 CrowdIQ. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B] font-mono">
            CrowdIQ — Intelligent Crowd Safety & Operations Platform
          </p>
        </div>

      </div>
    </footer>
  );
}
