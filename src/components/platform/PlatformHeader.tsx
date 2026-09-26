import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Lock, 
  Radio, 
  UserCheck, 
  ArrowUpRight,
  Menu
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { UserRole } from '../../types/platform';
import { ROLES_CONFIG } from '../../services/dbClient';

interface PlatformHeaderProps {
  onNavigate: (route: string) => void;
  onOpenNotifications: () => void;
  onToggleMobileSidebar: () => void;
  onGoToPublicSite: () => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  onNavigate,
  onOpenNotifications,
  onToggleMobileSidebar,
  onGoToPublicSite
}) => {
  const { 
    currentUser, 
    userRole, 
    switchRole, 
    logout, 
    events, 
    selectedEventId, 
    setSelectedEventId, 
    unreadNotificationsCount 
  } = usePlatform();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleSwitcherOpen(false);
    onNavigate('dashboard');
  };

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[#0F172A]">
      {/* LEFT: Mobile Toggle + Logo + Event Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Sidebar Hamburger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none group"
          title="Direct link to Dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#1D4ED8] transition-colors">
            <Shield className="w-4 h-4" strokeWidth={2.4} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-[#0F172A]">
              Crowd<span className="text-[#2563EB]">IQ</span>
            </span>
          </div>
        </div>

        {/* Current Event Selector Context (Only for staff roles, or simple tag for attendee) */}
        {userRole !== 'EVENT_ATTENDEE' && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E2E8F0]">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-xs font-semibold text-[#0F172A] bg-transparent border-0 focus:outline-none cursor-pointer hover:text-[#2563EB] transition-colors pr-2 py-1 max-w-[200px] xl:max-w-[260px] truncate"
              title="Change active event operational context"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CENTER: Quick Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search zones, cameras, incidents..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] transition-all text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
      </div>

      {/* RIGHT: Status Indicator + Role Switcher Pill + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* System Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] font-semibold text-[#16A34A]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>● System Operational</span>
        </div>

        {/* ROLE SWITCHER DROPDOWN (Essential for instant evaluation & interview demonstrations) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#CBD5E1] hover:border-[#2563EB] bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] transition-all cursor-pointer"
            title="Switch RBAC Persona for instant review"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase text-[#64748B]">ROLE:</span>
            <span className="font-bold text-xs text-[#2563EB] max-w-[100px] truncate">
              {ROLES_CONFIG[userRole]?.badge || userRole}
            </span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E2E8F0] shadow-xl py-2 z-50 text-[#0F172A] animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-[#F1F5F9]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                  Switch Active RBAC Experience
                </p>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  Select any persona to test its customized dashboard & permissions.
                </p>
              </div>

              <div className="py-1">
                {(['ADMIN', 'INCIDENT_COMMANDER', 'SECURITY_OFFICER', 'OPERATIONS_DIRECTOR', 'EVENT_ATTENDEE'] as UserRole[]).map((r) => {
                  const cfg = ROLES_CONFIG[r];
                  const isCurrent = userRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                        isCurrent ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#0F172A]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 bg-[#2563EB]" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{cfg.name}</span>
                          {isCurrent && <span className="text-[10px] text-[#2563EB] font-mono">(Active)</span>}
                        </div>
                        <p className="text-[10px] text-[#64748B] leading-tight line-clamp-1">
                          {cfg.badge} • {cfg.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          title="Notification Center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* USER PROFILE DROPDOWN MENU */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg border border-[#CBD5E1] hover:border-[#2563EB] bg-white transition-colors cursor-pointer"
            title="User Account Menu"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.fullName}
              className="w-6 h-6 rounded-full object-cover border border-[#CBD5E1]"
            />
            <span className="hidden md:inline text-xs font-semibold text-[#0F172A] max-w-[110px] truncate">
              {currentUser.fullName.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-[#E2E8F0] shadow-xl py-2 z-50 text-[#0F172A] animate-fadeIn">
              {/* Profile Card Header */}
              <div className="px-4 py-2 border-b border-[#F1F5F9]">
                <p className="text-xs font-bold text-[#0F172A] truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {currentUser.email}
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  {ROLES_CONFIG[userRole]?.badge}
                </span>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <button
                  onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => { onOpenNotifications(); setProfileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Notifications</span>
                </button>

                {/* Visible only for Admins */}
                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => { onNavigate('admin-console'); setProfileMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-[#2563EB] bg-[#EFF6FF]/60 hover:bg-[#EFF6FF] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Admin Console</span>
                  </button>
                )}

                <div className="my-1 border-t border-[#F1F5F9]" />

                <button
                  onClick={() => { onGoToPublicSite(); setProfileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Exit to Public Website</span>
                </button>

                <button
                  onClick={() => { logout(); onGoToPublicSite(); setProfileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
