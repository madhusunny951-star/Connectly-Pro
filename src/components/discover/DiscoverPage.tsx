import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { HydratedProfile, FilterOptions } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { FilterModal } from './FilterModal.tsx';
import { 
  Heart, X, Star, SlidersHorizontal, MapPin, Briefcase, 
  GraduationCap, Info, Sparkles, CheckCircle2, RotateCcw, 
  Compass, ShieldCheck
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { triggerMatchModal, openProfileModal } = useAuth();
  
  const [profiles, setProfiles] = useState<HydratedProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [swipeAction, setSwipeAction] = useState<'like' | 'pass' | 'super_like' | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    min_age: 18,
    max_age: 50,
    max_distance: 50,
    genders: ['woman', 'man', 'non-binary'],
    intentions: [],
    interests: [],
    verified_only: false
  });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDiscoverProfiles(filters);
      setProfiles(data);
      setActivePhotoIdx(0);
    } catch (err) {
      console.error('Error fetching discovery profiles:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const currentProfile = profiles[0] || null;

  const handleAction = async (type: 'like' | 'pass' | 'super_like') => {
    if (!currentProfile) return;

    setSwipeAction(type);
    const targetUserId = currentProfile.id;

    // Remove from active queue immediately for snappy UI
    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setActivePhotoIdx(0);
      setSwipeAction(null);
    }, 280);

    try {
      if (type === 'pass') {
        await api.passUser(targetUserId);
      } else {
        const likeType = type === 'super_like' ? 'SUPER_LIKE' : 'LIKE';
        const res = await api.likeUser(targetUserId, likeType);
        if (res.isMatch && res.match && res.matchedUser) {
          triggerMatchModal(res.match, res.matchedUser);
        }
      }
    } catch (err) {
      console.error('Failed to register action:', err);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProfile) return;
      if (e.key === 'ArrowLeft') {
        handleAction('pass');
      } else if (e.key === 'ArrowRight') {
        handleAction('like');
      } else if (e.key === 'ArrowUp') {
        handleAction('super_like');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile]);

  // Motion drag values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleAction('like');
    } else if (info.offset.x < -100) {
      handleAction('pass');
    } else if (info.offset.y < -120) {
      handleAction('super_like');
    }
  };

  const photos = currentProfile?.photos || [];
  const currentPhoto = photos[activePhotoIdx]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 1) {
      setActivePhotoIdx(prev => (prev + 1) % photos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 1) {
      setActivePhotoIdx(prev => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-3 sm:py-6 flex flex-col min-h-[calc(100vh-5rem)] justify-between">
      
      {/* Top Discover Bar: Filter Trigger & Status */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-rose-600" />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Discover</h1>
          <span className="text-xs text-slate-500 font-medium">
            ({profiles.length} available)
          </span>
        </div>

        <button
          id="btn-open-filters"
          onClick={() => setIsFilterOpen(true)}
          className="px-3 py-1.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white/80 shadow-xs flex items-center space-x-1.5 text-xs font-semibold transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Preferences</span>
        </button>
      </div>

      {/* Main Card Stage */}
      <div className="relative flex-1 flex items-center justify-center my-auto min-h-[500px]">
        {loading ? (
          // Skeleton Loader with frosted glass look
          <div className="w-full max-w-sm sm:max-w-md h-[540px] rounded-[40px] bg-white/40 backdrop-blur-xl animate-pulse flex flex-col justify-end p-6 border-[6px] border-white/50 shadow-2xl">
            <div className="h-6 w-3/4 bg-white/60 rounded-full mb-2" />
            <div className="h-4 w-1/2 bg-white/50 rounded-full mb-4" />
            <div className="h-12 w-full bg-white/60 rounded-2xl" />
          </div>
        ) : currentProfile ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentProfile.id}
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              animate={
                swipeAction === 'like' 
                  ? { x: 400, opacity: 0, rotate: 20 }
                  : swipeAction === 'pass'
                  ? { x: -400, opacity: 0, rotate: -20 }
                  : swipeAction === 'super_like'
                  ? { y: -400, opacity: 0, scale: 0.8 }
                  : { x: 0, y: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm sm:max-w-md h-[540px] sm:h-[580px] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-white/50 cursor-grab active:cursor-grabbing select-none"
            >
              {/* Profile Photo */}
              <img
                src={currentPhoto}
                alt={currentProfile.name}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Photo indicator tabs */}
              {photos.length > 1 && (
                <div className="absolute top-4 inset-x-4 flex gap-1.5 z-20">
                  {photos.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i === activePhotoIdx ? 'bg-white shadow-xs' : 'bg-white/30 backdrop-blur-xs'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Left/Right click triggers to browse photos */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3 z-10" 
                onClick={handlePrevPhoto} 
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/3 z-10" 
                onClick={handleNextPhoto} 
              />

              {/* Swipe Stamped Indicators */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-10 left-6 border-4 border-emerald-400 text-emerald-400 rounded-2xl px-4 py-1.5 font-extrabold text-2xl uppercase tracking-wider transform -rotate-12 z-30 bg-black/40 backdrop-blur-md shadow-lg"
              >
                LIKE
              </motion.div>

              <motion.div
                style={{ opacity: passOpacity }}
                className="absolute top-10 right-6 border-4 border-rose-400 text-rose-400 rounded-2xl px-4 py-1.5 font-extrabold text-2xl uppercase tracking-wider transform rotate-12 z-30 bg-black/40 backdrop-blur-md shadow-lg"
              >
                PASS
              </motion.div>

              {/* Top Badges: Distance & Compatibility */}
              <div className="absolute top-8 inset-x-5 z-20 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full flex items-center space-x-1 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-rose-300" />
                  <span>{currentProfile.location} (~{currentProfile.distance_km ?? 8} km)</span>
                </div>

                {currentProfile.match_score && (
                  <div className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-rose-500/30 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>{currentProfile.match_score}% Match</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Content Gradient */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-white z-20 pointer-events-auto">
                
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {currentProfile.name}, {currentProfile.age}
                    </h2>
                    {currentProfile.is_verified && (
                      <span title="Verified identity">
                        <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white shadow-xs" />
                      </span>
                    )}
                  </div>

                  {/* Info button to open full profile modal */}
                  <button
                    id="btn-card-info"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProfileModal(currentProfile.id);
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all shadow-xs"
                    title="View Full Profile Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Pronouns, Occupation & Intent */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200 mb-2.5">
                  {currentProfile.profile?.pronouns && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-medium">
                      {currentProfile.profile.pronouns}
                    </span>
                  )}
                  {currentProfile.profile?.occupation && (
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-0.5 rounded-full text-white text-[11px] font-medium">
                      <Briefcase className="w-3 h-3 text-slate-300" />
                      <span className="truncate max-w-[130px]">{currentProfile.profile.occupation}</span>
                    </span>
                  )}
                  {currentProfile.profile?.relationship_intention && (
                    <span className="inline-flex items-center gap-1 bg-rose-500/40 text-rose-100 border border-rose-400/50 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[11px] font-semibold">
                      <Heart className="w-3 h-3 text-rose-200 fill-rose-300" />
                      <span>{currentProfile.profile.relationship_intention}</span>
                    </span>
                  )}
                </div>

                {/* Bio snippet */}
                {currentProfile.profile?.bio && (
                  <p className="text-xs text-slate-200 line-clamp-2 mb-3 leading-relaxed">
                    {currentProfile.profile.bio}
                  </p>
                )}

                {/* Interest Pills */}
                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.interests.slice(0, 4).map((int, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md border border-white/30 text-white"
                      >
                        {int}
                      </span>
                    ))}
                    {currentProfile.interests.length > 4 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 backdrop-blur-md text-slate-300">
                        +{currentProfile.interests.length - 4}
                      </span>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          // Empty State with frosted glass look
          <div className="w-full max-w-md bg-white/50 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/60 shadow-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-md text-rose-600 flex items-center justify-center border border-white/80 shadow-md">
              <Compass className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                No more profiles right now ✨
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed">
                You've reviewed all potential matches in your current radius. Try expanding your distance or age preferences to meet more people.
              </p>
            </div>
            <button
              onClick={() => {
                setFilters({
                  min_age: 18,
                  max_age: 60,
                  max_distance: 100,
                  genders: ['woman', 'man', 'non-binary'],
                  intentions: [],
                  interests: [],
                  verified_only: false
                });
                fetchProfiles();
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold shadow-md shadow-rose-200 flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Expand Preferences</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons: Pass, Super Like, Like */}
      {currentProfile && (
        <div className="flex items-center justify-center space-x-6 sm:space-x-8 pt-4 pb-2">
          
          {/* PASS BUTTON ❌ */}
          <button
            id="btn-discover-pass"
            onClick={() => handleAction('pass')}
            disabled={!currentProfile || loading}
            className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 shadow-xl border border-white/60 hover:scale-105 active:scale-95 hover:text-rose-500 hover:bg-white transition-all focus:outline-none"
            title="Pass (Left Arrow)"
          >
            <X className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* SUPER LIKE BUTTON ⭐ */}
          <button
            id="btn-discover-superlike"
            onClick={() => handleAction('super_like')}
            disabled={!currentProfile || loading}
            className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-blue-400 shadow-lg border border-white/60 hover:scale-105 active:scale-95 hover:text-blue-500 hover:bg-white transition-all focus:outline-none"
            title="Super Like (Up Arrow)"
          >
            <Star className="w-5 h-5 fill-blue-400 stroke-blue-500" />
          </button>

          {/* LIKE BUTTON ❤️ */}
          <button
            id="btn-discover-like"
            onClick={() => handleAction('like')}
            disabled={!currentProfile || loading}
            className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-200/60 hover:scale-105 active:scale-95 transition-all focus:outline-none"
            title="Like (Right Arrow)"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
          </button>

        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
        }}
      />

    </div>
  );
};
