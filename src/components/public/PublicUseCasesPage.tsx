import React from 'react';
import { Building2, Music, Train, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PublicUseCasesPageProps {
  onLaunchPlatform: () => void;
}

export const PublicUseCasesPage: React.FC<PublicUseCasesPageProps> = ({ onLaunchPlatform }) => {
  const cases = [
    {
      icon: Building2,
      category: 'Sports & Mega Arenas',
      title: 'Stadium Bowl & Turnstile Flow Management',
      capacity: 'Up to 90,000 Spectators',
      challenge: 'High-velocity influx spikes 30 minutes before kick-off, leading to dangerous compression at outer turnstiles and corridor stairs.',
      solution: 'CrowdIQ continuously monitors ingress gates, identifies slow scanner lanes, and automatically reroutes attendees to adjacent turnstile banks.',
      outcomes: [
        '38% reduction in gate queue wait times',
        'Zero barrier collapse incidents',
        'Instant security squad repositioning'
      ]
    },
    {
      icon: Music,
      category: 'Music Festivals & Outdoor Grounds',
      title: 'Multi-Stage Egress & Mosh-Pit Safety',
      capacity: '30,000 - 100,000 Visitors',
      challenge: 'Simultaneous headline stage completions triggering tidal crowd cross-flows in poorly-illuminated festival pathways.',
      solution: 'Optical velocity tracking detects opposing vectors and automatically modulates lighting towers and public safety alerts.',
      outcomes: [
        'Continuous front-barrier pressure monitoring',
        'Automated medical route clearance',
        'Dynamic digital billboard wayfinding'
      ]
    },
    {
      icon: Train,
      category: 'Transit & Airport Terminals',
      title: 'Platform Chokepoint & Escalator Telemetry',
      capacity: 'Continuous Daily High Flux',
      challenge: 'Sudden train cancellations resulting in dangerous platform overcrowding and escalator landing pileups.',
      solution: 'CrowdIQ integrates station cameras with turnstile gating to throttle platform access before density exceeds 3 persons/m².',
      outcomes: [
        'Automated escalator emergency halt trigger',
        'Real-time passenger flow balancing',
        'Reduced dwell times on interchange platforms'
      ]
    },
    {
      icon: Layers,
      category: 'Expos & Trade Conventions',
      title: 'Multi-Hall Capacity & Egress Compliance',
      capacity: '15,000 - 45,000 Attendees',
      challenge: 'Keynote hall surges and booth congestion blocking emergency egress aisles contrary to fire safety regulations.',
      solution: 'Real-time zone occupancy tracking generates automated digital badge restrictions and alerts marshals before maximum capacity.',
      outcomes: [
        '100% compliance with local fire code standards',
        'Audit-ready hourly capacity logs',
        'Optimized exhibitor foot traffic distribution'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0F172A]">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
          Operational Deployments
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
          CrowdIQ Use Cases & Environments
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl leading-relaxed">
          From international sporting fixtures to multi-stage music festivals, CrowdIQ delivers tailored crowd safety protocols for every venue footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:border-[#BFDBFE] transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#64748B] uppercase">
                      {c.category}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                    {c.capacity}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A]">
                  {c.title}
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#DC2626]">Operational Challenge: </span>
                    <span className="text-[#64748B]">{c.challenge}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#2563EB]">CrowdIQ Solution: </span>
                    <span className="text-[#475569]">{c.solution}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-[#475569] uppercase">Verified Outcomes:</span>
                  {c.outcomes.map((out) => (
                    <div key={out} className="flex items-center gap-2 text-xs text-[#16A34A] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={onLaunchPlatform}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#2563EB] border border-[#CBD5E1] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Simulate in Platform Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
