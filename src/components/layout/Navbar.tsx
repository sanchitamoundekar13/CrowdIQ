import React from 'react';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Radio, 
  Calendar,
  Layers,
  Shield,
  Activity
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Navbar: React.FC = () => {
  const { 
    settings, 
    stage, 
    emergencyMode, 
    isSimulating, 
    soundEnabled, 
    currentTime,
    startSurgeSimulation, 
    toggleEmergencyMode, 
    toggleSound, 
    resetSimulation 
  } = useSimulation();

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Event & Title Context */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold font-mono tracking-tight text-[#0F172A]">
              Crowd<span className="text-[#2563EB]">IQ</span>
            </span>
            <span className="text-xs text-[#CBD5E1] font-mono">|</span>
            <span className="text-xs text-[#475569] font-medium hidden sm:inline-block">
              Intelligent Crowd Safety Command Operations
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#64748B] mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#2563EB]" />
              <span className="text-[#0F172A] font-semibold">{settings.eventName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-ping" />
              LIVE TELEMETRY
            </span>
            <span className="hidden md:inline text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]">
              DEMO SIMULATION
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions and Controls */}
      <div className="flex items-center gap-2.5">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-mono text-[#0F172A]">
          <Clock className="h-3.5 w-3.5 text-[#2563EB]" />
          <span className="font-bold">{currentTime}</span>
          <span className="text-[#64748B] text-[10px]">IST</span>
        </div>

        {/* Audio Alert Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled 
              ? 'border-[#BFDBFE] text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE]' 
              : 'border-[#CBD5E1] text-[#94A3B8] bg-white hover:bg-[#F8FAFC]'
          }`}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Reset State Button */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation State"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-mono font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* SIMULATE CROWD SURGE */}
        <button
          onClick={startSurgeSimulation}
          disabled={isSimulating || (stage !== 'NORMAL' && stage !== 'SAFE')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
            stage === 'NORMAL' || stage === 'SAFE'
              ? 'bg-[#2563EB] border-[#1D4ED8] text-white hover:bg-[#1D4ED8] shadow-sm active:scale-95'
              : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <Play className={`h-3.5 w-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'SIMULATING...' : 'START SIMULATION'}</span>
        </button>

        {/* EMERGENCY MODE TOGGLE */}
        <button
          onClick={toggleEmergencyMode}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
            emergencyMode
              ? 'bg-[#DC2626] border-[#B91C1C] text-white shadow-sm animate-pulse'
              : 'border-[#FCA5A5] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{emergencyMode ? 'EMERGENCY ACTIVE' : 'EMERGENCY MODE'}</span>
        </button>
      </div>
    </header>
  );
};
