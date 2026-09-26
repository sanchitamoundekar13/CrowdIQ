import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Power, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Settings2
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { CameraItem, CameraStatus } from '../types/platform';

interface CamerasPageProps {
  onNavigate: (route: string) => void;
}

export const CamerasPage: React.FC<CamerasPageProps> = ({ onNavigate }) => {
  const { cameras, addCamera, updateCamera, toggleCameraStatus, zones, events, userRole, hasPermission } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraItem | null>(null);

  const canManageCameras = hasPermission('cameras.manage') || userRole === 'ADMIN';

  // Form State
  const [formData, setFormData] = useState({
    cameraCode: '',
    name: '',
    location: '',
    zoneId: zones[0]?.id || 'zone-01',
    status: 'ONLINE' as CameraStatus,
    fps: 30,
    resolution: '1080p Full-HD',
    lastHeartbeat: 'Just now',
    currentPeopleCount: 1400,
    densityEstimate: 45,
    flowVector: { x: 0.1, y: -0.5, magnitude: 0.51, direction: 'INFLOW' }
  });

  const filteredCameras = cameras.filter((cam) => {
    const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.cameraCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.zoneName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zone = zones.find(z => z.id === formData.zoneId) || zones[0];
    if (editingCamera) {
      updateCamera(editingCamera.id, {
        ...formData,
        zoneName: zone.name
      });
      setEditingCamera(null);
    } else {
      addCamera({
        ...formData,
        zoneName: zone.name,
        eventId: events[0]?.id || 'evt-001'
      });
    }
    setShowAddModal(false);
  };

  const handleOpenEdit = (cam: CameraItem) => {
    setEditingCamera(cam);
    setFormData({
      cameraCode: cam.cameraCode,
      name: cam.name,
      location: cam.location,
      zoneId: cam.zoneId,
      status: cam.status,
      fps: cam.fps,
      resolution: cam.resolution,
      lastHeartbeat: cam.lastHeartbeat,
      currentPeopleCount: cam.currentPeopleCount,
      densityEstimate: cam.densityEstimate,
      flowVector: cam.flowVector
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
              Surveillance Grid
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              117 / 120 Online
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            CCTV Camera Management &amp; Ingestion Nodes
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure RTSP endpoints, YOLO edge inference FPS, resolution streams, and turnstile bindings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageCameras && (
            <button
              onClick={() => {
                setEditingCamera(null);
                setFormData({
                  cameraCode: `CAM-${String(cameras.length + 1).padStart(2, '0')}`,
                  name: '',
                  location: '',
                  zoneId: zones[0]?.id || 'zone-01',
                  status: 'ONLINE',
                  fps: 30,
                  resolution: '1080p Full-HD',
                  lastHeartbeat: 'Just now',
                  currentPeopleCount: 0,
                  densityEstimate: 0,
                  flowVector: { x: 0, y: 0, magnitude: 0, direction: 'STABLE' }
                });
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Camera Node</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs"
          >
            <Video className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Launch Live Monitor</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggle Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by CAM code, name, zone, or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONLINE">ONLINE</option>
              <option value="OFFLINE">OFFLINE</option>
              <option value="DEGRADED">DEGRADED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg border border-[#CBD5E1] p-0.5 bg-[#F8FAFC]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map((cam) => (
            <div 
              key={cam.id}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      {cam.cameraCode}
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">{cam.resolution}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                    cam.status === 'ONLINE' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' :
                    cam.status === 'MAINTENANCE' ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' :
                    'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                  }`}>
                    {cam.status === 'ONLINE' && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />}
                    {cam.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#0F172A] tracking-tight">
                    {cam.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                    {cam.location}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">Assigned Zone</span>
                    <strong className="text-[#0F172A] truncate block">{cam.zoneName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">FPS Rate</span>
                    <strong className="text-[#16A34A] font-mono">{cam.fps} FPS</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">People Headcount</span>
                    <strong className="text-[#0F172A] font-mono">{cam.currentPeopleCount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">Last Heartbeat</span>
                    <span className="text-[#64748B] font-mono">{cam.lastHeartbeat}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              {canManageCameras && (
                <div className="px-5 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleCameraStatus(cam.id)}
                    className="flex items-center gap-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    <Power className={`w-3.5 h-3.5 ${cam.status === 'ONLINE' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} />
                    <span>{cam.status === 'ONLINE' ? 'Take Offline' : 'Activate Node'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(cam)}
                    className="flex items-center gap-1 text-[#2563EB] hover:underline font-semibold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Code / Name</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">FPS / Res</th>
                <th className="py-3 px-4">People Count</th>
                <th className="py-3 px-4">Heartbeat</th>
                {canManageCameras && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#0F172A]">{cam.cameraCode}</span>
                    <span className="block text-[11px] text-[#64748B]">{cam.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">
                    {cam.zoneName}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {cam.location}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      cam.status === 'ONLINE' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FFFBEB] text-[#D97706]'
                    }`}>
                      {cam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {cam.fps} FPS • {cam.resolution}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0F172A]">
                    {cam.currentPeopleCount}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {cam.lastHeartbeat}
                  </td>
                  {canManageCameras && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(cam)}
                        className="px-2.5 py-1 rounded bg-[#EFF6FF] text-[#2563EB] font-bold text-xs hover:bg-[#DBEAFE]"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT CAMERA MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A]">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              {editingCamera ? `Configure: ${editingCamera.cameraCode}` : 'Register New Camera Node'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Registers camera hardware on edge YOLOv8 detection and DeepSORT pipeline.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Camera Code</label>
                  <input
                    type="text"
                    required
                    value={formData.cameraCode}
                    onChange={(e) => setFormData({ ...formData, cameraCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Assigned Zone</label>
                  <select
                    value={formData.zoneId}
                    onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Camera Descriptive Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Turnstile 5 Egress Overhead"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Physical Location Mounting</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Truss 4 Cantilever, Gate 2"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">FPS Target</label>
                  <input
                    type="number"
                    value={formData.fps}
                    onChange={(e) => setFormData({ ...formData, fps: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Resolution</label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option>1080p Full-HD</option>
                    <option>4K Ultra-HD</option>
                    <option>720p HD</option>
                  </select>
                </div>
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
                  Save Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
