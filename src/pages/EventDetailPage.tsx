import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Layers, 
  Camera, 
  AlertTriangle, 
  AlertOctagon, 
  BarChart3, 
  FileText, 
  ArrowLeft, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

interface EventDetailPageProps {
  eventId: string;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId, onBack, onNavigate }) => {
  const { 
    events, 
    zones, 
    cameras, 
    alerts, 
    incidents, 
    registrations, 
    userRole,
    registerForEvent 
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Crowd' | 'Zones' | 'Cameras' | 'Alerts' | 'Incidents' | 'Staff' | 'Registrations' | 'Analytics' | 'Reports'
  >('Overview');

  const event = events.find(e => e.id === eventId) || events[0];
  const eventZones = zones.filter(z => z.eventId === event.id);
  const eventCameras = cameras.filter(c => c.eventId === event.id);
  const eventAlerts = alerts.filter(a => a.eventId === event.id);
  const eventIncidents = incidents.filter(i => i.eventId === event.id);
  const eventRegistrations = registrations.filter(r => r.eventId === event.id);

  const tabs: Array<'Overview' | 'Crowd' | 'Zones' | 'Cameras' | 'Alerts' | 'Incidents' | 'Staff' | 'Registrations' | 'Analytics' | 'Reports'> = [
    'Overview',
    'Crowd',
    'Zones',
    'Cameras',
    'Alerts',
    'Incidents',
    'Staff',
    'Registrations',
    'Analytics',
    'Reports'
  ];

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Back Button & Event Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#475569] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Events</span>
        </button>
        <span className="text-xs text-[#94A3B8]">/</span>
        <span className="text-xs font-mono font-bold text-[#2563EB]">{event.id}</span>
      </div>

      {/* Main Event Header Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              event.status === 'Live' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
            }`}>
              ● {event.status.toUpperCase()}
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              Public Advisory: {event.publicStatus}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              {event.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              {event.startDate.split('T')[0]} to {event.endDate.split('T')[0]}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#2563EB]" />
              Organizer: <strong>{event.organizer}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#CBD5E1] text-right font-mono">
            <span className="text-[10px] uppercase text-[#64748B] block">Registered / Max Capacity</span>
            <span className="text-base font-extrabold text-[#0F172A]">
              {event.registeredAttendeesCount.toLocaleString()} / {event.maxCapacity.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Overview, Crowd, Zones, Cameras, Alerts, Incidents, Staff, Registrations, Analytics, Reports) */}
      <div className="border-b border-[#E2E8F0] flex overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#2563EB] text-[#2563EB] bg-white'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F172A]">Operational Profile &amp; Venue Blueprint</h2>
            <p className="text-xs text-[#475569] leading-relaxed">
              {event.description}
            </p>
            
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
              <span className="text-xs font-bold text-[#1D4ED8]">Current Public Safety Announcement</span>
              <p className="text-xs text-[#334155]">
                {event.publicSafetyAnnouncement || 'Normal flow operations in effect across all turnstile sectors.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block">Assigned Zones</span>
                <span className="text-base font-extrabold text-[#0F172A]">{eventZones.length}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block">Active CCTV Nodes</span>
                <span className="text-base font-extrabold text-[#16A34A]">{eventCameras.length}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block">Active Alerts</span>
                <span className="text-base font-extrabold text-[#DC2626]">{eventAlerts.length}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block">Logged Incidents</span>
                <span className="text-base font-extrabold text-[#EA580C]">{eventIncidents.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F172A]">Recommended Gate Ingress</h2>
            <div className="space-y-2 text-xs">
              {event.recommendedGates?.map((gate, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-semibold text-[#0F172A]">{gate}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('zones')}
              className="w-full py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF]"
            >
              Configure Venue Zones
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. CROWD & TELEMETRY */}
      {activeTab === 'Crowd' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Live Crowd Telemetry &amp; Headcount</h2>
              <p className="text-xs text-[#64748B]">Real-time optical headcount and density estimation per square meter.</p>
            </div>
            <button
              onClick={() => onNavigate('monitoring')}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold"
            >
              Open Live Monitor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventZones.map((z) => (
              <div key={z.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F172A]">{z.name}</span>
                  <span className="text-[10px] font-mono font-bold text-[#EA580C]">{z.density}% DENSITY</span>
                </div>
                <div className="text-xl font-extrabold text-[#0F172A]">
                  {z.currentCrowd.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">/ {z.capacity.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Flow: {z.flowDirection} • Risk: {z.riskLevel}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. ZONES */}
      {activeTab === 'Zones' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">Event Sectors &amp; Zones ({eventZones.length})</h2>
            <button onClick={() => onNavigate('zones')} className="text-xs font-bold text-[#2563EB] hover:underline">
              Manage Zones
            </button>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {eventZones.map((z) => (
              <div key={z.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0F172A]">{z.name}</span>
                  <span className="text-[11px] text-[#64748B] block">{z.location}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span>{z.currentCrowd} people</span>
                  <span className="font-bold text-[#2563EB]">{z.density}%</span>
                  <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold">{z.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. CAMERAS */}
      {activeTab === 'Cameras' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">Assigned CCTV Nodes ({eventCameras.length})</h2>
            <button onClick={() => onNavigate('cameras')} className="text-xs font-bold text-[#2563EB] hover:underline">
              Manage Cameras
            </button>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {eventCameras.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-[#0F172A]">{c.cameraCode}</span> — {c.name}
                  <span className="text-[11px] text-[#64748B] block">{c.location} ({c.zoneName})</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#16A34A] font-bold">{c.fps} FPS</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. ALERTS & 6. INCIDENTS */}
      {(activeTab === 'Alerts' || activeTab === 'Incidents') && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs text-xs space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A]">
            {activeTab} Logged for {event.name}
          </h2>
          <p className="text-[#64748B]">
            All incidents and alerts are synchronized across the Incident Commander terminal and field security squad radios.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate(activeTab.toLowerCase())}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white font-bold"
            >
              Open Dedicated {activeTab} Console
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. STAFF */}
      {activeTab === 'Staff' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs text-xs space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A]">Assigned Operations &amp; Security Personnel</h2>
          <p className="text-[#64748B]">84 Field security officers, 8 squad dispatch leaders, and 1 Incident Commander assigned.</p>
        </div>
      )}

      {/* TAB CONTENT: 8. REGISTRATIONS */}
      {activeTab === 'Registrations' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">Confirmed Attendee Registrations</h2>
            <span className="text-xs font-mono font-bold text-[#64748B]">{eventRegistrations.length} Passes Issued</span>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {eventRegistrations.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0F172A]">{r.attendeeName}</span>
                  <span className="text-[11px] font-mono text-[#64748B] block">Pass: {r.registrationCode} • {r.assignedGate}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] font-bold text-[10px]">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 9. ANALYTICS & 10. REPORTS */}
      {(activeTab === 'Analytics' || activeTab === 'Reports') && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs text-xs space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A]">Event Operational Intelligence</h2>
          <p className="text-[#64748B]">Generate exportable compliance logs and historical crowd flow trends for this event.</p>
          <button
            onClick={() => onNavigate(activeTab.toLowerCase())}
            className="px-4 py-2 rounded-lg bg-[#2563EB] text-white font-bold"
          >
            Open {activeTab} Engine
          </button>
        </div>
      )}
    </div>
  );
};
