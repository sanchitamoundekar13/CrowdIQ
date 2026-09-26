import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Activity, 
  AlertTriangle, 
  Video, 
  ShieldCheck, 
  TrendingUp, 
  FileSpreadsheet, 
  Download, 
  ArrowUpRight, 
  ChevronRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface OperationsDirectorDashboardProps {
  onNavigate: (route: string) => void;
}

export const OperationsDirectorDashboard: React.FC<OperationsDirectorDashboardProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    events, 
    zones, 
    cameras, 
    incidents, 
    alerts, 
    logAction 
  } = usePlatform();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Compute aggregate operational metrics
  const activeEventsCount = events.filter(e => e.status === 'Live' || e.status === 'Upcoming').length;
  const totalAttendeesRegistered = events.reduce((acc, e) => acc + e.registeredAttendeesCount, 0);
  const onlineCameras = cameras.filter(c => c.status === 'ONLINE').length;
  const totalCameras = cameras.length;
  const activeIncidents = incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;
  const criticalAlerts = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const totalSecurityStaff = 84;

  const currentLiveEvent = events.find(e => e.status === 'Live') || events[0];
  const capacityUtilization = Math.round((currentLiveEvent.registeredAttendeesCount / currentLiveEvent.maxCapacity) * 100);

  const handleExportReport = () => {
    logAction('REPORT_EXPORT', 'REP-OPERATIONS-EXECUTIVE', 'Operations Director downloaded multi-event analytics report (CSV)');
    
    // Simulate real CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Event ID,Event Name,Status,Capacity,Registered Attendees,Utilization Pct,Zones,Cameras\n"
      + events.map(e => `${e.id},"${e.name}",${e.status},${e.maxCapacity},${e.registeredAttendeesCount},${Math.round((e.registeredAttendeesCount/e.maxCapacity)*100)}%,${e.zonesCount},${e.camerasCount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrowdIQ_Operations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* 1. Operations Director Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded border border-[#DDD6FE]">
                EXECUTIVE OPERATIONS DESK
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                EMP ID: {currentUser.employeeOrOfficerId || 'OD-EXEC-09'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              {currentUser.fullName} • {currentUser.designation || 'VP of Venue Operations'}
            </h1>
            <p className="text-xs text-[#64748B]">
              {currentUser.organization || 'Metropolitan Arena Authority'} • Department: Event Security & Facility Logistics
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded CSV!' : 'Export Operations Report'}</span>
          </button>

          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Detailed Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Operations KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Events</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">
            06
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">1 Live, 5 Upcoming</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Total Attendees</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {totalAttendeesRegistered.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#64748B]">Across active season</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Capacity Util</span>
          <div className="text-2xl font-extrabold text-[#EA580C] mt-1">
            {capacityUtilization}%
          </div>
          <span className="text-[10px] text-[#EA580C] font-semibold">Arena Bowl Peak</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Incidents</span>
          <div className="text-2xl font-extrabold text-[#EA580C] mt-1">
            {activeIncidents.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#64748B]">Managed by IC</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Critical Alerts</span>
          <div className="text-2xl font-extrabold text-[#DC2626] mt-1">
            {criticalAlerts.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#DC2626] font-semibold">Turnstile compression</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Cameras Online</span>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1">
            117 / 120
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">97.5% availability</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Security Staff</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {totalSecurityStaff}
          </div>
          <span className="text-[10px] text-[#64748B]">8 Squads deployed</span>
        </div>
      </div>

      {/* 3. Event Performance Table (Multi-Event Portfolio View) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Event Operations Portfolio & Capacity Utilization
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time synchronization across scheduled arenas, stadiums, and festival venues.
            </p>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <span>Manage All Events</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Venue Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Capacity Utilization</th>
                <th className="py-3 px-4">Zones / Cams</th>
                <th className="py-3 px-4">Staff</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {events.map((ev) => {
                const utilPct = Math.round((ev.registeredAttendeesCount / ev.maxCapacity) * 100);
                return (
                  <tr key={ev.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      {ev.name}
                      <span className="block text-[11px] font-normal text-[#64748B] mt-0.5">
                        Organizer: {ev.organizer}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {ev.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ev.status === 'Live' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' :
                        ev.status === 'Upcoming' ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' :
                        'bg-[#F1F5F9] text-[#64748B]'
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="font-bold text-[#0F172A]">{ev.registeredAttendeesCount.toLocaleString()}</span>
                          <span className="text-[#64748B]">{utilPct}%</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              utilPct > 80 ? 'bg-[#EA580C]' : 'bg-[#2563EB]'
                            }`}
                            style={{ width: `${Math.min(utilPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {ev.zonesCount} zones • {ev.camerasCount} cams
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0F172A]">
                      {ev.assignedStaffCount} staff
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('events')}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] font-bold text-xs cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Strategic Visualizations: Crowd Distribution + Staffing & Camera Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Zone Capacity Breakdown */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A]">
              Live Zone Density & Flow Velocity (Metropolitan Arena)
            </h3>
            <span className="text-[11px] font-mono text-[#16A34A] font-semibold">● Real-time YOLOv8 Telemetry</span>
          </div>

          <div className="space-y-3">
            {zones.map((z) => (
              <div key={z.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">{z.name}</span>
                    <span className="text-[10px] font-mono text-[#64748B]">({z.category})</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    z.riskLevel === 'HIGH' ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]' :
                    z.riskLevel === 'MODERATE' ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]' :
                    'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                  }`}>
                    {z.density}% DENSITY • {z.riskLevel}
                  </span>
                </div>

                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      z.density >= 75 ? 'bg-[#EA580C]' : z.density >= 50 ? 'bg-[#CA8A04]' : 'bg-[#16A34A]'
                    }`}
                    style={{ width: `${z.density}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Headcount: <strong>{z.currentCrowd.toLocaleString()} / {z.capacity.toLocaleString()}</strong></span>
                  <span>Flow: <strong>{z.flowDirection}</strong> ({z.inflowRate} in / {z.outflowRate} out)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Staffing & Camera Network Readiness */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A]">
              Operational Readiness & Staff Deployment
            </h3>
            <span className="text-[11px] font-mono text-[#64748B]">8 Squads Assigned</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">CCTV Grid Health</span>
              <div className="text-xl font-extrabold text-[#16A34A]">97.5%</div>
              <p className="text-[11px] text-[#64748B]">117 online, 3 maintenance</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">Avg Egress Latency</span>
              <div className="text-xl font-extrabold text-[#2563EB]">4.2 min</div>
              <p className="text-[11px] text-[#64748B]">Within safety benchmark</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">Radio Dispatch Latency</span>
              <div className="text-xl font-extrabold text-[#16A34A]">8.4 sec</div>
              <p className="text-[11px] text-[#64748B]">Encrypted radio link active</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">Incident Resolution</span>
              <div className="text-xl font-extrabold text-[#2563EB]">94.2%</div>
              <p className="text-[11px] text-[#64748B]">16 resolved today</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D4ED8]">Executive Compliance Verification</span>
              <span className="text-[10px] font-mono text-[#2563EB] font-bold">VERIFIED</span>
            </div>
            <p className="text-[#334155] leading-relaxed">
              All fire evacuation corridors, medical emergency lanes, and turnstile surge release gates comply with international crowd safety standard ISO 22398.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
