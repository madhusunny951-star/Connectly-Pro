import React, { useState, useEffect } from 'react';
import { Match } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ChatWindow } from '../chat/ChatWindow.tsx';
import { MessageCircle, Heart, Search, CheckCircle2, Flame } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { selectedMatchId, navigateTo, openProfileModal } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(selectedMatchId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMatches();
      setMatches(data);
      // Auto-select first match on desktop if none selected
      if (!activeMatchId && data.length > 0 && window.innerWidth >= 768) {
        setActiveMatchId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatchId) {
      setActiveMatchId(selectedMatchId);
    }
  }, [selectedMatchId]);

  const activeMatch = matches.find(m => m.id === activeMatchId) || null;

  const filteredMatches = matches.filter(m => {
    if (!searchQuery.trim()) return true;
    const name = m.other_user?.name?.toLowerCase() || '';
    const bio = m.other_user?.profile?.bio?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || bio.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Matches list & Conversation Queue */}
        <div className={`md:col-span-5 lg:col-span-4 flex flex-col bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden ${
          activeMatchId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Header */}
          <div className="p-4 border-b border-white/40 bg-white/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-rose-600" />
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Matches & Chats</h1>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/60 text-rose-600 border border-white/80 shadow-xs">
                {matches.length}
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matches..."
                className="w-full text-xs py-2 pl-9 pr-3 rounded-2xl bg-white/50 focus:bg-white/80 border border-white/60 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
              />
            </div>
          </div>

          {/* New Mutual Matches Horizontal Scroll Avatar Bar */}
          {matches.length > 0 && (
            <div className="p-3 border-b border-white/40 bg-white/20 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                Mutual Connections
              </p>
              <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none">
                {matches.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMatchId(m.id)}
                    className="flex flex-col items-center shrink-0 group focus:outline-none"
                  >
                    <div className="relative">
                      <img
                        src={m.other_user?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={m.other_user?.name}
                        className={`w-13 h-13 rounded-full object-cover ring-2 transition-all shadow-xs ${
                          activeMatchId === m.id ? 'ring-rose-500 scale-105' : 'ring-white/80 group-hover:ring-rose-300'
                        }`}
                      />
                      {m.other_user?.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 mt-1 truncate max-w-[60px]">
                      {m.other_user?.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/30">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-white/60" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/60 rounded w-1/3" />
                      <div className="h-3 bg-white/50 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMatches.length === 0 ? (
              // Empty State (#26)
              <div className="p-8 text-center my-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md text-rose-500 flex items-center justify-center mx-auto border border-white/80 shadow-md">
                  <Heart className="w-7 h-7 fill-rose-500/20" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No matches yet ✨</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Keep discovering—you never know who you'll meet.
                </p>
                <button
                  onClick={() => navigateTo('/discover')}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-200 transition-all inline-flex items-center space-x-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Start Swiping</span>
                </button>
              </div>
            ) : (
              filteredMatches.map(m => {
                const isSelected = activeMatchId === m.id;
                const photoUrl = m.other_user?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                const timeStr = m.last_message ? new Date(m.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveMatchId(m.id)}
                    className={`w-full p-3.5 flex items-center space-x-3 transition-all text-left ${
                      isSelected ? 'bg-white/70 backdrop-blur-md border-l-4 border-rose-500 shadow-xs' : 'hover:bg-white/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={photoUrl}
                        alt={m.other_user?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/80 shadow-xs"
                      />
                      {m.other_user?.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          {m.other_user?.name}
                          {m.other_user?.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white shrink-0" />
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{timeStr}</span>
                      </div>

                      <p className="text-xs text-slate-600 truncate">
                        {m.last_message ? m.last_message.message : 'Say hello to your new match!'}
                      </p>
                    </div>

                    {m.unread_count && m.unread_count > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {m.unread_count}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Chat Window or Empty placeholder */}
        <div className={`md:col-span-7 lg:col-span-8 flex flex-col h-full ${
          activeMatchId ? 'flex' : 'hidden md:flex'
        }`}>
          {activeMatch ? (
            <ChatWindow
              match={activeMatch}
              onBack={() => setActiveMatchId(null)}
              onUnmatched={() => {
                setActiveMatchId(null);
                fetchMatches();
              }}
            />
          ) : (
            // No chat selected placeholder (#26)
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-md text-rose-500 flex items-center justify-center mb-3 border border-white/80 shadow-md">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your conversations will appear here</h3>
              <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed">
                Select any match from the left panel to begin chatting, or keep exploring profiles in Discover.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
