import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sliders, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  DoorOpen, 
  Activity, 
  Sparkles,
  Layers,
  Gauge,
  Plus,
  Video,
  Trash2,
  Edit2
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  capacity: number;
  currentOccupancy: number;
  zones: string[];
  assignedCameras: string[];
  status: 'LIVE' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED';
  riskLevel: string;
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'EVT-2026-01',
    title: 'World Championship Finals 2026',
    date: 'Today • Sep 26, 2026',
    time: '18:00 - 23:30 IST',
    capacity: 25000,
    currentOccupancy: 18492,
    zones: ['Gate A', 'Gate B', 'Core Plaza', 'VIP Lounge'],
    assignedCameras: ['CAM-01', 'CAM-02', 'CAM-04', 'CAM-06'],
    status: 'LIVE',
    riskLevel: 'MONITORED',
  },
  {
    id: 'EVT-2026-02',
    title: 'Metropolitan Tech & AI Horizon Summit',
    date: 'Tomorrow • Sep 27, 2026',
    time: '09:00 - 18:00 IST',
    capacity: 14500,
    currentOccupancy: 0,
    zones: ['Gate A', 'Gate C', 'Core Plaza'],
    assignedCameras: ['CAM-01', 'CAM-04', 'CAM-08'],
    status: 'SCHEDULED',
    riskLevel: 'LOW',
  },
  {
    id: 'EVT-2026-03',
    title: 'Global Symphonic Arena Concert',
    date: 'Oct 02, 2026',
    time: '19:30 - 23:00 IST',
    capacity: 22000,
    currentOccupancy: 0,
    zones: ['All Gates', 'Core Plaza', 'VIP Lounge', 'Stairwell'],
    assignedCameras: ['CAM-01', 'CAM-02', 'CAM-04', 'CAM-05', 'CAM-06'],
    status: 'SCHEDULED',
    riskLevel: 'MODERATE',
  },
  {
    id: 'EVT-2026-04',
    title: 'National Basketball Playoff Finals',
    date: 'Oct 07, 2026',
    time: '17:00 - 21:00 IST',
    capacity: 24800,
    currentOccupancy: 0,
    zones: ['All Gates', 'Emergency Exits'],
    assignedCameras: ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-08'],
    status: 'SCHEDULED',
    riskLevel: 'HIGH SURGE',
  }
];

export const EventsPage: React.FC = () => {
  const { settings, updateSettings, totalPeople, averageDensity, playAlertSound } = useSimulation();

  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventName: settings.eventName || 'World Championship Finals 2026',
    venueCapacity: settings.venueCapacity || 25000,
    totalGates: settings.totalGates || 4,
    activeSecurityTeams: settings.activeSecurityTeams || 4,
    criticalDensityThreshold: settings.criticalDensityThreshold || 85,
    warningDensityThreshold: settings.warningDensityThreshold || 70,
  });

  const [isSaved, setIsSaved] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: 'Sep 30, 2026',
    time: '19:00 - 23:00 IST',
    capacity: 20000,
    zones: ['Gate A', 'Core Plaza'],
    assignedCameras: ['CAM-01', 'CAM-04'],
    status: 'SCHEDULED' as 'LIVE' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED',
    riskLevel: 'LOW'
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const created: EventItem = {
      id: `EVT-2026-0${events.length + 1}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      capacity: Number(newEvent.capacity),
      currentOccupancy: 0,
      zones: newEvent.zones,
      assignedCameras: newEvent.assignedCameras,
      status: newEvent.status,
      riskLevel: newEvent.riskLevel,
    };
    setEvents([...events, created]);
    setIsCreateModalOpen(false);
    playAlertSound('info');
  };

  const handleUpdateStatus = (id: string, newStatus: 'LIVE' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED') => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, status: newStatus } : ev));
    playAlertSound('info');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
    playAlertSound('warning');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    playAlertSound('info');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const liveEvent = events.find(e => e.status === 'LIVE') || events[0];
  const occupancyPercent = Math.min(100, Math.round((totalPeople / (formData.venueCapacity || 25000)) * 100));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2563EB]" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Events Management & Venue Schedules
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Configure event capacities, assigned sector zones, assigned surveillance cameras, and real-time status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Active Event Hero Card */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE LIVE EVENT
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {liveEvent.id}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {liveEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                Metropolitan Arena • All Concourses
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Live: {liveEvent.time}
              </span>
              <span className="flex items-center gap-1.5">
                <DoorOpen className="w-4 h-4 text-purple-400" />
                Zones: {liveEvent.zones.join(', ')}
              </span>
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-400" />
                Cameras: {liveEvent.assignedCameras.join(', ')}
              </span>
            </div>
          </div>

          {/* Real-time Headcount Telemetry */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-center min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>VENUE OCCUPANCY</span>
              <span className="text-emerald-400 font-bold">{occupancyPercent}%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {totalPeople.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                / {liveEvent.capacity.toLocaleString()} cap
              </span>
            </div>

            <div className="w-full bg-slate-700/60 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPercent > 85 ? 'bg-rose-500' :
                  occupancyPercent > 70 ? 'bg-amber-400' : 'bg-blue-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
              <span>Avg Density: <strong>{averageDensity}%</strong></span>
              <span>Available Seats: <strong>{Math.max(0, liveEvent.capacity - totalPeople).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              Events Directory & Operations Ledger ({events.length})
            </h3>
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
              Capacity quotas, assigned zones, surveillance camera bindings, and lifecycle state
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                <th className="p-3">Event Code & Title</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Active Zones</th>
                <th className="p-3">Assigned Cameras</th>
                <th className="p-3">Event Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="p-3">
                    <div className="font-bold text-[#0F172A]">{ev.title}</div>
                    <span className="text-[10px] text-[#2563EB] font-bold">{ev.id}</span>
                  </td>
                  <td className="p-3 text-[#475569]">
                    <div>{ev.date}</div>
                    <div className="text-[10px] text-[#64748B]">{ev.time}</div>
                  </td>
                  <td className="p-3 font-bold text-[#0F172A]">
                    {ev.capacity.toLocaleString()}
                    <span className="text-[10px] text-[#64748B] block font-normal">
                      {ev.status === 'LIVE' ? `${totalPeople.toLocaleString()} inside` : '0 attendees'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {ev.zones.map(z => (
                        <span key={z} className="px-1.5 py-0.5 rounded text-[9px] bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                          {z}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {ev.assignedCameras.map(cam => (
                        <span key={cam} className="px-1.5 py-0.5 rounded text-[9px] bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]">
                          {cam}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={ev.status}
                      onChange={(e) => handleUpdateStatus(ev.id, e.target.value as any)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border cursor-pointer font-mono ${
                        ev.status === 'LIVE' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' :
                        ev.status === 'SCHEDULED' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' :
                        ev.status === 'PAUSED' ? 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]' :
                        'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      <option value="LIVE">LIVE</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="PAUSED">PAUSED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-extrabold text-[#0F172A] text-base">Create & Schedule New Event</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Continental Derby Match 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Capacity Quota</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Initial Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Concourses / Zones</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Gate A', 'Gate B', 'Gate C', 'Core Plaza', 'VIP Lounge', 'North Exit', 'South Wing'].map((zone) => {
                    const isSelected = newEvent.zones.includes(zone);
                    return (
                      <button
                        type="button"
                        key={zone}
                        onClick={() => {
                          const updated = isSelected 
                            ? newEvent.zones.filter(z => z !== zone)
                            : [...newEvent.zones, zone];
                          setNewEvent({ ...newEvent, zones: updated });
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-[#2563EB] text-white border-[#1D4ED8]' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {zone}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned CCTV Cameras</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-05', 'CAM-06', 'CAM-07', 'CAM-08'].map((cam) => {
                    const isSelected = newEvent.assignedCameras.includes(cam);
                    return (
                      <button
                        type="button"
                        key={cam}
                        onClick={() => {
                          const updated = isSelected 
                            ? newEvent.assignedCameras.filter(c => c !== cam)
                            : [...newEvent.assignedCameras, cam];
                          setNewEvent({ ...newEvent, assignedCameras: updated });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-[#16A34A] text-white border-[#15803D]' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {cam}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                >
                  Save & Register Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
