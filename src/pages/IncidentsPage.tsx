import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldAlert, 
  ChevronRight, 
  MapPin, 
  Send 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { IncidentRecord, IncidentStatus, RiskSeverity } from '../types/platform';

interface IncidentsPageProps {
  onNavigate: (route: string) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ onNavigate }) => {
  const { 
    incidents, 
    createIncident, 
    updateIncidentStatus, 
    resolveIncident, 
    zones, 
    events, 
    userRole, 
    hasPermission 
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord>(incidents[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');

  const [createForm, setCreateForm] = useState({
    zoneName: zones[0]?.name || 'Gate A - North Entry Plaza',
    location: '',
    type: 'CROWD_COMPRESSION',
    severity: 'HIGH' as RiskSeverity,
    description: '',
    assignedOfficers: 'Officer K. Reyes, Squad Alpha'
  });

  const canCreate = hasPermission('incidents.create') || userRole === 'ADMIN';
  const canManage = hasPermission('incidents.manage') || userRole === 'ADMIN';

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const workflowStages: IncidentStatus[] = [
    'DETECTED',
    'ACKNOWLEDGED',
    'INVESTIGATING',
    'RESPONSE_ASSIGNED',
    'RESPONSE_IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createIncident({
      eventId: events[0]?.id || 'evt-001',
      zoneName: createForm.zoneName,
      location: createForm.location || createForm.zoneName,
      type: createForm.type,
      severity: createForm.severity,
      description: createForm.description,
      assignedOfficers: createForm.assignedOfficers.split(',').map(s => s.trim())
    });
    setSelectedIncident(created);
    setShowCreateModal(false);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolutionText) return;
    resolveIncident(selectedIncident.id, resolutionText);
    setResolutionText('');
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFEDD5]">
              Incident Management System
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {incidents.length} Total Incidents
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Tactical Incidents &amp; Response Lifecycle
          </h1>
          <p className="text-xs text-[#64748B]">
            Structured 7-stage progression: Detected → Acknowledged → Investigating → Response Assigned → In Progress → Resolved → Closed.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Tactical Incident</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, location, type..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              {workflowStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MODERATE">MODERATE</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split Grid: Incidents List + Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Incidents List */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
            <span className="text-xs font-bold text-[#0F172A]">Incident Ledger</span>
            <span className="text-[11px] font-mono text-[#64748B]">{filteredIncidents.length} shown</span>
          </div>

          <div className="divide-y divide-[#F1F5F9] max-h-[600px] overflow-y-auto">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncident?.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-[#F8FAFC] ${
                    isSelected ? 'bg-[#EFF6FF] border-l-4 border-l-[#2563EB]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#0F172A]">{inc.incidentNumber}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      inc.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' :
                      inc.severity === 'HIGH' ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]' :
                      'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#0F172A] mt-1">{inc.type.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">{inc.location}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9] text-[10px] font-mono">
                    <span className="text-[#2563EB] font-bold">{inc.status}</span>
                    <span className="text-[#94A3B8]">{inc.detectedTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Selected Incident Details & Workflow */}
        <div className="lg:col-span-2 space-y-5">
          {selectedIncident ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5 text-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {selectedIncident.incidentNumber}
                    </span>
                    <span className="text-[#64748B] font-mono">
                      Detected: {selectedIncident.detectedTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A] mt-1">
                    {selectedIncident.type.replace(/_/g, ' ')} — {selectedIncident.location}
                  </h2>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold self-start sm:self-auto ${
                  selectedIncident.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' :
                  'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
                }`}>
                  {selectedIncident.severity}
                </span>
              </div>

              {/* Description Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <span className="font-mono font-bold text-[#64748B] uppercase text-[10px] block">
                  Incident Brief:
                </span>
                <p className="text-[#334155] leading-relaxed">
                  {selectedIncident.description}
                </p>
                <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#64748B]">
                  <div><strong>Zone:</strong> {selectedIncident.zoneName}</div>
                  <div><strong>Reported By:</strong> {selectedIncident.reportedBy}</div>
                  <div><strong>Commander:</strong> {selectedIncident.assignedCommander || 'Cmdr. Sarah Keller'}</div>
                </div>
              </div>

              {/* 7-Stage Workflow Progress */}
              <div className="space-y-2">
                <span className="font-mono font-bold text-[#64748B] uppercase text-[10px] block">
                  Workflow State Progression
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-center font-mono text-[10px]">
                  {workflowStages.map((stage, idx) => {
                    const currentIdx = workflowStages.indexOf(selectedIncident.status);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded-lg border flex flex-col justify-between ${
                          isCurrent ? 'bg-[#2563EB] text-white border-[#1D4ED8] font-bold shadow-xs' :
                          isDone ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' :
                          'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'
                        }`}
                      >
                        <span className="font-extrabold">{idx + 1}</span>
                        <span className="truncate mt-1">{stage.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resolution Form if in progress */}
              {canManage && selectedIncident.status !== 'RESOLVED' && selectedIncident.status !== 'CLOSED' && (
                <form onSubmit={handleResolveSubmit} className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-3">
                  <span className="font-bold text-[#1D4ED8] block">Document Operational Resolution</span>
                  <textarea
                    rows={2}
                    required
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Enter resolution notes, squad actions taken, and barrier restoration details..."
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold cursor-pointer"
                    >
                      Resolve &amp; Close Incident
                    </button>
                  </div>
                </form>
              )}

              {selectedIncident.resolution && (
                <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                  <span className="font-mono font-bold text-[#16A34A] uppercase text-[10px] block">Verified Resolution:</span>
                  <p className="text-[#166534]">{selectedIncident.resolution}</p>
                </div>
              )}

              {/* Incident Timeline */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="font-mono font-bold text-[#64748B] uppercase text-[10px] block">
                  Action Audit Trail
                </span>
                <div className="space-y-2 border-l-2 border-[#CBD5E1] pl-3 ml-2">
                  {selectedIncident.timeline.map((tl) => (
                    <div key={tl.id} className="relative text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#2563EB] absolute -left-[17px] top-1" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{tl.action}</span>
                        <span className="text-[10px] text-[#94A3B8]">({tl.timestamp})</span>
                        <span className="text-[10px] text-[#64748B]">by {tl.performedBy}</span>
                      </div>
                      <p className="text-[#475569] mt-0.5">{tl.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
              No incident selected
            </div>
          )}
        </div>
      </div>

      {/* CREATE INCIDENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A] text-xs">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              Log Tactical Incident
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Zone</label>
                <select
                  value={createForm.zoneName}
                  onChange={(e) => setCreateForm({ ...createForm, zoneName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                >
                  {zones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Location Marker</label>
                <input
                  type="text"
                  required
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="e.g. Turnstile Bank 4"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Severity</label>
                  <select
                    value={createForm.severity}
                    onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value as RiskSeverity })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Type</label>
                  <input
                    type="text"
                    required
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#DC2626] text-white font-bold"
                >
                  Log &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
