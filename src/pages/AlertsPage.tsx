import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { AlertOctagon, Search, Filter, ShieldAlert, CheckCircle2, AlertTriangle, Zap, ArrowDownCircle } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = filterSeverity === 'ALL' 
      ? true 
      : filterSeverity === 'RESOLVED'
      ? a.status === 'RESOLVED'
      : a.severity === filterSeverity;
    
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]';
      case 'HIGH':
        return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
      case 'WARNING':
        return 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]';
      case 'ACTION':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      case 'RECOVERY':
        return 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1]';
      case 'RESOLVED':
        return 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-[#DC2626]" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              Incident Registry & Alert Dispatch Log
            </h2>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Audit trail of anomalies, predictive alarms, and executed countermeasures
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by zone or trigger description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'ACTION', 'RESOLVED'].map((lvl) => (
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
      <div className="rounded-xl border border-[#CBD5E1] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold">Zone</th>
                <th className="py-3 px-4 font-bold">Alert Title</th>
                <th className="py-3 px-4 font-bold">Details</th>
                <th className="py-3 px-4 font-bold">Action Taken</th>
                <th className="py-3 px-4 font-bold">Time</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#64748B]">
                    No security alerts matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getSeverityBadge(a.severity)}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">{a.zoneName}</td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A] max-w-[200px] truncate">{a.title}</td>
                    <td className="py-3 px-4 text-[#475569] max-w-[280px] truncate">{a.description}</td>
                    <td className="py-3 px-4 text-[#0F766E] max-w-[220px] truncate">{a.actionTaken}</td>
                    <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">{a.timeFormatted}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.status === 'ACTIVE'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                          : a.status === 'ACKNOWLEDGED'
                          ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                          : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {a.status === 'ACTIVE' ? (
                        <button
                          onClick={() => acknowledgeAlert(a.id)}
                          className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          ACK
                        </button>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
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
