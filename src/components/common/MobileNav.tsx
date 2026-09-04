import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Flame, Heart, MessageCircle, Bell, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRoute, navigateTo, unreadNotifsCount, unreadMessagesCount, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/50 backdrop-blur-xl border-t border-white/40 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        
        <button
          id="mobile-nav-discover"
          onClick={() => navigateTo('/discover')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentRoute === '/discover' ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentRoute === '/discover' ? 'fill-rose-600' : ''}`} />
          <span className="text-[10px] mt-0.5">Discover</span>
        </button>

        <button
          id="mobile-nav-likes"
          onClick={() => navigateTo('/likes')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentRoute === '/likes' ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${currentRoute === '/likes' ? 'fill-rose-600' : ''}`} />
          <span className="text-[10px] mt-0.5">Likes</span>
        </button>

        <button
          id="mobile-nav-matches"
          onClick={() => navigateTo('/matches')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            currentRoute.startsWith('/matches') || currentRoute.startsWith('/messages')
              ? 'text-rose-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Matches</span>
        </button>

        <button
          id="mobile-nav-notifications"
          onClick={() => navigateTo('/notifications')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            currentRoute === '/notifications' ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotifsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Activity</span>
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => navigateTo('/profile')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentRoute === '/profile' ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>

      </div>
    </div>
  );
};
