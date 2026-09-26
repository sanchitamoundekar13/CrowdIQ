import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Zone, RiskLevel } from '../../types';
import { Layers, Shield, Navigation, AlertCircle, Eye, Flame, Users } from 'lucide-react';

export const VenueMapCanvas: React.FC = () => {
  const { zones, selectedZoneId, selectZone, securityTeams, emergencyMode, stage } = useSimulation();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  const [showSecuritySquads, setShowSecuritySquads] = useState(true);

  const getZoneRiskColor = (level: RiskLevel, density: number, isSelected: boolean) => {
    switch (level) {
      case 'CRITICAL':
        return {
          fill: isSelected ? 'rgba(220, 38, 38, 0.22)' : 'rgba(220, 38, 38, 0.14)',
          stroke: '#DC2626',
          badgeBg: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] font-bold',
          textColor: 'text-[#DC2626]',
        };
      case 'HIGH':
        return {
          fill: isSelected ? 'rgba(245, 158, 11, 0.20)' : 'rgba(245, 158, 11, 0.12)',
          stroke: '#F59E0B',
          badgeBg: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-bold',
          textColor: 'text-[#D97706]',
        };
      case 'WATCH':
        return {
          fill: isSelected ? 'rgba(234, 179, 8, 0.18)' : 'rgba(234, 179, 8, 0.10)',
          stroke: '#EAB308',
          badgeBg: 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A] font-semibold',
          textColor: 'text-[#CA8A04]',
        };
      case 'SAFE':
      default:
        return {
          fill: isSelected ? 'rgba(22, 163, 74, 0.18)' : 'rgba(22, 163, 74, 0.08)',
          stroke: '#16A34A',
          badgeBg: 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]',
          textColor: 'text-[#16A34A]',
        };
    }
  };

  return (
    <div className="relative rounded-xl border border-[#CBD5E1] bg-white overflow-hidden shadow-sm flex flex-col h-[520px]">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E2E8F0] bg-white z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#2563EB]" />
          <span className="text-xs font-mono font-bold tracking-wider text-[#0F172A] uppercase">
            Interactive Venue Spatial Grid (Metropolitan Arena)
          </span>
          {emergencyMode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DC2626] text-white font-bold animate-pulse">
              EMERGENCY ACTIVE
            </span>
          )}
        </div>

        {/* View Layer Toggles */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
              showHeatmap
                ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                : 'bg-white text-[#64748B] border-[#CBD5E1]'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setShowEvacRoutes(!showEvacRoutes)}
            className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
              showEvacRoutes
                ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                : 'bg-white text-[#64748B] border-[#CBD5E1]'
            }`}
          >
            Flow Vectors
          </button>
          <button
            onClick={() => setShowSecuritySquads(!showSecuritySquads)}
            className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
              showSecuritySquads
                ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                : 'bg-white text-[#64748B] border-[#CBD5E1]'
            }`}
          >
            Security Squads
          </button>
        </div>
      </div>

      {/* SVG Canvas Viewport */}
      <div className="relative flex-1 bg-[#F8FAFC] w-full h-full p-2 flex items-center justify-center select-none overflow-hidden">
        <svg
          viewBox="0 0 850 540"
          className="w-full h-full object-contain"
        >
          {/* Background Blueprint Grid */}
          <defs>
            <pattern id="venueGridLight" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="850" height="540" fill="url(#venueGridLight)" />

          {/* Venue Outer Perimeter Wall */}
          <rect
            x="20"
            y="20"
            width="810"
            height="500"
            rx="12"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text x="35" y="45" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            VENUE BOUNDARY • CAPACITY 25,000
          </text>

          {/* Evacuation Routes & Movement Vectors */}
          {showEvacRoutes && (
            <g stroke="#2563EB" strokeWidth="2.5" fill="none" strokeDasharray="6,4">
              <path d="M 270 135 L 310 240" />
              <path d="M 580 135 L 550 240" />
              <path d="M 270 445 L 310 445" />
              <path d="M 550 320 L 580 445" />
            </g>
          )}

          {/* Zones */}
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const style = getZoneRiskColor(zone.riskLevel, zone.density, isSelected);
            const { x, y, width, height } = zone.coordinates;

            return (
              <g
                key={zone.id}
                onClick={() => selectZone(zone.id)}
                className="cursor-pointer transition-all duration-150"
              >
                {/* Zone Base Fill */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="8"
                  fill={showHeatmap ? style.fill : 'rgba(255,255,255,0.7)'}
                  stroke={isSelected ? '#2563EB' : style.stroke}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Zone Header Ribbon */}
                <rect x={x} y={y} width={width} height="24" rx="8" fill="rgba(255, 255, 255, 0.85)" />
                <text x={x + 10} y={y + 16} fill="#0F172A" fontSize="11" fontWeight="700">
                  {zone.shortName}
                </text>

                {/* Density Badge */}
                <rect
                  x={x + width - 52}
                  y={y + 4}
                  width="44"
                  height="16"
                  rx="4"
                  fill="#FFFFFF"
                  stroke={isSelected ? '#2563EB' : style.stroke}
                  strokeWidth="1"
                />
                <text
                  x={x + width - 30}
                  y={y + 16}
                  fill={style.stroke}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {zone.density}%
                </text>

                {/* Real-time Occupant Stats */}
                <text x={x + 10} y={y + 45} fill="#475569" fontSize="11" fontWeight="600">
                  {zone.currentPeople.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                </text>
                <text x={x + 10} y={y + 65} fill="#64748B" fontSize="9.5" fontFamily="monospace">
                  Flow: {zone.flowDirection}
                </text>

                {/* Density Bar */}
                <rect x={x + 10} y={y + height - 14} width={width - 20} height="5" rx="2.5" fill="#E2E8F0" />
                <rect
                  x={x + 10}
                  y={y + height - 14}
                  width={Math.min(width - 20, ((width - 20) * zone.density) / 100)}
                  height="5"
                  rx="2.5"
                  fill={style.stroke}
                />
              </g>
            );
          })}

          {/* Security Squad Locations */}
          {showSecuritySquads &&
            securityTeams.map((team, idx) => {
              const offsets = [
                { cx: 160, cy: 135 },
                { cx: 430, cy: 275 },
                { cx: 690, cy: 445 },
                { cx: 495, cy: 450 },
              ];
              const pt = offsets[idx % offsets.length];

              return (
                <g key={team.id}>
                  <circle cx={pt.cx} cy={pt.cy} r="10" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <text
                    x={pt.cx}
                    y={pt.cy + 3.5}
                    fill="#FFFFFF"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    S{idx + 1}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Floating Quick Zone Legend & Active Stage Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-[#CBD5E1] rounded-lg px-3 py-1.5 flex items-center gap-3 text-[11px] font-mono shadow-xs">
          <span className="text-[#64748B]">STAGE:</span>
          <span className="font-bold text-[#0F172A]">{stage}</span>
          <span className="text-[#E2E8F0]">|</span>
          <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Safe (&lt;50%)
          </span>
          <span className="flex items-center gap-1.5 text-[#D97706] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> High (70-85%)
          </span>
          <span className="flex items-center gap-1.5 text-[#DC2626] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Critical (&gt;85%)
          </span>
        </div>
      </div>
    </div>
  );
};
