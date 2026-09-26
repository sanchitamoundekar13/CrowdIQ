import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Settings, Save, Sliders, Volume2, ShieldCheck, Gauge, Layers } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSimulation();

  const [formData, setFormData] = useState({
    eventName: settings.eventName,
    venueCapacity: settings.venueCapacity,
    totalGates: settings.totalGates,
    activeSecurityTeams: settings.activeSecurityTeams,
    criticalDensityThreshold: settings.criticalDensityThreshold,
    warningDensityThreshold: settings.warningDensityThreshold,
    simulationSpeed: settings.simulationSpeed,
    soundAlertsEnabled: settings.soundAlertsEnabled,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Event Configuration & Safety Thresholds
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Configure venue capacity ceilings, early warning sensitivities, and simulation parameters
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Venue & Event Info */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0] mb-4">
            <Layers className="h-4 w-4 text-[#2563EB]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              General Venue & Operation Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#64748B] mb-1.5 uppercase font-bold">Event Name / Title</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#64748B] mb-1.5 uppercase font-bold">Maximum Venue Capacity</label>
              <input
                type="number"
                value={formData.venueCapacity}
                onChange={(e) => setFormData({ ...formData, venueCapacity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#64748B] mb-1.5 uppercase font-bold">Active Entry/Exit Gates</label>
              <input
                type="number"
                value={formData.totalGates}
                onChange={(e) => setFormData({ ...formData, totalGates: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#64748B] mb-1.5 uppercase font-bold">Security Teams Deployed</label>
              <input
                type="number"
                value={formData.activeSecurityTeams}
                onChange={(e) => setFormData({ ...formData, activeSecurityTeams: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hazard Alert Thresholds */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0] mb-4">
            <Gauge className="h-4 w-4 text-[#D97706]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              Dynamic Safety Threshold Triggers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono text-[#64748B] uppercase font-bold">Warning Threshold (%)</label>
                <span className="text-xs font-mono text-[#D97706] font-bold">{formData.warningDensityThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={formData.warningDensityThreshold}
                onChange={(e) => setFormData({ ...formData, warningDensityThreshold: Number(e.target.value) })}
                className="w-full accent-[#F59E0B]"
              />
              <span className="text-[10px] text-[#64748B] font-mono">Triggers alert notifications & standby squad deployment</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono text-[#64748B] uppercase font-bold">Critical Threshold (%)</label>
                <span className="text-xs font-mono text-[#DC2626] font-bold">{formData.criticalDensityThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={formData.criticalDensityThreshold}
                onChange={(e) => setFormData({ ...formData, criticalDensityThreshold: Number(e.target.value) })}
                className="w-full accent-[#DC2626]"
              />
              <span className="text-[10px] text-[#64748B] font-mono">Forces automated turnstile gating & emergency evacuation alerts</span>
            </div>
          </div>
        </div>

        {/* Section 3: System Preferences */}
        <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0] mb-4">
            <Volume2 className="h-4 w-4 text-[#16A34A]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
              Audio & Pacing Configuration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <div>
                <span className="text-xs font-mono text-[#0F172A] font-bold block">Synthesizer Audio Chimes</span>
                <span className="text-[10px] font-mono text-[#64748B]">Audible alarms on Warning/Critical state change</span>
              </div>
              <input
                type="checkbox"
                checked={formData.soundAlertsEnabled}
                onChange={(e) => setFormData({ ...formData, soundAlertsEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-[#2563EB]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <div>
                <span className="text-xs font-mono text-[#0F172A] font-bold block">Simulation Pacer</span>
                <span className="text-[10px] font-mono text-[#64748B]">Standard 1x Real-time progression speed</span>
              </div>
              <span className="text-xs font-mono text-[#2563EB] font-bold">1x Speed</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold tracking-wider shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>SAVE CONFIGURATION PARAMETERS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
