import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Share2, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Activity
} from 'lucide-react';

export const ZoneDetailsDrawer: React.FC = () => {
  const { 
    selectedZone, 
    dispatchSecurityTeam, 
    redirectCrowd, 
    securityTeams, 
    stage 
  } = useSimulation();

  if (!selectedZone) return null;

  const team04 = securityTeams.find(t => t.id === 'team-04');
  const isTeam04Moving = team04?.status === 'MOVING';
  const isTeam04Arrived = team04?.status === 'ARRIVED';

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base font-mono tracking-wide text-[#0F172A] uppercase">
                {selectedZone.name}
              </h3>
            </div>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Category: {selectedZone.category} | Zone ID: {selectedZone.id}
            </p>
          </div>
          <RiskBadge level={selectedZone.riskLevel} size="md" />
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] uppercase">Current People</span>
            <div className="text-lg font-bold font-mono text-[#0F172A] mt-0.5">
              {selectedZone.currentPeople.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              Cap: {selectedZone.maxCapacity.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] uppercase">Density Load</span>
            <div className="text-lg font-bold font-mono text-[#0F172A] mt-0.5">
              {selectedZone.density}%
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              {selectedZone.densityTrend > 0 ? `+${selectedZone.densityTrend}% growth` : 'Stable load'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] uppercase">Inflow Rate</span>
            <div className="text-lg font-bold font-mono text-[#0F172A] mt-0.5">
              {selectedZone.inflow} <span className="text-xs font-normal text-[#64748B]">/min</span>
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              Outflow: {selectedZone.outflow}/min
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] uppercase">Pred. In 4 Min</span>
            <div className="text-lg font-bold font-mono text-[#2563EB] mt-0.5">
              {selectedZone.predictedDensityIn4Min || selectedZone.density}%
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              Delta: {((selectedZone.predictedDensityIn4Min || selectedZone.density) - selectedZone.density) > 0 ? `+${(selectedZone.predictedDensityIn4Min || selectedZone.density) - selectedZone.density}%` : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Dynamic Context Prediction */}
        <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] space-y-1 mb-4">
          <div className="text-xs font-bold font-mono text-[#2563EB] flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            TELEMETRY ANALYSIS & FLOW
          </div>
          <p className="text-xs font-mono text-[#334155] leading-relaxed">
            {selectedZone.predictionText || 'Telemetry sensors indicate laminar pedestrian movement across all portal lanes.'}
          </p>
        </div>

        {/* Active Security Squad Assigned */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748B] font-bold">Assigned Rapid Squad:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isTeam04Moving
                ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                : isTeam04Arrived
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                : 'bg-white text-[#475569] border border-[#CBD5E1]'
            }`}>
              {team04?.status || 'AVAILABLE'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-[#475569]">
            <span>{team04?.name} ({team04?.membersCount} Officers)</span>
            <span>{isTeam04Moving ? `ETA: 00:${team04?.etaSeconds}s` : isTeam04Arrived ? 'On Site' : 'Standby'}</span>
          </div>
        </div>
      </div>

      {/* Manual Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
        <div className="text-[11px] font-mono uppercase text-[#64748B] font-bold mb-1 flex items-center gap-1">
          <Zap className="h-3 w-3 text-[#2563EB]" />
          Operator Interventions
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => dispatchSecurityTeam('team-04', selectedZone.id)}
            disabled={isTeam04Moving || isTeam04Arrived}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              isTeam04Moving || isTeam04Arrived
                ? 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] shadow-sm active:scale-95'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{isTeam04Moving ? 'EN ROUTE' : isTeam04Arrived ? 'ARRIVED' : 'DISPATCH TEAM'}</span>
          </button>

          <button
            onClick={() => redirectCrowd(selectedZone.id, 'gate-c')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-mono font-bold bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>REROUTE FLOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
