import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay.tsx';

// Redesigned Light-Theme CrowdIQ Product Sections
import { CrowdIQNavbar } from './components/landing/CrowdIQNavbar';
import { CrowdIQHero } from './components/landing/CrowdIQHero';
import { LiveCrowdMonitoringPreview } from './components/landing/LiveCrowdMonitoringPreview';
import { LiveDashboardSection } from './components/landing/LiveDashboardSection';
import { HowCrowdIQWorks } from './components/landing/HowCrowdIQWorks';
import { ComputerVisionSection } from './components/landing/ComputerVisionSection';
import { RiskAlertSystemSection } from './components/landing/RiskAlertSystemSection';
import { VenueIntelligenceSection } from './components/landing/VenueIntelligenceSection';
import { TechnologySection } from './components/landing/TechnologySection';
import { ProblemSolutionSection } from './components/landing/ProblemSolutionSection';
import { CrowdIQFooter } from './components/landing/CrowdIQFooter';
import { RequestDemoModal } from './components/landing/RequestDemoModal';

// Command Center Pages
import { CommandCenterPage } from './pages/CommandCenterPage.tsx';
import { LiveCamerasPage } from './pages/LiveCamerasPage.tsx';
import { VenueMapPage } from './pages/VenueMapPage.tsx';
import { AlertsPage } from './pages/AlertsPage.tsx';
import { PredictionsPage } from './pages/PredictionsPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { SecurityTeamsPage } from './pages/SecurityTeamsPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

import { Shield, ArrowLeft, ArrowUpRight } from 'lucide-react';

function AppContent() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'console'
  const [currentPage, setCurrentPage] = useState('command-center');
  const [activeSection, setActiveSection] = useState('overview');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleLaunchConsole = (page = 'command-center') => {
    const pageMap = {
      'overview': 'command-center',
      'dashboard': 'command-center',
      'command-center': 'command-center',
      'live-cameras': 'live-cameras',
      'prediction': 'predictions',
      'predictions': 'predictions',
      'routing': 'venue-map',
      'venue-map': 'venue-map',
      'emergency': 'alerts',
      'alerts': 'alerts',
      'analytics': 'analytics',
      'security-teams': 'security-teams',
      'settings': 'settings'
    };
    setCurrentPage(pageMap[page] || 'command-center');
    setViewMode('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId) => {
    setActiveSection(sectionId);
    if (viewMode !== 'landing') {
      setViewMode('landing');
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenterPage />;
      case 'live-cameras':
        return <LiveCamerasPage />;
      case 'venue-map':
        return <VenueMapPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'security-teams':
        return <SecurityTeamsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] font-sans antialiased">
      {/* ===================================================================
          1. REDESIGNED LIGHT-THEME PRODUCT & SECURITY OPERATIONS WEBSITE
          =================================================================== */}
      {viewMode === 'landing' ? (
        <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
          
          {/* Professional Clean Light Navbar */}
          <CrowdIQNavbar
            onLaunchDashboard={() => handleLaunchConsole('command-center')}
            onRequestDemo={() => setIsDemoModalOpen(true)}
            activeSection={activeSection}
            onNavigateSection={handleNavigateSection}
          />

          <main className="flex-1">
            {/* 1. Hero Section with CCTV Bounding Box Visualizer */}
            <CrowdIQHero
              onLaunchDashboard={() => handleLaunchConsole('command-center')}
              onViewDemo={() => handleNavigateSection('live-dashboard')}
              onRequestDemo={() => setIsDemoModalOpen(true)}
            />

            {/* 2. Show The Product Early: Live Crowd Monitoring Preview */}
            <LiveCrowdMonitoringPreview
              onLaunchFullConsole={() => handleLaunchConsole('command-center')}
              onJumpToSimulation={() => handleNavigateSection('live-dashboard')}
            />

            {/* 3. Live Dashboard with Heatmap, Cameras, Alerts & Demo Simulation */}
            <LiveDashboardSection />

            {/* 4. How CrowdIQ Works: 6-Step Technical Pipeline */}
            <HowCrowdIQWorks />

            {/* 5. CCTV + Computer Vision Deep Dive */}
            <ComputerVisionSection />

            {/* 6. Venue Spatial Intelligence (WHERE, HOW, WHICH, WHERE) */}
            <VenueIntelligenceSection />

            {/* 7. Risk & Alert Incident Management System */}
            <RiskAlertSystemSection />

            {/* 8. Technical Architecture Stack */}
            <TechnologySection />

            {/* 9. Problem & Solution Comparison */}
            <ProblemSolutionSection
              onLaunchDashboard={() => handleLaunchConsole('command-center')}
            />
          </main>

          {/* Clean Light Footer */}
          <CrowdIQFooter
            onNavigateSection={handleNavigateSection}
            onLaunchDashboard={() => handleLaunchConsole('command-center')}
          />
        </div>
      ) : (
        /* ===================================================================
           2. DEDICATED FULL-SCREEN WORKSTATION CONSOLE (100% LIGHT THEME)
           =================================================================== */
        <div className="flex flex-col min-h-screen bg-[#F7F9FC] text-[#0F172A] font-sans">
          {/* Quick Header Banner to return to Landing */}
          <div className="bg-white border-b border-[#E2E8F0] px-6 py-2.5 flex justify-between items-center text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('landing')}
                className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition cursor-pointer"
                title="Return to CrowdIQ Product Overview"
              >
                <ArrowLeft size={13} /> Back to Overview
              </button>
              <span className="flex items-center gap-2 text-[#475569] font-medium hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                CrowdIQ Operations Console • Live Telemetry Synchronized
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#64748B] hidden md:inline">
                Metropolitan Arena Sector Map
              </span>
              <button 
                onClick={() => setViewMode('landing')}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition shadow-xs"
              >
                Exit Console
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Fixed Left Navigation Sidebar */}
            <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} />

            {/* Main Command Center Viewport */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F7F9FC]">
              <Navbar />
              
              <main className="flex-1 p-6 overflow-y-auto max-w-[1720px] w-full mx-auto">
                {renderPage()}
              </main>
            </div>
          </div>

          {/* Emergency Overlay Modal */}
          <EmergencyOverlay />

          {/* Global Real-time Toast Stack */}
          <ToastContainer />
        </div>
      )}

      {/* 100% Light Theme Request Demo Modal */}
      <RequestDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDashboard={() => handleLaunchConsole('command-center')}
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