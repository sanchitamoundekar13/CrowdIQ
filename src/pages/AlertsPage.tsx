import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Video, 
  Clock, 
  Check, 
  RotateCcw 
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, playAlertSound } = useSimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Record<string, boolean>>({});

  const handleResolveAlert = (id: string) => {
    setResolvedAlertIds(prev => ({ ...prev, [id]: true }));
    playAlertSound('info');
  };

  // Map zone names to corresponding camera ID
  const getCameraForZone = (zoneName: string): string => {
    if (zoneName.toLowerCase().includes('main gate') || zoneName.toLowerCase().includes('gate a')) return 'CAM-01';
    if (zoneName.toLowerCase().includes('gate b') || zoneName.toLowerCase().includes('gate 2')) return 'CAM-02';
    if (zoneName.toLowerCase().includes('exit') || zoneName.toLowerCase().includes('north')) return 'CAM-03';
    if (zoneName.toLowerCase().includes('plaza') || zoneName.toLowerCase().includes('arena') || zoneName.toLowerCase().includes('central')) return 'CAM-04';
    if (zoneName.toLowerCase().includes('concourse') || zoneName.toLowerCase().includes('south')) return 'CAM-05';
    if (zoneName.toLowerCase().includes('vip') || zoneName.toLowerCase().includes('lounge')) return 'CAM-06';
    if (zoneName.toLowerCase().includes('stair')) return 'CAM-07';
    return 'CAM-08';
  };

  // Normalize severity to user spec: Critical / High / Medium / Low
  const normalizeSeverity = (s: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
    const upper = s.toUpperCase();
    if (upper === 'CRITICAL') return 'CRITICAL';
    if (upper === 'HIGH') return 'HIGH';
    if (upper === 'WARNING' || upper === 'MEDIUM' || upper === 'MODERATE') return 'MEDIUM';
    return 'LOW';
  };

  const enrichedAlerts = alerts.map(a => {
    const norm = normalizeSeverity(a.severity);
    const camera = getCameraForZone(a.zoneName);
    const isResolved = resolvedAlertIds[a.id] || a.status === 'RESOLVED';
    return {
      ...a,
      normSeverity: norm,
      camera,
      currentStatus: isResolved ? 'RESOLVED' : a.status
    };
  });

  const filteredAlerts = enrichedAlerts.filter(a => {
    const matchesFilter = filterSeverity === 'ALL' 
      ? true 
      : filterSeverity === 'RESOLVED'
      ? a.currentStatus === 'RESOLVED'
      : a.normSeverity === filterSeverity;
    
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.camera.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]';
      case 'HIGH':
        return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
      case 'MEDIUM':
        return 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]';
      case 'LOW':
        return 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-[#DC2626]" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Alerts & Hazard Monitoring Registry
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Severity classifications, camera origin, timestamps, and commander triage actions
          </p>
        </div>

        {/* Live Alert Counts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] font-bold">
            {enrichedAlerts.filter(a => a.normSeverity === 'CRITICAL' && a.currentStatus !== 'RESOLVED').length} Critical
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-bold">
            {enrichedAlerts.filter(a => a.normSeverity === 'HIGH' && a.currentStatus !== 'RESOLVED').length} High
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A] font-bold">
            {enrichedAlerts.filter(a => a.normSeverity === 'MEDIUM' && a.currentStatus !== 'RESOLVED').length} Medium
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-bold">
            {enrichedAlerts.filter(a => a.normSeverity === 'LOW' && a.currentStatus !== 'RESOLVED').length} Low
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by location, camera (e.g. CAM-04), or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>

        {/* Severity Filter Tabs per specification: Critical / High / Medium / Low */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'RESOLVED'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                filterSeverity === lvl
                  ? 'bg-[#2563EB] text-white border-[#1D4ED8]'
                  : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-xl border border-[#CBD5E1] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold">Location + Camera</th>
                <th className="py-3 px-4 font-bold">Alert Title & Trigger</th>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No security alerts matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Severity */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getSeverityBadge(a.normSeverity)}`}>
                        {a.normSeverity}
                      </span>
                    </td>

                    {/* Location + Camera */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A]">{a.zoneName}</div>
                      <div className="flex items-center gap-1 text-[10px] text-[#2563EB] font-bold mt-0.5">
                        <Video className="w-3 h-3 text-[#2563EB]" />
                        <span>{a.camera}</span>
                      </div>
                    </td>

                    {/* Title & Trigger Description */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{a.title}</div>
                      <div className="text-[11px] text-[#64748B] max-w-sm line-clamp-1 mt-0.5">{a.description}</div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{a.timeFormatted}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.currentStatus === 'ACTIVE'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] animate-pulse'
                          : a.currentStatus === 'ACKNOWLEDGED'
                          ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                          : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                      }`}>
                        {a.currentStatus}
                      </span>
                    </td>

                    {/* Actions: Acknowledge & Resolve */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.currentStatus === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              acknowledgeAlert(a.id);
                              playAlertSound('info');
                            }}
                            className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Acknowledge alert"
                          >
                            Acknowledge
                          </button>
                        )}

                        {a.currentStatus !== 'RESOLVED' ? (
                          <button
                            onClick={() => handleResolveAlert(a.id)}
                            className="px-2.5 py-1 rounded bg-[#16A34A] hover:bg-[#15803D] text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Mark as resolved"
                          >
                            <Check className="w-3 h-3" />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#16A34A] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
