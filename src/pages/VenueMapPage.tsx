import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { VenueMapCanvas } from '../components/dashboard/VenueMapCanvas';
import { ZoneDetailsDrawer } from '../components/dashboard/ZoneDetailsDrawer';
import { RiskBadge } from '../components/common/RiskBadge';
import { Map, Layers, Navigation, Shield, AlertTriangle } from 'lucide-react';

export const VenueMapPage: React.FC = () => {
  const { zones, selectedZoneId, selectZone } = useSimulation();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Venue Spatial & Evacuation Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Full-scale vector blueprint with dynamic crowd density and emergency evacuation corridors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Vector Map (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <VenueMapCanvas />
        </div>

        {/* Zone Details Drawer (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          <ZoneDetailsDrawer />
        </div>
      </div>

      {/* Zone Overview Grid List */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#2563EB]" />
          All Monitored Venue Sectors ({zones.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => selectZone(zone.id)}
              className={`p-4 rounded-xl border bg-white cursor-pointer transition-all duration-150 hover:border-[#94A3B8] shadow-sm ${
                selectedZoneId === zone.id ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20' : 'border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0F172A]">{zone.name}</span>
                <RiskBadge level={zone.riskLevel} size="sm" />
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs font-mono">
                <span className="text-[#64748B]">People: {zone.currentPeople.toLocaleString()} / {zone.maxCapacity.toLocaleString()}</span>
                <span className="text-[#2563EB] font-bold">{zone.density}%</span>
              </div>

              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    zone.density >= 85 ? 'bg-[#DC2626]' : zone.density >= 70 ? 'bg-[#F59E0B]' : zone.density >= 50 ? 'bg-[#EAB308]' : 'bg-[#16A34A]'
                  }`}
                  style={{ width: `${Math.min(100, zone.density)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>In: {zone.inflow}/m</span>
                <span>Out: {zone.outflow}/m</span>
                <span className={zone.densityTrend > 0 ? 'text-[#DC2626] font-semibold' : 'text-[#16A34A] font-semibold'}>
                  {zone.densityTrend > 0 ? `+${zone.densityTrend}%` : `${zone.densityTrend}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
