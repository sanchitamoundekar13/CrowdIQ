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
  Gauge
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { settings, updateSettings, totalPeople, averageDensity, playAlertSound } = useSimulation();

  const [formData, setFormData] = useState({
    eventName: settings.eventName || 'World Championship Finals 2026',
    venueCapacity: settings.venueCapacity || 25000,
    totalGates: settings.totalGates || 4,
    activeSecurityTeams: settings.activeSecurityTeams || 4,
    criticalDensityThreshold: settings.criticalDensityThreshold || 85,
    warningDensityThreshold: settings.warningDensityThreshold || 70,
  });

  const [isSaved, setIsSaved] = useState(false);

  const upcomingEvents = [
    {
      id: 'EVT-2026-01',
      title: 'World Championship Finals 2026',
      date: 'Today • Sep 26, 2026',
      time: '18:00 - 23:30 IST',
      tier: 'Tier 1 Major',
      status: 'LIVE NOW',
      expectedAttendance: 25000,
      currentOccupancy: totalPeople,
      riskLevel: 'MONITORED',
      gates: '4 Turnstile Concourses',
    },
    {
      id: 'EVT-2026-02',
      title: 'Metropolitan Tech & AI Horizon Summit',
      date: 'Tomorrow • Sep 27, 2026',
      time: '09:00 - 18:00 IST',
      tier: 'Conference',
      status: 'SCHEDULED',
      expectedAttendance: 14500,
      currentOccupancy: 0,
      riskLevel: 'LOW',
      gates: 'North & West Concourses',
    },
    {
      id: 'EVT-2026-03',
      title: 'Global Symphonic Arena Concert',
      date: 'Oct 02, 2026',
      time: '19:30 - 23:00 IST',
      tier: 'Concert',
      status: 'SCHEDULED',
      expectedAttendance: 22000,
      currentOccupancy: 0,
      riskLevel: 'MODERATE',
      gates: 'All Gates + VIP Lounge',
    },
    {
      id: 'EVT-2026-04',
      title: 'National Indoor Basketball Playoff Finals',
      date: 'Oct 07, 2026',
      time: '17:00 - 21:00 IST',
      tier: 'Sporting Event',
      status: 'SCHEDULED',
      expectedAttendance: 24800,
      currentOccupancy: 0,
      riskLevel: 'HIGH SURGE',
      gates: 'All 4 Gates Active',
    }
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    playAlertSound('info');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const occupancyPercent = Math.min(100, Math.round((totalPeople / (formData.venueCapacity || 25000)) * 100));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2563EB]" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Events Management & Operational Capacity
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Active venue schedule, expected attendance thresholds, and security parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            1 Live Event Active
          </span>
        </div>
      </div>

      {/* Active Event Hero Card */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                CURRENTLY HOSTING
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                EVT-2026-01
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formData.eventName}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                Metropolitan Arena • Main Bowl
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Live: 18:00 - 23:30 IST
              </span>
              <span className="flex items-center gap-1.5">
                <DoorOpen className="w-4 h-4 text-purple-400" />
                Gates A, B, C, VIP Ingress Active
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
                / {formData.venueCapacity.toLocaleString()} cap
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
              <span>Remaining: <strong>{Math.max(0, formData.venueCapacity - totalPeople).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Event Operations Settings + Scheduled Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Event Operational Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Event Parameters & Safety Limits
              </h3>
            </div>
            {isSaved && (
              <span className="text-[11px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Applied
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-[#475569] uppercase mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#475569] uppercase mb-1">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={formData.venueCapacity}
                  onChange={(e) => setFormData({ ...formData, venueCapacity: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#475569] uppercase mb-1">
                  Active Gates
                </label>
                <input
                  type="number"
                  value={formData.totalGates}
                  onChange={(e) => setFormData({ ...formData, totalGates: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#475569] uppercase mb-1">
                  Security Units
                </label>
                <input
                  type="number"
                  value={formData.activeSecurityTeams}
                  onChange={(e) => setFormData({ ...formData, activeSecurityTeams: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#475569] uppercase mb-1">
                  Critical Density %
                </label>
                <input
                  type="number"
                  value={formData.criticalDensityThreshold}
                  onChange={(e) => setFormData({ ...formData, criticalDensityThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>UPDATE EVENT PARAMETERS</span>
            </button>
          </form>
        </div>

        {/* Right: Scheduled Venue Events Ledger (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Venue Events Schedule & Roster
              </h3>
            </div>
            <span className="text-xs font-mono text-[#64748B]">
              4 Events on Record
            </span>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div 
                key={evt.id}
                className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                        {evt.id}
                      </span>
                      <h4 className="font-bold text-xs text-[#0F172A]">{evt.title}</h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span>{evt.date}</span>
                      <span>•</span>
                      <span>{evt.time}</span>
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-center border ${
                    evt.status === 'LIVE NOW' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {evt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tier</span>
                    <span className="font-bold text-slate-800">{evt.tier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Expected Cap</span>
                    <span className="font-bold text-slate-800">{evt.expectedAttendance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Risk Tier</span>
                    <span className="font-bold text-blue-600">{evt.riskLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Concourse</span>
                    <span className="font-bold text-slate-700 truncate block">{evt.gates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
