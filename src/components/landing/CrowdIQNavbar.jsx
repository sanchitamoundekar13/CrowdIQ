import React, { useState } from 'react';
import { Shield, Activity, Menu, X, ArrowRight } from 'lucide-react';

export function CrowdIQNavbar({ onLaunchDashboard, onRequestDemo, activeSection, onNavigateSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'live-monitoring', label: 'Live Dashboard' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'venue-intelligence', label: 'Venue Intel' },
    { id: 'technology', label: 'Technology' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleNavClick('overview')}
        >
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Shield className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">Crowd<span className="text-[#2563EB]">IQ</span></span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">Security Ops</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] bg-[#EFF6FF]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Live Status & Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
          </div>

          <button
            onClick={onRequestDemo}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Request Demo
          </button>

          <button
            onClick={onLaunchDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
            title="Launch CrowdIQ Live Security Dashboard"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Dashboard</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onLaunchDashboard}
            className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              SYSTEM ONLINE
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              className="text-xs font-semibold text-[#2563EB] flex items-center gap-1"
            >
              Open Full Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
