import React from "react";
import { Shield, Cpu, Eye, BarChart2, Bell, MapPin, FileText, AlertTriangle, Users, Globe, Lock, Zap } from "lucide-react";

const features = [
  { icon: <Eye className="w-5 h-5" />, title:"Live Monitor", color:"#2563EB", bg:"#EFF6FF", desc:"Real-time CCTV surveillance with AI-assisted crowd density analysis across all venue sectors." },
  { icon: <BarChart2 className="w-5 h-5" />, title:"Analytics Engine", color:"#7C3AED", bg:"#F5F3FF", desc:"Predictive crowd flow models, heatmap generation, and throughput trend reporting." },
  { icon: <Bell className="w-5 h-5" />, title:"Alerts & Events", color:"#DC2626", bg:"#FEF2F2", desc:"Multi-tier alert escalation, event capacity management, and automated crowd threshold notifications." },
  { icon: <FileText className="w-5 h-5" />, title:"Reports", color:"#059669", bg:"#F0FDF4", desc:"Exportable operational reports: attendance summaries, incident logs, zone occupancy, and CCTV records." },
  { icon: <MapPin className="w-5 h-5" />, title:"Zones", color:"#D97706", bg:"#FFFBEB", desc:"Interactive venue floor map with per-sector occupancy, access control, and real-time density overlays." },
  { icon: <AlertTriangle className="w-5 h-5" />, title:"Incidents", color:"#B45309", bg:"#FFF7ED", desc:"Tactical incident management: dispatch, unit tracking, resolution workflow, and post-event RCA logging." },
];

const stats = [
  { value:"99.97%", label:"System Uptime" },
  { value:"<50ms", label:"Alert Latency" },
  { value:"64+", label:"CCTV Nodes" },
  { value:"24/7", label:"Monitoring" },
];

export function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",backgroundSize:"32px 32px"}}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">CrowdIQ</h1>
              <p className="text-blue-200 text-sm font-semibold">Intelligent Crowd Safety Operations Platform</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl mb-6">
            CrowdIQ is a real-time crowd monitoring and safety operations system designed for high-density venues. 
            It consolidates CCTV surveillance, zone management, incident response, and crowd analytics into a single 
            unified command interface — giving security teams complete situational awareness at all times.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s,i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-blue-200 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Modules */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Platform Modules</h2>
        <p className="text-xs text-[#64748B] mb-5">Every module is directly accessible from the navigation bar — no nested menus, no dead ends.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f,i) => (
            <div key={i} className="rounded-xl border border-[#E2E8F0] p-4 hover:shadow-md transition-shadow">
              <div style={{background:f.bg,color:f.color}} className="inline-flex p-2.5 rounded-xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">{f.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon:<Cpu className="w-5 h-5" />, color:"#2563EB", bg:"#EFF6FF", title:"React + Vite", desc:"Frontend built with React 18, Vite, and TailwindCSS for a responsive, high-performance UI." },
          { icon:<Lock className="w-5 h-5" />, color:"#059669", bg:"#F0FDF4", title:"LocalStorage DB", desc:"Persistent operational state via browser localStorage — attendance, audits, CCTV events, and zone data." },
          { icon:<Zap className="w-5 h-5" />, color:"#D97706", bg:"#FFFBEB", title:"Real-time Context", desc:"SimulationContext + AuthContext provide live crowd data, role-based access, and global alert state." },
        ].map((t,i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex gap-3">
            <div style={{background:t.bg,color:t.color}} className="p-2.5 rounded-xl h-fit">{t.icon}</div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">{t.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Version Footer */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
        <span className="font-mono">CrowdIQ Operations Platform • v2.1.0</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          System Online — All modules operational
        </span>
      </div>
    </div>
  );
}
