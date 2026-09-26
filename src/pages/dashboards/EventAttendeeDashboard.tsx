import React, { useState } from 'react';
import { 
  QrCode, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  X, 
  ChevronRight,
  Info,
  ExternalLink,
  Plus
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { EventItem, EventRegistration } from '../../types/platform';

interface EventAttendeeDashboardProps {
  onNavigate: (route: string) => void;
}

export const EventAttendeeDashboard: React.FC<EventAttendeeDashboardProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    events, 
    registrations, 
    registerForEvent, 
    cancelRegistration 
  } = usePlatform();

  // Only registrations belonging to the current attendee (Strict Privacy Protection!)
  const myRegistrations = registrations.filter(r => r.attendeeId === currentUser.id && r.status === 'CONFIRMED');
  const availableUpcomingEvents = events.filter(e => e.status !== 'Completed' && e.status !== 'Cancelled');

  // Modals state
  const [selectedPass, setSelectedPass] = useState<EventRegistration | null>(myRegistrations[0] || null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [targetEventToRegister, setTargetEventToRegister] = useState<EventItem | null>(null);
  const [confirmationPass, setConfirmationPass] = useState<EventRegistration | null>(null);

  // Form State for Event Registration
  const [regForm, setRegForm] = useState({
    fullName: currentUser.fullName || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '+1 (555) 438-7721',
    attendanceDate: '2026-10-15',
    expectedArrivalTime: '08:45 AM',
    accompanyingPeople: 0,
    emergencyContactName: currentUser.emergencyContactName || 'Viktor Rostova',
    emergencyContactPhone: currentUser.emergencyContactPhone || '+1 (555) 438-9900',
    emergencyContactRelationship: 'Family',
    accessibilityAssistance: false,
    consentAgreed: true
  });

  const handleOpenRegister = (event: EventItem) => {
    setTargetEventToRegister(event);
    setRegForm({
      ...regForm,
      attendanceDate: event.startDate.split('T')[0]
    });
    setShowRegisterModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEventToRegister) return;

    const newPass = registerForEvent({
      eventId: targetEventToRegister.id,
      fullName: regForm.fullName,
      email: regForm.email,
      phone: regForm.phone,
      attendanceDate: regForm.attendanceDate,
      expectedArrivalTime: regForm.expectedArrivalTime,
      accompanyingPeople: Number(regForm.accompanyingPeople),
      emergencyContactName: regForm.emergencyContactName,
      emergencyContactPhone: regForm.emergencyContactPhone,
      emergencyContactRelationship: regForm.emergencyContactRelationship,
      accessibilityAssistance: regForm.accessibilityAssistance,
      consentAgreed: regForm.consentAgreed
    });

    setShowRegisterModal(false);
    setConfirmationPass(newPass);
    setSelectedPass(newPass);
  };

  const handleCancelRegistration = (regId: string) => {
    if (window.confirm("Are you sure you wish to cancel this event pass?")) {
      cancelRegistration(regId);
      if (selectedPass?.id === regId) {
        setSelectedPass(null);
      }
    }
  };

  return (
    <div className="space-y-8 text-[#0F172A]">
      {/* 1. Attendee Welcome & Profile Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                ATTENDEE ACCESS PORTAL
              </span>
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {currentUser.preferredLanguage || 'English'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
              Welcome back, {currentUser.fullName.split(' ')[0]}!
            </h1>
            <p className="text-xs text-[#64748B]">
              You have {myRegistrations.length} active digital event pass{myRegistrations.length !== 1 ? 'es' : ''}.
            </p>
          </div>
        </div>

        {/* Quick button */}
        <div>
          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Browse More Events</span>
          </button>
        </div>
      </div>

      {/* 2. PUBLIC SAFETY NOTICE BROADCAST BANNER (No sensitive telemetry, just clear guidance!) */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white border border-[#BFDBFE] text-[#2563EB] flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wide">
              Official Event Safety Advisory • Metropolitan Arena
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              STATUS: NORMAL
            </span>
          </div>
          <p className="text-xs text-[#334155] mt-1 leading-relaxed">
            "Please avoid Gate 3 and use North Gate 1 or East Gate 5 for fastest entry scanning. Medical first aid stations are active at Concourse Sectors B &amp; D."
          </p>
        </div>
      </div>

      {/* 3. MY REGISTERED PASSES (DIGITAL PASS QR CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              My Digital Event Passes &amp; QR Codes
            </h2>
            <p className="text-xs text-[#64748B]">
              Present this pass at the turnstile gate for contactless entry scanning.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#64748B]">
            {myRegistrations.length} Passes Active
          </span>
        </div>

        {myRegistrations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-10 text-center text-[#64748B] space-y-3">
            <QrCode className="w-12 h-12 text-[#CBD5E1] mx-auto" />
            <h3 className="font-bold text-sm text-[#0F172A]">No Active Event Passes</h3>
            <p className="text-xs max-w-sm mx-auto">
              You haven't registered for any events yet. Browse our upcoming calendar below to get your digital entrance pass!
            </p>
            <button
              onClick={() => onNavigate('events')}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-bold"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRegistrations.map((pass) => (
              <div 
                key={pass.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Pass Ticket Top */}
                <div className="p-5 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      PASS ID: {pass.registrationCode}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      CONFIRMED
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                      {pass.eventName}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      {pass.eventLocation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#F1F5F9]">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] uppercase block">Date & Time</span>
                      <span className="font-bold text-[#0F172A]">{pass.eventDate} ({pass.eventStartTime})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] uppercase block">Assigned Gate</span>
                      <span className="font-bold text-[#2563EB]">{pass.assignedGate}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Presentation Box */}
                <div className="p-5 flex flex-col sm:flex-row items-center gap-4 bg-white">
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#CBD5E1] shadow-2xs flex-shrink-0">
                    {/* High-fidelity SVG QR representation */}
                    <div className="w-28 h-28 bg-white p-2 border border-[#E2E8F0] rounded-lg flex flex-col items-center justify-center">
                      <QrCode className="w-20 h-20 text-[#0F172A]" />
                      <span className="text-[8px] font-mono text-[#64748B] mt-1">{pass.registrationCode}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#475569]">
                    <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valid for Contactless Scanner</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Attendee: <strong>{pass.attendeeName}</strong>
                      {pass.accompanyingPeople > 0 && <span> (+{pass.accompanyingPeople} accompanying)</span>}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Expected Arrival: <strong>{pass.expectedArrivalTime}</strong>
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPass(pass)}
                        className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold text-xs hover:bg-[#DBEAFE] cursor-pointer"
                      >
                        View Full Pass Details
                      </button>
                      <button
                        onClick={() => handleCancelRegistration(pass.id)}
                        className="text-xs text-[#DC2626] hover:underline"
                      >
                        Cancel Pass
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. UPCOMING EVENTS (BROWSE & REGISTER SYSTEM) */}
      <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            Upcoming Events Available for Registration
          </h2>
          <p className="text-xs text-[#64748B]">
            Browse safe, monitored venue events and register for free entrance credential passes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableUpcomingEvents.map((event) => {
            const isAlreadyRegistered = myRegistrations.some(r => r.eventId === event.id);
            const availableCapacity = event.maxCapacity - event.registeredAttendeesCount;
            return (
              <div 
                key={event.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#BFDBFE] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {event.status}
                    </span>
                    <span className="text-[11px] font-mono text-[#16A34A] font-semibold">
                      {availableCapacity.toLocaleString()} spots left
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">
                      {event.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#475569] pt-2 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{event.startDate.split('T')[0]} • 09:00 AM IST</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F1F5F9]">
                  {isAlreadyRegistered ? (
                    <div className="w-full py-2 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-center text-xs font-bold text-[#16A34A] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registered (Pass Active)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenRegister(event)}
                      className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Register for Event</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. EVENT SAFETY INSTRUCTIONS & ADVICE FOR ATTENDEES */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <Info className="w-4 h-4 text-[#2563EB]" />
          <h2 className="font-bold text-sm text-[#0F172A]">
            Event Safety Instructions &amp; Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="font-bold text-[#0F172A] block">1. Recommended Gates</span>
            <p className="text-[#64748B]">Always approach the specific gate indicated on your digital pass to minimize queue waiting times.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="font-bold text-[#0F172A] block">2. Emergency Exits</span>
            <p className="text-[#64748B]">Familiarize yourself with illuminated green exit signage. In an alert, proceed calmly without pushing.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="font-bold text-[#0F172A] block">3. Medical Aid Stations</span>
            <p className="text-[#64748B]">Paramedic tents are located adjacent to Sectors B &amp; D, offering free hydration and first aid care.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="font-bold text-[#0F172A] block">4. Lost &amp; Help Desk</span>
            <p className="text-[#64748B]">General information and lost &amp; found stanchions are situated beside Gate 1 Information Pavilion.</p>
          </div>
        </div>
      </div>

      {/* MODAL 1: REGISTRATION FORM MODAL */}
      {showRegisterModal && targetEventToRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-6 text-[#0F172A] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                  REGISTRATION SYSTEM
                </span>
                <h2 className="text-base font-extrabold text-[#0F172A] mt-1">
                  Register: {targetEventToRegister.name}
                </h2>
              </div>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 text-xs">
              {/* Personal Information */}
              <div>
                <span className="font-mono font-bold text-[#64748B] uppercase block mb-2">1. Personal Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#475569] font-medium mb-1">Mobile Phone (for Safety SMS)</label>
                    <input
                      type="tel"
                      required
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Details */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <span className="font-mono font-bold text-[#64748B] uppercase block mb-2">2. Attendance Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={regForm.attendanceDate}
                      onChange={(e) => setRegForm({ ...regForm, attendanceDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Expected Arrival</label>
                    <input
                      type="text"
                      required
                      value={regForm.expectedArrivalTime}
                      onChange={(e) => setRegForm({ ...regForm, expectedArrivalTime: e.target.value })}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Accompanying People</label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={regForm.accompanyingPeople}
                      onChange={(e) => setRegForm({ ...regForm, accompanyingPeople: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <span className="font-mono font-bold text-[#64748B] uppercase block mb-2">3. Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={regForm.emergencyContactName}
                      onChange={(e) => setRegForm({ ...regForm, emergencyContactName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      value={regForm.emergencyContactPhone}
                      onChange={(e) => setRegForm({ ...regForm, emergencyContactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#475569] font-medium mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      value={regForm.emergencyContactRelationship}
                      onChange={(e) => setRegForm({ ...regForm, emergencyContactRelationship: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                </div>
              </div>

              {/* Accessibility & Consent */}
              <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
                <span className="font-mono font-bold text-[#64748B] uppercase block">4. Accessibility &amp; Safety Consent</span>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regForm.accessibilityAssistance}
                    onChange={(e) => setRegForm({ ...regForm, accessibilityAssistance: e.target.checked })}
                    className="rounded text-[#2563EB]"
                  />
                  <span>Accessibility assistance / level ground access required</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={regForm.consentAgreed}
                    onChange={(e) => setRegForm({ ...regForm, consentAgreed: e.target.checked })}
                    className="rounded text-[#2563EB] mt-0.5"
                  />
                  <span className="text-[#64748B]">
                    I agree to the venue crowd safety guidelines and consent to receiving emergency exit notices if public safety alerts are broadcasted.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                >
                  Confirm &amp; Generate Digital Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION & FULL PASS INSPECTOR */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full overflow-hidden text-[#0F172A]">
            <div className="p-4 bg-[#2563EB] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                <h3 className="font-extrabold text-sm tracking-tight">CrowdIQ Digital Pass</h3>
              </div>
              <button onClick={() => setSelectedPass(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <span className="text-[11px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
                REGISTRATION CONFIRMED • PASS ACTIVE
              </span>

              <h2 className="text-lg font-bold text-[#0F172A]">
                {selectedPass.eventName}
              </h2>

              {/* QR Image */}
              <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-xs">
                <QrCode className="w-36 h-36 text-[#0F172A]" />
                <span className="text-[10px] font-mono font-bold text-[#64748B]">{selectedPass.registrationCode}</span>
              </div>

              <div className="text-xs text-left bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                <div><strong>Attendee:</strong> {selectedPass.attendeeName}</div>
                <div><strong>Assigned Gate:</strong> {selectedPass.assignedGate}</div>
                <div><strong>Date &amp; Arrival:</strong> {selectedPass.eventDate} at {selectedPass.expectedArrivalTime}</div>
                <div><strong>Emergency Contact:</strong> {selectedPass.emergencyContactName} ({selectedPass.emergencyContactPhone})</div>
              </div>

              <p className="text-[11px] text-[#64748B]">
                Please display this QR code to the optical turnstile scanner upon entering.
              </p>

              <button
                onClick={() => setSelectedPass(null)}
                className="w-full py-2 rounded-lg bg-[#F1F5F9] text-[#0F172A] font-bold text-xs hover:bg-[#E2E8F0]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
