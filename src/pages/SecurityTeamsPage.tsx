import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldCheck, 
  Shield, 
  Radio, 
  Navigation, 
  Clock, 
  UserCheck, 
  Send, 
  CheckCircle2, 
  Users, 
  AlertTriangle, 
  Plus, 
  X, 
  Zap, 
  RotateCcw,
  Volume2
} from 'lucide-react';

export const SecurityTeamsPage: React.FC = () => {
  const { 
    securityTeams, 
    dispatchSecurityTeam, 
    zones, 
    addSecurityTeam,
    updateSecurityTeam,
    playAlertSound,
    currentTime
  } = useSimulation();

  const [selectedTeam, setSelectedTeam] = useState<string>(securityTeams[0]?.id || 'team-04');
  const [targetZone, setTargetZone] = useState<string>('gate-b');
  const [missionPriority, setMissionPriority] = useState<string>('HIGH');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // Live radio transmission logs state
  const [radioTransmissions, setRadioTransmissions] = useState<Array<{
    id: string;
    timestamp: string;
    sender: string;
    message: string;
    type: 'dispatch' | 'arrival' | 'routine';
  }>>([
    {
      id: 'tx-1',
      timestamp: '09:44:12',
      sender: 'Alpha Squad (Lt. R. Vance)',
      message: 'Gate A turnstiles clear. Inflow proceeding at 45 persons/minute.',
      type: 'routine'
    },
    {
      id: 'tx-2',
      timestamp: '09:44:50',
      sender: 'Delta Team 04 (Sgt. M. Jenkins)',
      message: 'Positioned at Gate B perimeter. Monitoring turnstile bottleneck queue.',
      type: 'routine'
    },
    {
      id: 'tx-3',
      timestamp: '09:45:02',
      sender: 'CENTRAL DISPATCH',
      message: 'All units hold assigned sectors. CCTV telemetry nominal across sectors.',
      type: 'dispatch'
    }
  ]);

  // Form state for creating a new squad
  const [newSquadForm, setNewSquadForm] = useState({
    name: 'Foxtrot Unit 06',
    leader: 'Capt. D. Miller',
    assignedZone: 'Main Concourse',
    membersCount: 4,
    distanceMeters: 60,
    etaSeconds: 35
  });

  // Calculate high-level stats
  const totalOfficers = securityTeams.reduce((acc, t) => acc + t.membersCount, 0);
  const activeMovingCount = securityTeams.filter(t => t.status === 'MOVING' || t.status === 'DISPATCHED').length;
  const availableCount = securityTeams.filter(t => t.status === 'AVAILABLE').length;

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

  const handleManualDispatch = () => {
    const squad = securityTeams.find(t => t.id === selectedTeam);
    const destZone = zones.find(z => z.id === targetZone);
    if (!squad || !destZone) return;

    dispatchSecurityTeam(selectedTeam, targetZone);
    playAlertSound('warning');

    // Add radio dispatch record
    const newTx = {
      id: 'tx-' + Date.now(),
      timestamp: currentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sender: `CENTRAL DISPATCH → ${squad.name}`,
      message: `TACTICAL ORDER: Immediate priority deploy to ${destZone.name}. Mitigation protocol active. ETA ~00:${String(squad.etaSeconds || 45).padStart(2, '0')}.`,
      type: 'dispatch' as const
    };
    setRadioTransmissions(prev => [newTx, ...prev.slice(0, 9)]);
  };

  const handleRegisterSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadForm.name.trim()) return;

    addSecurityTeam({
      name: newSquadForm.name,
      leader: newSquadForm.leader,
      assignedZone: newSquadForm.assignedZone,
      membersCount: Number(newSquadForm.membersCount) || 4,
      status: 'AVAILABLE',
      distanceMeters: Number(newSquadForm.distanceMeters) || 50,
      etaSeconds: Number(newSquadForm.etaSeconds) || 30
    });

    setIsRegisterModalOpen(false);
    setNewSquadForm({
      name: `Squad 0${securityTeams.length + 2}`,
      leader: 'Officer in Charge',
      assignedZone: 'Plaza South',
      membersCount: 4,
      distanceMeters: 70,
      etaSeconds: 40
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Tactical Security Dispatch & Roster Control
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Rapid response unit positioning, perimeter enforcement, and tactical radio dispatch matrix
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-mono text-xs font-semibold flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#16A34A] animate-pulse" />
            <span>Radio Grid Encrypted • {securityTeams.length} Squads</span>
          </span>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold font-mono shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>COMMISSION SQUAD</span>
          </button>
        </div>
      </div>

      {/* Security Fleet Top Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Active Personnel</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">{totalOfficers} Officers</div>
          <span className="text-[11px] text-[#64748B]">Across {securityTeams.length} tactical units</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Available Squads</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#16A34A]">{availableCount} Units</div>
          <span className="text-[11px] text-[#16A34A] font-semibold">Immediate standby readiness</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">En Route / Moving</span>
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping" />
          </div>
          <div className={`text-2xl font-extrabold ${activeMovingCount > 0 ? 'text-[#D97706]' : 'text-[#0F172A]'}`}>
            {activeMovingCount} Units
          </div>
          <span className="text-[11px] text-[#64748B]">Active transit vectors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Average Deployment ETA</span>
            <Clock className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">00:38s</div>
          <span className="text-[11px] text-[#16A34A] font-semibold">Target &lt; 01:00 SLA</span>
        </div>
      </div>

      {/* Security Teams Grid Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2563EB]" />
            Active Tactical Units Fleet ({securityTeams.length})
          </h2>
          <span className="text-xs text-[#64748B] font-mono">Select any unit to inspect telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityTeams.map((team) => {
            const isSel = selectedTeam === team.id;
            return (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`p-5 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-150 ${
                  isSel
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md'
                    : 'border-[#CBD5E1] hover:border-[#94A3B8]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-[#0F172A] block">{team.name}</span>
                    <span className="text-[11px] text-[#64748B] font-mono">Lead: {team.leader}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusBadge(team.status)}`}>
                    {team.status}
                  </span>
                </div>

                <div className="my-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#475569]">
                    <span>Current Sector:</span>
                    <strong className="text-[#0F172A]">{team.assignedZone}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#475569]">
                    <span>Personnel:</span>
                    <strong className="text-[#0F172A]">{team.membersCount} Officers</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#475569]">
                    <span>Perimeter Distance:</span>
                    <strong className="text-[#2563EB]">{team.distanceMeters} meters</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#475569]">
                    <span>Deployment ETA:</span>
                    <strong className="text-[#D97706]">
                      {team.etaSeconds > 0 ? `00:${String(team.etaSeconds).padStart(2, '0')}s` : 'On Station'}
                    </strong>
                  </div>
                </div>

                {/* Instant Sector Dispatch Action */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
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
                    {team.status === 'MOVING' ? 'EN ROUTE...' : team.status === 'ARRIVED' ? 'ON STATION' : 'DEPLOY → GATE B'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Tactical Dispatch Console (Left 7 Cols) + Live Radio Transmissions (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tactical Dispatch Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Direct Tactical Dispatch Terminal
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#16A34A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              READY TO DISPATCH
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[#64748B] mb-1 font-bold uppercase">Assigned Squad:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
              >
                {securityTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1 font-bold uppercase">Destination Sector:</label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name} ({z.density}% Load)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#64748B] mb-1 font-bold uppercase">Mission Priority:</label>
              <select
                value={missionPriority}
                onChange={(e) => setMissionPriority(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
              >
                <option value="CRITICAL">EMERGENCY DISPATCH</option>
                <option value="HIGH">HIGH (Bottleneck Alert)</option>
                <option value="ROUTINE">ROUTINE PATROL</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-mono">
              Orders will transmit immediately over encrypted squad frequency.
            </span>

            <button
              onClick={handleManualDispatch}
              className="py-2.5 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs font-mono transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>TRANSMIT DISPATCH ORDER</span>
            </button>
          </div>
        </div>

        {/* Live Radio Transmissions Log (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Live Radio Transmission Log
              </h3>
            </div>
            <span className="text-[10px] text-[#16A34A] font-mono font-semibold">ENCRYPTED</span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
            {radioTransmissions.map((tx) => (
              <div 
                key={tx.id} 
                className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                  tx.type === 'dispatch'
                    ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <strong className="text-[#0F172A]">{tx.sender}</strong>
                  <span className="text-[#64748B]">{tx.timestamp}</span>
                </div>
                <p className="text-[11px] leading-tight">{tx.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Commission Squad Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#CBD5E1] w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Commission New Security Squad
                </h3>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSquad} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Squad Unit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Charlie Squad 03"
                  value={newSquadForm.name}
                  onChange={(e) => setNewSquadForm({ ...newSquadForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Squad Leader</label>
                  <input
                    type="text"
                    placeholder="Officer Lead"
                    value={newSquadForm.leader}
                    onChange={(e) => setNewSquadForm({ ...newSquadForm, leader: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Officers Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newSquadForm.membersCount}
                    onChange={(e) => setNewSquadForm({ ...newSquadForm, membersCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Initial Assigned Sector</label>
                <select
                  value={newSquadForm.assignedZone}
                  onChange={(e) => setNewSquadForm({ ...newSquadForm, assignedZone: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition shadow-sm cursor-pointer"
                >
                  Register Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
