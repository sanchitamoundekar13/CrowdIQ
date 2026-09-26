import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, Users, AlertTriangle, BarChart2, Clock, CheckCircle, TrendingUp, Filter, RefreshCw } from "lucide-react";

function getDB() {
  try {
    const raw = localStorage.getItem("crowdiq_database");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => { buildReports(); }, []);

  function buildReports() {
    const db = getDB();
    const now = new Date();
    setReports([
      { id:"rpt-001", title:"Daily Attendance Summary", type:"attendance", generated:now.toLocaleString(), period:"Today — "+now.toLocaleDateString(), status:"ready", size:"14 KB", records:(db.attendanceLogs||[]).length, description:"Gate-by-gate counts, peak windows, and real-time occupancy across all venue sectors." },
      { id:"rpt-002", title:"Weekly Crowd Flow Analytics", type:"analytics", generated:new Date(now-3600000).toLocaleString(), period:"Last 7 days", status:"ready", size:"52 KB", records:((db.attendanceLogs||[]).length)*7, description:"Heatmap density trends, congestion hotspots, throughput by zone, and crowd velocity vectors." },
      { id:"rpt-003", title:"Security Incident Log", type:"incident", generated:now.toLocaleString(), period:"Last 30 days", status:"ready", size:"24 KB", records:(db.auditLog||[]).length, description:"All logged incidents with timestamps, severity, assigned unit, resolution time, and outcome status." },
      { id:"rpt-004", title:"Zone Occupancy Report", type:"zone", generated:new Date(now-7200000).toLocaleString(), period:"Today", status:"ready", size:"9 KB", records:db.zoneOccupancy?Object.keys(db.zoneOccupancy).length:6, description:"Per-zone headcounts, capacity utilization percentages, dwell times, and overflow alerts." },
      { id:"rpt-005", title:"CCTV Surveillance Report", type:"security", generated:now.toLocaleString(), period:"Last 24 hours", status:"ready", size:"21 KB", records:(db.cctvEvents||[]).length, description:"Camera uptime, AI detection events, flagged timestamps, and manual review requests from all CCTV nodes." },
      { id:"rpt-006", title:"Monthly Executive Summary", type:"analytics", generated:"", period:now.toLocaleString("default",{month:"long"})+" "+now.getFullYear(), status:"scheduled", size:"—", records:0, description:"C-level KPI snapshot: peak attendance, incident rate, average response time, and system uptime." },
    ]);
    setLastRefresh(new Date());
  }

  function handleRefresh() {
    setGenerating(true);
    setTimeout(() => { buildReports(); setGenerating(false); }, 1100);
  }

  function handleDownload(report) {
    const db = getDB();
    const blob = new Blob([JSON.stringify({ reportTitle:report.title, generatedAt:report.generated, period:report.period, records:report.records, data:db, exportedBy:"CrowdIQ Operations Platform" }, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CrowdIQ_"+report.title.replace(/\s+/g,"_")+"_"+Date.now()+".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const typeCfg = {
    attendance:{ color:"#2563EB", bg:"#EFF6FF" },
    analytics:{ color:"#7C3AED", bg:"#F5F3FF" },
    incident:{ color:"#DC2626", bg:"#FEF2F2" },
    zone:{ color:"#D97706", bg:"#FFFBEB" },
    security:{ color:"#059669", bg:"#F0FDF4" },
  };

  const filtered = filter === "all" ? reports : reports.filter(r => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-0.5 rounded">Reports Center</span>
            <span className="text-[11px] font-semibold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>LIVE DB DATA
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Operational Reports</h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">All reports from real-time database • Metropolitan Arena</p>
        </div>
        <button onClick={handleRefresh} disabled={generating} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold shadow-xs hover:bg-[#1D4ED8] transition cursor-pointer disabled:opacity-60">
          <RefreshCw className={"w-4 h-4 "+(generating?"animate-spin":"")} />
          {generating?"Refreshing…":"Refresh All"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Reports", value:reports.length, sub:"in system", color:"#2563EB", bg:"#EFF6FF" },
          { label:"Ready to Export", value:reports.filter(r=>r.status==="ready").length, sub:"available now", color:"#059669", bg:"#F0FDF4" },
          { label:"Scheduled", value:reports.filter(r=>r.status==="scheduled").length, sub:"auto-generate", color:"#D97706", bg:"#FFFBEB" },
          { label:"Last Refreshed", value:lastRefresh.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), sub:"live DB sync", color:"#7C3AED", bg:"#F5F3FF" },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">{s.label}</div>
            <div style={{color:s.color}} className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[#64748B]" />
        <span className="text-xs font-semibold text-[#64748B]">Filter:</span>
        {["all","attendance","analytics","incident","zone","security"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} className={"px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer capitalize "+(filter===f?"bg-[#2563EB] text-white":"bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]")}>
            {f==="all"?"All Reports":f}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map(report => {
          const cfg = typeCfg[report.type] || { color:"#64748B", bg:"#F1F5F9" };
          return (
            <div key={report.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div style={{background:cfg.bg,color:cfg.color}} className="p-2.5 rounded-xl mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-bold text-[#0F172A]">{report.title}</h3>
                      <span style={{background:cfg.bg,color:cfg.color}} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">{report.type}</span>
                      {report.status==="ready" && <span className="text-[10px] font-bold text-[#059669] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">✓ Ready</span>}
                      {report.status==="scheduled" && <span className="text-[10px] font-bold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">⏱ Scheduled</span>}
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-2">{report.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] flex-wrap">
                      <span>📅 {report.period}</span>
                      {report.records>0 && <span>👥 {report.records} records</span>}
                      {report.size!=="—" && <span>📄 {report.size}</span>}
                      {report.generated && <span>🕐 {report.generated}</span>}
                    </div>
                  </div>
                </div>
                <div>
                  {report.status==="ready" ? (
                    <button onClick={()=>handleDownload(report)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold shadow-xs hover:bg-[#1D4ED8] transition cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Export JSON
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F1F5F9] text-[#94A3B8] text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
