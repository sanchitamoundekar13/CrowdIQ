import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Map, 
  AlertOctagon, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  ShieldAlert,
  Radio,
  Layers,
  Shield
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SidebarProps {
  currentPage: string;
  onSelectPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const { activeAlertsCount, stage, emergencyMode } = useSimulation();

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live-cameras', label: 'Live Cameras', icon: Video },
    { id: 'venue-map', label: 'Venue Map', icon: Map },
    { 
      id: 'alerts', 
      label: 'Alerts & Incidents', 
      icon: AlertOctagon, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-[#DC2626] text-white'
    },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security-teams', label: 'Security Teams', icon: ShieldCheck },
    { id: 'settings', label: 'Event Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen sticky top-0 select-none z-30 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              emergencyMode 
                ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626] animate-pulse' 
                : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
            }`}>
              <Shield className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-[#0F172A]">
                  Crowd<span className="text-[#2563EB]">IQ</span>
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#475569] font-bold">OPS</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
                </span>
                <span className="text-[10px] font-mono text-[#16A34A] tracking-wider uppercase font-bold">
                  ONLINE
                </span>
                {stage !== 'NORMAL' && stage !== 'SAFE' && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] uppercase font-bold">
                    {stage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-[#F1F5F9] text-[#475569]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Section */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold mb-2 flex items-center gap-1.5">
          <Radio className="h-3 w-3 text-[#2563EB]" />
          System Health
        </div>
        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
              Vision Engine
            </span>
            <span className="text-[#16A34A] font-semibold">Online</span>
          </div>
          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
              CCTV Grid
            </span>
            <span className="text-[#16A34A] font-semibold">4 / 4 Live</span>
          </div>
          <div className="flex items-center justify-between text-[#475569]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
              Risk Pipeline
            </span>
            <span className="text-[#16A34A] font-semibold">Nominal</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
