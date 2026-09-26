import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const EarlyWarningCard: React.FC = () => {
  const { selectedZone, stage } = useSimulation();

  const zone = selectedZone || {
    name: 'Gate B (Main East Concourse)',
    shortName: 'Gate B',
    density: 91,
    predictedDensityIn4Min: 101,
  };

  const currentD = zone.density;
  const pred2m = Math.min(105, Math.round(currentD * 1.05));
  const pred4m = Math.min(115, Math.round(currentD * 1.11));
  const pred6m = Math.min(125, Math.round(currentD * 1.18));

  const chartData = [
    { time: '-4m', density: Math.max(30, currentD - 28) },
    { time: '-2m', density: Math.max(40, currentD - 14) },
    { time: 'NOW', density: currentD },
    { time: '+2m (Est)', density: pred2m, isProjected: true },
    { time: '+4m (Est)', density: pred4m, isProjected: true },
    { time: '+6m (Est)', density: pred6m, isProjected: true },
  ];

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm relative overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              EARLY WARNING SYSTEM
            </span>
            <p className="text-[11px] text-[#64748B] font-mono">
              Target: {zone.shortName} • Real-time Predictive Modeling
            </p>
          </div>
        </div>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
          currentD >= 85 
            ? 'bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626]' 
            : currentD >= 70
            ? 'bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]'
            : 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]'
        }`}>
          {currentD >= 85 ? 'HIGH CONGESTION RISK' : currentD >= 70 ? 'MODERATE SURGE' : 'SAFE BASELINE'}
        </span>
      </div>

      {/* Projection Comparison Columns */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-mono uppercase text-[#64748B]">Current (NOW)</span>
          <div className="text-xl font-bold font-mono text-[#0F172A] mt-0.5">
            {currentD}%
          </div>
          <span className="text-[10px] text-[#2563EB] font-mono">Active telemetry</span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] font-mono uppercase text-[#64748B]">+2 Min Forecast</span>
          <div className="text-xl font-bold font-mono text-[#D97706] mt-0.5">
            {pred2m}%
          </div>
          <span className="text-[10px] text-[#D97706] font-mono">↑ Rapid accumulation</span>
        </div>

        <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]">
          <span className="text-[10px] font-mono uppercase text-[#DC2626] font-bold">+4 Min Forecast</span>
          <div className="text-xl font-bold font-mono text-[#DC2626] mt-0.5">
            {pred4m}%
          </div>
          <span className="text-[10px] text-[#DC2626] font-bold font-mono">! CRITICAL OVERLOAD</span>
        </div>
      </div>

      {/* Early Warning Explanatory Line */}
      <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2 text-xs font-mono text-[#92400E] mb-4">
        <TrendingUp className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <strong>Prediction Engine:</strong> Inflow surge will overload {zone.shortName} capacity in ~4 minutes. Immediate intervention enables smooth recovery before stampede risk escalates.
        </div>
      </div>

      {/* Recharts Area Chart Preview */}
      <div className="h-40 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earlyWarningGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
            <YAxis domain={[0, 130]} stroke="#94A3B8" fontSize={10} tickLine={false} />
            <Tooltip 
              contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
            />
            <Area type="monotone" dataKey="density" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#earlyWarningGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
