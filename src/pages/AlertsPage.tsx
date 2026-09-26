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
  Download, 
  Plus, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Send, 
  Clock, 
  MapPin, 
  X,
  Radio,
  Eye
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    deleteAlert, 
    addAlert, 
    zones, 
    dispatchSecurityTeam, 
    securityTeams,
    playAlertSound,
    soundEnabled,
    toggleSound
  } = useSimulation();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New incident modal state
  const [modalForm, setModalForm] = useState({
    title: '',
    severity: 'WARNING' as const,
    zoneId: zones[0]?.id || 'gate-b',
    description: '',
    actionTaken: ''
  });

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = filterSeverity === 'ALL' 
      ? true 
      : filterSeverity === 'RESOLVED'
      ? a.status === 'RESOLVED'
      : a.severity === filterSeverity;
    
    const matchesZone = filterZone === 'ALL' || a.zoneId === filterZone;

    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesZone && matchesSearch;
  });

  // Calculate high-level incident metrics
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const warningCount = alerts.filter(a => (a.severity === 'HIGH' || a.severity === 'WARNING') && a.status !== 'RESOLVED').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;
  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;

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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.title.trim()) return;

    const targetZone = zones.find(z => z.id === modalForm.zoneId) || zones[0];
    addAlert({
      title: modalForm.title,
      severity: modalForm.severity,
      zoneId: modalForm.zoneId,
      zoneName: targetZone.name,
      description: modalForm.description || `Automated telemetry alarm triggered in ${targetZone.name}.`,
      actionTaken: modalForm.actionTaken || 'Countermeasure protocol initiated.',
      status: 'ACTIVE'
    });

    setModalForm({
      title: '',
      severity: 'WARNING',
      zoneId: zones[0]?.id || 'gate-b',
      description: '',
      actionTaken: ''
    });
    setIsCreateModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID,Time,Severity,Zone,Title,Description,Action Taken,Status\n'];
    const rows = alerts.map(a => 
      `"${a.id}","${a.timeFormatted}","${a.severity}","${a.zoneName}","${a.title.replace(/"/g, '""')}","${a.description.replace(/"/g, '""')}","${(a.actionTaken || '').replace(/"/g, '""')}","${a.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CrowdIQ_Incident_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center text-[#DC2626]">
              <AlertOctagon className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Incident Registry & Real-Time Alert Dispatch
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit trail of venue anomalies, predictive alarms, and automated countermeasure logs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => playAlertSound('critical')}
            title="Test Audio Siren"
            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-mono font-medium text-[#475569] transition cursor-pointer flex items-center gap-1.5"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Test Sound</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-mono font-medium text-[#475569] transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold font-mono shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>LOG INCIDENT ALERT</span>
          </button>
        </div>
      </div>

      {/* Incident Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Total Logged</span>
            <AlertOctagon className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">{alerts.length}</div>
          <span className="text-[11px] text-[#64748B]">Across all venue zones</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Critical Emergencies</span>
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
          </div>
          <div className={`text-2xl font-extrabold ${criticalCount > 0 ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
            {criticalCount}
          </div>
          <span className="text-[11px] text-[#DC2626] font-semibold">
            {criticalCount > 0 ? 'Immediate action required' : 'Perimeter nominal'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Active In Triage</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-extrabold text-[#D97706]">{activeCount}</div>
          <span className="text-[11px] text-[#64748B]">Pending resolution</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] mb-1">
            <span className="font-bold text-[10px] uppercase">Hazards Averted</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#16A34A]">{resolvedCount}</div>
          <span className="text-[11px] text-[#16A34A] font-semibold">100% protocol adherence</span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by title, description, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Zone Selector Filter */}
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-medium"
          >
            <option value="ALL">All Monitored Zones</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          {/* Severity Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
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
      </div>

      {/* Alerts Table */}
      <div className="rounded-xl border border-[#CBD5E1] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Zone / Location</th>
                <th className="py-3 px-4 font-bold">Alert Title</th>
                <th className="py-3 px-4 font-bold">Telemetry Details</th>
                <th className="py-3 px-4 font-bold">Action Taken</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    No security alerts matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase inline-flex items-center gap-1 ${getSeverityBadge(a.severity)}`}>
                        {a.severity === 'CRITICAL' && <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse"></span>}
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">{a.timeFormatted}</td>
                    <td className="py-3 px-4 font-bold text-[#0F172A] whitespace-nowrap">{a.zoneName}</td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A] max-w-[200px] truncate" title={a.title}>
                      {a.title}
                    </td>
                    <td className="py-3 px-4 text-[#475569] max-w-[280px] truncate" title={a.description}>
                      {a.description}
                    </td>
                    <td className="py-3 px-4 text-[#0F766E] max-w-[220px] truncate font-medium" title={a.actionTaken}>
                      {a.actionTaken || 'None specified'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
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
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.status === 'ACTIVE' && (
                          <button
                            onClick={() => acknowledgeAlert(a.id)}
                            className="px-2 py-1 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Acknowledge Alert"
                          >
                            ACK
                          </button>
                        )}
                        {a.status !== 'RESOLVED' && (
                          <button
                            onClick={() => resolveAlert(a.id)}
                            className="px-2 py-1 rounded bg-[#16A34A] hover:bg-[#15803D] text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Mark Resolved"
                          >
                            Resolve
                          </button>
                        )}
                        {/* Quick Squad Dispatch Button */}
                        {a.status !== 'RESOLVED' && (
                          <button
                            onClick={() => {
                              const availSquad = securityTeams.find(t => t.status === 'AVAILABLE') || securityTeams[0];
                              if (availSquad) {
                                dispatchSecurityTeam(availSquad.id, a.zoneId);
                              }
                            }}
                            className="px-2 py-1 rounded border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[#0F172A] text-[10px] font-semibold transition cursor-pointer"
                            title="Dispatch nearest available squad"
                          >
                            Dispatch
                          </button>
                        )}
                        <button
                          onClick={() => deleteAlert(a.id)}
                          className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Incident Log Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#CBD5E1] w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-[#DC2626]" />
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Log New Security Incident Alert
                </h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inflow congestion threshold breached at Gate B"
                  value={modalForm.title}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Severity Level</label>
                  <select
                    value={modalForm.severity}
                    onChange={(e) => setModalForm({ ...modalForm, severity: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  >
                    <option value="CRITICAL">CRITICAL (Emergency)</option>
                    <option value="HIGH">HIGH (Dangerous)</option>
                    <option value="WARNING">WARNING (Elevated)</option>
                    <option value="ACTION">ACTION (Proactive)</option>
                    <option value="INFO">INFO (Notice)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#475569] font-bold uppercase mb-1">Venue Sector</label>
                  <select
                    value={modalForm.zoneId}
                    onChange={(e) => setModalForm({ ...modalForm, zoneId: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  >
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Telemetry Description</label>
                <textarea
                  rows={3}
                  placeholder="Specify sensor counts, density figures, camera observations..."
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-bold uppercase mb-1">Recommended Tactical Action</label>
                <input
                  type="text"
                  placeholder="e.g. Deploy Squad 03 to coordinate barrier rerouting"
                  value={modalForm.actionTaken}
                  onChange={(e) => setModalForm({ ...modalForm, actionTaken: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold transition shadow-sm cursor-pointer"
                >
                  Broadcast Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
