import React, { useState, useEffect } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { SimulationProvider } from './context/SimulationContext';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Public & Architecture Components
import { PublicHomePage } from './components/public/PublicHomePage';
import { PublicFeaturesPage } from './components/public/PublicFeaturesPage';
import { PublicUseCasesPage } from './components/public/PublicUseCasesPage';
import { PublicAboutPage } from './components/public/PublicAboutPage';
import { PublicContactPage } from './components/public/PublicContactPage';
import { PublicAuthModal } from './components/public/PublicAuthModal';
import { CrowdIQFooter } from './components/landing/CrowdIQFooter';
import { HowCrowdIQWorks } from './components/landing/HowCrowdIQWorks';
import { ComputerVisionSection } from './components/landing/ComputerVisionSection';
import { TechnologySection } from './components/landing/TechnologySection';

// Shell Navigation
import { PlatformHeader } from './components/platform/PlatformHeader';
import { PlatformSidebar } from './components/platform/PlatformSidebar';
import { NotificationDrawer } from './components/platform/NotificationDrawer';

// Role-Specific Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { IncidentCommanderDashboard } from './pages/dashboards/IncidentCommanderDashboard';
import { SecurityOfficerDashboard } from './pages/dashboards/SecurityOfficerDashboard';
import { OperationsDirectorDashboard } from './pages/dashboards/OperationsDirectorDashboard';
import { EventAttendeeDashboard } from './pages/dashboards/EventAttendeeDashboard';

// Core Platform Pages
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { ZonesPage } from './pages/ZonesPage';
import { CamerasPage } from './pages/CamerasPage';
import { LiveCamerasPage } from './pages/LiveCamerasPage';
import { AlertsPage } from './pages/AlertsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { VenueMapPage } from './pages/VenueMapPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { SecurityTeamsPage } from './pages/SecurityTeamsPage';

// Admin Console Pages
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSystemHealthPage } from './pages/admin/AdminSystemHealthPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { MasterAdminPortal } from './pages/MasterAdminPortal';

import { Lock, ArrowLeft } from 'lucide-react';

function MainAppShell() {
  const { 
    userRole, 
    loginAsRole, 
    loginWithEmail 
  } = usePlatform();

  // Extract initial route from URL hash (defaults to 'overview')
  const getInitialRoute = () => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (!rawHash || rawHash === 'home') return 'overview';
    return rawHash;
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute());
  const [selectedEventId, setSelectedEventId] = useState('evt-001');

  // UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync route on hash changes
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!rawHash || rawHash === 'home') {
        setCurrentRoute('overview');
      } else {
        setCurrentRoute(rawHash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateRoute = (routeId) => {
    const cleanRoute = routeId.replace(/^#\/?/, '');
    setCurrentRoute(cleanRoute);
    window.location.hash = `#/${cleanRoute}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleInspectEvent = (eventId) => {
    setSelectedEventId(eventId);
    navigateRoute('event-detail');
  };

  // Dedicated Standalone Master Admin Portal (Level 5 Root Clearance)
  if (currentRoute === 'master-admin' || currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col">
        <MasterAdminPortal onNavigate={navigateRoute} />
        <EmergencyOverlay />
        <ToastContainer />
      </div>
    );
  }

  // Role-based Access Isolation: Attendee cannot see internal CCTV, alerts, or incidents
  const isAttendeeRestricted = userRole === 'EVENT_ATTENDEE' && 
    ['monitoring', 'alerts', 'incidents', 'cameras', 'zones', 'admin-console', 'admin-users', 'admin-roles', 'admin-audit', 'admin-health', 'admin-settings', 'spatial', 'predictions', 'dispatch'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Global Authenticated & System Header */}
        <PlatformHeader
          onNavigate={navigateRoute}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onGoToPublicSite={() => navigateRoute('overview')}
        />

        <div className="flex">
          {/* Universal Permanent Sidebar on the Side */}
          <PlatformSidebar
            currentRoute={currentRoute}
            onNavigate={navigateRoute}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Center Routed Viewport with all features accessible */}
          <main className="flex-1 min-w-0">
            {/* ACCESS RESTRICTED SCREEN FOR PUBLIC ATTENDEE */}
            {isAttendeeRestricted ? (
              <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#0F172A]">Access Restricted by Security Policy</h2>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Internal optical surveillance, tactical telemetry, and field radio dispatches are restricted to certified operational personnel.
                </p>
                <button
                  onClick={() => navigateRoute('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-bold shadow-xs hover:bg-[#1D4ED8] transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Attendee Portal</span>
                </button>
              </div>
            ) : (
              <>
                {/* 1. DISCOVERY / PUBLIC LANDING VIEWS */}
                {(currentRoute === 'overview' || currentRoute === 'home') && (
                  <PublicHomePage
                    onLaunchPlatform={() => navigateRoute('dashboard')}
                    onExploreFeatures={() => navigateRoute('features')}
                    onSelectTab={navigateRoute}
                  />
                )}

                {currentRoute === 'features' && (
                  <PublicFeaturesPage onLaunchPlatform={() => navigateRoute('dashboard')} />
                )}

                {currentRoute === 'use-cases' && (
                  <PublicUseCasesPage onLaunchPlatform={() => navigateRoute('dashboard')} />
                )}

                {currentRoute === 'about' && (
                  <PublicAboutPage onLaunchPlatform={() => navigateRoute('dashboard')} />
                )}

                {currentRoute === 'contact' && (
                  <PublicContactPage />
                )}

                {/* 2. HOW IT WORKS & CV PIPELINE */}
                {currentRoute === 'how-it-works' && (
                  <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
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
                    <HowCrowdIQWorks />
                    <ComputerVisionSection />
                  </div>
                )}

                {/* 3. TECHNOLOGY STACK & SPECS */}
                {currentRoute === 'technology' && (
                  <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
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
                    <TechnologySection />
                  </div>
                )}

                {/* 4. OPERATIONS DASHBOARD (ADAPTS TO USER ROLE) */}
                {currentRoute === 'dashboard' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {userRole === 'ADMIN' && <AdminDashboard onNavigate={navigateRoute} />}
                    {userRole === 'INCIDENT_COMMANDER' && <IncidentCommanderDashboard onNavigate={navigateRoute} />}
                    {userRole === 'SECURITY_OFFICER' && <SecurityOfficerDashboard onNavigate={navigateRoute} />}
                    {userRole === 'OPERATIONS_DIRECTOR' && <OperationsDirectorDashboard onNavigate={navigateRoute} />}
                    {userRole === 'EVENT_ATTENDEE' && <EventAttendeeDashboard onNavigate={navigateRoute} />}
                  </div>
                )}

                {/* 5. LIVE SURVEILLANCE & OPTICAL FEEDS */}
                {currentRoute === 'monitoring' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <LiveCamerasPage />
                  </div>
                )}

                {/* 6. SPATIAL BLUEPRINT & PREDICTIONS & DISPATCH */}
                {currentRoute === 'spatial' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <VenueMapPage />
                  </div>
                )}

                {currentRoute === 'predictions' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <PredictionsPage />
                  </div>
                )}

                {currentRoute === 'dispatch' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <SecurityTeamsPage />
                  </div>
                )}

                {/* 7. EVENTS CATALOG & DETAIL */}
                {currentRoute === 'events' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <EventsPage
                      onNavigate={navigateRoute}
                      onSelectEventDetail={handleInspectEvent}
                    />
                  </div>
                )}

                {currentRoute === 'event-detail' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <EventDetailPage
                      eventId={selectedEventId}
                      onBack={() => navigateRoute('events')}
                      onNavigate={navigateRoute}
                    />
                  </div>
                )}

                {/* 8. VENUE MANAGEMENT */}
                {currentRoute === 'zones' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <ZonesPage onNavigate={navigateRoute} />
                  </div>
                )}

                {currentRoute === 'cameras' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <CamerasPage onNavigate={navigateRoute} />
                  </div>
                )}

                {/* 9. ALERTS & INCIDENTS */}
                {currentRoute === 'alerts' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AlertsPage />
                  </div>
                )}

                {currentRoute === 'incidents' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <IncidentsPage onNavigate={navigateRoute} />
                  </div>
                )}

                {/* 10. ANALYTICS & REPORTS */}
                {currentRoute === 'analytics' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AnalyticsPage />
                  </div>
                )}

                {currentRoute === 'reports' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <ReportsPage />
                  </div>
                )}

                {/* 11. PERSONAL, NOTIFICATIONS & PASSES */}
                {currentRoute === 'notifications' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <NotificationsPage onNavigate={navigateRoute} />
                  </div>
                )}

                {currentRoute === 'profile' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <ProfilePage onNavigate={navigateRoute} />
                  </div>
                )}

                {currentRoute === 'event-safety' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <EventAttendeeDashboard onNavigate={navigateRoute} />
                  </div>
                )}

                {/* 12. ADMIN CONSOLE ROUTES */}
                {currentRoute === 'admin-console' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminDashboard onNavigate={navigateRoute} />
                  </div>
                )}

                {currentRoute === 'admin-users' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminUsersPage />
                  </div>
                )}

                {currentRoute === 'admin-roles' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminRolesPage />
                  </div>
                )}

                {currentRoute === 'admin-audit' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminAuditLogsPage />
                  </div>
                )}

                {currentRoute === 'admin-health' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminSystemHealthPage />
                  </div>
                )}

                {currentRoute === 'admin-settings' && (
                  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AdminSettingsPage />
                  </div>
                )}
              </>
            )}

            {/* Bottom Footer across all pages */}
            <CrowdIQFooter onNavigate={navigateRoute} />
          </main>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={navigateRoute}
      />

      <PublicAuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginAsRole={(role) => {
          loginAsRole(role);
          navigateRoute('dashboard');
        }}
        onLoginWithEmail={(email, role) => {
          const success = loginWithEmail(email, role);
          if (success) navigateRoute('dashboard');
          return success;
        }}
      />

      <EmergencyOverlay />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <SimulationProvider>
        <MainAppShell />
      </SimulationProvider>
    </PlatformProvider>
  );
}