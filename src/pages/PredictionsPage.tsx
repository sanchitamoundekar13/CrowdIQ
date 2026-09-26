import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { EarlyWarningCard } from '../components/dashboard/EarlyWarningCard';
import { RiskEngineBreakdown } from '../components/dashboard/RiskEngineBreakdown';
import { RiskBadge } from '../components/common/RiskBadge';
import { TrendingUp, AlertTriangle, Zap, Cpu, Sparkles, Compass } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PredictionsPage: React.FC = () => {
  const { zones, selectedZone, selectZone, stage } = useSimulation();

  const multiZoneForecast = [
    { time: 'T-0 (Now)', 'Gate A': 42, 'Gate B': selectedZone?.id === 'gate-b' ? selectedZone.density : 68, 'Gate C': 28, 'Main Stage': 74 },
    { time: '+2 Min', 'Gate A': 44, 'Gate B': Math.min(100, Math.round((selectedZone?.density || 68) * 1.06)), 'Gate C': 30, 'Main Stage': 76 },
    { time: '+4 Min', 'Gate A': 45, 'Gate B': Math.min(105, Math.round((selectedZone?.density || 68) * 1.12)), 'Gate C': 32, 'Main Stage': 78 },
    { time: '+6 Min', 'Gate A': 46, 'Gate B': Math.min(115, Math.round((selectedZone?.density || 68) * 1.18)), 'Gate C': 33, 'Main Stage': 80 },
    { time: '+8 Min', 'Gate A': 48, 'Gate B': Math.min(120, Math.round((selectedZone?.density || 68) * 1.22)), 'Gate C': 35, 'Main Stage': 82 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Predictive Congestion & Surge Forecasting
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Sequential Risk Modeling • Pre-empting Crowd Hazard Events 4–8 Minutes Before Emergence
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-mono text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
          <span>AI PREDICTIVE RADAR ACTIVE</span>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-zone Surge Projection Line Chart (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#2563EB]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                  Multi-Sector 8-Minute Congestion Trajectory
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">
                Confidence: 94.2%
              </span>
            </div>

            <div className="h-72 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={multiZoneForecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 130]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', color: '#0F172A', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                  />
                  <Line type="monotone" dataKey="Gate B" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Main Stage" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Gate A" stroke="#2563EB" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Gate C" stroke="#16A34A" strokeWidth={1.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Threshold Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0] text-xs font-mono text-[#475569]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Gate B (Bottleneck)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Main Stage</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Gate A</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Gate C (Alternate)</span>
              </div>
              <span className="text-[#DC2626] font-bold text-[11px]">85% Critical Threshold</span>
            </div>
          </div>

          {/* Detailed Early Warning Card */}
          <EarlyWarningCard />
        </div>

        {/* Right Column: Zone Risk Breakdown & Selector (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <RiskEngineBreakdown />

          {/* Quick Zone Selector for Predictions */}
          <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] block">
              Zone Risk Selector
            </span>
            <div className="grid grid-cols-2 gap-2">
              {zones.slice(0, 6).map((z) => (
                <button
                  key={z.id}
                  onClick={() => selectZone(z.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer ${
                    selectedZone?.id === z.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="font-bold text-[#0F172A]">{z.shortName}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span>{z.density}% Load</span>
                    <span className="font-semibold">{z.riskLevel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
