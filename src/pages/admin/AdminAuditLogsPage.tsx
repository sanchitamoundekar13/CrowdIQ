import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Laptop 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.ipAddress.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || log.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Log ID,Timestamp,User,Email,Role,Action,Resource,Description,IP Address,Status\n"
      + filteredLogs.map(l => `"${l.id}","${l.timestamp}","${l.user}","${l.userEmail}","${l.role}","${l.action}","${l.resource}","${l.description}","${l.ipAddress}","${l.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrowdIQ_Security_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Compliance Audit Trail
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              Immutable Ledger
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            System &amp; Security Audit Logs
          </h1>
          <p className="text-xs text-[#64748B]">
            Tracks administrative overrides, role modifications, camera status toggles, incident dispatches, and login sessions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
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
            placeholder="Search action, user, IP, or resource..."
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
              <option value="ADMIN">ADMIN</option>
              <option value="INCIDENT_COMMANDER">INCIDENT_COMMANDER</option>
              <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
              <option value="OPERATIONS_DIRECTOR">OPERATIONS_DIRECTOR</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#475569]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="WARNING">WARNING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">User &amp; Role</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#64748B] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#2563EB]">
                    {log.resource}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155] max-w-sm">
                    {log.description}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-[#0F172A] block">{log.user}</strong>
                    <span className="text-[10px] font-mono text-[#64748B]">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.status === 'SUCCESS' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' :
                      log.status === 'WARNING' ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' :
                      'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
