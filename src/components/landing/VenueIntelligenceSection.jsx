import React from 'react';
import { 
  MapPin, 
  Navigation, 
  TrendingUp, 
  AlertCircle, 
  Video, 
  DoorOpen, 
  Flame, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export function VenueIntelligenceSection() {
  const intelligenceQuestions = [
    {
      question: 'WHERE is the crowd?',
      icon: MapPin,
      answer: 'Concentrated primarily between Gate B Concourse (1,360 people) and Main Arena Floor (5,920 people). Egress corridors remain below 30% capacity.'
    },
    {
      question: 'HOW dense is it?',
      icon: Flame,
      answer: 'Gate B reaches 68% (5.4 persons/m²) during peak arrival waves, surpassing the normal comfort threshold of 3.5 persons/m².'
    },
    {
      question: 'WHICH direction is it moving?',
      icon: Navigation,
      answer: 'Primary inflow vectors push East → Concourse inward at 1.2 m/s. Egress vectors toward Gate C are underutilized.'
    },
    {
      question: 'WHERE is the risk increasing?',
      icon: AlertCircle,
      answer: 'Bottleneck accumulation is actively accelerating at Gate B East Turnstiles with an inflow-to-outflow imbalance ratio of 1.97.'
    }
  ];

  const venueComponents = [
    { label: 'Entry/Exit Zones', detail: '3 Regulated Turnstile Portals (Gates A, B, C)', icon: DoorOpen, color: '#2563EB' },
    { label: 'Congestion Points', detail: 'Gate B Concourse Neck & Main Stage Barrier', icon: AlertCircle, color: '#DC2626' },
    { label: 'High-Density Areas', detail: 'Main Arena Standing Field (> 70% load)', icon: Flame, color: '#D97706' },
    { label: 'CCTV Camera Cones', detail: '4 Synchronized 1080p Optical Sensors', icon: Video, color: '#0F766E' },
  ];

  return (
    <section className="bg-white py-16 lg:py-20 border-b border-[#E2E8F0]" id="venue-intelligence">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Venue Intelligence & Flow Telemetry
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Transforms raw camera pixels into actionable spatial answers for command staff and field teams.
          </p>
        </div>

        {/* 4 Core Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {intelligenceQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <div 
                key={q.question}
                className="bg-[#F8FAFC] rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#2563EB]">
                    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm text-[#0F172A]">{q.question}</span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {q.answer}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-1 text-[11px] font-semibold text-[#0F766E]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Real-time computed answer</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Venue Spatial Intelligence Map Representation */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#E2E8F0] gap-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Facility Spatial Topology & Sensor Mapping</h3>
              <p className="text-xs text-[#64748B]">Metropolitan Arena security grid with active camera field-of-view cones and egress channels</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#475569]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              <span>All 4 Zones Monitored</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {venueComponents.map((comp) => {
              const Icon = comp.icon;
              return (
                <div key={comp.label} className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: comp.color }} />
                    <span className="font-bold text-xs text-[#0F172A]">{comp.label}</span>
                  </div>
                  <p className="text-xs text-[#64748B]">{comp.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
