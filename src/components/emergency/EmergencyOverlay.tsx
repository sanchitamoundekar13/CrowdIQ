import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  PhoneCall, 
  Navigation, 
  HeartHandshake,
  CheckCircle2,
  Users
} from 'lucide-react';

export const EmergencyOverlay: React.FC = () => {
  const { emergencyMode, toggleEmergencyMode, zones, securityTeams, totalPeople } = useSimulation();
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [medicalDispatched, setMedicalDispatched] = useState(false);

  if (!emergencyMode) return null;

  const criticalZones = zones.filter(z => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH');
  const safeExits = zones.filter(z => z.category === 'EXIT' || (z.category === 'GATE' && z.riskLevel === 'SAFE'));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border-2 border-[#DC2626] bg-white p-6 shadow-2xl text-[#0F172A]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#FCA5A5]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#DC2626] text-white animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono tracking-wider text-[#DC2626] uppercase">
                  EMERGENCY MODE ACTIVE
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-bold">
                  PRIORITY RESPONSE
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                Priority venue evacuation & rapid incident response orchestration
              </p>
            </div>
          </div>

          <button
            onClick={toggleEmergencyMode}
            className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Emergency Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Critical Hazard Zones */}
          <div className="p-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2]">
            <span className="text-xs font-mono font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Hazard Zones ({criticalZones.length})
            </span>
            <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto pr-1">
              {criticalZones.map(z => (
                <div key={z.id} className="p-2 rounded-lg bg-white border border-[#FECACA] flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0F172A]">{z.name}</span>
                  <span className="text-[#DC2626] font-bold">{z.density}% Load</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Egress Routes */}
          <div className="p-4 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4]">
            <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Primary Egress Routes ({safeExits.length})
            </span>
            <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto pr-1">
              {safeExits.map(z => (
                <div key={z.id} className="p-2 rounded-lg bg-white border border-[#BBF7D0] flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0F172A]">{z.name}</span>
                  <span className="text-[#16A34A] font-bold">Clear Flow ({z.density}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={() => setBroadcastSent(true)}
            className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              broadcastSent
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
                : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white border-[#B91C1C]'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>{broadcastSent ? 'PUBLIC ANNOUNCEMENT SENT' : 'BROADCAST EVACUATION PA'}</span>
          </button>

          <button
            onClick={() => setMedicalDispatched(true)}
            className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              medicalDispatched
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
                : 'bg-white hover:bg-[#F8FAFC] text-[#0F172A] border-[#CBD5E1]'
            }`}
          >
            <HeartHandshake className="h-4 w-4 text-[#2563EB]" />
            <span>{medicalDispatched ? 'PARAMEDICS DISPATCHED' : 'DISPATCH MEDICAL SQUADS'}</span>
          </button>

          <button
            onClick={toggleEmergencyMode}
            className="p-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-mono font-bold text-[#475569] transition-all cursor-pointer"
          >
            <span>DEACTIVATE EMERGENCY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
