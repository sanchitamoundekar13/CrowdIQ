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
  ShieldCheck
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    securityTeams, 
    dispatchSecurityTeam, 
    zones, 
    emergencyMode, 
    toggleEmergencyMode, 
    playAlertSound,
    responseTime 
  } = useSimulation();

  const [selectedSquad, setSelectedSquad] = useState<string>('team-01');
  const [targetSector, setTargetSector] = useState<string>('gate-b');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const activeIncidents = alerts.filter(a => a.status === 'ACTIVE');
  const resolvedIncidents = alerts.filter(a => a.status === 'RESOLVED');

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = statusFilter === 'ALL' ? true : a.status === statusFilter;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchSecurityTeam(selectedSquad, targetSector);
    playAlertSound('warning');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACTION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
              Incident Command & Tactical Response Log
            </h1>
          </div>
          <p className="text-xs text-[#64748B] font-mono mt-0.5">
            Active hazard monitoring, rapid unit dispatching, and resolution audit trail
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              toggleEmergencyMode();
              playAlertSound('critical');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer flex items-center gap-1.5 border ${
              emergencyMode 
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{emergencyMode ? 'HALT EMERGENCY BROADCAST' : 'TRIGGER VENUE PA / KLAXON'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Active Incidents</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {activeIncidents.length}
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold">
              {activeIncidents.filter(a => a.severity === 'CRITICAL').length} Critical
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Requires commander acknowledgment
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
              {resolvedIncidents.length}
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">100% Cleared</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Archived in persistent audit ledger
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Target Response Time</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {responseTime}
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">-24s vs avg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Direct squad radio link online
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Units Deployed</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {securityTeams.length}
            </span>
            <span className="text-xs font-mono text-purple-600 font-bold">
              {securityTeams.reduce((acc, t) => acc + t.membersCount, 0)} Officers
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            All tactical units actively linked
          </p>
        </div>
      </div>

      {/* Main Grid: Direct Squad Dispatch + Tactical Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Rapid Tactical Unit Dispatcher (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Tactical Unit Dispatch
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Command Radio
            </span>
          </div>

          <form onSubmit={handleDispatch} className="space-y-3.5 text-xs font-mono">
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
              Unit Deployments
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

        {/* Right: Comprehensive Incident Log (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Incident Registry & Audit Trail
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Every detected bottleneck, surge warning, and operator acknowledgment
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter incident log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-mono focus:outline-hidden focus:border-blue-500 w-44"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {['ALL', 'ACTIVE', 'RESOLVED'].map(st => (
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
                  <th className="p-3">Time</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Incident Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 font-mono">
                      No matching incident records found.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-slate-500 font-semibold">{alert.timeFormatted}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">{alert.zoneName}</td>
                      <td className="p-3 text-slate-800 font-medium">{alert.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alert.status === 'ACTIVE' 
                            ? 'bg-rose-100 text-rose-800 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {alert.status === 'ACTIVE' ? (
                          <button
                            onClick={() => {
                              acknowledgeAlert(alert.id);
                              playAlertSound('info');
                            }}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono font-bold transition cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Resolved</span>
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
    </div>
  );
};
