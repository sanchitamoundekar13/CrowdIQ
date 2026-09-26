import React, { useState, useEffect } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { SimulationProvider } from './context/SimulationContext';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Public Website Components
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicHomePage } from './components/public/PublicHomePage';
import { PublicFeaturesPage } from './components/public/PublicFeaturesPage';
import { PublicUseCasesPage } from './components/public/PublicUseCasesPage';
import { PublicAboutPage } from './components/public/PublicAboutPage';
import { PublicContactPage } from './components/public/PublicContactPage';
import { PublicAuthModal } from './components/public/PublicAuthModal';
import { CrowdIQFooter } from './components/landing/CrowdIQFooter';

// Authenticated Platform Shell
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

import { Shield, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

function MainAppShell() {
  const { 
    userRole, 
    loginAsRole, 
    loginWithEmail, 
    hasPermission 
  } = usePlatform();

  // Mode: 'PUBLIC' | 'PLATFORM'
  const getInitialStateFromHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    
    // Check if directly navigating to a platform route
    const platformRoutes = [
      'dashboard', 'monitoring', 'events', 'zones', 'cameras', 
      'alerts', 'incidents', 'analytics', 'reports', 'notifications', 
      'profile', 'admin-console', 'admin-users', 'admin-roles', 
      'admin-audit', 'admin-health', 'admin-settings', 'spatial', 'predictions', 'dispatch'
    ];
    
    if (platformRoutes.includes(hash)) {
      return { mode: 'PLATFORM', route: hash, publicTab: 'home' };
    }
    
    if (['features', 'use-cases', 'about', 'contact'].includes(hash)) {
      return { mode: 'PUBLIC', route: 'home', publicTab: hash };
    }

    return { mode: 'PUBLIC', route: 'home', publicTab: 'home' };
  };

  const initialState = getInitialStateFromHash();
  const [appMode, setAppMode] = useState(initialState.mode);
  const [platformRoute, setPlatformRoute] = useState(initialState.route === 'home' ? 'dashboard' : initialState.route);
  const [publicTab, setPublicTab] = useState(initialState.publicTab);
  const [selectedEventId, setSelectedEventId] = useState('evt-001');

  // UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!hash || hash === 'home' || hash === 'overview') {
        setAppMode('PUBLIC');
        setPublicTab('home');
      } else if (['features', 'use-cases', 'about', 'contact'].includes(hash)) {
        setAppMode('PUBLIC');
        setPublicTab(hash);
      } else {
        setAppMode('PLATFORM');
        setPlatformRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigatePlatform = (routeId) => {
    setPlatformRoute(routeId);
    setAppMode('PLATFORM');
    window.location.hash = `#/${routeId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigatePublic = (tabId) => {
    setPublicTab(tabId);
    setAppMode('PUBLIC');
    window.location.hash = `#/${tabId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchPlatform = () => {
    navigatePlatform('dashboard');
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleInspectEvent = (eventId) => {
    setSelectedEventId(eventId);
    navigatePlatform('event-detail');
  };

  // ---------------------------------------------------------------------------
  // RENDER 1: PUBLIC WEBSITE VIEW (Home, Features, Use Cases, About, Contact)
  // ---------------------------------------------------------------------------
  if (appMode === 'PUBLIC') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col justify-between">
        <div>
          <PublicNavbar
            activePublicTab={publicTab}
            onSelectTab={navigatePublic}
            onLaunchPlatform={handleLaunchPlatform}
            onOpenAuth={handleOpenAuth}
          />

          <main className="flex-1">
            {publicTab === 'home' && (
              <PublicHomePage
                onLaunchPlatform={handleLaunchPlatform}
                onExploreFeatures={() => navigatePublic('features')}
                onSelectTab={navigatePublic}
              />
            )}
            {publicTab === 'features' && (
              <PublicFeaturesPage onLaunchPlatform={handleLaunchPlatform} />
            )}
            {publicTab === 'use-cases' && (
              <PublicUseCasesPage onLaunchPlatform={handleLaunchPlatform} />
            )}
            {publicTab === 'about' && (
              <PublicAboutPage onLaunchPlatform={handleLaunchPlatform} />
            )}
            {publicTab === 'contact' && (
              <PublicContactPage />
            )}
          </main>
        </div>

        <CrowdIQFooter 
          onNavigate={(routeId) => {
            if (['features', 'use-cases', 'about', 'contact'].includes(routeId)) {
              navigatePublic(routeId);
            } else if (['dashboard', 'monitoring', 'events', 'analytics', 'alerts'].includes(routeId)) {
              navigatePlatform(routeId);
            } else {
              navigatePublic('home');
            }
          }} 
        />

        <PublicAuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLoginAsRole={(role) => {
            loginAsRole(role);
            navigatePlatform('dashboard');
          }}
          onLoginWithEmail={(email, role) => {
            const success = loginWithEmail(email, role);
            if (success) navigatePlatform('dashboard');
            return success;
          }}
        />

        <ToastContainer />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER 2: AUTHENTICATED PLATFORM VIEW (Dashboard, Live Monitor, Events, Zones,
  // Cameras, Alerts, Incidents, Analytics, Reports, Notifications, Profile, Admin)
  // ---------------------------------------------------------------------------

  // Role-based Access Isolation: Attendee cannot see internal CCTV, alerts, or incidents
  const isAttendeeRestricted = userRole === 'EVENT_ATTENDEE' && 
    ['monitoring', 'alerts', 'incidents', 'cameras', 'zones', 'admin-console', 'admin-users', 'admin-roles', 'admin-audit', 'admin-health', 'admin-settings'].includes(platformRoute);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col">
      {/* Authenticated Global Header */}
      <PlatformHeader
        onNavigate={navigatePlatform}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onGoToPublicSite={() => navigatePublic('home')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Primary Navigation Sidebar */}
        <PlatformSidebar
          currentRoute={platformRoute}
          onNavigate={navigatePlatform}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Center Routed Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ACCESS RESTRICTED SCREEN FOR PUBLIC ATTENDEE */}
          {isAttendeeRestricted ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#0F172A]">Access Restricted by Security Policy</h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Internal CCTV surveillance, field radio communications, and tactical security incidents are restricted to authorized event security personnel.
              </p>
              <button
                onClick={() => navigatePlatform('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Attendee Portal</span>
              </button>
            </div>
          ) : (
            <>
              {/* ROUTE 1: DASHBOARD (ADAPTS TO USER ROLE!) */}
              {platformRoute === 'dashboard' && (
                <>
                  {userRole === 'ADMIN' && <AdminDashboard onNavigate={navigatePlatform} />}
                  {userRole === 'INCIDENT_COMMANDER' && <IncidentCommanderDashboard onNavigate={navigatePlatform} />}
                  {userRole === 'SECURITY_OFFICER' && <SecurityOfficerDashboard onNavigate={navigatePlatform} />}
                  {userRole === 'OPERATIONS_DIRECTOR' && <OperationsDirectorDashboard onNavigate={navigatePlatform} />}
                  {userRole === 'EVENT_ATTENDEE' && <EventAttendeeDashboard onNavigate={navigatePlatform} />}
                </>
              )}

              {/* ROUTE 2: LIVE MONITOR */}
              {platformRoute === 'monitoring' && <LiveCamerasPage />}

              {/* ROUTE 3: EVENTS CATALOG & MANAGEMENT */}
              {platformRoute === 'events' && (
                <EventsPage
                  onNavigate={navigatePlatform}
                  onSelectEventDetail={handleInspectEvent}
                />
              )}

              {/* ROUTE 4: EVENT DETAIL WORKSPACE */}
              {platformRoute === 'event-detail' && (
                <EventDetailPage
                  eventId={selectedEventId}
                  onBack={() => navigatePlatform('events')}
                  onNavigate={navigatePlatform}
                />
              )}

              {/* ROUTE 5: ZONES MANAGEMENT */}
              {platformRoute === 'zones' && <ZonesPage onNavigate={navigatePlatform} />}

              {/* ROUTE 6: CAMERAS MANAGEMENT */}
              {platformRoute === 'cameras' && <CamerasPage onNavigate={navigatePlatform} />}

              {/* ROUTE 7: ALERTS TRIAGE */}
              {platformRoute === 'alerts' && <AlertsPage />}

              {/* ROUTE 8: INCIDENTS MANAGEMENT */}
              {platformRoute === 'incidents' && <IncidentsPage onNavigate={navigatePlatform} />}

              {/* ROUTE 9: ANALYTICS */}
              {platformRoute === 'analytics' && <AnalyticsPage />}

              {/* ROUTE 10: REPORTS GENERATION */}
              {platformRoute === 'reports' && <ReportsPage />}

              {/* ROUTE 11: NOTIFICATIONS */}
              {platformRoute === 'notifications' && <NotificationsPage onNavigate={navigatePlatform} />}

              {/* ROUTE 12: USER PROFILE */}
              {platformRoute === 'profile' && <ProfilePage onNavigate={navigatePlatform} />}

              {/* ROUTE 13: ATTENDEE EVENT SAFETY */}
              {platformRoute === 'event-safety' && <EventAttendeeDashboard onNavigate={navigatePlatform} />}

              {/* ROUTE 14: SPATIAL BLUEPRINT & PREDICTIONS & DISPATCH */}
              {platformRoute === 'spatial' && <VenueMapPage />}
              {platformRoute === 'predictions' && <PredictionsPage />}
              {platformRoute === 'dispatch' && <SecurityTeamsPage />}

              {/* ADMIN CONSOLE ROUTES (PROTECTED) */}
              {platformRoute === 'admin-console' && <AdminDashboard onNavigate={navigatePlatform} />}
              {platformRoute === 'admin-users' && <AdminUsersPage />}
              {platformRoute === 'admin-roles' && <AdminRolesPage />}
              {platformRoute === 'admin-audit' && <AdminAuditLogsPage />}
              {platformRoute === 'admin-health' && <AdminSystemHealthPage />}
              {platformRoute === 'admin-settings' && <AdminSettingsPage />}
            </>
          )}
        </main>
      </div>

      {/* Notification Drawer Component */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={navigatePlatform}
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