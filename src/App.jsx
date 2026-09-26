import React, { useState, useEffect } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Light-Theme Sticky Navbar and Platform Sections
import { CrowdIQNavbar } from './components/landing/CrowdIQNavbar';
import { CrowdIQHero } from './components/landing/CrowdIQHero';
import { LiveCrowdMonitoringPreview } from './components/landing/LiveCrowdMonitoringPreview';
import { LiveDashboardSection } from './components/landing/LiveDashboardSection';
import { ProblemSolutionSection } from './components/landing/ProblemSolutionSection';
import { HowCrowdIQWorks } from './components/landing/HowCrowdIQWorks';
import { ComputerVisionSection } from './components/landing/ComputerVisionSection';
import { RiskAlertSystemSection } from './components/landing/RiskAlertSystemSection';
import { VenueIntelligenceSection } from './components/landing/VenueIntelligenceSection';
import { TechnologySection } from './components/landing/TechnologySection';
import { CrowdIQFooter } from './components/landing/CrowdIQFooter';
import { RequestDemoModal } from './components/landing/RequestDemoModal';

// Dedicated Platform Application Pages
import { CommandCenterPage } from './pages/CommandCenterPage.tsx';
import { LiveCamerasPage } from './pages/LiveCamerasPage.tsx';
import { VenueMapPage } from './pages/VenueMapPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { PredictionsPage } from './pages/PredictionsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SecurityTeamsPage } from './pages/SecurityTeamsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

import { 
  Shield, 
  Activity, 
  Map, 
  TrendingUp, 
  Users, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  ExternalLink 
} from 'lucide-react';

function AppContent() {
  // Synchronize route with URL hash for GitHub Pages direct navigation & bookmarking
  const getRouteFromHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (['dashboard', 'console', 'command-center'].includes(hash)) return 'dashboard';
    if (['monitoring', 'live-monitoring', 'cameras'].includes(hash)) return 'monitoring';
    if (['analytics'].includes(hash)) return 'analytics';
    if (['alerts', 'incidents'].includes(hash)) return 'alerts';
    if (['how-it-works', 'howitworks'].includes(hash)) return 'how-it-works';
    if (['technology', 'tech'].includes(hash)) return 'technology';
    return 'overview';
  };

  const [activeRoute, setActiveRoute] = useState(getRouteFromHash);
  const [dashboardSubTab, setDashboardSubTab] = useState('overview'); // 'overview' | 'spatial' | 'predictive' | 'dispatch'
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (routeId) => {
    setActiveRoute(routeId);
    window.location.hash = `#/${routeId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] font-sans antialiased flex flex-col">
      {/* ===================================================================
          STICKY MAIN NAVIGATION BAR (MANDATORY ON ALL PAGES)
          Contains: Overview | Dashboard | Live Monitoring | Analytics | Alerts | How It Works | Technology | ● System Online
          =================================================================== */}
      <CrowdIQNavbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onRequestDemo={() => setIsDemoModalOpen(true)}
      />

      {/* ===================================================================
          MAIN PLATFORM VIEWPORT (ROUTED VIEW)
          =================================================================== */}
      <main className="flex-1">
        {/* ROUTE 1: OVERVIEW / LANDING PAGE */}
        {activeRoute === 'overview' && (
          <div className="space-y-0">
            {/* 1. Hero Section */}
            <CrowdIQHero
              onLaunchDashboard={() => handleNavigate('dashboard')}
              onViewDemo={() => handleNavigate('monitoring')}
              onRequestDemo={() => setIsDemoModalOpen(true)}
            />

            {/* 2. Live Product Preview (Immediate below Hero with 1,842 people, 72% density, LOW risk, DEMO SIMULATION) */}
            <LiveCrowdMonitoringPreview
              onLaunchFullConsole={() => handleNavigate('dashboard')}
              onJumpToSimulation={() => handleNavigate('dashboard')}
            />

            {/* 3. Problem / Solution Comparison */}
            <ProblemSolutionSection
              onLaunchDashboard={() => handleNavigate('dashboard')}
            />

            {/* 5. Crowd Detection (Computer Vision YOLOv8 + DeepSORT) */}
            <ComputerVisionSection />

            {/* 6. Risk & Alert System */}
            <RiskAlertSystemSection />

            {/* 7. Venue Spatial Intelligence */}
            <VenueIntelligenceSection />


            {/* 9. Direct Call to Action */}
            <section className="bg-white py-14 border-t border-b border-[#E2E8F0]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#2563EB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  INTELLIGENT SURVEILLANCE SUITE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Ready to deploy intelligent crowd risk prevention?
                </h2>
                <p className="text-sm text-[#64748B] max-w-2xl mx-auto">
                  Experience live CCTV telemetry, spatial heatmaps, kinematic bottleneck tracking, and automated security team dispatching.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleNavigate('monitoring')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Inspect CCTV Feeds</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ROUTE 2: MAIN DASHBOARD VIEW */}
        {activeRoute === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Dashboard Operational Header */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                    Operations Platform
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                    DEMO SIMULATION
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                  CrowdIQ Security Operations Dashboard
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Metropolitan Arena • Sector Floorplan • Real-time Congestion & Flow Telemetry
                </p>
              </div>

              {/* Sub-view Switcher for Command Center Tools */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDashboardSubTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    dashboardSubTab === 'overview'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Live Operations & Heatmap
                </button>
                <button
                  onClick={() => setDashboardSubTab('spatial')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    dashboardSubTab === 'spatial'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Spatial Blueprint
                </button>
                <button
                  onClick={() => setDashboardSubTab('predictive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    dashboardSubTab === 'predictive'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Predictive Analysis
                </button>
                <button
                  onClick={() => setDashboardSubTab('dispatch')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    dashboardSubTab === 'dispatch'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Security Dispatch
                </button>
              </div>
            </div>

            {/* Dashboard Sub-tab Content */}
            {dashboardSubTab === 'overview' && (
              <div className="space-y-6">
                <LiveDashboardSection />
              </div>
            )}

            {dashboardSubTab === 'spatial' && (
              <div className="space-y-6">
                <VenueMapPage />
              </div>
            )}

            {dashboardSubTab === 'predictive' && (
              <div className="space-y-6">
                <PredictionsPage />
              </div>
            )}

            {dashboardSubTab === 'dispatch' && (
              <div className="space-y-6">
                <SecurityTeamsPage />
              </div>
            )}
          </div>
        )}

        {/* ROUTE 3: LIVE MONITORING VIEW */}
        {activeRoute === 'monitoring' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <LiveCamerasPage />
          </div>
        )}

        {/* ROUTE 4: ANALYTICS VIEW */}
        {activeRoute === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AnalyticsPage />
          </div>
        )}

        {/* ROUTE 5: ALERTS VIEW */}
        {activeRoute === 'alerts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AlertsPage />
          </div>
        )}

        {/* ROUTE 6: HOW IT WORKS VIEW */}
        {activeRoute === 'how-it-works' && (
          <div className="space-y-6 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs mb-8">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                  Technical Architecture Pipeline
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">
                  How CrowdIQ Works
                </h1>
                <p className="text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed">
                  A high-throughput computer vision pipeline connecting RTSP surveillance feeds to edge YOLO detection, DeepSORT tracking, density estimation, and risk dispatch.
                </p>
              </div>
            </div>
            <HowCrowdIQWorks />
            <ComputerVisionSection />
          </div>
        )}

        {/* ROUTE 7: TECHNOLOGY VIEW */}
        {activeRoute === 'technology' && (
          <div className="space-y-6 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs mb-8">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                  System Stack & Specifications
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">
                  CrowdIQ Technical Specifications & Architecture
                </h1>
                <p className="text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed">
                  Built on industry-standard computer vision, spatial mathematics, and real-time state machines designed for low-latency operational environments.
                </p>
              </div>
            </div>
            <TechnologySection />
          </div>
        )}
      </main>

      {/* ===================================================================
          PROFESSIONAL PLATFORM FOOTER (MANDATORY ON ALL PAGES)
          Includes: © 2026 CrowdIQ. All rights reserved.
          CrowdIQ — Intelligent Crowd Safety Platform | Hackathon 2026
          =================================================================== */}
      <CrowdIQFooter onNavigate={handleNavigate} />

      {/* Emergency Overlay Modal */}
      <EmergencyOverlay />

      {/* Global Real-time Toast Stack */}
      <ToastContainer />

      {/* 100% Light Theme Request Demo Modal */}
      <RequestDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDashboard={() => handleNavigate('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}