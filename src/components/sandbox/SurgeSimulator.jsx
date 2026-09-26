import React from 'react';
import { Sliders, Zap, AlertTriangle, ShieldCheck, RefreshCw, Flame, Wind } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdDataContext';

export function SurgeSimulator() {
  const { 
    activeSimulationPreset, 
    triggerSimulationPreset, 
    influxMultiplier, 
    setInfluxMultiplier,
    compositeSriResult,
    totalHeadcount,
    venueCapacity
  } = useCrowdData();

  const presets = [
    {
      id: 'nominal',
      name: 'Nominal Operations',
      desc: 'Uniform pacing, all turnstiles operating within 40-60% capacity.',
      badge: 'STABLE',
      color: '#10b981',
      icon: ShieldCheck
    },
    {
      id: 'surge',
      name: 'Main Act Finale Surge',
      desc: 'Sudden mass movement towards exits and merchandise corridors (+240% inflow).',
      badge: 'SURGE +240%',
      color: '#f59e0b',
      icon: Wind
    },
    {
      id: 'stampede_hazard',
      name: 'Catastrophic Chokepoint Jam',
      desc: 'Stage floor choke + Gate A barrier failure. Density exceeds 5.2 p/m². Critical crush hazard.',
      badge: 'CRITICAL STAMPEDE',
      color: '#ef4444',
      icon: Flame
    },
    {
      id: 'evacuation_reroute',
      name: 'Smart Reroute Dissipation',
      desc: 'AI dynamic wayfinding redirects 45% of attendees to West corridor, dissipating bottleneck.',
      badge: 'DISSIPATING',
      color: '#00f0ff',
      icon: Zap
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--accent-gold)" />
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              DYNAMIC INCIDENT DISPATCH & STRESS DRILL CONTROLLER
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Conduct operational safety drills and stress-test the real-time AI Stampede Prevention systems against peak load incidents.
          </p>
        </div>

        <button
          onClick={() => triggerSimulationPreset('nominal')}
          className="cyber-btn"
          style={{ fontSize: '0.75rem' }}
        >
          <RefreshCw size={13} />
          Reset to Baseline
        </button>
      </div>

      {/* Preset Scenario Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {presets.map(p => {
          const Icon = p.icon;
          const isActive = activeSimulationPreset === p.id;

          return (
            <div
              key={p.id}
              onClick={() => triggerSimulationPreset(p.id)}
              style={{
                background: isActive ? `${p.color}15` : 'var(--bg-card)',
                border: `1.5px solid ${isActive ? p.color : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 0 16px ${p.color}30` : 'var(--shadow-glass)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={p.color} />
                </div>
                <span className="cyber-badge" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40`, fontSize: '0.65rem' }}>
                  {p.badge}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                {p.name}
              </div>

              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {p.desc}
              </p>

              {isActive && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', fontWeight: 700, color: p.color, fontFamily: 'var(--font-mono)' }}>
                  ● SCENARIO ACTIVE IN TELEMETRY ENGINE
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Influx Slider */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              CONTINUOUS INFLUX MULTIPLIER: {influxMultiplier.toFixed(1)}x
            </span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Directly scales turnstile admission velocity and arrival stochastic waves.
            </div>
          </div>

          <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: compositeSriResult.color }}>
            SRI: {compositeSriResult.sri}% [{compositeSriResult.level}]
          </span>
        </div>

        <input
          type="range"
          min="0.5"
          max="5.0"
          step="0.1"
          value={influxMultiplier}
          onChange={(e) => setInfluxMultiplier(parseFloat(e.target.value))}
          style={{ width: '100%', height: '8px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <span>0.5x (Trickle)</span>
          <span>1.0x (Standard)</span>
          <span>2.5x (Peak Rush)</span>
          <span>5.0x (Extreme Surge)</span>
        </div>
      </div>
    </div>
  );
}
