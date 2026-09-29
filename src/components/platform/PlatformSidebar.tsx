import React, { useState } from 'react';
import { 
  Home,
  Sparkles,
  Compass,
  Cpu,
  Binary,
  Info,
  Mail,
  LayoutDashboard, 
  Video, 
  Map,
  TrendingUp,
  Radio,
  Calendar, 
  Layers, 
  Camera, 
  AlertTriangle, 
  AlertOctagon, 
  BarChart3, 
  FileText, 
  Bell,
  User,
  Lock, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  FileSpreadsheet, 
  Activity, 
  Settings, 
  QrCode, 
  Search,
  X
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface PlatformSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  currentRoute,
  onNavigate,
  mobileOpen,
  onCloseMobile
}) => {
  const { 
    userRole, 
    activeAlertsCount, 
    activeIncidentsCount, 
    unreadNotificationsCount 
  } = usePlatform();

  const [filterQuery, setFilterQuery] = useState('');

  const handleNavClick = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  // Group 1: Public Discovery & Architecture
  const discoveryNavItems = [
    { id: 'overview', label: 'Overview / Home', icon: Home, matchRoutes: ['overview', 'home'] },
    { id: 'features', label: 'Platform Features', icon: Sparkles },
    { id: 'use-cases', label: 'Use Cases & Venues', icon: Compass },
    { id: 'how-it-works', label: 'How It Works (CV Pipeline)', icon: Cpu },
    { id: 'technology', label: 'Technology Stack', icon: Binary },
    { id: 'about', label: 'About CrowdIQ', icon: Info },
    { id: 'contact', label: 'Contact & Inquiries', icon: Mail },
  ];

  // Group 2: Live Operations & Intelligence
  const operationsNavItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Optical Feeds (CCTV)', icon: Video },
    { id: 'spatial', label: 'Spatial Blueprint', icon: Map },
    { id: 'predictions', label: 'Predictive Forecasting', icon: TrendingUp },
    { id: 'dispatch', label: 'Tactical Security Dispatch', icon: Radio },
  ];

  // Group 3: Event Management & Telemetry Fleet
  const telemetryNavItems = [
    { id: 'events', label: 'Events Catalog', icon: Calendar },
    { id: 'zones', label: 'Venue Sectors / Zones', icon: Layers },
    { id: 'cameras', label: 'Optical Camera Fleet', icon: Camera },
    { 
      id: 'alerts', 
      label: 'Alerts Triage', 
      icon: AlertTriangle, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-[#DC2626] text-white'
    },
    { 
      id: 'incidents', 
      label: 'Incidents Command', 
      icon: AlertOctagon, 
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-[#EA580C] text-white'
    },
    { id: 'analytics', label: 'Density Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Safety Reports & Exports', icon: FileText },
  ];

  // Group 4: Administration & Root Clearance (Visible to ADMIN)
  const adminNavItems = [
    { 
      id: 'master-admin', 
      label: 'Master Admin Root', 
      icon: ShieldAlert, 
      badge: 'ROOT',
      badgeColor: 'bg-[#DC2626] text-white' 
    },
    { id: 'admin-console', label: 'Admin Console', icon: Lock },
    { id: 'admin-users', label: 'User Directory', icon: Users },
    { id: 'admin-roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'admin-audit', label: 'Security Audit Logs', icon: FileSpreadsheet },
    { id: 'admin-health', label: 'System Health Telemetry', icon: Activity },
    { id: 'admin-settings', label: 'Platform Settings', icon: Settings },
  ];

  // Group 5: Profile & Personal
  const accountNavItems = [
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-[#2563EB] text-white'
    },
    { id: 'profile', label: 'User Profile & Badge', icon: User },
    { id: 'event-safety', label: 'Digital Safety Pass', icon: QrCode },
  ];

  // Filter items if user typed in search box
  const filterList = (items: Array<any>) => {
    if (!filterQuery.trim()) return items;
    const q = filterQuery.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  };

  const isItemActive = (item: any) => {
    if (item.matchRoutes) {
      return item.matchRoutes.includes(currentRoute);
    }
    return currentRoute === item.id;
  };

  const renderNavGroup = (title: string, badgeText: string | null, badgeStyle: string, items: Array<any>) => {
    const filtered = filterList(items);
    if (filtered.length === 0) return null;

    return (
      <div className="space-y-1">
        <div className="px-3 mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
            {title}
          </span>
          {badgeText && (
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badgeStyle}`}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-2xs font-bold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${item.badgeColor || 'bg-[#F1F5F9] text-[#475569]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white border-r border-[#E2E8F0] select-none text-[#0F172A]">
      
      {/* Search Filter Header */}
      <div className="p-3 border-b border-[#F1F5F9]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search all features..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium placeholder-[#94A3B8] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Nav Items Scroll Container */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        
        {/* GROUP 1: Discovery & Architecture */}
        {renderNavGroup(
          'Discovery & Architecture',
          'PUBLIC',
          'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
          discoveryNavItems
        )}

        {/* GROUP 2: Operations & Live Surveillance */}
        {userRole !== 'EVENT_ATTENDEE' && renderNavGroup(
          'Live Operations & Intel',
          'LIVE',
          'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]',
          operationsNavItems
        )}

        {/* GROUP 3: Event Management & Telemetry Fleet */}
        {userRole !== 'EVENT_ATTENDEE' && renderNavGroup(
          'Venue & Fleet Management',
          null,
          '',
          telemetryNavItems
        )}

        {/* GROUP 4: Administration & Root Clearance */}
        {userRole === 'ADMIN' && renderNavGroup(
          'Administration',
          'ROOT',
          'text-[#DC2626] bg-[#FEF2F2] border-[#FCA5A5]',
          adminNavItems
        )}

        {/* GROUP 5: Account & Passes */}
        {renderNavGroup(
          userRole === 'EVENT_ATTENDEE' ? 'Attendee Safety & Pass' : 'Personal & Alerts',
          null,
          '',
          accountNavItems
        )}
      </div>

      {/* FOOTER BADGE: Core telemetry & clearance */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[#0F172A] font-bold">CrowdIQ Core</span>
          </span>
          <span className="text-[10px] text-[#94A3B8]">v2.6.0 Live</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Side Layout) */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[85vw] h-full shadow-2xl z-10">
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={onCloseMobile}
                className="p-1 rounded-md bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
