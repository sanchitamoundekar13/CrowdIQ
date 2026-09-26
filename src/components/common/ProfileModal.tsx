import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Shield, 
  Lock, 
  CheckCircle2, 
  X, 
  Database, 
  Key, 
  ShieldCheck, 
  Sliders, 
  LogOut,
  ExternalLink
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAdmin: () => void;
  onOpenDatabase: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateAdmin,
  onOpenDatabase
}) => {
  const { currentRole, userName, switchRole, roles } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-scaleUp text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">{userName}</h3>
              <p className="text-[11px] font-mono text-slate-500">
                Operator Clearance: Level 5 Commander
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-slate-800">Operational Duty Active</span>
          </div>
          <span 
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
            style={{ backgroundColor: `${currentRole.color}15`, color: currentRole.color }}
          >
            {currentRole.badge}
          </span>
        </div>

        {/* Role Switcher */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase block">
            Switch Operator Profile Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(roles).map((key) => {
              const r = roles[key];
              const isCurrent = currentRole.id === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(key)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {r.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-900 mt-1 truncate">
                    {r.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-blue-600 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-2 border-t border-slate-100 space-y-2 font-mono text-xs">
          <button
            onClick={() => {
              onClose();
              onNavigateAdmin();
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Master Admin Portal</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDatabase();
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database Storage Inspector</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600">CONNECTED</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] font-mono text-slate-400 border-t border-slate-100">
          CrowdIQ Security Platform • Operator ID: OPR-8812-VANCE
        </div>
      </div>
    </div>
  );
};
