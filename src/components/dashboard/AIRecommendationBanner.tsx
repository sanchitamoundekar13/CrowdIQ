import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CheckCircle2, XCircle, ArrowRight, Shield, Share2, Sparkles, AlertTriangle } from 'lucide-react';

export const AIRecommendationBanner: React.FC = () => {
  const { 
    stage, 
    recommendationApproved, 
    recommendationDismissed, 
    approveRecommendation, 
    dismissRecommendation,
    selectedZone 
  } = useSimulation();

  if (stage === 'NORMAL' || stage === 'SAFE') {
    return (
      <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white border border-[#BBF7D0] text-[#16A34A]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#15803D]">
              System State: Stable Flow
            </h4>
            <p className="text-xs text-[#166534]">
              All venue gates operating within normal capacity limits. No intervention required.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white border border-[#BBF7D0] text-[#16A34A] font-semibold uppercase">
          Autonomous Safety Guard Active
        </span>
      </div>
    );
  }

  if (recommendationDismissed) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-[#94A3B8]" />
          <span className="text-xs font-mono text-[#64748B]">
            Automated recommendation dismissed by operator override. Manual monitoring active.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-5 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Info & Actions */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white border border-[#BFDBFE] text-[#2563EB] shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                AUTOMATED HAZARD RECOMMENDATION & DECISION SUPPORT
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] font-semibold border border-[#FCA5A5] uppercase">
                {selectedZone?.shortName || 'Gate B'} Congestion Risk
              </span>
            </div>

            <p className="text-xs text-[#334155] font-mono mt-1">
              High density accumulation forecasted in ~4 minutes. Proposed automated stabilization plan:
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#CBD5E1] text-[#2563EB] flex items-center gap-1.5 font-semibold">
                <Share2 className="h-3 w-3" />
                Redirect incoming visitors → Gate C (West Plaza)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#CBD5E1] text-[#2563EB] flex items-center gap-1.5 font-semibold">
                <Shield className="h-3 w-3" />
                Deploy Security Team 04 (Rapid Response)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#CBD5E1] text-[#475569]">
                Pace turnstile entry flow by -40%
              </span>
            </div>
          </div>
        </div>

        {/* Right Decision Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
          <button
            onClick={dismissRecommendation}
            className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-mono font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            DISMISS
          </button>

          <button
            onClick={approveRecommendation}
            disabled={recommendationApproved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              recommendationApproved
                ? 'bg-[#16A34A] text-white border border-[#15803D]'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] shadow-sm active:scale-95'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{recommendationApproved ? 'ACTIONS APPROVED & ACTIVE' : 'APPROVE & EXECUTE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
