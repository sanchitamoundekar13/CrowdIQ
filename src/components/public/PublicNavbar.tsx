import React, { useState } from 'react';
import { Shield, Menu, X, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface PublicNavbarProps {
  activePublicTab: string;
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activePublicTab,
  onSelectTab,
  onLaunchPlatform,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'use-cases', label: 'Use Cases' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
            <Shield className="w-4.5 h-4.5" strokeWidth={2.4} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
              Crowd<span className="text-[#2563EB]">IQ</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] font-bold">
              SAAS PLATFORM
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePublicTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB] bg-[#EFF6FF] font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#CBD5E1] transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Login</span>
          </button>
          
          <button
            onClick={() => onOpenAuth('register')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Register</span>
          </button>

          <button
            onClick={onLaunchPlatform}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-xs transition-all active:scale-95 cursor-pointer ml-1"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onLaunchPlatform}
            className="px-2.5 py-1 text-xs font-bold text-white bg-[#2563EB] rounded-lg"
          >
            Launch
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#475569] hover:text-[#0F172A] rounded-lg border border-[#E2E8F0]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activePublicTab === link.id
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <button
              onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg text-center text-xs font-semibold text-[#0F172A] border border-[#CBD5E1]"
            >
              Login to Platform
            </button>
            <button
              onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg text-center text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]"
            >
              Create Account
            </button>
            <button
              onClick={() => { onLaunchPlatform(); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg text-center text-xs font-bold text-white bg-[#2563EB]"
            >
              Launch Platform Directly
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
