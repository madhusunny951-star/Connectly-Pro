import React, { useState, useEffect } from 'react';
import { HydratedProfile } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  X, Heart, Star, ShieldAlert, Ban, MapPin, GraduationCap, 
  Briefcase, Ruler, Sparkles, ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';

interface PublicProfileModalProps {
  userId: string | null;
  onClose: () => void;
  onLike?: (userId: string, type: 'LIKE' | 'SUPER_LIKE') => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  userId,
  onClose,
  onLike
}) => {
  const { openReportModal } = useAuth();
  const [profile, setProfile] = useState<HydratedProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [blockConfirm, setBlockConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setActivePhotoIdx(0);
    setBlockConfirm(false);

    api.getUserProfile(userId)
      .then(res => setProfile(res))
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  const photos = profile?.photos || [];
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

  const handleBlock = async () => {
    if (!profile) return;
    try {
      await api.blockUser(profile.id);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 border border-white/70"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Carousel */}
          <div className="relative h-80 sm:h-96 w-full bg-slate-950 group">
            {loading ? (
              <div className="w-full h-full bg-white/40 animate-pulse backdrop-blur-md" />
            ) : (
              <img
                src={currentPhoto}
                alt={profile?.name}
                className="w-full h-full object-cover select-none"
              />
            )}

            {/* Photo indicators */}
            {photos.length > 1 && (
              <div className="absolute top-3 left-3 right-16 flex gap-1 z-10">
                {photos.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === activePhotoIdx ? 'bg-white shadow-xs' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Carousel navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 backdrop-blur-md transition-colors border border-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 backdrop-blur-md transition-colors border border-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Name, Age, Distance overlay on image bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-5 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {profile?.name}, {profile?.age}
                </h2>
                {profile?.is_verified && (
                  <span className="text-blue-400 bg-white/20 rounded-full p-0.5 shadow-xs" title="Verified Profile">
                    <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {profile?.location} (~{profile?.distance_km ?? 8} km away)
                </span>
                {profile?.profile?.pronouns && (
                  <span>• {profile?.profile?.pronouns}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Compatibility badge with breakdown */}
          {profile?.match_score && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-200/80 backdrop-blur-md shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-bold text-slate-900">
                    {profile.match_score}% Approximate Compatibility
                  </span>
                </div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-rose-600 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-rose-200 shadow-xs">
                  Estimate
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Calculated based on shared interests, relationship goals, lifestyle preferences, and distance. (Not a guarantee of scientific compatibility).
              </p>
            </div>
          )}

          {/* About Bio */}
          {profile?.profile?.bio && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                About Me
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-normal bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xs">
                {profile.profile.bio}
              </p>
            </div>
          )}

          {/* Details (Work, Education, Height) */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Profile Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {profile?.profile?.occupation && (
                <div className="p-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl flex items-center space-x-2 text-slate-700 shadow-xs">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.profile.occupation}</span>
                </div>
              )}
              {profile?.profile?.education && (
                <div className="p-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl flex items-center space-x-2 text-slate-700 shadow-xs">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.profile.education}</span>
                </div>
              )}
              {profile?.profile?.height && (
                <div className="p-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl flex items-center space-x-2 text-slate-700 shadow-xs">
                  <Ruler className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.profile.height}</span>
                </div>
              )}
              {profile?.profile?.relationship_intention && (
                <div className="p-3 bg-white/70 backdrop-blur-md border border-rose-200/60 rounded-2xl flex items-center space-x-2 text-rose-800 font-medium shadow-xs">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{profile.profile.relationship_intention}</span>
                </div>
              )}
            </div>
          </div>

          {/* Passions & Interests */}
          {profile?.interests && profile.interests.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Passions & Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((int, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/60 backdrop-blur-md text-slate-700 border border-white/80 shadow-xs"
                  >
                    {int}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Information */}
          {profile?.profile?.lifestyle_data && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Lifestyle & Habits
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {profile.profile.lifestyle_data.exercise && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🏃 Exercise: {profile.profile.lifestyle_data.exercise}
                  </span>
                )}
                {profile.profile.lifestyle_data.drinking && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🍷 Drinking: {profile.profile.lifestyle_data.drinking}
                  </span>
                )}
                {profile.profile.lifestyle_data.smoking && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🚭 Smoking: {profile.profile.lifestyle_data.smoking}
                  </span>
                )}
                {profile.profile.lifestyle_data.diet && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🥗 Diet: {profile.profile.lifestyle_data.diet}
                  </span>
                )}
                {profile.profile.lifestyle_data.pets && profile.profile.lifestyle_data.pets.length > 0 && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🐾 Pets: {profile.profile.lifestyle_data.pets.join(', ')}
                  </span>
                )}
                {profile.profile.lifestyle_data.languages && (
                  <span className="px-3 py-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs">
                    🗣️ Languages: {profile.profile.lifestyle_data.languages.join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Safety & Moderation Options */}
          <div className="border-t border-white/40 pt-4 flex items-center justify-between">
            <button
              onClick={() => openReportModal(userId)}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center space-x-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Report Profile</span>
            </button>

            {blockConfirm ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-rose-600 font-medium">Confirm block?</span>
                <button
                  onClick={handleBlock}
                  className="px-3 py-1 rounded-xl text-xs bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-xs"
                >
                  Yes
                </button>
                <button
                  onClick={() => setBlockConfirm(false)}
                  className="px-3 py-1 rounded-xl text-xs bg-white/60 text-slate-700 border border-white/80"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBlockConfirm(true)}
                className="text-xs text-slate-500 hover:text-rose-700 flex items-center space-x-1.5 transition-colors"
              >
                <Ban className="w-4 h-4 text-rose-500" />
                <span>Block User</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Quick Action (Like / Super Like) */}
        {onLike && (
          <div className="px-6 py-4 border-t border-white/60 bg-white/50 backdrop-blur-xl flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                onLike(userId, 'SUPER_LIKE');
                onClose();
              }}
              className="py-2.5 px-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Super Like</span>
            </button>

            <button
              onClick={() => {
                onLike(userId, 'LIKE');
                onClose();
              }}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-200/50 transition-all flex items-center space-x-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Like Profile</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
