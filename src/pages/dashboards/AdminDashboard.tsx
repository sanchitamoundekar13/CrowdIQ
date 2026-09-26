import React from 'react';
import { 
  Users, 
  Calendar, 
  AlertOctagon, 
  AlertTriangle, 
  Camera, 
  Activity, 
  ShieldCheck, 
  FileSpreadsheet, 
  Lock, 
  TrendingUp, 
  Server, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    events, 
    cameras, 
    incidents, 
    alerts, 
    users, 
    auditLogs, 
    systemHealth 
  } = usePlatform();

  // Prompt Exact Metric Figures:
  // ACTIVE EVENTS: 06
  // REGISTERED ATTENDEES: 42,381
  // ACTIVE INCIDENTS: 05
  // CRITICAL ALERTS: 02
  // CAMERAS ONLINE: 117 / 120
  // ACTIVE USERS: 84

  const activeEventsCount = 6;
  const registeredAttendees = "42,381";
  const activeIncidentsCount = 5;
  const criticalAlertsCount = 2;
  const camerasOnline = 117;
  const totalCameras = 120;
  const activeUsersCount = 84;

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* 1. Admin System Master Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
                SYSTEM ROOT ADMIN
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                ID: {currentUser.employeeOrOfficerId || 'ADM-ROOT-901'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              CrowdIQ Master Control Console
            </h1>
            <p className="text-xs text-[#64748B]">
              Logged in as {currentUser.fullName} • Global Platform Infrastructure &amp; Security Administration
            </p>
          </div>
        </div>

        {/* Quick Admin Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('admin-users')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => onNavigate('admin-roles')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>RBAC Matrix</span>
          </button>

          <button
            onClick={() => onNavigate('admin-audit')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] text-xs font-bold text-[#1D4ED8] cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* 2. THE 6 CORE PROMPT METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* ACTIVE EVENTS: 06 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Events</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 font-mono">
            {activeEventsCount.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
            All venues nominal
          </span>
        </div>

        {/* REGISTERED ATTENDEES: 42,381 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Registered Attendees</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1 font-mono">
            {registeredAttendees}
          </div>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">
            Digital pass credentials
          </span>
        </div>

        {/* ACTIVE INCIDENTS: 05 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Incidents</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] mt-1 font-mono">
            {activeIncidentsCount.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#EA580C] font-semibold mt-0.5 block">
            01 Response in Progress
          </span>
        </div>

        {/* CRITICAL ALERTS: 02 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Critical Alerts</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#DC2626] mt-1 font-mono">
            {criticalAlertsCount.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#DC2626] font-semibold mt-0.5 block">
            Gate A &amp; Stage front
          </span>
        </div>

        {/* CAMERAS ONLINE: 117 / 120 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Cameras Online</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] mt-1 font-mono">
            {camerasOnline} / {totalCameras}
          </div>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">
            3 in maintenance mode
          </span>
        </div>

        {/* ACTIVE USERS: 84 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Users</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] mt-1 font-mono">
            {activeUsersCount}
          </div>
          <span className="text-[10px] text-[#7C3AED] font-semibold mt-0.5 block">
            Commanders &amp; Officers
          </span>
        </div>
      </div>

      {/* 3. Operational Charts & Trend Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend 1: User Logins & Personnel Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#64748B]">
              Users &amp; Personnel Over Time (24h)
            </h3>
            <span className="text-[11px] font-mono text-[#16A34A] font-bold">+18% shift surge</span>
          </div>

          <div className="h-36 flex items-end justify-between gap-1.5 pt-4">
            {[24, 32, 45, 68, 84, 82, 79, 84].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-[#2563EB] rounded-t-sm hover:bg-[#1D4ED8] transition-all"
                  style={{ height: `${(val / 90) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-[#94A3B8]">
                  {`${(idx * 3).toString().padStart(2, '0')}:00`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex justify-between text-[11px] text-[#64748B]">
            <span>Min: 24 active</span>
            <span>Peak: 84 concurrent officers</span>
          </div>
        </div>

        {/* Trend 2: Alerts & Risk Over Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#64748B]">
              Alerts &amp; Incidents Trend
            </h3>
            <span className="text-[11px] font-mono text-[#EA580C] font-bold">2 Critical Active</span>
          </div>

          <div className="h-36 flex items-end justify-between gap-1.5 pt-4">
            {[3, 4, 8, 12, 19, 14, 11, 7].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className={`w-full rounded-t-sm transition-all ${
                    val > 15 ? 'bg-[#DC2626]' : val > 10 ? 'bg-[#EA580C]' : 'bg-[#CBD5E1]'
                  }`}
                  style={{ height: `${(val / 20) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-[#94A3B8]">
                  {`${(idx * 3).toString().padStart(2, '0')}:00`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex justify-between text-[11px] text-[#64748B]">
            <span>12:00 Ingress surge</span>
            <span>Current: 7 alerts (2 critical)</span>
          </div>
        </div>

        {/* Trend 3: Camera Availability & Edge Health */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#64748B]">
              Camera Network Health
            </h3>
            <span className="text-[11px] font-mono text-[#16A34A] font-bold">97.5% Online</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#475569]">Turnstile Influx PTZ (32 Cams)</span>
                <span className="font-mono font-bold text-[#16A34A]">100% (32/32)</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#475569]">Arena Bowl Central Overhead (44 Cams)</span>
                <span className="font-mono font-bold text-[#16A34A]">100% (44/44)</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#475569]">Perimeter &amp; Auxiliary Stanchions (44 Cams)</span>
                <span className="font-mono font-bold text-[#EA580C]">93.2% (41/44)</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#EA580C] rounded-full" style={{ width: '93.2%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
            All 3 offline nodes flagged for scheduled lens cleaning.
          </div>
        </div>
      </div>

      {/* 4. Split Grid: System Health Matrix + Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Health */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#16A34A]" />
              <h3 className="font-bold text-sm text-[#0F172A]">Core Infrastructure &amp; Engine Health</h3>
            </div>
            <button
              onClick={() => onNavigate('admin-health')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Full Diagnostics
            </button>
          </div>

          <div className="space-y-2.5">
            {systemHealth.map((sh) => (
              <div key={sh.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0F172A]">{sh.serviceName}</span>
                  <div className="flex items-center gap-2 text-[10px] text-[#64748B] mt-0.5">
                    <span>Latency: <strong>{sh.latencyMs}ms</strong></span>
                    <span>•</span>
                    <span>Uptime: <strong>{sh.uptimePercentage}%</strong></span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                  {sh.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#0F172A]">Recent Security &amp; Admin Audit Trail</h3>
            </div>
            <button
              onClick={() => onNavigate('admin-audit')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View All Logs
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0F172A]">{log.action}</span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{log.timestamp}</span>
                </div>
                <p className="text-[#475569] leading-tight">
                  {log.description}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0] text-[10px] text-[#64748B]">
                  <span>User: <strong>{log.user}</strong> ({log.role})</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
