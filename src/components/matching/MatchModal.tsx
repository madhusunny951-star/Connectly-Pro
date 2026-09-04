import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext.tsx';
import { Heart, MessageCircle, ArrowRight, X } from 'lucide-react';

export const MatchModal: React.FC = () => {
  const { user, matchedUserData, closeMatchModal, navigateTo } = useAuth();

  useEffect(() => {
    if (matchedUserData) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fecdd3']
        });
      } catch {
        // ignore
      }
    }
  }, [matchedUserData]);

  if (!matchedUserData) return null;

  const { match, otherUser } = matchedUserData;
  const userPhoto = user?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const matchPhoto = otherUser?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80';

  const handleSayHello = () => {
    closeMatchModal();
    navigateTo(`/messages/${match.id}`, match.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-300 border border-white/70"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          onClick={closeMatchModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/15 border border-rose-200/60 text-rose-600 mb-3 animate-bounce shadow-xs backdrop-blur-md">
          <Heart className="w-7 h-7 fill-rose-600" />
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          It's a Match! ❤️
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          You and <span className="font-semibold text-slate-900">{otherUser.name}</span> liked each other.
        </p>

        {/* Compatibility badge */}
        {otherUser.match_score && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 backdrop-blur-md border border-rose-200/80 text-rose-700 shadow-xs">
            <span>✨ {otherUser.match_score}% Estimated Compatibility</span>
          </div>
        )}

        {/* Dual Avatars with Overlap */}
        <div className="flex items-center justify-center my-6 relative">
          <div className="relative transform -translate-x-3 transition-transform hover:scale-105">
            <img
              src={userPhoto}
              alt={user?.name || 'You'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white/90 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-md border border-white/80 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs text-slate-800">
              You
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xl z-10 -mx-3 ring-4 ring-white/90">
            <Heart className="w-5 h-5 fill-white" />
          </div>

          <div className="relative transform translate-x-3 transition-transform hover:scale-105">
            <img
              src={matchPhoto}
              alt={otherUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white/90 shadow-xl"
            />
            <span className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-md border border-white/80 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs text-slate-800 truncate max-w-[80px]">
              {otherUser.name.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Bio snippet */}
        {otherUser.profile?.bio && (
          <p className="text-xs text-slate-600 italic line-clamp-2 px-4 mb-6">
            "{otherUser.profile.bio}"
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            id="btn-match-say-hello"
            onClick={handleSayHello}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-200/50 transition-all flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Say Hello</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="btn-match-keep-discovering"
            onClick={closeMatchModal}
            className="w-full py-3 px-4 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-700 font-medium text-sm transition-all backdrop-blur-md shadow-xs"
          >
            Keep Discovering
          </button>
        </div>
      </div>
    </div>
  );
};
