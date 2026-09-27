import React, { useState } from 'react';
import { Shield, Menu, X, User, Lock, Bell, Terminal } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function CrowdIQNavbar({ activeRoute, onNavigate, onOpenProfile, onOpenDatabase }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isBackendConnected, backendLatency, backendInfo, openDatabaseModal } = useSimulation();

  // Primary nav items per spec
  const navItems = [
    { id: 'dashboard',  label: 'Dashboard'    },
    { id: 'monitoring', label: 'Live Monitor'  },
    { id: 'events',     label: 'Events'        },
    { id: 'zones',      label: 'Zones'         },
    { id: 'cameras',    label: 'Cameras'       },
    { id: 'alerts',     label: 'Alerts'        },
    { id: 'analytics',  label: 'Analytics'     },
    { id: 'incidents',  label: 'Incidents'     },
  ];

  const handleItemClick = (id) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

        {/* Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          onClick={() => handleItemClick('home')}
        >
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
            <Shield className="w-4 h-4" strokeWidth={2.4} />
          </div>
          <span className="font-extrabold text-[18px] tracking-tight text-[#0F172A] leading-none">
            Crowd<span className="text-[#2563EB]">IQ</span>
          </span>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-5 bg-[#E2E8F0] shrink-0" />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-3 py-1.5 text-[13px] font-medium transition-all duration-150 rounded-md cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#2563EB] font-bold bg-[#EFF6FF]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium-screen Nav */}
        <nav className="hidden md:flex lg:hidden items-center gap-0 flex-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-2.5 py-1.5 text-[12px] font-medium transition-colors cursor-pointer shrink-0 rounded-md ${
                  isActive ? 'text-[#2563EB] font-bold' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
                {isActive && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#2563EB] rounded-full" />}
              </button>
            );
          })}
        </nav>

        {/* Spacer on lg+ (already handled by flex-1 on nav) */}
        <div className="hidden lg:block" />

        {/* RIGHT: System status + Admin Console + Profile */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {/* 🟢 System / FastAPI Status Indicator */}
          {isBackendConnected ? (
            <button
              onClick={onOpenDatabase || openDatabaseModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-bold text-[#1D4ED8] hover:bg-[#DBEAFE] transition cursor-pointer select-none"
              title={`Python FastAPI Backend Online (Uptime: ${backendInfo?.uptime_seconds || 0}s, Latency: ${backendLatency}ms) - PyTorch AI Active`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              FastAPI Online {backendLatency ? `(${backendLatency}ms)` : ''}
            </button>
          ) : (
            <button
              onClick={onOpenDatabase || openDatabaseModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold text-[#16A34A] hover:bg-[#DCFCE7] transition cursor-pointer select-none"
              title="Running Local Client-Side Engine"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Local Engine
            </button>
          )}

          {/* Alerts badge */}
          <button
            onClick={() => handleItemClick('alerts')}
            className="relative p-1.5 rounded-lg text-[#475569] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition cursor-pointer"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#DC2626] border border-white" />
          </button>

          {/* 🔐 Admin Console */}
          <button
            onClick={() => handleItemClick('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition cursor-pointer ${
              activeRoute === 'admin'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Admin Console
          </button>

          {/* Profile */}
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#0F172A] shadow-2xs transition cursor-pointer active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            Profile
          </button>
        </div>

        {/* Mobile: profile + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#E2E8F0] bg-white text-[12px] font-semibold text-[#0F172A] cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-0.5 shadow-md">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center justify-between cursor-pointer transition ${
                  isActive
                    ? 'text-[#2563EB] bg-[#EFF6FF] font-bold border-l-4 border-[#2563EB]'
                    : 'text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.label}
                {isActive && <span className="text-[10px] text-[#2563EB] font-mono">Active</span>}
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#E2E8F0] mt-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />System Online
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleItemClick('admin')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#475569] border border-[#E2E8F0] px-2 py-1 rounded cursor-pointer hover:bg-[#F8FAFC]">
                <Lock className="w-3 h-3" />Admin
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline">
                Profile →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
