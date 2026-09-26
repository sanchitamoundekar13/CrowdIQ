import React, { useState } from 'react';
import { Shield, Activity, Menu, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function CrowdIQNavbar({ activeRoute, onNavigate, onRequestDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'monitoring', label: 'Live Monitoring' },
    { id: 'dispatch', label: 'Security Dispatch & Track' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'admin', label: 'Admin Portal' },
  ];

  const handleItemClick = (id) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: CrowdIQ logo / brand name */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => handleItemClick('overview')}
          title="CrowdIQ — Intelligent Crowd Safety Platform"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
            <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
              Crowd<span className="text-[#2563EB]">IQ</span>
            </span>
          </div>
        </div>

        {/* CENTER: Primary Navigation items with subtle blue active indicator */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-md'
                }`}
              >
                <span>{item.label}</span>
                {/* Subtle blue active-state indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium-screen nav for md breakpoints */}
        <nav className="hidden md:flex lg:hidden items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: ● System Online Status + Quick Action */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>● System Online</span>
          </div>

          {onRequestDemo && (
            <button
              onClick={onRequestDemo}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs transition-colors cursor-pointer"
            >
              Request Demo
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Direct quick jump to Dashboard on mobile header */}
          <button
            onClick={() => handleItemClick('dashboard')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
              activeRoute === 'dashboard'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0F172A]" /> : <Menu className="w-5 h-5 text-[#0F172A]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean, Light, Responsive) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center justify-between cursor-pointer transition ${
                  isActive
                    ? 'text-[#2563EB] bg-[#EFF6FF] font-bold border-l-4 border-[#2563EB]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="text-xs text-[#2563EB] font-mono">Active</span>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              ● System Online
            </span>
            {onRequestDemo && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestDemo();
                }}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Request Demo
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
