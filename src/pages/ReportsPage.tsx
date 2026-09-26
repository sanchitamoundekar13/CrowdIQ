import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet, 
  Clock, 
  Eye, 
  Plus, 
  Layers 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

interface ReportRecord {
  id: string;
  title: string;
  type: string;
  eventName: string;
  generatedAt: string;
  generatedBy: string;
  format: 'CSV' | 'PDF';
  recordCount: number;
  fileSize: string;
}

export const ReportsPage: React.FC = () => {
  const { currentEvent, events, logAction } = usePlatform();

  const [reportsList, setReportsList] = useState<ReportRecord[]>([
    {
      id: 'REP-CROWD-901',
      title: 'Crowd Density & Flow Velocity Hourly Audit',
      type: 'Crowd Density Report',
      eventName: 'Metropolitan Arena Grand Prix',
      generatedAt: '2026-09-26 14:00 IST',
      generatedBy: 'Director David Chen',
      format: 'CSV',
      recordCount: 1420,
      fileSize: '340 KB'
    },
    {
      id: 'REP-INC-902',
      title: 'Tactical Incident Triage & Resolution Log',
      type: 'Incident Report',
      eventName: 'Metropolitan Arena Grand Prix',
      generatedAt: '2026-09-26 13:30 IST',
      generatedBy: 'Cmdr. Sarah Keller',
      format: 'CSV',
      recordCount: 84,
      fileSize: '52 KB'
    },
    {
      id: 'REP-CAM-903',
      title: 'CCTV Hardware Availability & Optical Inference SLA',
      type: 'Camera Performance Report',
      eventName: 'Metropolitan Arena Grand Prix',
      generatedAt: '2026-09-26 12:00 IST',
      generatedBy: 'Chief Marcus Vance',
      format: 'CSV',
      recordCount: 120,
      fileSize: '78 KB'
    },
    {
      id: 'REP-SEC-904',
      title: 'Field Security Squad Response Dispatch Metrics',
      type: 'Security Operations Report',
      eventName: 'Metropolitan Arena Grand Prix',
      generatedAt: '2026-09-26 11:15 IST',
      generatedBy: 'Chief Marcus Vance',
      format: 'CSV',
      recordCount: 312,
      fileSize: '115 KB'
    }
  ]);

  const [selectedType, setSelectedType] = useState('Crowd Density Report');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const reportTypes = [
    'Event Report',
    'Crowd Density Report',
    'Incident Report',
    'Alert Report',
    'Camera Performance Report',
    'Security Operations Report'
  ];

  const handleGenerateReport = () => {
    const newRep: ReportRecord = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${selectedType} — ${currentEvent?.name || 'Metropolitan Arena'}`,
      type: selectedType,
      eventName: currentEvent?.name || 'Metropolitan Arena Grand Prix',
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      generatedBy: 'Authorized Operator',
      format: 'CSV',
      recordCount: Math.floor(200 + Math.random() * 800),
      fileSize: `${Math.floor(50 + Math.random() * 200)} KB`
    };

    setReportsList(prev => [newRep, ...prev]);
    logAction('REPORT_GENERATED', `REPORT:${newRep.id}`, `Generated report ${newRep.title}`);
  };

  const handleDownloadReport = (rep: ReportRecord) => {
    logAction('REPORT_DOWNLOAD', `REPORT:${rep.id}`, `Downloaded ${rep.title}`);
    
    // Generate real CSV download
    const csvContent = "data:text/csv;charset=utf-8,"
      + `Report ID: ${rep.id}\n`
      + `Title: "${rep.title}"\n`
      + `Type: ${rep.type}\n`
      + `Event: "${rep.eventName}"\n`
      + `Generated: ${rep.generatedAt} by ${rep.generatedBy}\n`
      + `Compliance Status: ISO 22398 Verified Nominal\n\n`
      + `Timestamp,Metric,Sector,Value,Threshold,Status\n`
      + `14:00:00,Density,Gate A,79%,85%,HIGH\n`
      + `14:05:00,Inflow,Turnstiles 1-4,184 pers/min,190 pers/min,CRITICAL_ELEVATED\n`
      + `14:10:00,Optical Velocity,Main Stage Floor,0.42 m/s,0.30 m/s,NOMINAL_DECEL\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${rep.id}_${rep.type.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(rep.id);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
              Compliance &amp; Export Engine
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              ISO 22398 Certified Logs
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Operational Safety Reports &amp; Compliance Exports
          </h1>
          <p className="text-xs text-[#64748B]">
            Generate official audits across crowd density, CCTV availability, security squad dispatches, and emergency response latencies.
          </p>
        </div>

        {downloadNotice && (
          <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Downloaded CSV: {downloadNotice}</span>
          </div>
        )}
      </div>

      {/* Generator Tool Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#475569]">Select Report Archetype:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white font-semibold"
          >
            {reportTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateReport}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Audit Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <h2 className="text-xs font-bold text-[#0F172A]">Available Compliance Reports ({reportsList.length})</h2>
          <span className="text-[11px] font-mono text-[#64748B]">CSV Export Enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Title &amp; Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Generated Timestamp</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Records</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {reportsList.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                    {rep.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                    {rep.title}
                    <span className="block text-[11px] font-normal text-[#64748B]">{rep.eventName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono font-bold">
                      {rep.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">
                    {rep.generatedAt}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    {rep.generatedBy}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">
                    {rep.recordCount} rows ({rep.fileSize})
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadReport(rep)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
