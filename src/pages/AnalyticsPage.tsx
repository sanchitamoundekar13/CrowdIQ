import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/common/MetricCard';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { zones, totalPeople, activeAlertsCount } = useSimulation();

  // Density over time series
  const densityHistory = [
    { time: '18:00', overall: 32, gateB: 28, stage: 45 },
    { time: '18:30', overall: 44, gateB: 38, stage: 56 },
    { time: '19:00', overall: 58, gateB: 52, stage: 68 },
    { time: '19:30', overall: 65, gateB: 68, stage: 72 },
    { time: '20:00', overall: 72, gateB: 84, stage: 78 },
    { time: '20:30 (Peak)', overall: 81, gateB: 94, stage: 85 },
    { time: '21:00', overall: 68, gateB: 72, stage: 79 },
    { time: '21:30', overall: 54, gateB: 48, stage: 64 },
  ];

  // Inflow vs Outflow Comparison Data
  const flowData = zones.map(z => ({
    name: z.shortName,
    Inflow: z.inflow,
    Outflow: z.outflow,
  }));

  // Zone Occupancy Bar Data
  const occupancyData = zones.map(z => ({
    name: z.shortName,
    Occupancy: z.density,
    Capacity: 100,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Historical Telemetry & Spatial Trends
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Macro-level throughput analysis, bottleneck duration logs, and gate flow metrics
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569]">
            Reporting Interval: 30m Aggregate
          </span>
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm">
          <span className="text-xs font-mono text-[#64748B] uppercase">Peak Venue Inflow</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1">214 /min</div>
          <span className="text-[10px] text-[#2563EB] font-mono">Recorded at 20:30 (Gate B)</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm">
          <span className="text-xs font-mono text-[#64748B] uppercase">Bottleneck Duration</span>
          <div className="text-2xl font-bold font-mono text-[#D97706] mt-1">04m 18s</div>
          <span className="text-[10px] text-[#16A34A] font-mono">Resolved via Gate C diversion</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm">
          <span className="text-xs font-mono text-[#64748B] uppercase">Total Egress Volume</span>
          <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1">14,280</div>
          <span className="text-[10px] text-[#64748B] font-mono">Cumulative safe egress count</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm">
          <span className="text-xs font-mono text-[#64748B] uppercase">Mean Squad Response</span>
          <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">01m 24s</div>
          <span className="text-[10px] text-[#16A34A] font-mono">Exceeds 03:00 safety SLA</span>
        </div>
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temporal Density Curve */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Temporal Density Progression (%)
              </h3>
              <p className="text-[11px] text-[#64748B] font-mono">
                Comparative time-series: Concourse, Arena, and Venue Mean
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]">
              TIME SERIES
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={densityHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="overall" name="Venue Mean" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gateB" name="Gate B Concourse" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stage" name="Main Stage" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Flow Balance by Zone */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Inflow vs Outflow Rate by Zone (/min)
              </h3>
              <p className="text-[11px] text-[#64748B] font-mono">
                Identifies bottleneck accumulation imbalance ratios
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0FDFA] text-[#0F766E] font-bold border border-[#CCFBF1]">
              FLOW BALANCE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Inflow" name="Inflow Rate" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" name="Outflow Rate" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Zone Occupancy vs Safety Limit */}
        <div className="lg:col-span-2 rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Real-Time Zone Saturation vs Absolute Safety Ceilings
              </h3>
              <p className="text-[11px] text-[#64748B] font-mono">
                Cross-zone capacity compliance telemetry
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-bold border border-[#E2E8F0]">
              CAPACITY THRESHOLD
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Occupancy" name="Current Load %" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
