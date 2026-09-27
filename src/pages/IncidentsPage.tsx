import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Radio, 
  Search, 
  Volume2, 
  UserCheck, 
  MapPin, 
  Layers, 
  ArrowRight,
  Filter,
  ShieldCheck,
  Plus,
  ArrowRightCircle,
  Eye,
  Activity
} from 'lucide-react';

interface IncidentItem {
  id: string;
  title: string;
  zone: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  responder: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  reportedAt: string;
  description: string;
}

const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'INC-2026-88',
    title: 'Turnstile Opposing Crowd Bottleneck',
    zone: 'Gate B (East)',
    severity: 'HIGH',
    responder: 'Squad Alpha (Cmdr. Vance)',
    status: 'Investigating',
    reportedAt: '20:18:42 IST',
    description: 'Inflow rate exceeding outflow by 18 p/min. Bidirectional collision near turnstile barrier #3.'
  },
  {
    id: 'INC-2026-89',
    title: 'Main Plaza Perimeter Congestion Surge',
    zone: 'Central Plaza',
    severity: 'CRITICAL',
    responder: 'Rapid Response 02',
    status: 'Open',
    reportedAt: '20:21:10 IST',
    description: 'Density spike at 85% capacity. Opposing flow detected near Arena core junction.'
  },
  {
    id: 'INC-2026-87',
    title: 'Unattended Bag Flagged by Edge Node',
    zone: 'South Concourse',
    severity: 'MEDIUM',
    responder: 'Patrol Beta (4 Officers)',
    status: 'Resolved',
    reportedAt: '19:45:00 IST',
    description: 'Owner located and identified by security personnel at food court. Sector cleared.'
  },
  {
    id: 'INC-2026-86',
    title: 'Emergency Stairwell Access Verification',
    zone: 'Emergency Stairwell',
    severity: 'LOW',
    responder: 'Medic Unit 01',
    status: 'Resolved',
    reportedAt: '19:12:30 IST',
    description: 'Routine clearance verification completed. Fire doors fully operational.'
  }
];

export const IncidentsPage: React.FC = () => {
  const { 
    zones, 
    securityTeams, 
    dispatchSecurityTeam, 
    emergencyMode, 
    toggleEmergencyMode, 
    playAlertSound,
    responseTime 
  } = useSimulation();

  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Quick Dispatch Form State
  const [selectedSquad, setSelectedSquad] = useState<string>('team-01');
  const [targetSector, setTargetSector] = useState<string>('gate-b');

  // Create Incident Form State
  const [newIncident, setNewIncident] = useState({
    title: '',
    zone: 'Central Plaza',
    severity: 'HIGH' as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    responder: 'Squad Alpha (4 officers)',
    description: '',
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const created: IncidentItem = {
      id: `INC-2026-${incidents.length + 90}`,
      title: newIncident.title,
      zone: newIncident.zone,
      severity: newIncident.severity,
      responder: newIncident.responder,
      status: 'Open',
      reportedAt: nowTime,
      description: newIncident.description || 'Operator reported live crowd safety incident.'
    };
    setIncidents([created, ...incidents]);
    setIsCreateModalOpen(false);
    playAlertSound('warning');
  };

  const handleUpdateStatus = (id: string, newStatus: 'Open' | 'Investigating' | 'Resolved') => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    playAlertSound(newStatus === 'Resolved' ? 'info' : 'warning');
  };

  const handleUpdateResponder = (id: string, responderName: string) => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, responder: responderName } : inc));
    playAlertSound('info');
  };

  const handleQuickDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchSecurityTeam(selectedSquad, targetSector);
    playAlertSound('warning');
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesFilter = statusFilter === 'ALL' ? true : inc.status === statusFilter;
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.responder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusBadge = (status: 'Open' | 'Investigating' | 'Resolved') => {
    switch (status) {
      case 'Open':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      case 'Investigating':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Incident Management & Tactical Command
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Log incidents, assign tactical responders, track lifecycle (Open → Investigating → Resolved), and audit response records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Incident</span>
          </button>

          <button
            onClick={() => {
              toggleEmergencyMode();
              playAlertSound('critical');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer flex items-center gap-1.5 border ${
              emergencyMode 
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{emergencyMode ? 'HALT VENUE ALARM' : 'TRIGGER VENUE PA'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Open Incidents</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {incidents.filter(i => i.status === 'Open').length}
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold">Requires Triage</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Unassigned / immediate hazard status
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Investigating</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {incidents.filter(i => i.status === 'Investigating').length}
            </span>
            <span className="text-xs font-mono text-blue-600 font-bold">Units En Route</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Officers deployed on site
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Resolved Incidents</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {incidents.filter(i => i.status === 'Resolved').length}
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">100% Cleared</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Logged into incident history
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Target Response Time</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {responseTime}
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">-24s SLA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Direct responder radio online
          </p>
        </div>
      </div>

      {/* Main Grid: Squad Quick Dispatcher (4 Cols) + Incident History & Registry (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Rapid Tactical Unit Dispatcher (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Tactical Unit Dispatcher
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Command Radio
            </span>
          </div>

          <form onSubmit={handleQuickDispatch} className="space-y-3.5 text-xs font-mono">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Select Response Unit
              </label>
              <select
                value={selectedSquad}
                onChange={(e) => setSelectedSquad(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500 font-mono"
              >
                {securityTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.status}) • {t.membersCount} officers
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Target Concourse / Sector
              </label>
              <select
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:border-blue-500 font-mono"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Density: {z.density}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>DISPATCH SQUAD TO SECTOR</span>
            </button>
          </form>

          {/* Active Teams Summary */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block">
              Field Units Status
            </span>
            <div className="space-y-1.5">
              {securityTeams.map(t => (
                <div key={t.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-slate-900 block">{t.name}</span>
                    <span className="text-[10px] text-slate-500">{t.assignedZone}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'DISPATCHED' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Comprehensive Incident Log & History (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Incident Registry & Incident History ({filteredIncidents.length})
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Lifecycle Progression: Open → Investigating → Resolved with responder assignments
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search incidents or responders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-hidden focus:border-blue-500 w-44"
                />
              </div>

              {/* Status Filter Tabs per specification */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {['ALL', 'Open', 'Investigating', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                      statusFilter === st ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Incident ID & Title</th>
                  <th className="p-3">Location / Sector</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Assigned Responder</th>
                  <th className="p-3">Lifecycle Status</th>
                  <th className="p-3 text-right">Progress Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 font-mono">
                      No matching incident records found.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{inc.title}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="font-bold text-blue-600">{inc.id}</span>
                          <span>•</span>
                          <span>{inc.reportedAt}</span>
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-slate-800">
                        {inc.zone}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </td>

                      {/* Responder Assignment */}
                      <td className="p-3">
                        <select
                          value={inc.responder}
                          onChange={(e) => handleUpdateResponder(inc.id, e.target.value)}
                          className="px-2 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-800 cursor-pointer focus:outline-hidden focus:border-blue-500 max-w-[160px] truncate"
                        >
                          <option value="Squad Alpha (Cmdr. Vance)">Squad Alpha (4 officers)</option>
                          <option value="Rapid Response 02">Rapid Response 02</option>
                          <option value="Patrol Beta (4 Officers)">Patrol Beta (4 Officers)</option>
                          <option value="Medic Unit 01">Medic Unit 01</option>
                          <option value="K-9 Security Detail">K-9 Security Detail</option>
                        </select>
                      </td>

                      {/* Status Badge */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(inc.status)}`}>
                          {inc.status}
                        </span>
                      </td>

                      {/* Status: Open → Investigating → Resolved */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inc.status === 'Open' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'Investigating')}
                              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1"
                              title="Advance to Investigating"
                            >
                              <span>Investigate</span>
                              <ArrowRightCircle className="w-3 h-3" />
                            </button>
                          )}
                          {inc.status === 'Investigating' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'Resolved')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1"
                              title="Resolve Incident"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Resolve</span>
                            </button>
                          )}
                          {inc.status === 'Resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'Investigating')}
                              className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                              title="Reopen incident"
                            >
                              Re-open
                            </button>
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

      {/* Create Incident Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-[#0F172A] text-base">Create Security Incident</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bottleneck Surge near Gate 3"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Sector / Zone</label>
                  <select
                    value={newIncident.zone}
                    onChange={(e) => setNewIncident({ ...newIncident, zone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    {zones.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assign Responder</label>
                <select
                  value={newIncident.responder}
                  onChange={(e) => setNewIncident({ ...newIncident, responder: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                >
                  <option value="Squad Alpha (Cmdr. Vance)">Squad Alpha (Cmdr. Vance)</option>
                  <option value="Rapid Response 02">Rapid Response 02</option>
                  <option value="Patrol Beta (4 Officers)">Patrol Beta (4 Officers)</option>
                  <option value="Medic Unit 01">Medic Unit 01</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Incident Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe observed crowd anomaly, obstruction or threat..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Dispatch & Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
