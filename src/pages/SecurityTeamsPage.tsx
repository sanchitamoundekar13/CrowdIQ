import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldCheck, Shield, Radio, Navigation, Clock, UserCheck, Send, CheckCircle2 } from 'lucide-react';

export const SecurityTeamsPage: React.FC = () => {
  const { securityTeams, dispatchSecurityTeam, zones } = useSimulation();
  const [selectedTeam, setSelectedTeam] = useState<string>('team-04');
  const [targetZone, setTargetZone] = useState<string>('gate-b');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]';
      case 'ACTIVE':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      case 'MOVING':
      case 'DISPATCHED':
        return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] animate-pulse';
      case 'ARRIVED':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Security Squad Dispatch & Tracking
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Rapid response unit positioning, real-time telemetry, and perimeter enforcement
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-mono text-xs font-semibold flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#16A34A]" />
          4 Squads Online
        </span>
      </div>

      {/* Security Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`p-5 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-150 ${
              selectedTeam === team.id
                ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                : 'border-[#CBD5E1] hover:border-[#94A3B8]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#0F172A] block">{team.name}</span>
                <span className="text-[11px] text-[#64748B] font-mono">Lead: {team.leader}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(team.status)}`}>
                {team.status}
              </span>
            </div>

            <div className="my-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#475569]">
                <span>Assigned Sector:</span>
                <strong className="text-[#0F172A]">{team.assignedZone}</strong>
              </div>
              <div className="flex items-center justify-between text-[#475569]">
                <span>Squad Strength:</span>
                <strong className="text-[#0F172A]">{team.membersCount} Officers</strong>
              </div>
              <div className="flex items-center justify-between text-[#475569]">
                <span>Proximity Distance:</span>
                <strong className="text-[#2563EB]">{team.distanceMeters} meters</strong>
              </div>
              <div className="flex items-center justify-between text-[#475569]">
                <span>Estimated ETA:</span>
                <strong className="text-[#D97706]">{team.etaSeconds > 0 ? `00:${String(team.etaSeconds).padStart(2, '0')}s` : 'On Station'}</strong>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatchSecurityTeam(team.id, 'gate-b');
              }}
              disabled={team.status === 'MOVING' || team.status === 'ARRIVED'}
              className={`w-full py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                team.status === 'MOVING' || team.status === 'ARRIVED'
                  ? 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] shadow-sm active:scale-95'
              }`}
            >
              {team.status === 'MOVING' ? 'EN ROUTE...' : team.status === 'ARRIVED' ? 'ARRIVED ON SITE' : 'DEPLOY TO GATE B'}
            </button>
          </div>
        ))}
      </div>

      {/* Manual Dispatch Console */}
      <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-[#2563EB]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              Direct Tactical Dispatch Terminal
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B]">Immediate Dispatch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-[#64748B] mb-1 font-bold uppercase">Select Squad:</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
            >
              {securityTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1 font-bold uppercase">Target Zone Destination:</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} ({z.density}% Load)</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => dispatchSecurityTeam(selectedTeam, targetZone)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>DISPATCH SQUAD NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
