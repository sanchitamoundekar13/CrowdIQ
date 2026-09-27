import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { UserRole, PermissionKey } from '../../types/platform';
import { ROLES_CONFIG } from '../../services/dbClient';

export const AdminRolesPage: React.FC = () => {
  const { rolePermissions, updateRolePermission } = usePlatform();

  const [saveNotice, setSaveNotice] = useState(false);

  // Modules across which permissions are evaluated
  const modules = [
    { key: 'users', label: 'Users & Accounts' },
    { key: 'events', label: 'Events & Scheduling' },
    { key: 'zones', label: 'Zones & Capacities' },
    { key: 'cameras', label: 'Cameras & RTSP' },
    { key: 'alerts', label: 'Alerts & Triage' },
    { key: 'incidents', label: 'Incidents & Workflows' },
    { key: 'reports', label: 'Reports & Audits' },
    { key: 'analytics', label: 'Spatial Analytics' },
  ];

  const roles: UserRole[] = [
    'ADMIN',
    'INCIDENT_COMMANDER',
    'SECURITY_OFFICER',
    'OPERATIONS_DIRECTOR',
    'EVENT_ATTENDEE'
  ];

  // Map module to read / manage permission keys
  const getPermissionForModuleAction = (module: string, action: 'READ' | 'CREATE' | 'EDIT' | 'DELETE'): PermissionKey => {
    if (module === 'users') {
      return action === 'READ' ? 'users.read' : 'users.manage';
    }
    if (module === 'events') {
      if (action === 'READ') return 'events.read';
      if (action === 'CREATE') return 'events.create';
      return 'events.manage';
    }
    if (module === 'zones') {
      return action === 'READ' ? 'zones.read' : 'zones.manage';
    }
    if (module === 'cameras') {
      return action === 'READ' ? 'cameras.read' : 'cameras.manage';
    }
    if (module === 'alerts') {
      return action === 'READ' ? 'alerts.read' : 'alerts.manage';
    }
    if (module === 'incidents') {
      if (action === 'READ') return 'incidents.read';
      if (action === 'CREATE') return 'incidents.create';
      return 'incidents.manage';
    }
    if (module === 'reports') {
      return action === 'READ' ? 'reports.read' : 'reports.generate';
    }
    // analytics
    return 'analytics.read';
  };

  const handleToggle = (role: UserRole, module: string, action: 'READ' | 'CREATE' | 'EDIT' | 'DELETE') => {
    // Admin has permanent root
    if (role === 'ADMIN') return;
    
    // Attendee cannot access internal security modules
    if (role === 'EVENT_ATTENDEE' && ['cameras', 'alerts', 'incidents', 'zones', 'users'].includes(module)) {
      alert("Security Policy: Event Attendees cannot be granted access to internal security telemetry.");
      return;
    }

    const permKey = getPermissionForModuleAction(module, action);
    const hasIt = rolePermissions[role]?.includes(permKey);
    updateRolePermission(role, permKey, !hasIt);

    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const checkHasPermission = (role: UserRole, module: string, action: 'READ' | 'CREATE' | 'EDIT' | 'DELETE'): boolean => {
    if (role === 'ADMIN') return true;
    if (role === 'EVENT_ATTENDEE' && ['cameras', 'alerts', 'incidents', 'zones', 'users'].includes(module)) return false;
    const permKey = getPermissionForModuleAction(module, action);
    return rolePermissions[role]?.includes(permKey) || false;
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Authorization Matrix
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              RLS Database Enforced
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Roles &amp; Permissions Security Matrix
          </h1>
          <p className="text-xs text-[#64748B]">
            Granular CRUD access control enforced at both backend PostgreSQL Row Level Security (RLS) and UI controller boundaries.
          </p>
        </div>

        {saveNotice && (
          <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Role policy updated!</span>
          </div>
        )}
      </div>

      {/* Security Guidance Alert */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <p className="text-[#334155] leading-relaxed">
          <strong>Security Policy Enforcement:</strong> Root Administrators retain immutable clearance across all subsystems. Event Attendees are strictly isolated to public event registrations and safety notices, and cannot read internal CCTV telemetry or incident actions.
        </p>
      </div>

      {/* Interactive Permission Matrix Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-xs font-bold text-[#0F172A]">Subsystem Access Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-44">Target Module</th>
                <th className="py-3 px-4 w-28 text-center">Action</th>
                {roles.map(r => (
                  <th key={r} className="py-3 px-4 text-center">
                    <span className="block font-bold text-[#0F172A]">{ROLES_CONFIG[r]?.name}</span>
                    <span className="text-[9px] text-[#64748B] font-normal">{ROLES_CONFIG[r]?.badge}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {modules.map((mod) => (
                <React.Fragment key={mod.key}>
                  {(['READ', 'CREATE', 'EDIT', 'DELETE'] as const).map((action, actionIdx) => (
                    <tr 
                      key={`${mod.key}-${action}`}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        actionIdx === 0 ? 'border-t-2 border-t-[#E2E8F0]' : ''
                      }`}
                    >
                      {actionIdx === 0 ? (
                        <td rowSpan={4} className="py-3 px-4 font-bold text-[#0F172A] bg-[#FAFAFA] border-r border-[#E2E8F0] align-top">
                          {mod.label}
                          <span className="block text-[10px] font-mono text-[#64748B] font-normal mt-0.5">
                            api/{mod.key}/*
                          </span>
                        </td>
                      ) : null}

                      <td className="py-2.5 px-4 font-mono font-bold text-center text-[#64748B] border-r border-[#F1F5F9]">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          action === 'READ' ? 'bg-[#F1F5F9] text-[#475569]' :
                          action === 'CREATE' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                          action === 'EDIT' ? 'bg-[#FFFBEB] text-[#D97706]' :
                          'bg-[#FEF2F2] text-[#DC2626]'
                        }`}>
                          {action}
                        </span>
                      </td>

                      {roles.map((r) => {
                        const hasPerm = checkHasPermission(r, mod.key, action);
                        const isLockedAdmin = r === 'ADMIN';
                        const isAttendeeBlocked = r === 'EVENT_ATTENDEE' && ['cameras', 'alerts', 'incidents', 'zones', 'users'].includes(mod.key);

                        return (
                          <td key={`${mod.key}-${action}-${r}`} className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              disabled={isLockedAdmin || isAttendeeBlocked}
                              onClick={() => handleToggle(r, mod.key, action)}
                              className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                                hasPerm
                                  ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                                  : 'bg-[#F8FAFC] text-[#CBD5E1] border border-[#E2E8F0]'
                              } ${
                                isLockedAdmin ? 'opacity-80 cursor-not-allowed' :
                                isAttendeeBlocked ? 'opacity-40 cursor-not-allowed' :
                                'hover:scale-110 active:scale-95'
                              }`}
                              title={
                                isLockedAdmin ? 'Root Admin permanent' :
                                isAttendeeBlocked ? 'Attendee blocked by security policy' :
                                'Click to toggle permission'
                              }
                            >
                              {hasPerm ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
