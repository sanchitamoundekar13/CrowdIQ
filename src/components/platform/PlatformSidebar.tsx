import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Calendar, 
  Layers, 
  Camera, 
  AlertTriangle, 
  AlertOctagon, 
  BarChart3, 
  FileText, 
  Lock, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Activity, 
  Settings, 
  QrCode, 
  Info, 
  X,
  Compass
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
  const { userRole, activeAlertsCount, activeIncidentsCount } = usePlatform();

  const handleNavClick = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  // Staff primary navigation
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitor', icon: Video },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'zones', label: 'Zones', icon: Layers },
    { id: 'cameras', label: 'Cameras', icon: Camera },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertTriangle, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-[#DC2626] text-white'
    },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      icon: AlertOctagon, 
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-[#EA580C] text-white'
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // Administration section (visible only to ADMIN)
  const adminNavItems = [
    { id: 'admin-console', label: 'Admin Console', icon: Lock },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'admin-audit', label: 'Audit Logs', icon: FileSpreadsheet },
    { id: 'admin-health', label: 'System Health', icon: Activity },
    { id: 'admin-settings', label: 'Platform Settings', icon: Settings },
  ];

  // Attendee simplified navigation (Strictly NO CCTV or internal security telemetry!)
  const attendeeNavItems = [
    { id: 'dashboard', label: 'My Events & Passes', icon: QrCode },
    { id: 'events', label: 'Upcoming Events', icon: Calendar },
    { id: 'event-safety', label: 'Event Safety & Advice', icon: Info },
    { id: 'profile', label: 'Attendee Profile', icon: Users },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white border-r border-[#E2E8F0] select-none text-[#0F172A]">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        
        {/* EVENT ATTENDEE NAVIGATION */}
        {userRole === 'EVENT_ATTENDEE' ? (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Attendee Portal
              </span>
              <span className="text-[9px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.2 rounded border border-[#BBF7D0]">
                PUBLIC PASS
              </span>
            </div>
            <nav className="space-y-1">
              {attendeeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-2xs'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* STAFF PRIMARY NAVIGATION */
          <>
            <div>
              <div className="px-3 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                  Platform Navigation
                </span>
              </div>
              <nav className="space-y-1">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-2xs'
                          : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
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

            {/* SEPARATED ADMINISTRATION SECTION (VISIBLE ONLY TO ADMIN) */}
            {userRole === 'ADMIN' && (
              <div className="pt-3 border-t border-[#F1F5F9]">
                <div className="px-3 mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DC2626]">
                    Administration
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.2 rounded border border-[#FCA5A5]">
                    ROOT ONLY
                  </span>
                </div>
                <nav className="space-y-1">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] shadow-2xs font-bold'
                            : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#DC2626]' : 'text-[#64748B]'}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER BADGE: Current Version & Engine Status */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
            <span className="text-[#0F172A] font-bold">CrowdIQ Core</span>
          </span>
          <span className="text-[10px] text-[#94A3B8]">v2.6.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
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
