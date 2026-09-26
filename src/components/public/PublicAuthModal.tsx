import React, { useState } from 'react';
import { X, Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/platform';
import { ROLES_CONFIG, INITIAL_PROFILES } from '../../services/dbClient';

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
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('EVENT_ATTENDEE');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const success = onLoginWithEmail(email, selectedRole);
      if (success) {
        onClose();
      } else {
        // Fallback: log in with selected role
        onLoginAsRole(selectedRole);
        onClose();
      }
    } else {
      // Register mock
      onLoginAsRole(selectedRole);
      onClose();
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    onLoginAsRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                Crowd<span className="text-[#2563EB]">IQ</span> Authentication & RBAC
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Supabase PostgreSQL 15+ & Row Level Security
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
        <div className="p-6 space-y-5">
          {/* Quick 1-Click Role Switcher for Portfolios & Interviews */}
          <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Instant Demo Role Logins (1-Click)</span>
              </span>
              <span className="text-[10px] text-[#2563EB] font-medium">Select to test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('ADMIN')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#DC2626]">Chief Admin</div>
                <div className="text-[10px] text-[#64748B] truncate">Root Platform</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('INCIDENT_COMMANDER')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#EA580C]">Incident Cmdr</div>
                <div className="text-[10px] text-[#64748B] truncate">Sarah Keller</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('SECURITY_OFFICER')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#2563EB]">Field Officer</div>
                <div className="text-[10px] text-[#64748B] truncate">Kevin Reyes</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('OPERATIONS_DIRECTOR')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#7C3AED]">Ops Director</div>
                <div className="text-[10px] text-[#64748B] truncate">David Chen</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('EVENT_ATTENDEE')}
                className="px-2 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-left text-[11px] font-semibold text-[#0F172A] transition-colors cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="font-bold text-[#16A34A]">Event Attendee</div>
                <div className="text-[10px] text-[#64748B] truncate">Elena Rostova</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E2E8F0]"></div>
            <span className="flex-shrink mx-3 text-[11px] font-mono text-[#94A3B8] uppercase">Or Sign In with Credentials</span>
            <div className="flex-grow border-t border-[#E2E8F0]"></div>
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
                  placeholder="e.g. Officer Marcus Vance"
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
                  placeholder="admin@crowdiq.security"
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

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1">Assigned Operational Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB] bg-white"
              >
                <option value="ADMIN">ADMIN — Master System Administrator</option>
                <option value="INCIDENT_COMMANDER">INCIDENT_COMMANDER — Tactical Lead</option>
                <option value="SECURITY_OFFICER">SECURITY_OFFICER — Field Operations</option>
                <option value="OPERATIONS_DIRECTOR">OPERATIONS_DIRECTOR — Venue Management</option>
                <option value="EVENT_ATTENDEE">EVENT_ATTENDEE — Public Digital Pass</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>{mode === 'login' ? 'Authenticate & Enter Platform' : 'Create Account & Access Platform'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
