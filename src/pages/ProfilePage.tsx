import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  Bell, 
  Activity, 
  CheckCircle2, 
  Key, 
  LogOut,
  Building,
  Award,
  Clock
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { ROLES_CONFIG } from '../services/dbClient';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, userRole, updateCurrentUserProfile, logout, auditLogs } = usePlatform();

  const [activeTab, setActiveTab] = useState<'Overview' | 'Account' | 'Security' | 'Notifications' | 'Activity'>('Overview');
  const [saveNotice, setSaveNotice] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone || '',
    organization: currentUser.organization || '',
    designation: currentUser.designation || '',
    preferredLanguage: currentUser.preferredLanguage || 'English',
    accessibilityPreference: currentUser.accessibilityPreference || '',
    emergencyContactName: currentUser.emergencyContactName || '',
    emergencyContactPhone: currentUser.emergencyContactPhone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: ''
  });
  const [passChanged, setPassChanged] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile(formData);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChanged(true);
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPassChanged(false), 3000);
  };

  const myAuditLogs = auditLogs.filter(a => a.userEmail === currentUser.email || a.user === currentUser.fullName);

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header Profile Identity Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                {ROLES_CONFIG[userRole]?.badge}
              </span>
              <span className="text-xs font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                ● Active Account
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              {currentUser.fullName}
            </h1>
            <p className="text-xs text-[#64748B]">
              {currentUser.email} • {currentUser.organization || 'CrowdIQ Platform'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout (Overview, Account, Security, Notifications, Activity) */}
      <div className="border-b border-[#E2E8F0] flex gap-1">
        {(['Overview', 'Account', 'Security', 'Notifications', 'Activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-[#2563EB] text-[#2563EB] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {saveNotice && (
        <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile configuration updated successfully!</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A]">Role Details &amp; Authority Scope</h2>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="font-bold text-[#2563EB]">{ROLES_CONFIG[userRole]?.name}</span>
              <p className="text-[#475569] leading-relaxed">
                {ROLES_CONFIG[userRole]?.description}
              </p>
            </div>

            {/* DYNAMIC ROLE-SPECIFIC INFORMATION */}
            <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
              <h3 className="font-bold text-[#0F172A]">Credentialed Telemetry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentUser.employeeOrOfficerId && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">ID / Badge</span>
                    <strong className="text-sm font-mono text-[#0F172A]">{currentUser.employeeOrOfficerId}</strong>
                  </div>
                )}
                {currentUser.designation && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Designation</span>
                    <strong className="text-sm text-[#0F172A]">{currentUser.designation}</strong>
                  </div>
                )}
                {currentUser.currentShift && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Current Shift</span>
                    <strong className="text-sm text-[#0F172A]">{currentUser.currentShift}</strong>
                  </div>
                )}
                {currentUser.emergencyContactName && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Emergency Contact</span>
                    <strong className="text-sm text-[#0F172A]">{currentUser.emergencyContactName} ({currentUser.emergencyContactPhone})</strong>
                  </div>
                )}
                {currentUser.certifications && currentUser.certifications.length > 0 && (
                  <div className="sm:col-span-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Professional Certifications</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentUser.certifications.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[10px] font-mono font-bold text-[#2563EB]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A]">Account Status</h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Account ID</span>
                <span className="font-mono text-[#0F172A]">{currentUser.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Last Logged In</span>
                <span className="text-[#0F172A] font-medium">{currentUser.lastLoginAt || 'Today'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Member Since</span>
                <span className="text-[#0F172A] font-medium">{currentUser.createdAt.split('T')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT SETTINGS */}
      {activeTab === 'Account' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs max-w-2xl text-xs">
          <h2 className="text-base font-bold text-[#0F172A] mb-4">Edit Profile &amp; Contact Details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[#475569] font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[#475569] font-medium mb-1">Preferred Language</label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[#475569] font-medium mb-1">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD CHANGE */}
      {activeTab === 'Security' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs max-w-xl text-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Security Credentials &amp; Password</h2>
          
          {passChanged && (
            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] font-bold">
              ✓ Password updated successfully!
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[#475569] font-medium mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPass: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
            </div>
            <div>
              <label className="block text-[#475569] font-medium mb-1">New Secure Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
            </div>
            <div>
              <label className="block text-[#475569] font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS PREFERENCES */}
      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs max-w-xl text-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Notification Delivery Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="font-bold text-[#0F172A] block">Critical Crowd Alerts</span>
                <span className="text-[#64748B]">Immediate high-frequency audible klaxon alerts</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="font-bold text-[#0F172A] block">Incident Assignment Radios</span>
                <span className="text-[#64748B]">Push notifications when squads are assigned</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="font-bold text-[#0F172A] block">Public Safety Announcements</span>
                <span className="text-[#64748B]">Advisories regarding gate redirects and egress</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
            </label>
          </div>
        </div>
      )}

      {/* TAB 5: RECENT ACTIVITY */}
      {activeTab === 'Activity' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h2 className="font-bold text-[#0F172A]">Personal Activity Audit Log</h2>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {myAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-[#64748B]">No recent personal actions recorded.</div>
            ) : (
              myAuditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#0F172A]">{log.action}</span>
                    <span className="text-[#64748B] block mt-0.5">{log.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
