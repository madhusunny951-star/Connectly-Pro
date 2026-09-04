import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { MobileNav } from './components/common/MobileNav.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { DiscoverPage } from './components/discover/DiscoverPage.tsx';
import { LikesPage } from './components/likes/LikesPage.tsx';
import { MatchesPage } from './components/matches/MatchesPage.tsx';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow.tsx';
import { MyProfilePage } from './components/profile/MyProfilePage.tsx';
import { SettingsPage } from './components/settings/SettingsPage.tsx';
import { SafetyCenter } from './components/safety/SafetyCenter.tsx';
import { NotificationsPage } from './components/notifications/NotificationsPage.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { MatchModal } from './components/matching/MatchModal.tsx';
import { PublicProfileModal } from './components/profile/PublicProfileModal.tsx';
import { ReportModal } from './components/safety/ReportModal.tsx';
import { BackendStatusModal } from './components/common/BackendStatusModal.tsx';

const AppContent: React.FC = () => {
  const { 
    user, isAuthenticated, currentRoute, navigateTo, 
    inspectedProfileId, closeProfileModal,
    quickSwitchUser, isBackendModalOpen, openBackendModal, closeBackendModal,
    backendPingMs
  } = useAuth();

  // If user is on landing page or not authenticated
  if (currentRoute === '/landing' || !isAuthenticated) {
    return (
      <>
        <LandingPage onGetStarted={async () => {
          await quickSwitchUser('usr_me');
          navigateTo('/discover');
        }} />
        <BackendStatusModal
          isOpen={isBackendModalOpen}
          onClose={closeBackendModal}
        />
      </>
    );
  }

  // Active View Router
  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case '/onboarding':
        return <OnboardingFlow />;
      case '/discover':
        return <DiscoverPage />;
      case '/likes':
        return <LikesPage />;
      case '/matches':
        return <MatchesPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/profile':
        return <MyProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/safety':
        return <SafetyCenter />;
      case '/admin':
        return <AdminDashboard />;
      default:
        if (currentRoute.startsWith('/messages')) {
          return <MatchesPage />;
        }
        return <DiscoverPage />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans antialiased selection:bg-rose-200 selection:text-rose-900 pb-16 md:pb-0 relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      {/* Frosted Glass Footer */}
      <footer className="h-12 hidden sm:flex items-center justify-center px-8 bg-white/20 backdrop-blur-md border-t border-white/30 text-xs text-slate-500 gap-8 z-10 mt-auto">
        <button onClick={() => navigateTo('/safety')} className="hover:text-rose-600 transition-colors">Safety Center</button>
        <button onClick={() => navigateTo('/settings')} className="hover:text-rose-600 transition-colors">Privacy & Settings</button>
        <button onClick={() => navigateTo('/discover')} className="hover:text-rose-600 transition-colors">Terms of Service</button>
        <button 
          onClick={openBackendModal}
          className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-emerald-700 transition-all cursor-pointer bg-white/40 px-2.5 py-1 rounded-full border border-white/60"
          title="Click to view Backend & API status"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[11px] font-semibold text-slate-700">Backend Connected {backendPingMs ? `(${backendPingMs}ms)` : ''}</span>
        </button>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Dialogs */}
      <MatchModal />
      <PublicProfileModal
        userId={inspectedProfileId}
        onClose={closeProfileModal}
      />
      <ReportModal />
      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={closeBackendModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
