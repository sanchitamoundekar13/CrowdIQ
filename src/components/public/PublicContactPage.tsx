import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const PublicContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    venueType: 'Stadium / Arena',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0F172A]">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
          Get in Touch
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
          Contact CrowdIQ Engineering & Operations
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-3xl leading-relaxed">
          Request an enterprise deployment consultation, CCTV architecture review, or custom integration briefing with our crowd safety specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Technical Inquiries</h3>
              <p className="text-xs text-[#64748B] mt-0.5">operations@crowdiq.security</p>
              <span className="text-[10px] font-mono text-[#16A34A] font-semibold mt-1 inline-block">24/7 Monitored Dispatch</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Command Center Hotline</h3>
              <p className="text-xs text-[#64748B] mt-0.5">+1 (800) 555-CROWD (2769)</p>
              <span className="text-[10px] text-[#64748B] mt-1 inline-block">Direct emergency routing</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Headquarters</h3>
              <p className="text-xs text-[#64748B] mt-0.5">CrowdIQ Systems Inc.</p>
              <p className="text-xs text-[#64748B]">Metropolitan Security Operations Center, Sector 4</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Inquiry Dispatched Successfully</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Thank you for reaching out. A CrowdIQ safety systems engineer will contact you within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-[#0F172A]">
                Request Venue Consultation / Demo
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Vance"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@arenaauthority.gov"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Organization / Agency</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Metropolitan Sports Bureau"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Venue / Event Type</label>
                  <select
                    value={formData.venueType}
                    onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB] bg-white"
                  >
                    <option>Stadium / Arena (&gt;30,000 capacity)</option>
                    <option>Music Festival / Multi-Stage</option>
                    <option>Transit Hub / Metro Station</option>
                    <option>Convention / Exhibition Center</option>
                    <option>Public City Square / Parade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Project Details / Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your current camera infrastructure, expected visitor volume, and safety objectives..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
