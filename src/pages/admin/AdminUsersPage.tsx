import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Power, 
  Eye, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { UserProfile, UserRole } from '../../types/platform';
import { ROLES_CONFIG } from '../../services/dbClient';

export const AdminUsersPage: React.FC = () => {
  const { users, createUser, updateUser, toggleUserStatus, updateUserRole, events } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    role: 'SECURITY_OFFICER' as UserRole,
    organization: 'Metropolitan Protective Services',
    designation: 'Field Security Specialist',
    phone: '+1 (555) 000-1122'
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.organization && u.organization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      ...createForm,
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      lastLoginAt: 'Never'
    });
    setShowCreateModal(false);
    setCreateForm({
      fullName: '',
      email: '',
      role: 'SECURITY_OFFICER',
      organization: 'Metropolitan Protective Services',
      designation: 'Field Security Specialist',
      phone: '+1 (555) 000-1122'
    });
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Admin Console
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {users.length} Registered Accounts
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            User Provisioning &amp; Role Assignments
          </h1>
          <p className="text-xs text-[#64748B]">
            Create, edit, suspend, and configure authorization tiers for personnel and public attendees.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or org..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="INCIDENT_COMMANDER">Incident Commander</option>
              <option value="SECURITY_OFFICER">Security Officer</option>
              <option value="OPERATIONS_DIRECTOR">Operations Director</option>
              <option value="EVENT_ATTENDEE">Event Attendee</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Name / ID</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={u.fullName}
                        className="w-7 h-7 rounded-full object-cover border border-[#CBD5E1]"
                      />
                      <div>
                        <strong className="text-[#0F172A] block">{u.fullName}</strong>
                        <span className="text-[10px] font-mono text-[#64748B]">{u.employeeOrOfficerId || u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                      {ROLES_CONFIG[u.role]?.badge || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      u.isActive ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                    }`}>
                      {u.isActive ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {u.lastLoginAt || 'Recent'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {u.createdAt.split('T')[0]}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUserDetail(u)}
                        className="p-1.5 rounded-md hover:bg-[#EFF6FF] text-[#2563EB] cursor-pointer"
                        title="View User Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 rounded-md cursor-pointer ${
                          u.isActive ? 'hover:bg-[#FEF2F2] text-[#DC2626]' : 'hover:bg-[#F0FDF4] text-[#16A34A]'
                        }`}
                        title={u.isActive ? 'Disable User' : 'Enable User'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL MODAL / DRAWER */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserDetail.avatarUrl}
                  alt={selectedUserDetail.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#CBD5E1]"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">{selectedUserDetail.fullName}</h3>
                  <span className="text-[11px] text-[#64748B]">{selectedUserDetail.email}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="p-1 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-mono font-bold text-[#64748B] uppercase text-[10px] block">Role Assignment</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#2563EB]">{ROLES_CONFIG[selectedUserDetail.role]?.name}</span>
                  <select
                    value={selectedUserDetail.role}
                    onChange={(e) => {
                      updateUserRole(selectedUserDetail.id, e.target.value as UserRole);
                      setSelectedUserDetail({ ...selectedUserDetail, role: e.target.value as UserRole });
                    }}
                    className="px-2 py-1 rounded border border-[#CBD5E1] bg-white font-semibold text-xs"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="INCIDENT_COMMANDER">INCIDENT_COMMANDER</option>
                    <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                    <option value="OPERATIONS_DIRECTOR">OPERATIONS_DIRECTOR</option>
                    <option value="EVENT_ATTENDEE">EVENT_ATTENDEE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase block">Designation</span>
                  <strong className="text-xs text-[#0F172A]">{selectedUserDetail.designation || 'None'}</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase block">Organization</span>
                  <strong className="text-xs text-[#0F172A]">{selectedUserDetail.organization || 'None'}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block">Assigned Security Clearance</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {ROLES_CONFIG[selectedUserDetail.role]?.permissions.map(p => (
                    <span key={p} className="px-1.5 py-0.2 rounded bg-white border border-[#CBD5E1] font-mono text-[9px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 rounded-lg bg-[#F1F5F9] text-[#0F172A] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROVISION USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 text-[#0F172A] text-xs">
            <h2 className="text-base font-extrabold text-[#0F172A]">
              Provision Platform User
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-4">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="e.g. Officer Nathan Drake"
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="officer.drake@security.gov"
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Security Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-semibold"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="INCIDENT_COMMANDER">INCIDENT_COMMANDER</option>
                    <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                    <option value="OPERATIONS_DIRECTOR">OPERATIONS_DIRECTOR</option>
                    <option value="EVENT_ATTENDEE">EVENT_ATTENDEE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Organization</label>
                  <input
                    type="text"
                    value={createForm.organization}
                    onChange={(e) => setCreateForm({ ...createForm, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Designation</label>
                  <input
                    type="text"
                    value={createForm.designation}
                    onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
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
                  className="px-5 py-2 rounded-lg bg-[#2563EB] text-white font-bold"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
