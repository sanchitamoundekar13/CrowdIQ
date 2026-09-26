import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Users, 
  Camera, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit3, 
  CheckCircle2, 
  Info,
  Shield,
  Activity,
  ArrowRight
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { ZoneItem, RiskSeverity } from '../types/platform';

interface ZonesPageProps {
  onNavigate: (route: string) => void;
}

export const ZonesPage: React.FC<ZonesPageProps> = ({ onNavigate }) => {
  const { zones, addZone, updateZone, events, userRole, hasPermission } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);

  const canManageZones = hasPermission('zones.manage') || userRole === 'ADMIN';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    category: 'GATE' as any,
    location: '',
    capacity: 5000,
    currentCrowd: 1200,
    density: 24,
    flowDirection: 'NORTH -> SOUTH',
    inflowRate: 80,
    outflowRate: 75,
    riskLevel: 'LOW' as RiskSeverity,
    riskScore: 24,
    riskReason: 'Flow nominal; unobstructed passage through turnstiles.',
    assignedCamerasCount: 4,
    assignedOfficers: ['Officer K. Reyes']
  });

  const filteredZones = zones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          z.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || z.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateZone(editingZone.id, formData);
      setEditingZone(null);
    } else {
      addZone({
        ...formData,
        eventId: events[0]?.id || 'evt-001'
      });
    }
    setShowAddModal(false);
  };

  const handleOpenEdit = (zone: ZoneItem) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      shortName: zone.shortName,
      category: zone.category,
      location: zone.location,
      capacity: zone.capacity,
      currentCrowd: zone.currentCrowd,
      density: zone.density,
      flowDirection: zone.flowDirection,
      inflowRate: zone.inflowRate,
      outflowRate: zone.outflowRate,
      riskLevel: zone.riskLevel,
      riskScore: zone.riskScore,
      riskReason: zone.riskReason,
      assignedCamerasCount: zone.assignedCamerasCount,
      assignedOfficers: zone.assignedOfficers
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
              Spatial Intelligence
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {zones.length} Configured Sectors
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Zone &amp; Perimeter Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Real-time optical density thresholds, inflow/outflow balance, and risk justification.
          </p>
        </div>

        {canManageZones && (
          <button
            onClick={() => {
              setEditingZone(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Zone</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search zones by name or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="font-semibold text-[#475569]">Risk Filter:</span>
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">LOW</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => (
          <div 
            key={zone.id}
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  {zone.shortName} • {zone.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  zone.riskLevel === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' :
                  zone.riskLevel === 'HIGH' ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]' :
                  zone.riskLevel === 'MODERATE' ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]' :
                  'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                }`}>
                  {zone.riskLevel} RISK ({zone.riskScore}/100)
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#0F172A] tracking-tight">
                  {zone.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  {zone.location}
                </p>
              </div>

              {/* Density Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#64748B]">Density: <strong>{zone.density}%</strong></span>
                  <span className="font-bold text-[#0F172A]">{zone.currentCrowd.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      zone.density >= 75 ? 'bg-[#EA580C]' : zone.density >= 50 ? 'bg-[#CA8A04]' : 'bg-[#16A34A]'
                    }`}
                    style={{ width: `${zone.density}%` }}
                  />
                </div>
              </div>

              {/* RISK ENGINE EXPLANATION UI (REQUIREMENT: Explain WHY risk is high!) */}
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
                <span className="font-mono font-bold text-[#64748B] uppercase text-[10px] block">
                  Risk Diagnostic Reason:
                </span>
                <p className="text-[#334155] leading-relaxed">
                  {zone.riskReason}
                </p>
              </div>

              {/* Telemetry Vectors */}
              <div className="pt-2 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs text-[#64748B]">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Movement Direction</span>
                  <strong className="text-[#0F172A] font-mono">{zone.flowDirection}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Throughput Flux</span>
                  <span className="font-mono text-[#0F172A]">{zone.inflowRate} in / {zone.outflowRate} out</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>CCTV: <strong>{zone.assignedCamerasCount} nodes</strong></span>
                <span>Staff: <strong>{zone.assignedOfficers.join(', ')}</strong></span>
              </div>
            </div>

            {/* Actions */}
            {canManageZones && (
              <div className="px-5 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end">
                <button
                  onClick={() => handleOpenEdit(zone)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Parameters</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD / EDIT ZONE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A] max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              {editingZone ? `Edit Zone: ${editingZone.name}` : 'Add New Monitored Zone'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Defines capacity boundary, optical sensor mapping, and density thresholds.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gate 5 South Transit Hub"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Short Name / Code</label>
                  <input
                    type="text"
                    required
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="e.g. GATE 5"
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="GATE">GATE</option>
                    <option value="STAGE">STAGE</option>
                    <option value="EXIT">EXIT</option>
                    <option value="FACILITY">FACILITY</option>
                    <option value="SECURITY">SECURITY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Location Floorplan Tag</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. South Concourse Level 1"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Max Capacity (Persons)</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Initial Risk Level</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as RiskSeverity })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Risk Diagnostic Justification (Why?)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.riskReason}
                  onChange={(e) => setFormData({ ...formData, riskReason: e.target.value })}
                  placeholder="Describe kinematic bottlenecks, opposing vectors, or physical barrier constraints..."
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                >
                  {editingZone ? 'Save Changes' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
