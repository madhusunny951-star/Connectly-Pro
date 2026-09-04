import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Bell, Heart, MessageCircle, Star, ShieldCheck, 
  ShieldAlert, CheckCheck, Clock 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { navigateTo, refreshCounts } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      refreshCounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.is_read) {
      try {
        await api.markNotificationRead(item.id);
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
        refreshCounts();
      } catch {}
    }

    if (item.type === 'match' || item.type === 'message') {
      navigateTo('/matches');
    } else if (item.type === 'like' || item.type === 'super_like') {
      navigateTo('/likes');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'super_like':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'match':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'verification':
      case 'safety':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-rose-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time updates about likes, mutual matches, and messages.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/80 backdrop-blur-md shadow-xs flex items-center space-x-1.5 transition-all"
        >
          <CheckCheck className="w-4 h-4 text-rose-600" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden shadow-lg divide-y divide-white/40">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-white/50 backdrop-blur-xs" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/50 rounded w-1/2" />
                  <div className="h-3 bg-white/40 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/60 border border-white/80 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-md backdrop-blur-md">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">All caught up!</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              You will be notified here whenever someone likes, matches, or messages you.
            </p>
          </div>
        ) : (
          notifications.map(item => {
            const dateStr = new Date(item.created_at).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 flex items-start space-x-3.5 cursor-pointer transition-colors backdrop-blur-md ${
                  item.is_read ? 'hover:bg-white/40' : 'bg-white/50 hover:bg-white/70'
                }`}
              >
                <div className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md shadow-xs border border-white/80 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-xs shrink-0 self-center" />
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
