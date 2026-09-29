import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Key,
  Globe,
  Loader2,
  Settings2
} from 'lucide-react';
import { UserRole } from '../../types/platform';
import { ROLES_CONFIG, INITIAL_PROFILES } from '../../services/dbClient';
import { usePlatform } from '../../context/PlatformContext';
import { supabaseAuth } from '../../services/supabaseAuth';

interface PublicAuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginAsRole: (role: UserRole) => void;
  onLoginWithEmail: (email: string, role?: UserRole) => boolean;
}

export const PublicAuthModal: React.FC<PublicAuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginAsRole,
  onLoginWithEmail
}) => {
  const { loginWithSupabase, registerWithSupabase, isSupabaseConfigured } = usePlatform();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('EVENT_ATTENDEE');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Quick Supabase Config Inline Toggle
  const [showConfig, setShowConfig] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseAuth.getConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseAuth.getConfig().anonKey);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        // Attempt Real Supabase Auth
        if (mode === 'login') {
          const res = await loginWithSupabase(email, password);
          if (res.success) {
            setSuccessMessage(res.message);
            setTimeout(() => {
              onClose();
            }, 500);
            return;
          } else {
            setErrorMessage(res.message);
          }
        } else {
          const res = await registerWithSupabase({
            email,
            password,
            fullName: fullName || email.split('@')[0],
            role: selectedRole
          });
          if (res.success) {
            setSuccessMessage(res.message);
            setTimeout(() => {
              onClose();
            }, 1000);
            return;
          } else {
            setErrorMessage(res.message);
          }
        }
      } else {
        // Fallback: Local RBAC Authentication
        if (mode === 'login') {
          const success = onLoginWithEmail(email, selectedRole);
          if (success) {
            onClose();
          } else {
            onLoginAsRole(selectedRole);
            onClose();
          }
        } else {
          onLoginAsRole(selectedRole);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    onLoginAsRole(role);
    onClose();
  };

  const handleSaveAndTestConfig = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const test = await supabaseAuth.testConnection(supabaseUrl, supabaseAnonKey);
      setTestResult(test);
      if (test.success) {
        supabaseAuth.saveConfig({ url: supabaseUrl, anonKey: supabaseAnonKey });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Connection test failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden text-[#0F172A] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-2xs">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                  Crowd<span className="text-[#2563EB]">IQ</span> Authentication & Security
                </h2>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isSupabaseConfigured 
                    ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' 
                    : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                }`}>
                  {isSupabaseConfigured ? 'SUPABASE LIVE' : 'HYBRID READY'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                PostgreSQL Row Level Security (RLS) &amp; JWT Identity
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">

          {/* Alert Messages */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick 1-Click Role Switcher for Portfolios & Interviews */}
          <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Instant Demo Role Logins (1-Click)</span>
              </span>
              <span className="text-[10px] text-[#2563EB] font-medium">Bypass Form</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('ADMIN')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#DC2626]">Admin</div>
                <div className="text-[9px] text-[#64748B] truncate">Root Clearance</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('INCIDENT_COMMANDER')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#EA580C]">Commander</div>
                <div className="text-[9px] text-[#64748B] truncate">Tactical Dispatch</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('SECURITY_OFFICER')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#2563EB]">Security</div>
                <div className="text-[9px] text-[#64748B] truncate">CCTV &amp; Field</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('OPERATIONS_DIRECTOR')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#7C3AED]">Operations</div>
                <div className="text-[9px] text-[#64748B] truncate">Venue Analytics</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('EVENT_ATTENDEE')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer sm:col-span-2"
              >
                <div className="font-bold text-[#16A34A]">Attendee</div>
                <div className="text-[9px] text-[#64748B]">Digital Safety Pass &amp; Schedule</div>
              </button>
            </div>
          </div>

          {/* Supabase Security Credentials Toggle */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-left text-xs font-semibold text-[#475569] flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Supabase Live Credentials Settings</span>
              </span>
              <Settings2 className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {showConfig && (
              <div className="p-3.5 bg-white border-t border-[#E2E8F0] space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Supabase Public Anon Key
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                {testResult && (
                  <div className={`p-2 rounded text-[11px] font-mono ${testResult.success ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
                    {testResult.message}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSaveAndTestConfig}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                  <span>Test Connection &amp; Save</span>
                </button>
              </div>
            )}
          </div>

          {/* Form Divider */}
          <div className="relative text-center">
            <hr className="border-[#E2E8F0]" />
            <span className="bg-white px-2 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] relative -top-2">
              {isSupabaseConfigured ? 'Sign In / Up via Supabase Auth' : 'Standard Email Credential Login'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Officer Marcus Vance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@crowdiq.security"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-2.5 top-2.5" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">Assigned Operational Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB] bg-white font-medium"
                >
                  <option value="ADMIN">ADMIN — Master System Administrator</option>
                  <option value="INCIDENT_COMMANDER">INCIDENT_COMMANDER — Tactical Lead</option>
                  <option value="SECURITY_OFFICER">SECURITY_OFFICER — Field Operations</option>
                  <option value="OPERATIONS_DIRECTOR">OPERATIONS_DIRECTOR — Venue Management</option>
                  <option value="EVENT_ATTENDEE">EVENT_ATTENDEE — Public Digital Pass</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Supabase...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Authenticate & Enter Platform' : 'Create Supabase Account & Access Platform'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle login vs register */}
          <div className="text-center text-xs text-[#64748B] pt-1">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#2563EB] font-bold hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#2563EB] font-bold hover:underline"
                >
                  Log in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
