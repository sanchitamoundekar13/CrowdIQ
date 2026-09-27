import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';
import { DatabaseStatusModal } from './components/common/DatabaseStatusModal.tsx';
import { ProfileModal } from './components/common/ProfileModal.tsx';

// Clean Operational Navigation & Footer
import { CrowdIQNavbar } from './components/landing/CrowdIQNavbar';
import { CrowdIQFooter } from './components/landing/CrowdIQFooter';

// Operational Platform Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { CommandCenterPage } from './pages/CommandCenterPage.tsx';
import { LiveDashboardSection } from './components/landing/LiveDashboardSection';
import { LiveCamerasPage } from './pages/LiveCamerasPage.tsx';
import { CamerasPage } from './pages/CamerasPage.tsx';
import { EventsPage } from './pages/EventsPage.tsx';
import { VenueMapPage } from './pages/VenueMapPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { IncidentsPage } from './pages/IncidentsPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AdminPortalPage } from './pages/AdminPortalPage.tsx';

function AppContent() {
  // Synchronize route with URL hash for seamless direct navigation & bookmarking
  const getRouteFromHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (['admin', 'admin-portal', 'admin-console'].includes(hash)) return 'admin';
    if (['monitoring', 'live-monitor'].includes(hash)) return 'monitoring';
    if (['cameras', 'camera', 'cctv'].includes(hash)) return 'cameras';
    if (['events', 'event', 'schedule'].includes(hash)) return 'events';
    if (['zones', 'sectors', 'map'].includes(hash)) return 'zones';
    if (['analytics', 'trends', 'flow'].includes(hash)) return 'analytics';
    if (['alerts', 'alerts-events'].includes(hash)) return 'alerts';
    if (['incidents', 'incident', 'dispatch', 'response'].includes(hash)) return 'incidents';
    if (['reports', 'report'].includes(hash)) return 'reports';
    if (['about', 'info'].includes(hash)) return 'about';
    if (['dashboard'].includes(hash)) return 'dashboard';
    return 'home'; // Default landing experience
  };

  const [activeRoute, setActiveRoute] = useState(getRouteFromHash);
  const [dashboardSubTab, setDashboardSubTab] = useState('overview'); // 'overview' | 'command'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDatabaseModalOpen, closeDatabaseModal, openDatabaseModal } = useSimulation();

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
          STREAMLINED PLATFORM NAVIGATION BAR
          CrowdIQ | Dashboard | Live Monitor | Events | Zones | Analytics | Alerts | Incidents
          Right side: 🟢 System Online | Profile
          =================================================================== */}
      <CrowdIQNavbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDatabase={openDatabaseModal}
      />

      {/* ===================================================================
          MAIN OPERATIONAL VIEWPORT
          =================================================================== */}
      <main className="flex-1">
        {/* LANDING PAGE EXPERIENCE */}
        {activeRoute === 'home' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {/* MODULE 1: DASHBOARD */}
        {activeRoute === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Dashboard Operational Header */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                    Operations Platform
                  </span>
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                    ACTIVE PRODUCTION
                  </span>
                  <button
                    onClick={openDatabaseModal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] transition cursor-pointer"
                    title="Inspect LocalStorage Database"
                  >
                    <span>💾 DB: Connected</span>
                  </button>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                  CrowdIQ Security Operations Dashboard
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                  Metropolitan Arena • Sector Floorplan • Real-time Congestion & Flow Telemetry
                </p>
              </div>

              {/* Sub-view Switcher for Dashboard */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDashboardSubTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                    dashboardSubTab === 'overview'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Live Operations & Heatmap
                </button>
                <button
                  onClick={() => setDashboardSubTab('command')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                    dashboardSubTab === 'command'
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                >
                  Command Metrics Grid
                </button>
              </div>
            </div>

            {dashboardSubTab === 'overview' ? (
              <LiveDashboardSection />
            ) : (
              <CommandCenterPage />
            )}
          </div>
        )}

        {/* MODULE 2: LIVE MONITOR */}
        {activeRoute === 'monitoring' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <LiveCamerasPage />
          </div>
        )}

        {/* MODULE 3: EVENTS */}
        {activeRoute === 'events' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <EventsPage />
          </div>
        )}

        {/* MODULE 4: ZONES */}
        {activeRoute === 'zones' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <VenueMapPage />
          </div>
        )}

        {/* MODULE: CAMERAS */}
        {activeRoute === 'cameras' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <CamerasPage />
          </div>
        )}

        {/* MODULE 5: ANALYTICS */}
        {activeRoute === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AnalyticsPage />
          </div>
        )}

        {/* MODULE 6: ALERTS */}
        {activeRoute === 'alerts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AlertsPage />
          </div>
        )}

        {/* MODULE 7: INCIDENTS */}
        {activeRoute === 'incidents' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <IncidentsPage />
          </div>
        )}

        {/* MODULE 8: REPORTS */}
        {activeRoute === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <ReportsPage />
          </div>
        )}

        {/* MODULE 9: ABOUT */}
        {activeRoute === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AboutPage />
          </div>
        )}

        {/* RESTRICTED MODULE: ADMIN PORTAL */}
        {activeRoute === 'admin' && (
          <AdminPortalPage />
        )}
      </main>

      {/* OPERATIONAL FOOTER */}
      <CrowdIQFooter onNavigate={handleNavigate} />

      {/* Emergency Overlay Modal */}
      <EmergencyOverlay />

      {/* Global Real-time Toast Stack */}
      <ToastContainer />

      {/* Operator Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigateAdmin={() => handleNavigate('admin')}
        onOpenDatabase={openDatabaseModal}
      />

      {/* LocalStorage Database Management Modal */}
      <DatabaseStatusModal 
        isOpen={isDatabaseModalOpen} 
        onClose={closeDatabaseModal} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </AuthProvider>
  );
}