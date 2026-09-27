import React from 'react';
import { 
  Shield, 
  Activity, 
  ArrowRight, 
  Video, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  Building2, 
  Radio, 
  Layers, 
  Compass,
  FileText,
  ChevronRight
} from 'lucide-react';
import { LiveCrowdMonitoringPreview } from '../landing/LiveCrowdMonitoringPreview';

interface PublicHomePageProps {
  onLaunchPlatform: () => void;
  onExploreFeatures: () => void;
  onSelectTab: (tab: string) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onLaunchPlatform,
  onExploreFeatures,
  onSelectTab
}) => {
  const steps = [
    { num: '01', title: 'Monitor', desc: 'RTSP surveillance feeds ingest live video frames across venue sectors.' },
    { num: '02', title: 'Analyze', desc: 'YOLOv8 & DeepSORT estimate people headcount and optical velocity vectors.' },
    { num: '03', title: 'Detect', desc: 'Stampede Risk Index identifies abnormal compression and opposing flow patterns.' },
    { num: '04', title: 'Alert', desc: 'Instant multi-severity warnings dispatched to commanders before choke points form.' },
    { num: '05', title: 'Respond', desc: 'Tactical incident workflows coordinate field security squads and gate bypasses.' },
    { num: '06', title: 'Report', desc: 'Comprehensive compliance and operational analytics exported for audits.' },
  ];

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Density Tracking',
      desc: 'Accurately quantifies crowd concentration per square meter across gates, stages, concourses, and egress stairwells.'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Chokepoint Modeling',
      desc: 'Forecasts crowd compression up to 6 minutes in advance using kinematic inflow and bottleneck momentum equations.'
    },
    {
      icon: Shield,
      title: 'Tactical Incident Dispatch',
      desc: 'Connects incident commanders directly to field security officers with interactive incident lifecycle management.'
    },
    {
      icon: Compass,
      title: 'Dynamic Crowd Rerouting',
      desc: 'Calculates least-congested egress pathways and broadcasts public safety notices to prevent panic and bottlenecking.'
    }
  ];

  const useCases = [
    {
      title: 'Stadiums & Mega Arenas',
      metric: '50,000+ Capacity',
      desc: 'Prevent crush surges at turnstile gates, concourses, and post-match stadium bowl egress.'
    },
    {
      title: 'Music Festivals & Open Air',
      metric: 'Multi-Stage Grounds',
      desc: 'Manage crowd migration between headline stages and eliminate barrier barricade compression.'
    },
    {
      title: 'Metropolitan Transit Hubs',
      metric: 'High Turnstile Flux',
      desc: 'Continuous optical flow telemetry across commuter platforms, escalators, and transfer tunnels.'
    },
    {
      title: 'Expos & Convention Centers',
      metric: 'Multi-Hall Venues',
      desc: 'Monitor booth density, keynote room capacities, and fire egress corridor clearances.'
    }
  ];

  return (
    <div className="space-y-0 text-[#0F172A]">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#F8FAFC] to-white border-b border-[#E2E8F0] pt-14 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8]">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
            <span>Intelligent Crowd Safety & Event Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-4xl mx-auto">
            Crowd<span className="text-[#2563EB]">IQ</span> — Intelligent Crowd Safety & Event Intelligence
          </h1>

          <p className="text-base sm:text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
            Monitor crowd density, movement, congestion, and risk in real time to help event teams respond before situations escalate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onLaunchPlatform}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreFeatures}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              Role-Based Access Control (RBAC)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              PostgreSQL Schema & Row Level Security
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              YOLOv8 & DeepSORT Ingestion API
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              100% Light Theme SaaS Architecture
            </span>
          </div>
        </div>
      </section>

      {/* 2. LIVE PRODUCT MONITORING PREVIEW */}
      <section className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
              Live Operations Snapshot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">
              Real-Time Situational Awareness
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Multi-camera telemetry, optical density vectors, and predictive surge detection.
            </p>
          </div>

          <LiveCrowdMonitoringPreview
            onLaunchFullConsole={onLaunchPlatform}
            onJumpToSimulation={onLaunchPlatform}
          />
        </div>
      </section>

      {/* 3. HOW IT WORKS (CONCISE 6-STAGE PIPELINE) */}
      <section className="py-14 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">
              From Optical Feed to Incident Resolution
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              A proactive, closed-loop safety pipeline engineered for zero-lag emergency management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((st, i) => (
              <div 
                key={st.num} 
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs relative flex flex-col justify-between hover:border-[#2563EB] transition-colors"
              >
                <div>
                  <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                    {st.num}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#CBD5E1]">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE PLATFORM CAPABILITIES */}
      <section className="py-14 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">
              Purpose-Built for Safety & Operations
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Essential capabilities designed specifically for venue directors, security squads, and incident commanders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title}
                  className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 hover:border-[#BFDBFE] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. USE CASES */}
      <section className="py-14 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
              Operational Environments
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">
              Trusted Across High-Density Venues
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Engineered to scale from intimate convention halls to 80,000+ seat sporting arenas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc) => (
              <div 
                key={uc.title}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                    {uc.metric}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-3">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-xs font-semibold text-[#2563EB] flex items-center gap-1">
                  <span>View Case Architecture</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Deploy Real-Time Crowd Safety Intelligence Today
          </h2>
          <p className="text-sm text-[#64748B] max-w-2xl mx-auto">
            Experience the complete platform including Incident Command, Security Dispatch, Admin Console, and Event Attendee Pass registration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLaunchPlatform}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('contact')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Contact Operations Team</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
