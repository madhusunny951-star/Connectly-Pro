import React, { useState, useEffect } from 'react';
import { HydratedProfile } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Heart, Star, MapPin, CheckCircle2, Sparkles, UserX, Info } from 'lucide-react';

type IncomingLikeItem = HydratedProfile & { like_type: 'LIKE' | 'SUPER_LIKE'; liked_at: string };

export const LikesPage: React.FC = () => {
  const { triggerMatchModal, openProfileModal } = useAuth();
  const [likes, setLikes] = useState<IncomingLikeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const data = await api.getLikes();
      setLikes(data);
    } catch (err) {
      console.error('Failed to load likes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const handleLikeBack = async (targetUser: IncomingLikeItem) => {
    try {
      const res = await api.likeUser(targetUser.id, 'LIKE');
      setLikes(prev => prev.filter(l => l.id !== targetUser.id));
      if (res.isMatch && res.match) {
        triggerMatchModal(res.match, targetUser);
      }
    } catch (err) {
      console.error('Error liking back:', err);
    }
  };

  const handlePass = async (targetUser: IncomingLikeItem) => {
    try {
      await api.passUser(targetUser.id);
      setLikes(prev => prev.filter(l => l.id !== targetUser.id));
    } catch (err) {
      console.error('Error passing:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Interested in You
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/60 text-rose-600 border border-white/80 shadow-xs">
            {likes.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          People who have liked or super liked your profile. Like them back to match instantly!
        </p>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-80 bg-white/40 backdrop-blur-md rounded-3xl animate-pulse border border-white/60" />
          ))}
        </div>
      ) : likes.length === 0 ? (
        // Empty State (#26)
        <div className="max-w-md mx-auto my-12 p-8 bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-md text-rose-500 flex items-center justify-center mx-auto mb-4 border border-white/80 shadow-md">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No new likes yet ✨</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Keep discovering and updating your profile with fresh photos to attract new connections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {likes.map(profile => {
            const photoUrl = profile.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            const isSuperLike = profile.like_type === 'SUPER_LIKE';

            return (
              <div
                key={profile.id}
                className="group relative bg-white/45 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/60 flex flex-col"
              >
                {/* Photo container */}
                <div className="relative h-72 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => openProfileModal(profile.id)}>
                  <img
                    src={photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Super like or like badge */}
                  <div className="absolute top-3 left-3">
                    {isSuperLike ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Super Liked You</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/30 text-white backdrop-blur-md border border-white/40 shadow-xs">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Liked You</span>
                      </span>
                    )}
                  </div>

                  {/* Compatibility score pill */}
                  {profile.match_score && (
                    <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md border border-white/40 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>{profile.match_score}%</span>
                    </div>
                  )}

                  {/* Info button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProfileModal(profile.id);
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-md transition-colors border border-white/40"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {/* Basic info on photo */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 text-white">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-lg">{profile.name}, {profile.age}</h3>
                      {profile.is_verified && (
                        <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white shadow-xs" />
                      )}
                    </div>
                    <p className="text-xs text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{profile.location} (~{profile.distance_km ?? 8} km)</span>
                    </p>
                  </div>
                </div>

                {/* Details snippet & action buttons */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white/25 backdrop-blur-xs">
                  <div>
                    {profile.profile?.relationship_intention && (
                      <span className="inline-block text-[11px] font-medium text-rose-700 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80 shadow-xs mb-2">
                        {profile.profile.relationship_intention}
                      </span>
                    )}
                    {profile.profile?.bio && (
                      <p className="text-xs text-slate-700 line-clamp-2 italic">
                        "{profile.profile.bio}"
                      </p>
                    )}
                  </div>

                  {/* Action buttons: Pass or Match */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/40">
                    <button
                      onClick={() => handlePass(profile)}
                      className="py-2.5 px-3 rounded-2xl border border-white/60 bg-white/40 hover:bg-white/70 text-slate-700 text-xs font-semibold backdrop-blur-md transition-colors flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                    <button
                      onClick={() => handleLikeBack(profile)}
                      className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-200/50 flex items-center justify-center space-x-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Match</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
