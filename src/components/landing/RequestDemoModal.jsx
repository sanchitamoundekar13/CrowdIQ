import React, { useState } from 'react';
import { X, CheckCircle, Shield, ArrowRight, Building, Mail, User, Phone, Calendar } from 'lucide-react';

export function RequestDemoModal({ isOpen, onClose, onLaunchDashboard }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    venueCapacity: '10000_50000',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xl text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  Request CrowdIQ System Demo
                </h3>
                <span className="text-[10px] font-mono font-semibold uppercase text-[#2563EB]">
                  Security Operations Walkthrough
                </span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
              Schedule a live demonstration of CrowdIQ's edge computer vision crowd monitoring, predictive density modeling, and automated dispatch system.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sanchita Moundekar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input 
                    type="email"
                    required
                    placeholder="security.ops@metropolitan-arena.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Venue / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Metropolitan Arena Operations"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Venue Capacity Scale
                </label>
                <select
                  value={formData.venueCapacity}
                  onChange={(e) => setFormData({ ...formData, venueCapacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-hidden focus:border-[#2563EB] focus:bg-white"
                >
                  <option value="under_5000">Up to 5,000 capacity (Auditorium / Hall)</option>
                  <option value="5000_20000">5,000 – 20,000 capacity (Arena / Concourse)</option>
                  <option value="20000_50000">20,000 – 50,000 capacity (Stadium / Festival)</option>
                  <option value="50000_plus">50,000+ mega-gathering scale</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold font-mono tracking-wider shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>REQUEST SYSTEM DEMO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">
              Demo Request Registered!
            </h3>
            
            <p className="text-xs text-[#64748B] mb-5 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong>{formData.name}</strong>. Your operational demo session has been prepared. You can immediately inspect the live interactive security dashboard below.
            </p>

            <div className="flex flex-col gap-2.5">
              <button 
                className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold font-mono tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                onClick={() => {
                  handleReset();
                  if (onLaunchDashboard) onLaunchDashboard();
                }}
              >
                <span>OPEN LIVE OPERATIONAL DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                className="w-full py-2 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold font-mono transition-colors cursor-pointer"
                onClick={handleReset}
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
