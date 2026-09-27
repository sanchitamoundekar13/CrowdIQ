import React from 'react';
import { Shield } from 'lucide-react';

export function CrowdIQFooter({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-12 pb-8 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F1F5F9]">
          
          {/* Brand & Subtitle (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
              </div>
              <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-[#334155]">
              Intelligent Crowd Safety & Risk Prevention
            </p>
            <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
              Real-time computer vision telemetry, crowd movement analysis, and predictive incident mitigation for venues and public spaces.
            </p>
          </div>

          {/* Platform Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('monitoring')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Live Monitor
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('analytics')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('alerts')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <a 
                  href="mailto:safety@crowdiq.io" 
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('reports')}
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Documentation
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 text-center sm:text-left">
          <p className="text-xs text-[#94A3B8]">
            © 2026 CrowdIQ. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
