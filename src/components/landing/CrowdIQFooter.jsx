import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';

export function CrowdIQFooter({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-12 pb-8 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#F1F5F9]">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
              </div>
              <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Intelligent crowd monitoring and safety intelligence for safer, more informed event management.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Live Monitoring
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dispatch')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Security Dispatch & Track
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('analytics')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('alerts')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('how-it-works')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('technology')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Technology
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('overview')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Technology Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Technology</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Computer Vision
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Crowd Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('alerts')}
                  className="text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Risk Engine
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Exact Copyright Text + Scroll to top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#64748B]">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-[#0F172A]">
              © 2026 CrowdIQ. All rights reserved.
            </p>
            <p className="text-[11px] text-[#64748B]">
              CrowdIQ — Intelligent Crowd Safety Platform | Hackathon 2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold text-[#16A34A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
