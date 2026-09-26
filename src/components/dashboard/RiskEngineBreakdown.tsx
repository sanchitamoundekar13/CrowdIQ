import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';
import { Gauge, Calculator, Info } from 'lucide-react';

export const RiskEngineBreakdown: React.FC = () => {
  const { selectedZone, riskBreakdown } = useSimulation();

  const factors = [
    {
      name: 'Crowd Density',
      weight: riskBreakdown.crowdDensityWeight,
      rawScore: riskBreakdown.crowdDensityScore,
      contribution: ((riskBreakdown.crowdDensityScore * riskBreakdown.crowdDensityWeight) / 100).toFixed(1),
      desc: 'Base occupant saturation',
    },
    {
      name: 'Density Growth Rate',
      weight: riskBreakdown.densityGrowthWeight,
      rawScore: riskBreakdown.densityGrowthScore,
      contribution: ((riskBreakdown.densityGrowthScore * riskBreakdown.densityGrowthWeight) / 100).toFixed(1),
      desc: '3-minute acceleration slope',
    },
    {
      name: 'Flow Imbalance',
      weight: riskBreakdown.flowImbalanceWeight,
      rawScore: riskBreakdown.flowImbalanceScore,
      contribution: ((riskBreakdown.flowImbalanceScore * riskBreakdown.flowImbalanceWeight) / 100).toFixed(1),
      desc: 'Inflow vs outflow delta',
    },
    {
      name: 'Movement Pattern',
      weight: riskBreakdown.movementPatternWeight,
      rawScore: riskBreakdown.movementPatternScore,
      contribution: ((riskBreakdown.movementPatternScore * riskBreakdown.movementPatternWeight) / 100).toFixed(1),
      desc: 'Vector converging choke vectors',
    },
    {
      name: 'Zone Capacity Margin',
      weight: riskBreakdown.zoneCapacityWeight,
      rawScore: riskBreakdown.zoneCapacityScore,
      contribution: ((riskBreakdown.zoneCapacityScore * riskBreakdown.zoneCapacityWeight) / 100).toFixed(1),
      desc: 'Proximity to absolute maximum ceiling',
    },
  ];

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              Risk Engine Mathematical Breakdown
            </span>
            <p className="text-[11px] text-[#64748B] font-mono">
              Transparent multi-factor scoring model for {selectedZone?.shortName || 'Zone'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono text-[#0F172A]">
            {riskBreakdown.totalRiskScore}
            <span className="text-xs text-[#64748B]">/100</span>
          </span>
          <RiskBadge level={riskBreakdown.calculatedLevel} />
        </div>
      </div>

      {/* Factor Rows */}
      <div className="mt-4 space-y-3">
        {factors.map((f) => (
          <div key={f.name} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#0F172A] font-bold">{f.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-[10px]">Weight: {f.weight}%</span>
                <span className="font-bold text-[#2563EB]">+{f.contribution} pts</span>
              </div>
            </div>

            {/* Progress / Contribution Bar */}
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  f.rawScore > 80 ? 'bg-[#DC2626]' : f.rawScore > 60 ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'
                }`}
                style={{ width: `${Math.min(100, f.rawScore)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>{f.desc}</span>
              <span>Raw index: {f.rawScore}/100</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3 text-[#2563EB]" /> Deterministic, fully explainable model
        </span>
        <span className="text-[#0F172A] font-semibold">Normalized Threshold: 85%</span>
      </div>
    </div>
  );
};
