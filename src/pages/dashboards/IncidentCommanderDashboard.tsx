import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Users, 
  Radio, 
  Activity, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  PhoneCall, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Video, 
  Send,
  AlertTriangle
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { IncidentStatus, RiskSeverity } from '../../types/platform';

interface IncidentCommanderDashboardProps {
  onNavigate: (route: string) => void;
}

export const IncidentCommanderDashboard: React.FC<IncidentCommanderDashboardProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    currentEvent, 
    incidents, 
    alerts, 
    zones, 
    updateIncidentStatus, 
    assignIncidentResponse, 
    resolveIncident, 
    createIncident 
  } = usePlatform();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [statusNote, setStatusNote] = useState('');
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [newIncidentForm, setNewIncidentForm] = useState({
    zoneName: 'Gate A - North Entry Plaza',
    location: '',
    type: 'CROWD_COMPRESSION',
    severity: 'HIGH' as RiskSeverity,
    description: ''
  });

  const activeIncidents = incidents.filter(i => i.status !== 'CLOSED');
  const criticalAlerts = alerts.filter(a => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'HIGH'));
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const workflowStages: IncidentStatus[] = [
    'DETECTED',
    'ACKNOWLEDGED',
    'INVESTIGATING',
    'RESPONSE_ASSIGNED',
    'RESPONSE_IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
  ];

  const handleAdvanceStatus = (nextStatus: IncidentStatus) => {
    if (!selectedIncident) return;
    updateIncidentStatus(selectedIncident.id, nextStatus, statusNote || `Status advanced to ${nextStatus} by Cmdr.`);
    setStatusNote('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createIncident({
      eventId: currentEvent?.id || 'evt-001',
      zoneName: newIncidentForm.zoneName,
      location: newIncidentForm.location || newIncidentForm.zoneName,
      type: newIncidentForm.type,
      severity: newIncidentForm.severity,
      description: newIncidentForm.description,
      assignedOfficers: ['Squad Alpha', 'Officer K. Reyes']
    });
    setSelectedIncidentId(created.id);
    setShowNewIncidentModal(false);
    setNewIncidentForm({
      zoneName: 'Gate A - North Entry Plaza',
      location: '',
      type: 'CROWD_COMPRESSION',
      severity: 'HIGH',
      description: ''
    });
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* 1. Incident Commander Profile & Context Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFEDD5]">
                TACTICAL COMMAND DESK
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                ID: {currentUser.employeeOrOfficerId || 'IC-DELTA-44'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              {currentUser.fullName} • {currentUser.designation || 'Incident Commander'}
            </h1>
            <p className="text-xs text-[#64748B]">
              {currentUser.organization || 'Metropolitan Emergency Management Bureau'} • Assigned: {currentEvent?.name}
            </p>
          </div>
        </div>

        {/* Quick Tactical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNewIncidentModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Tactical Incident</span>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>View CCTV Grid</span>
          </button>

          <button
            onClick={() => onNavigate('alerts')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold hover:bg-[#DBEAFE] transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Triage Alerts ({criticalAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Commander KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Incidents</span>
          <div className="text-2xl font-extrabold text-[#EA580C] mt-1">
            {activeIncidents.length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#64748B]">Under active triage</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Critical Alerts</span>
          <div className="text-2xl font-extrabold text-[#DC2626] mt-1">
            {criticalAlerts.length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#DC2626] font-semibold">Immediate attention</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Field Squads</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">
            08 / 08
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">Fully deployed</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Current Risk</span>
          <div className="text-2xl font-extrabold text-[#EA580C] mt-1">
            84 / 100
          </div>
          <span className="text-[10px] text-[#EA580C] font-semibold">Gate A compression</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Officers Online</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            84
          </div>
          <span className="text-[10px] text-[#64748B]">Radio linked</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Avg Response</span>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1">
            1.8m
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">Under target (&lt;3m)</span>
        </div>
      </div>

      {/* 3. Main Operational View: Active Incidents List + Lifecycle Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Incidents Queue */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#EA580C]" />
              <h2 className="font-bold text-sm text-[#0F172A]">Incident Queue</h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {activeIncidents.length} Active
            </span>
          </div>

          <div className="divide-y divide-[#F1F5F9] max-h-[500px] overflow-y-auto">
            {activeIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncident?.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-[#F8FAFC] ${
                    isSelected ? 'bg-[#EFF6FF] border-l-4 border-l-[#2563EB]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#0F172A]">
                      {inc.incidentNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      inc.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' :
                      inc.severity === 'HIGH' ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]' :
                      'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0F172A] mt-1">
                    {inc.type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                    {inc.location}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9] text-[10px] font-mono">
                    <span className="text-[#2563EB] font-bold">
                      {inc.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#94A3B8]">
                      {inc.detectedTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Selected Incident Workflow & Actions */}
        <div className="lg:col-span-2 space-y-5">
          {selectedIncident ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-5">
              
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {selectedIncident.incidentNumber}
                    </span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Detected at {selectedIncident.detectedTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0F172A] mt-1">
                    {selectedIncident.type.replace(/_/g, ' ')} — {selectedIncident.location}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    selectedIncident.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' :
                    'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
                  }`}>
                    {selectedIncident.severity} PRIORITY
                  </span>
                </div>
              </div>

              {/* Description & Intelligence */}
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5">
                <span className="font-mono font-bold text-[#64748B] uppercase">Incident Briefing:</span>
                <p className="text-[#334155] leading-relaxed">
                  {selectedIncident.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#64748B]">
                  <span><strong>Reported By:</strong> {selectedIncident.reportedBy}</span>
                  <span><strong>Assigned Commander:</strong> {selectedIncident.assignedCommander || 'Cmdr. Sarah Keller'}</span>
                  <span><strong>Assigned Squads:</strong> {selectedIncident.assignedOfficers.join(', ')}</span>
                </div>
              </div>

              {/* 7-STAGE INCIDENT WORKFLOW STEPPER */}
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                  Incident Response Lifecycle
                </span>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
                  {workflowStages.map((stage, idx) => {
                    const currentIdx = workflowStages.indexOf(selectedIncident.status);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div 
                        key={stage}
                        className={`p-2 rounded-lg border flex flex-col justify-between ${
                          isCurrent 
                            ? 'bg-[#2563EB] text-white border-[#1D4ED8] font-bold shadow-xs' 
                            : isDone
                            ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                            : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'
                        }`}
                      >
                        <span className="font-extrabold">{idx + 1}</span>
                        <span className="truncate mt-1">{stage.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advance Workflow Status Action Box */}
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-3">
                <span className="text-xs font-bold text-[#1D4ED8] block">
                  Advance Incident Status & Dispatch Response
                </span>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Enter command note or squad instructions..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:border-[#2563EB]"
                  />

                  {selectedIncident.status === 'DETECTED' && (
                    <button
                      onClick={() => handleAdvanceStatus('ACKNOWLEDGED')}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {selectedIncident.status === 'ACKNOWLEDGED' && (
                    <button
                      onClick={() => handleAdvanceStatus('INVESTIGATING')}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                    >
                      Begin Investigation
                    </button>
                  )}

                  {selectedIncident.status === 'INVESTIGATING' && (
                    <button
                      onClick={() => handleAdvanceStatus('RESPONSE_ASSIGNED')}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                    >
                      Assign Response Squad
                    </button>
                  )}

                  {selectedIncident.status === 'RESPONSE_ASSIGNED' && (
                    <button
                      onClick={() => handleAdvanceStatus('RESPONSE_IN_PROGRESS')}
                      className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                    >
                      Mark Response In Progress
                    </button>
                  )}

                  {selectedIncident.status === 'RESPONSE_IN_PROGRESS' && (
                    <button
                      onClick={() => handleAdvanceStatus('RESOLVED')}
                      className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold cursor-pointer"
                    >
                      Resolve Incident
                    </button>
                  )}

                  {selectedIncident.status === 'RESOLVED' && (
                    <button
                      onClick={() => handleAdvanceStatus('CLOSED')}
                      className="px-4 py-2 rounded-lg bg-[#475569] hover:bg-[#334155] text-white text-xs font-bold cursor-pointer"
                    >
                      Close & Archive
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline of Actions */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                  Incident Log & Timeline
                </span>
                <div className="space-y-2 border-l-2 border-[#CBD5E1] pl-3 ml-2">
                  {selectedIncident.timeline.map((item) => (
                    <div key={item.id} className="relative text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#2563EB] absolute -left-[17px] top-1" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{item.action}</span>
                        <span className="text-[10px] text-[#94A3B8]">({item.timestamp})</span>
                        <span className="text-[10px] text-[#64748B]">by {item.performedBy}</span>
                      </div>
                      <p className="text-[#475569] mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
              <AlertOctagon className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
              <p className="text-sm font-semibold">No active incidents selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Log Tactical Incident Modal */}
      {showNewIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A]">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              Log New Tactical Incident
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Dispatches directly to field security radio terminals and incident queue.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Target Zone</label>
                <select
                  value={newIncidentForm.zoneName}
                  onChange={(e) => setNewIncidentForm({ ...newIncidentForm, zoneName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Exact Location / Marker</label>
                <input
                  type="text"
                  required
                  value={newIncidentForm.location}
                  onChange={(e) => setNewIncidentForm({ ...newIncidentForm, location: e.target.value })}
                  placeholder="e.g. Turnstile 4 Stanchion"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Incident Type</label>
                  <select
                    value={newIncidentForm.type}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="CROWD_COMPRESSION">Crowd Compression Surge</option>
                    <option value="BARRIER_FAILURE">Barrier Barricade Strain</option>
                    <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
                    <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
                    <option value="SUSPICIOUS_ITEM">Unattended Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">Severity</label>
                  <select
                    value={newIncidentForm.severity}
                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, severity: e.target.value as RiskSeverity })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Detailed Situation Brief</label>
                <textarea
                  rows={3}
                  required
                  value={newIncidentForm.description}
                  onChange={(e) => setNewIncidentForm({ ...newIncidentForm, description: e.target.value })}
                  placeholder="Describe optical conditions, estimated person density, and immediate squad requirements..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold"
                >
                  Create & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
