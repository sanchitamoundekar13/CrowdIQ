import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Camera, 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { EventItem, EventStatus } from '../types/platform';

interface EventsPageProps {
  onNavigate: (route: string) => void;
  onSelectEventDetail: (eventId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onSelectEventDetail }) => {
  const { events, addEvent, userRole, hasPermission } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '2026-11-15T09:00:00Z',
    endDate: '2026-11-17T22:00:00Z',
    expectedCapacity: 25000,
    maxCapacity: 30000,
    status: 'Upcoming' as EventStatus,
    organizer: 'Metropolitan Arts Authority',
    publicStatus: 'NORMAL' as 'NORMAL' | 'HIGH CROWD' | 'RESTRICTED',
    publicSafetyAnnouncement: 'Welcome! Please adhere to designated gate ingress paths.',
    recommendedGates: ['Gate 1 (North Entrance)', 'Gate 3 (South Egress)']
  });

  const canManageEvents = hasPermission('events.create') || userRole === 'ADMIN';

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(newEventForm);
    setShowAddModal(false);
    setNewEventForm({
      name: '',
      description: '',
      location: '',
      startDate: '2026-11-15T09:00:00Z',
      endDate: '2026-11-17T22:00:00Z',
      expectedCapacity: 25000,
      maxCapacity: 30000,
      status: 'Upcoming',
      organizer: 'Metropolitan Arts Authority',
      publicStatus: 'NORMAL',
      publicSafetyAnnouncement: 'Welcome! Please adhere to designated gate ingress paths.',
      recommendedGates: ['Gate 1 (North Entrance)', 'Gate 3 (South Egress)']
    });
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
              Event Management Module
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {events.length} Events In Catalog
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Venues &amp; Managed Events
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure venue capacities, zones, CCTV camera associations, and attendee digital registrations.
          </p>
        </div>

        {canManageEvents && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Event</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, organizer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-xs font-semibold text-[#475569]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#CBD5E1] bg-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Live">Live</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const utilPct = Math.round((ev.registeredAttendeesCount / ev.maxCapacity) * 100);
          return (
            <div 
              key={ev.id}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#BFDBFE] transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ev.status === 'Live' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' :
                    ev.status === 'Upcoming' ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' :
                    'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    ● {ev.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#64748B]">
                    {ev.publicStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#0F172A] tracking-tight">
                    {ev.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-[#475569] pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                    <span>{ev.startDate.split('T')[0]} • 09:00 AM IST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                    <span>Capacity: <strong>{ev.maxCapacity.toLocaleString()} max</strong></span>
                  </div>
                </div>

                {/* Capacity Utilization Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#64748B]">Attendees: <strong>{ev.registeredAttendeesCount.toLocaleString()}</strong></span>
                    <span className="font-bold text-[#2563EB]">{utilPct}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        utilPct > 80 ? 'bg-[#EA580C]' : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${Math.min(utilPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sub-resource badges */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] text-[10px] font-mono text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#2563EB]" />
                    {ev.zonesCount} Zones
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-[#2563EB]" />
                    {ev.camerasCount} Cams
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#16A34A]" />
                    {ev.assignedStaffCount} Staff
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  By: {ev.organizer}
                </span>
                <button
                  onClick={() => onSelectEventDetail(ev.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Event Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-6 text-[#0F172A] max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              Create New Monitored Event
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Establishes zone architecture, CCTV routing, and attendee registration limits.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={newEventForm.name}
                  onChange={(e) => setNewEventForm({ ...newEventForm, name: e.target.value })}
                  placeholder="e.g. World Urban Summit 2026"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder="Brief description of event type, expected demographics, and schedule..."
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Venue Location</label>
                  <input
                    type="text"
                    required
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    placeholder="e.g. Sector 2 Convention Arena"
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Organizer Agency</label>
                  <input
                    type="text"
                    required
                    value={newEventForm.organizer}
                    onChange={(e) => setNewEventForm({ ...newEventForm, organizer: e.target.value })}
                    placeholder="e.g. Metropolitan Events Bureau"
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Expected Capacity</label>
                  <input
                    type="number"
                    required
                    value={newEventForm.expectedCapacity}
                    onChange={(e) => setNewEventForm({ ...newEventForm, expectedCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Max Regulatory Capacity</label>
                  <input
                    type="number"
                    required
                    value={newEventForm.maxCapacity}
                    onChange={(e) => setNewEventForm({ ...newEventForm, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Initial Status</label>
                  <select
                    value={newEventForm.status}
                    onChange={(e) => setNewEventForm({ ...newEventForm, status: e.target.value as EventStatus })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Public Safety State</label>
                  <select
                    value={newEventForm.publicStatus}
                    onChange={(e) => setNewEventForm({ ...newEventForm, publicStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH CROWD">HIGH CROWD</option>
                    <option value="RESTRICTED">RESTRICTED</option>
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
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
