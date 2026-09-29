import React, { useState, useEffect } from 'react';
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
  Edit2,
  ShieldAlert,
  ArrowRight,
  Radio,
  Search,
  ExternalLink
} from 'lucide-react';
import { JevLayaLostPersonSection } from '../components/events/JevLayaLostPersonSection';
import { jevLayaAiService } from '../services/jevLayaAiService';

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

  // Active Tab: 'events' | 'jev-laya'
  const [activeTab, setActiveTab] = useState<'events' | 'jev-laya'>('jev-laya');
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

  // Check URL hash params for tab
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('tab=events')) {
      setActiveTab('events');
    } else if (hash.includes('tab=jev-laya') || hash.includes('tab=lost-person')) {
      setActiveTab('jev-laya');
    }
  }, []);

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
    <div className="space-y-6 pb-12 font-sans text-slate-900 animate-fadeIn">
      
      {/* ===================================================================
          PAGE HEADER WITH DUAL SUBSYSTEM TABS (WHITE THEME)
          =================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Events Operations &amp; Intelligence
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Arena Schedule
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Venue capacity management, camera sector assignments, and Jev &amp; Laya AI Lost Person Locator
              </p>
            </div>
          </div>
        </div>

        {/* Subsystem Switcher Tabs */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('jev-laya')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'jev-laya'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Jev &amp; Laya AI Locator</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              AMBER
            </span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'events'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events Directory ({events.length})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          TAB 1: JEV & LAYA AI LOST PERSON & CHILD LOCATOR
          =================================================================== */}
      {activeTab === 'jev-laya' && (
        <div className="space-y-6">
          <JevLayaLostPersonSection
            onNavigateToCamera={(camId, targetName) => {
              window.location.hash = `#/cameras?camId=${camId}&targetName=${encodeURIComponent(targetName)}`;
            }}
          />
        </div>
      )}

      {/* ===================================================================
          TAB 2: EVENTS DIRECTORY & SCHEDULES
          =================================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          
          {/* Quick Amber Alert Notice Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold block text-rose-950">
                  Active Code Amber Child Search in Progress (Leo Sharma, 8 yrs)
                </span>
                <span className="text-[11px] text-rose-800">
                  Target confirmed on CAM-02 (Gate 2 Turnstiles). Jev &amp; Laya AI cross-camera neural tracking active.
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('jev-laya')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
            >
              <span>Open Jev &amp; Laya AI Locator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Event Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-slate-900">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE LIVE EVENT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {liveEvent.id}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {liveEvent.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Metropolitan Arena • All Concourses
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Live: {liveEvent.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4 text-purple-600" />
                    Zones: {liveEvent.zones.join(', ')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-500" />
                    Cameras: {liveEvent.assignedCameras.join(', ')}
                  </span>
                </div>
              </div>

              {/* Real-time Headcount Telemetry */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-center min-w-[260px]">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
                  <span>VENUE OCCUPANCY</span>
                  <span className="text-emerald-600 font-bold">{occupancyPercent}%</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-slate-900">
                    {totalPeople.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {liveEvent.capacity.toLocaleString()} cap
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 85 ? 'bg-rose-500' :
                      occupancyPercent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                  <span>Avg Density: <strong>{averageDensity}%</strong></span>
                  <span>Available Seats: <strong>{Math.max(0, liveEvent.capacity - totalPeople).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Events Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Events Directory &amp; Operations Ledger ({events.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Capacity quotas, assigned zones, surveillance camera bindings, and lifecycle state
                </p>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                    <th className="p-3">Event Code &amp; Title</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Active Zones</th>
                    <th className="p-3">Assigned Cameras</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{ev.title}</div>
                        <span className="text-[10px] text-blue-600 font-mono font-bold">{ev.id}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <div>{ev.date}</div>
                        <div className="text-[11px] text-slate-400">{ev.time}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {ev.capacity.toLocaleString()}
                        <span className="text-[11px] text-slate-400 block font-normal">
                          {ev.status === 'LIVE' ? `${totalPeople.toLocaleString()} inside` : '0 attendees'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {ev.zones.map(z => (
                            <span key={z} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                              {z}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {ev.assignedCameras.map(cam => (
                            <span key={cam} className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                              {cam}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={ev.status}
                          onChange={(e) => handleUpdateStatus(ev.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase border cursor-pointer ${
                            ev.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            ev.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            ev.status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
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
        </div>
      )}

      {/* ===================================================================
          MODAL: CREATE NEW EVENT
          =================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-scaleUp text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Create &amp; Schedule New Event</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Continental Derby Match 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity Quota</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Concourses / Zones</label>
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {zone}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned CCTV Cameras</label>
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
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Register Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
