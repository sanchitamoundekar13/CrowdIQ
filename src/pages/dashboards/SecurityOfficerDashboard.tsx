import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Video, 
  Camera, 
  PhoneCall, 
  Send, 
  CheckCircle2, 
  Navigation, 
  Radio, 
  Upload, 
  FileText,
  AlertOctagon,
  Eye
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { RiskSeverity } from '../../types/platform';

interface SecurityOfficerDashboardProps {
  onNavigate: (route: string) => void;
}

export const SecurityOfficerDashboard: React.FC<SecurityOfficerDashboardProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    currentEvent, 
    zones, 
    cameras, 
    alerts, 
    acknowledgeAlert, 
    createIncident 
  } = usePlatform();

  // Find officer's assigned zone
  const assignedZone = zones.find(z => z.id === currentUser.assignedZoneId) || zones[0];
  const zoneCameras = cameras.filter(c => c.zoneId === assignedZone?.id);
  const zoneAlerts = alerts.filter(a => a.zoneId === assignedZone?.id && a.status !== 'RESOLVED');

  // Interactive Form State for Report Incident
  const [incidentForm, setIncidentForm] = useState({
    type: 'CROWD_COMPRESSION',
    location: assignedZone?.name || 'Gate A Turnstile Bank',
    severity: 'HIGH' as RiskSeverity,
    description: '',
    attachmentName: ''
  });
  const [reportSuccess, setReportSuccess] = useState(false);
  const [observationText, setObservationText] = useState('');
  const [observationLogged, setObservationLogged] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [callingCommander, setCallingCommander] = useState(false);

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    createIncident({
      eventId: currentEvent?.id || 'evt-001',
      zoneId: assignedZone?.id,
      zoneName: assignedZone?.name || 'Sector Alpha',
      location: incidentForm.location,
      type: incidentForm.type,
      severity: incidentForm.severity,
      description: incidentForm.description + (incidentForm.attachmentName ? ` [Attached: ${incidentForm.attachmentName}]` : ''),
      assignedOfficers: [currentUser.fullName]
    });
    setReportSuccess(true);
    setIncidentForm({
      type: 'CROWD_COMPRESSION',
      location: assignedZone?.name || 'Gate A Turnstile Bank',
      severity: 'HIGH',
      description: '',
      attachmentName: ''
    });
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText) return;
    setObservationLogged(true);
    setObservationText('');
    setTimeout(() => setObservationLogged(false), 3000);
  };

  const handleShareLocation = () => {
    setLocationShared(true);
    setTimeout(() => setLocationShared(false), 3000);
  };

  const handleCallCommander = () => {
    setCallingCommander(true);
    setTimeout(() => setCallingCommander(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* 1. Security Officer Duty Status Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                FIELD SECURITY OFFICER
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                ID: {currentUser.employeeOrOfficerId || 'SO-SECTOR-A18'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              {currentUser.fullName} • On Active Duty
            </h1>
            <p className="text-xs text-[#64748B]">
              {currentUser.organization || 'Apex Protective Field Services'} • Shift: {currentUser.currentShift || 'Day Shift (08:00 - 18:00 IST)'}
            </p>
          </div>
        </div>

        {/* Quick Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShareLocation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{locationShared ? 'GPS Telemetry Synced!' : 'Share GPS Location'}</span>
          </button>

          <button
            onClick={handleCallCommander}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] text-xs font-bold text-[#1D4ED8] cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{callingCommander ? 'Connecting Audio Channel...' : 'Call Commander'}</span>
          </button>

          <button
            onClick={() => onNavigate('alerts')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Call</span>
          </button>
        </div>
      </div>

      {/* 2. Tactical Metrics Grid (PRIORITIZES ACTION OVER ANALYTICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">My Event</span>
          <div className="text-xs font-bold text-[#0F172A] mt-1 truncate" title={currentEvent?.name}>
            {currentEvent?.name}
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">● Status: Live</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">My Zone</span>
          <div className="text-xs font-bold text-[#2563EB] mt-1 truncate" title={assignedZone?.name}>
            {assignedZone?.name}
          </div>
          <span className="text-[10px] text-[#64748B]">Capacity: {assignedZone?.capacity.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Zone Density</span>
          <div className="text-2xl font-extrabold text-[#EA580C] mt-1">
            {assignedZone?.density}%
          </div>
          <span className="text-[10px] text-[#EA580C] font-semibold">Risk: {assignedZone?.riskLevel}</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Zone Headcount</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {assignedZone?.currentCrowd.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#64748B]">{assignedZone?.flowDirection}</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Active Alerts</span>
          <div className="text-2xl font-extrabold text-[#DC2626] mt-1">
            {zoneAlerts.length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#DC2626] font-semibold">In your sector</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Nearby Cameras</span>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1">
            {zoneCameras.length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">All online (30 FPS)</span>
        </div>
      </div>

      {/* 3. Main Split View: Tactical Incident Report Form + Sector Alerts & Cameras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Tactical Incident Report Form */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[#DC2626]" />
              <h2 className="font-bold text-base text-[#0F172A]">
                Report Field Incident
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748B]">Immediate Dispatch</span>
          </div>

          {reportSuccess && (
            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Incident reported successfully! Command desk notified and logged to audit trail.</span>
            </div>
          )}

          <form onSubmit={handleReportIncident} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Incident Type</label>
                <select
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="CROWD_COMPRESSION">Crowd Surge / Compression</option>
                  <option value="BARRIER_DEFECT">Barrier Barricade Strain</option>
                  <option value="MEDICAL_EMERGENCY">Medical Distressed Attendee</option>
                  <option value="TURNSTILE_BOTTLENECK">Turnstile Scanner Jam</option>
                  <option value="GATE_OBSTRUCTION">Fire Exit Path Obstruction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Severity Rating</label>
                <select
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as RiskSeverity })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="CRITICAL">CRITICAL — Immediate Squad Needed</option>
                  <option value="HIGH">HIGH — High Risk Condition</option>
                  <option value="MODERATE">MODERATE — Monitor Situation</option>
                  <option value="LOW">LOW — Minor Stoppage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Exact Location / Marker</label>
              <input
                type="text"
                required
                value={incidentForm.location}
                onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                placeholder="e.g. Turnstile 3 & 4 outer perimeter"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Incident Description & Field Notes</label>
              <textarea
                rows={3}
                required
                value={incidentForm.description}
                onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                placeholder="Describe ground observations, estimated crowd density, physical distress signs..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Photo / Video Attachment Simulation */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">
                Photo / Video Evidence Attachment
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={incidentForm.attachmentName}
                  onChange={(e) => setIncidentForm({ ...incidentForm, attachmentName: e.target.value })}
                  placeholder="e.g. Turnstile_Stanchion_Compress.jpg"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={() => setIncidentForm({ ...incidentForm, attachmentName: `CAM_CAPTURE_${Date.now().toString().slice(-4)}.jpg` })}
                  className="px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Attach</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit & Transmit Incident Report</span>
            </button>
          </form>

          {/* Quick Ground Observation Box */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <form onSubmit={handleAddObservation} className="flex gap-2">
              <input
                type="text"
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Log quick non-emergency radio observation..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A]"
              >
                Log Note
              </button>
            </form>
            {observationLogged && (
              <span className="text-[10px] text-[#16A34A] font-semibold mt-1 inline-block">
                ✓ Observation saved to duty ledger
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Zone Alerts & Nearby CCTV Feeds */}
        <div className="space-y-5">
          {/* Active Sector Alerts */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Active Alerts in My Sector ({zoneAlerts.length})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">{assignedZone?.name}</span>
            </div>

            <div className="space-y-2.5">
              {zoneAlerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64748B]">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A] mx-auto mb-1" />
                  <span>Sector nominal. No active alerts for your post.</span>
                </div>
              ) : (
                zoneAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A]">{alert.type.replace(/_/g, ' ')}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' : 'bg-[#FFF7ED] text-[#EA580C]'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[#64748B]">
                      <span>Marker: {alert.location}</span>
                      {alert.status === 'ACTIVE' ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[#16A34A] font-bold">✓ Acknowledged</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nearby Sector Cameras */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Assigned Cameras ({zoneCameras.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('monitoring')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Open Full Grid
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zoneCameras.map((cam) => (
                <div key={cam.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0F172A]">{cam.cameraCode}</span>
                    <span className="text-[10px] font-mono font-semibold text-[#16A34A] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                      {cam.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#475569] truncate" title={cam.name}>
                    {cam.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                    <span>Headcount: <strong>{cam.currentPeopleCount}</strong></span>
                    <span>Density: <strong>{cam.densityEstimate}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
