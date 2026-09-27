import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowUpDown,
  Calendar,
  Layers,
  ShieldAlert,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { zones, totalPeople, activeAlertsCount } = useSimulation();
  const [activeTab, setActiveTab] = useState<'all' | 'crowd' | 'density' | 'peaks' | 'alerts' | 'events'>('all');

  // 1. Crowd Trends Data
  const crowdTrendsData = [
    { time: '16:00', entrants: 1400, exits: 120, inside: 1280 },
    { time: '17:00', entrants: 3800, exits: 310, inside: 4770 },
    { time: '18:00', entrants: 7200, exits: 650, inside: 11320 },
    { time: '19:00', entrants: 8900, exits: 1200, inside: 19020 },
    { time: '20:00 (Peak)', entrants: 5100, exits: 1950, inside: totalPeople || 22170 },
    { time: '21:00', entrants: 2100, exits: 3400, inside: 20870 },
    { time: '22:00', entrants: 600, exits: 8200, inside: 13270 },
  ];

  // 2. Density Trends Data
  const densityHistory = [
    { time: '18:00', overall: 32, gateB: 28, stage: 45, concourse: 24 },
    { time: '18:30', overall: 44, gateB: 38, stage: 56, concourse: 36 },
    { time: '19:00', overall: 58, gateB: 52, stage: 68, concourse: 49 },
    { time: '19:30', overall: 65, gateB: 68, stage: 72, concourse: 58 },
    { time: '20:00', overall: 72, gateB: 84, stage: 78, concourse: 65 },
    { time: '20:30 (Peak)', overall: 81, gateB: 94, stage: 85, concourse: 74 },
    { time: '21:00', overall: 68, gateB: 72, stage: 79, concourse: 61 },
    { time: '21:30', overall: 54, gateB: 48, stage: 64, concourse: 46 },
  ];

  // 3. Alerts vs Incidents Data
  const alertsIncidentsData = [
    { time: '17:00', alerts: 2, incidents: 1, resolved: 1 },
    { time: '18:00', alerts: 5, incidents: 2, resolved: 2 },
    { time: '19:00', alerts: 11, incidents: 4, resolved: 3 },
    { time: '20:00 (Peak)', alerts: 18, incidents: 7, resolved: 6 },
    { time: '21:00', alerts: 8, incidents: 3, resolved: 3 },
    { time: '22:00', alerts: 3, incidents: 1, resolved: 1 },
  ];

  // 4. Event Comparison Data
  const eventComparison = [
    { name: 'World Championship Finals (Current)', date: 'Sep 26', attendance: 24890, peakDensity: 94, incidents: 6, avgResponse: '01m 24s', riskScore: 84 },
    { name: 'AI Horizon Summit', date: 'Sep 27', attendance: 14200, peakDensity: 68, incidents: 2, avgResponse: '01m 05s', riskScore: 32 },
    { name: 'Symphonic Concert', date: 'Oct 02', attendance: 21800, peakDensity: 82, incidents: 4, avgResponse: '01m 40s', riskScore: 61 },
    { name: 'National Basketball Finals', date: 'Oct 07', attendance: 24900, peakDensity: 96, incidents: 8, avgResponse: '01m 18s', riskScore: 88 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#2563EB]" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              CrowdIQ Analytics & Safety Intelligence
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Crowd trends • Density trends • Peak periods • Alerts & incidents • Event comparison
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono bg-white p-1 rounded-xl border border-[#CBD5E1] shadow-2xs">
          {[
            { id: 'all', label: 'All Telemetry' },
            { id: 'crowd', label: 'Crowd Trends' },
            { id: 'density', label: 'Density Trends' },
            { id: 'peaks', label: 'Peak Periods' },
            { id: 'alerts', label: 'Alerts & Incidents' },
            { id: 'events', label: 'Event Comparison' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Peak Influx Velocity</span>
          <div className="text-2xl font-extrabold font-mono text-[#0F172A] mt-1">214 /min</div>
          <span className="text-[10px] text-[#2563EB] font-mono">Recorded at 20:30 (Gate B)</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Bottleneck Peak Duration</span>
          <div className="text-2xl font-extrabold font-mono text-[#D97706] mt-1">04m 18s</div>
          <span className="text-[10px] text-[#16A34A] font-mono">Countermeasure: Gate C Egress</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Cumulative Venue Influx</span>
          <div className="text-2xl font-extrabold font-mono text-[#0F172A] mt-1">{totalPeople.toLocaleString()}</div>
          <span className="text-[10px] text-[#64748B] font-mono">98.4% nominal flow efficiency</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Mean Responder SLA</span>
          <div className="text-2xl font-extrabold font-mono text-[#16A34A] mt-1">01m 24s</div>
          <span className="text-[10px] text-[#16A34A] font-mono">Exceeds 03:00 safety limit</span>
        </div>
      </div>

      {/* 1. CROWD TRENDS */}
      {(activeTab === 'all' || activeTab === 'crowd') && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Crowd Trends: Entrants vs Exits vs Cumulative Inside
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Headcount timeline and ingress ramp progression across event hours
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]">
              CROWD TRAJECTORY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdTrendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="insideGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px', color: '#0F172A' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="inside" name="Present Inside" stroke="#2563EB" strokeWidth={2.5} fill="url(#insideGrad)" />
                <Line type="monotone" dataKey="entrants" name="Hourly Ingress" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="exits" name="Hourly Egress" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2. DENSITY TRENDS */}
      {(activeTab === 'all' || activeTab === 'density') && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Density Trends: Spatial Zone Saturation (%) Over Time
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Multi-sector density telemetry identifying bottleneck escalation thresholds
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7C3AED] font-bold border border-[#E9D5FF]">
              SECTOR DENSITY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={densityHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px', color: '#0F172A' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="overall" name="Venue Mean Density" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gateB" name="Gate B Turnstiles" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stage" name="Main Stage Front" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="concourse" name="South Concourse" stroke="#0F766E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. PEAK PERIODS */}
      {(activeTab === 'all' || activeTab === 'peaks') && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Peak Periods & Surge Duration Analysis
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Window periods with highest crowd density, opposing turbulence, and door delays
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFBEB] text-[#D97706] font-bold border border-[#FDE68A]">
              SURGE BREAKDOWN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]">
              <span className="text-[10px] font-bold text-[#DC2626] uppercase block">Primary Peak Surge</span>
              <div className="text-xl font-extrabold text-[#9A3412] mt-1">20:15 - 20:45 IST</div>
              <p className="text-[11px] text-[#7F1D1D] mt-1">
                94% density recorded at Gate B. Flow velocity dipped to 0.4 m/s. Required tactical lane bifurcation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
              <span className="text-[10px] font-bold text-[#D97706] uppercase block">Pre-Event Rush</span>
              <div className="text-xl font-extrabold text-[#B45309] mt-1">18:30 - 19:15 IST</div>
              <p className="text-[11px] text-[#78350F] mt-1">
                Sustained inflow of 180 entrants/min. Turnstiles operated at 92% throughput capacity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase block">Projected Egress Rush</span>
              <div className="text-xl font-extrabold text-[#1E40AF] mt-1">23:00 - 23:45 IST</div>
              <p className="text-[11px] text-[#1E3A8A] mt-1">
                Estimated egress of 24,000 attendees across 6 gates. Staggered exit protocol recommended.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. ALERTS & INCIDENTS HISTOGRAM */}
      {(activeTab === 'all' || activeTab === 'alerts') && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Alerts & Incidents Distribution Across Timeline
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Automated predictive alarms generated vs tactical incidents resolved per hour
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#FCA5A5]">
              ALERTS / INCIDENTS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsIncidentsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px', color: '#0F172A' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="alerts" name="Alarms Triggered" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" name="Incidents Logged" fill="#D97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Squads Cleared" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. EVENT COMPARISON */}
      {(activeTab === 'all' || activeTab === 'events') && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Event Comparison Benchmarks
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Cross-event telemetry: Attendance load, peak density, response time, and risk metrics
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]">
              BENCHMARK AUDIT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px]">
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Peak Density</th>
                  <th className="p-3">Incidents</th>
                  <th className="p-3">Mean Response</th>
                  <th className="p-3 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {eventComparison.map((ev, i) => (
                  <tr key={i} className={`hover:bg-[#F8FAFC] transition ${i === 0 ? 'bg-[#EFF6FF]/40 font-semibold' : ''}`}>
                    <td className="p-3 text-[#0F172A]">
                      {ev.name}
                      {i === 0 && <span className="ml-2 text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
                    </td>
                    <td className="p-3 text-[#64748B]">{ev.date}</td>
                    <td className="p-3 font-bold text-[#0F172A]">{ev.attendance.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.peakDensity >= 90 ? 'bg-rose-100 text-rose-800' :
                        ev.peakDensity >= 75 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ev.peakDensity}%
                      </span>
                    </td>
                    <td className="p-3 text-[#DC2626] font-bold">{ev.incidents}</td>
                    <td className="p-3 text-[#16A34A]">{ev.avgResponse}</td>
                    <td className="p-3 text-right">
                      <span className="font-extrabold text-[#0F172A]">{ev.riskScore}/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
