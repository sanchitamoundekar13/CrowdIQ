import React from 'react';
import { 
  Activity, 
  Users, 
  Percent, 
  AlertTriangle, 
  Video, 
  Clock, 
  Building2, 
  CheckCircle, 
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Maximize2
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function LiveCrowdMonitoringPreview({ onLaunchFullConsole, onJumpToSimulation }) {
  const { 
    totalPeople, 
    averageDensity, 
    activeAlertsCount, 
    stage, 
    currentTime, 
    zones, 
    cameraFeeds 
  } = useSimulation();

  // Dynamic risk calculation from current simulation state
  const riskLabel = stage === 'CRITICAL' ? 'CRITICAL' : stage === 'WARNING' || stage === 'BUILDING' ? 'MODERATE' : 'LOW';
  const riskBadgeClass = stage === 'CRITICAL' 
    ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' 
    : stage === 'WARNING' || stage === 'BUILDING'
    ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
    : 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]';

  return (
    <section className="bg-[#F7F9FC] py-10 lg:py-12 border-b border-[#E2E8F0]" id="live-monitoring">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Security Ops Metadata Bar */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                  Control Room Telemetry
                </span>
                <span className="text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                  LIVE INFERENCE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                LIVE CROWD MONITORING
              </h2>
            </div>

            {/* Quick Action & Full Console Launcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#16A34A]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>SYSTEM ONLINE</span>
              </div>

              <button
                onClick={onLaunchFullConsole}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Launch Workstation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Operational Environment Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#475569] shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#94A3B8]">Venue</span>
                <span className="font-semibold text-[#0F172A]">Metropolitan Arena</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#475569] shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#94A3B8]">Active Feeds</span>
                <span className="font-semibold text-[#0F172A]">4 / 4 CCTV Streams</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#475569] shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#94A3B8]">System Timestamp</span>
                <span className="font-mono font-semibold text-[#0F172A]">{currentTime} IST</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#94A3B8]">Inference Health</span>
                <span className="font-semibold text-[#16A34A]">All Nodes Nominal</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Security Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: People Detected */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-all hover:border-[#CBD5E1]">
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">People Detected</span>
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#0F172A]">
                {totalPeople > 0 ? totalPeople.toLocaleString() : '1,842'}
              </span>
              <span className="text-xs text-[#64748B]">/ 25,000 cap</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
              <span className="text-[#16A34A] font-medium flex items-center gap-0.5">
                +12% vs last hr
              </span>
              <span className="font-mono text-[11px]">Turnstiles + Arena</span>
            </div>
          </div>

          {/* Card 2: Crowd Density */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-all hover:border-[#CBD5E1]">
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Crowd Density</span>
              <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#0F172A]">
                {averageDensity > 0 ? averageDensity : 72}%
              </span>
              <span className="text-xs text-[#64748B]">mean occupancy</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  averageDensity > 80 ? 'bg-[#DC2626]' : averageDensity > 60 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                }`}
                style={{ width: `${Math.min(100, averageDensity || 72)}%` }}
              ></div>
            </div>
          </div>

          {/* Card 3: Risk Level */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-all hover:border-[#CBD5E1]">
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Risk Level</span>
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold font-mono px-2.5 py-0.5 rounded border ${riskBadgeClass}`}>
                {riskLabel}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
              <span>Gate B: Bottleneck Alert</span>
              <span className="font-mono text-[11px] font-semibold text-[#0F172A]">Index 68/100</span>
            </div>
          </div>

          {/* Card 4: Active Alerts */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-all hover:border-[#CBD5E1]">
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#0F172A]">
                {String(activeAlertsCount || 3).padStart(2, '0')}
              </span>
              <span className="text-xs text-[#DC2626] font-semibold">
                {activeAlertsCount > 1 ? 'Attention required' : 'Monitored'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
              <span className="text-[#64748B]">1 Critical • 2 Warning</span>
              <span className="font-mono text-[11px] text-[#2563EB] font-semibold">Triage queue</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
