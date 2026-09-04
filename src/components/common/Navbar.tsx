import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Heart, Sparkles, MessageCircle, Bell, User, Settings, 
  Shield, LogOut, ChevronDown, CheckCircle2, Flame, ShieldAlert,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, isAuthenticated, isAdmin, currentRoute, navigateTo, 
    logout, quickSwitchUser, unreadNotifsCount, unreadMessagesCount,
    backendPingMs, openBackendModal
  } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  if (!isAuthenticated) return null;

  const demoUsers = [
    { id: 'usr_me', name: 'Taylor Morgan', role: 'Default Profile (They/Them, 26)' },
    { id: 'usr_1', name: 'Sophia Chen', role: 'Architect (She/Her, 25)' },
    { id: 'usr_2', name: 'Marcus Vance', role: 'Audio Engineer (He/Him, 28)' },
    { id: 'usr_3', name: 'Elena Rostova', role: 'Marine Biologist (She/Her, 26)' },
    { id: 'usr_admin', name: 'Admin Moderator', role: 'Safety Team (Admin Access)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('/discover')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-200/50">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600 tracking-tight flex items-center gap-1.5">
              Connectly
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/60 text-rose-600 border border-white/80 backdrop-blur-xs">
                PRO
              </span>
            </span>
            <p className="text-[10px] text-slate-500 hidden sm:block">Meaningful Connections</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            id="nav-discover"
            onClick={() => navigateTo('/discover')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
              currentRoute === '/discover'
                ? 'bg-white/70 text-rose-600 backdrop-blur-md border border-white/60 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-500 hover:bg-white/40'
            }`}
          >
            <Flame className={`w-4 h-4 ${currentRoute === '/discover' ? 'text-rose-600 fill-rose-600' : ''}`} />
            <span>Discover</span>
          </button>

          <button
            id="nav-likes"
            onClick={() => navigateTo('/likes')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 relative ${
              currentRoute === '/likes'
                ? 'bg-white/70 text-rose-600 backdrop-blur-md border border-white/60 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-500 hover:bg-white/40'
            }`}
          >
            <Heart className={`w-4 h-4 ${currentRoute === '/likes' ? 'text-rose-600 fill-rose-600' : ''}`} />
            <span>Likes</span>
          </button>

          <button
            id="nav-matches"
            onClick={() => navigateTo('/matches')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 relative ${
              currentRoute.startsWith('/matches') || currentRoute.startsWith('/messages')
                ? 'bg-white/70 text-rose-600 backdrop-blur-md border border-white/60 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-500 hover:bg-white/40'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${currentRoute.startsWith('/matches') ? 'text-rose-600' : ''}`} />
            <span>Matches</span>
            {unreadMessagesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            id="nav-notifications"
            onClick={() => navigateTo('/notifications')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 relative ${
              currentRoute === '/notifications'
                ? 'bg-white/70 text-rose-600 backdrop-blur-md border border-white/60 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-500 hover:bg-white/40'
            }`}
          >
            <Bell className={`w-4 h-4 ${currentRoute === '/notifications' ? 'text-rose-600' : ''}`} />
            <span>Activity</span>
            {unreadNotifsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            id="nav-safety"
            onClick={() => navigateTo('/safety')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
              currentRoute === '/safety'
                ? 'bg-white/70 text-emerald-600 backdrop-blur-md border border-white/60 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-600 hover:bg-white/40'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Safety</span>
          </button>

          {isAdmin && (
            <button
              id="nav-admin"
              onClick={() => navigateTo('/admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 border ${
                currentRoute === '/admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white/60 backdrop-blur-xs text-purple-700 border-purple-200/80 hover:bg-purple-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* Right Section: Backend Status + Quick Switcher + User Profile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Backend Connection Live Pill */}
          <button
            id="btn-backend-status"
            onClick={openBackendModal}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/50 hover:bg-white/80 text-emerald-800 border border-white/60 backdrop-blur-md shadow-xs transition-all cursor-pointer"
            title="Express API & Database Status (Click to inspect)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium">Backend</span>
            {backendPingMs ? (
              <span className="text-[10px] text-emerald-600 font-mono">({backendPingMs}ms)</span>
            ) : (
              <span className="text-[10px] text-emerald-600 font-mono">(Live)</span>
            )}
          </button>

          {/* Quick Profile Switcher Dropdown (Essential for testing multi-user mutual matching & admin) */}
          <div className="relative">
            <button
              id="btn-quick-switch"
              onClick={() => {
                setIsSwitcherOpen(!isSwitcherOpen);
                setIsMenuOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/50 backdrop-blur-md text-slate-700 hover:bg-white/80 flex items-center space-x-1.5 transition-all border border-white/60 shadow-xs"
              title="Switch demo account to test mutual matching, chat, or admin moderation"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline text-slate-500">Simulate:</span>
              <span className="font-semibold max-w-[80px] sm:max-w-[110px] truncate">{user?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isSwitcherOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white/85 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900">Switch Demo Persona</p>
                  <p className="text-[11px] text-slate-500">Test mutual matching, messaging, or admin moderation</p>
                </div>
                <div className="space-y-1">
                  {demoUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={async () => {
                        setIsSwitcherOpen(false);
                        await quickSwitchUser(u.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user?.id === u.id ? 'bg-rose-500/15 text-rose-900 font-semibold border border-rose-200/50' : 'hover:bg-white/60 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          {u.name}
                          {u.id === 'usr_admin' && (
                            <span className="px-1 py-0.2 bg-purple-100 text-purple-700 text-[9px] rounded font-bold">Admin</span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">{u.role}</p>
                      </div>
                      {user?.id === u.id && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              id="user-profile-menu-button"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsSwitcherOpen(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-full bg-white/40 hover:bg-white/80 border border-white/60 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <div className="relative">
                <img
                  src={user?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 shadow-xs"
                />
                {user?.is_verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white/85 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigateTo('/profile');
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-white/60 flex items-center space-x-2.5"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>My Dating Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigateTo('/settings');
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-white/60 flex items-center space-x-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Settings & Privacy</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigateTo('/safety');
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-white/60 flex items-center space-x-2.5"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Safety Center</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigateTo('/admin');
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center space-x-2.5"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      <span>Moderation Dashboard</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await logout();
                    }}
                    className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/70 flex items-center space-x-2.5"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
