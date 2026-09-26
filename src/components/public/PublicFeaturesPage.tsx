import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Map, 
  Video, 
  BarChart3, 
  FileCheck2, 
  Radio, 
  QrCode, 
  Users, 
  Lock, 
  Server,
  ArrowRight
} from 'lucide-react';

interface PublicFeaturesPageProps {
  onLaunchPlatform: () => void;
}

export const PublicFeaturesPage: React.FC<PublicFeaturesPageProps> = ({ onLaunchPlatform }) => {
  const featureGroups = [
    {
      category: 'Computer Vision & Real-Time Ingestion',
      icon: Video,
      items: [
        {
          title: 'YOLOv8 Edge Headcount Detection',
          desc: 'High-throughput bounding box person detection operating at 30+ FPS across low-light and dense crowd environments.'
        },
        {
          title: 'DeepSORT Optical Flow Tracking',
          desc: 'Persistent trajectory tagging that detects counter-flow vectors, micro-turbulence, and localized pedestrian stagnation.'
        },
        {
          title: 'Flexible RTSP / ONVIF Feed Ingestion',
          desc: 'Universal video streaming protocol connectors supporting enterprise CCTV surveillance networks with camera health telemetry.'
        }
      ]
    },
    {
      category: 'Predictive Stampede Risk Engine',
      icon: TrendingUp,
      items: [
        {
          title: 'Multi-Factor Stampede Risk Index (SRI)',
          desc: 'Weighted risk scoring synthesizing crowd density (pers/m²), velocity deceleration, inflow rate, and physical barrier constraints.'
        },
        {
          title: 'Kinematic 6-Minute Predictive Horizon',
          desc: 'Early bottleneck forecasting using physical hydrodynamic crowd models to notify commanders minutes before crush thresholds are reached.'
        },
        {
          title: 'Explainable AI Risk Diagnostic',
          desc: 'Clear textual justification explaining why risk is elevated (e.g., opposing flow, turnstile bottleneck, barrier compaction).'
        }
      ]
    },
    {
      category: 'Incident Command & Field Dispatch',
      icon: ShieldAlert,
      items: [
        {
          title: '7-Stage Incident Lifecycle Workflow',
          desc: 'Structured progression: Detected → Acknowledged → Investigating → Response Assigned → In Progress → Resolved → Closed.'
        },
        {
          title: 'Field Security Mobile Terminal',
          desc: 'Action-oriented dashboard for ground officers to acknowledge alerts, report incidents with photos, and share location.'
        },
        {
          title: 'Direct Emergency Klaxon & Broadcast',
          desc: 'One-click facility-wide emergency mode triggering auditory strobe alerts, turnstile gate unlock, and egress routing.'
        }
      ]
    },
    {
      category: 'Enterprise Security, RBAC & Compliance',
      icon: Lock,
      items: [
        {
          title: 'Granular Role-Based Access Control',
          desc: 'Strict enforcement separating Admin, Incident Commander, Security Officer, Operations Director, and Public Attendee.'
        },
        {
          title: 'Immutable Security Audit Logging',
          desc: 'Comprehensive tamper-evident audit trail capturing user ID, IP address, timestamp, resource modification, and action type.'
        },
        {
          title: 'Automated Compliance & Post-Event Reports',
          desc: 'Exportable CSV and PDF operational analytics documenting peak density intervals, response latencies, and CCTV availability.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
          Platform Architecture & Capabilities
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
          CrowdIQ Enterprise Features
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl leading-relaxed">
          Comprehensive, mission-critical toolset designed to give event safety directors, commanders, and field officers full situational dominance.
        </p>
        <div className="mt-4">
          <button
            onClick={onLaunchPlatform}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Launch Live Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature Groups */}
      <div className="space-y-10">
        {featureGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#E2E8F0]">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <GroupIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {group.category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {group.items.map((item) => (
                  <div 
                    key={item.title} 
                    className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#BFDBFE] hover:shadow-sm transition-all"
                  >
                    <h3 className="font-bold text-sm text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
