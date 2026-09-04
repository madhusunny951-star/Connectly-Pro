import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { 
  Camera, CheckCircle2, ShieldCheck, Trash2, Plus, Star, 
  Save, Eye, Sparkles, Heart, Check, ArrowUpRight, UploadCloud,
  ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import { PhotoUploadModal } from './PhotoUploadModal.tsx';
import { CURATED_PORTRAIT_PHOTOS } from '../../data/curatedPhotos.ts';
import { processImageFile } from '../../utils/imageCompressor.ts';

const ALL_INTERESTS = [
  'Music', 'Movies', 'Travel', 'Photography', 'Gaming', 'Fitness',
  'Cooking', 'Reading', 'Art', 'Sports', 'Technology', 'Fashion',
  'Dancing', 'Nature', 'Food', 'Pets', 'Coffee', 'Yoga', 'Hiking'
];

export const MyProfilePage: React.FC = () => {
  const { user, updateUser, openProfileModal } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [age, setAge] = useState<number>(user?.age || 26);
  const [pronouns, setPronouns] = useState<string>(user?.profile?.pronouns || '');
  const [location, setLocation] = useState<string>(user?.location || '');
  const [bio, setBio] = useState<string>(user?.profile?.bio || '');
  const [occupation, setOccupation] = useState<string>(user?.profile?.occupation || '');
  const [education, setEducation] = useState<string>(user?.profile?.education || '');
  const [height, setHeight] = useState<string>(user?.profile?.height || '');
  const [intention, setIntention] = useState<string>(user?.profile?.relationship_intention || 'Long-term relationship');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState<boolean>(false);
  const [photoActionLoading, setPhotoActionLoading] = useState<boolean>(false);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  // Calculate completeness
  let completedItems = 0;
  if (user?.photos && user.photos.length >= 2) completedItems += 25;
  else if (user?.photos && user.photos.length === 1) completedItems += 15;
  if (bio && bio.length > 30) completedItems += 25;
  if (interests && interests.length >= 3) completedItems += 20;
  if (occupation && education) completedItems += 15;
  if (user?.is_verified) completedItems += 15;
  const completionPercentage = Math.min(100, Math.max(30, completedItems));

  const handleInterestToggle = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        name,
        age,
        location,
        pronouns,
        bio,
        occupation,
        education,
        height,
        relationship_intention: intention,
        interests
      });
      updateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhotoDirectly = async (imageUrl: string) => {
    if (!imageUrl) return;
    setPhotoActionLoading(true);
    try {
      await api.addPhoto(imageUrl);
      const refreshed = await api.getProfile();
      updateUser(refreshed);
    } catch (e: any) {
      alert(e.message || 'Failed to add photo.');
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    try {
      await handleAddPhotoDirectly(newPhotoUrl.trim());
      setNewPhotoUrl('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleMakeCover = async (photoId: string) => {
    if (!user?.photos) return;
    const currentList = [...user.photos];
    const targetIdx = currentList.findIndex(p => p.id === photoId);
    if (targetIdx <= 0) return;
    setPhotoActionLoading(true);
    try {
      const target = currentList.splice(targetIdx, 1)[0];
      currentList.unshift(target);
      await api.reorderPhotos(currentList.map(p => p.id));
      const refreshed = await api.getProfile();
      updateUser(refreshed);
    } catch (e: any) {
      console.error('Failed to make cover photo:', e);
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const handleMovePhoto = async (photoId: string, direction: 'left' | 'right') => {
    if (!user?.photos) return;
    const ids = user.photos.map(p => p.id);
    const idx = ids.indexOf(photoId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ids.length) return;
    setPhotoActionLoading(true);
    try {
      const temp = ids[idx];
      ids[idx] = ids[targetIdx];
      ids[targetIdx] = temp;
      await api.reorderPhotos(ids);
      const refreshed = await api.getProfile();
      updateUser(refreshed);
    } catch (e) {
      console.error('Failed to move photo:', e);
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const handleDirectFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    if ((user?.photos?.length || 0) >= 6) {
      alert('Maximum of 6 photos reached. Please remove one first.');
      return;
    }
    setPhotoActionLoading(true);
    try {
      const dataUrl = await processImageFile(file);
      await handleAddPhotoDirectly(dataUrl);
    } catch (e: any) {
      alert(e.message || 'Failed to process image file.');
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if ((user?.photos?.length || 0) <= 1) {
      alert('You must maintain at least one active photo on your profile.');
      return;
    }
    try {
      await api.deletePhoto(photoId);
      const refreshed = await api.getProfile();
      updateUser(refreshed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestVerification = async () => {
    setVerifying(true);
    try {
      await api.requestVerification();
      const refreshed = await api.getProfile();
      updateUser(refreshed);
      setVerificationSuccess(true);
      setTimeout(() => setVerificationSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Header with Title & Preview Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Edit Profile</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your dating photos, personal information, and discovery highlights.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {user && (
            <button
              onClick={() => openProfileModal(user.id)}
              className="px-4 py-2 bg-white/50 hover:bg-white/80 text-slate-800 rounded-2xl text-xs font-semibold flex items-center space-x-1.5 transition-all border border-white/60 backdrop-blur-md shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Card</span>
            </button>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200/50 flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Profile Completeness Meter (#12) */}
      <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-xl border border-white/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Profile Completeness: {completionPercentage}%
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            {completionPercentage >= 90
              ? 'Excellent! Your profile is fully optimized for maximum mutual matches.'
              : 'Add at least 3 photos, select your passions, and verify your profile to rank higher.'}
          </p>
        </div>

        <div className="w-full sm:w-48">
          <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden border border-white/80 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-800 text-xs font-medium rounded-2xl flex items-center space-x-2 animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Section 1: Photo Manager (#4) */}
      <div 
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingPhoto(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDraggingPhoto(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingPhoto(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleDirectFileSelect(e.dataTransfer.files[0]);
          }
        }}
        className={`bg-white/45 backdrop-blur-xl rounded-3xl p-6 border transition-all shadow-lg space-y-4 ${
          isDraggingPhoto 
            ? 'border-rose-500 bg-rose-500/10 ring-4 ring-rose-200/50' 
            : 'border-white/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">Profile Photos</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 text-[11px] font-bold">
                {user?.photos?.length || 0} / 6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag & drop photos anywhere here, or upload from device. The star sets your primary cover.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={directFileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleDirectFileSelect(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-sm shadow-rose-200/50 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photos</span>
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {user?.photos?.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-3/4 rounded-2xl overflow-hidden border border-white/60 group bg-slate-900 shadow-xs"
            >
              <img src={photo.image_url} alt="Profile" className="w-full h-full object-cover" />
              
              {/* Cover Badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  <span>Cover</span>
                </span>
              )}

              {/* Photo Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex items-center justify-between">
                  {/* Make Cover Button if not cover */}
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => handleMakeCover(photo.id)}
                      className="p-1 rounded-lg bg-black/60 hover:bg-amber-500 text-white transition-colors"
                      title="Set as Main Cover Photo"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  ) : <div />}

                  {/* Delete Photo */}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Move Left / Right Controls */}
                <div className="flex items-center justify-center gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(photo.id, 'left')}
                      className="p-1 rounded-lg bg-black/60 hover:bg-white/30 text-white transition-colors"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < (user?.photos?.length || 0) - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(photo.id, 'right')}
                      className="p-1 rounded-lg bg-black/60 hover:bg-white/30 text-white transition-colors"
                      title="Move Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Interactive Add Photo Slot */}
          {(user?.photos?.length || 0) < 6 && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="aspect-3/4 rounded-2xl border-2 border-dashed border-white/80 hover:border-rose-400 bg-white/20 hover:bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-600 flex items-center justify-center mb-1.5 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-700 font-bold">Add Photo</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Upload or Pick</span>
            </button>
          )}
        </div>

        {/* Quick Sample Portraits Suggestions */}
        <div className="pt-2 border-t border-white/40">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>Tap to instantly add curated dating portraits:</span>
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="text-[11px] text-rose-600 font-semibold hover:underline"
            >
              Browse All
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CURATED_PORTRAIT_PHOTOS.slice(0, 6).map((preset) => {
              const isAdded = user?.photos?.some(p => p.image_url === preset.url);
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isAdded || (user?.photos?.length || 0) >= 6}
                  onClick={() => handleAddPhotoDirectly(preset.url)}
                  className={`w-14 h-18 rounded-2xl overflow-hidden border-2 relative shrink-0 transition-all ${
                    isAdded 
                      ? 'border-emerald-400 opacity-60 cursor-default' 
                      : 'border-white/80 hover:border-rose-500 hover:scale-105 shadow-xs'
                  }`}
                  title={preset.title}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  <span className={`absolute bottom-0 inset-x-0 text-[8px] text-center font-bold py-0.5 ${
                    isAdded ? 'bg-emerald-600 text-white' : 'bg-black/60 text-white'
                  }`}>
                    {isAdded ? 'Added' : '+ Add'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick add image URL input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="url"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="Paste public photo image URL..."
            className="flex-1 text-xs p-2.5 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
          />
          <button
            onClick={handleAddPhoto}
            disabled={!newPhotoUrl.trim()}
            className="px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-40 rounded-2xl text-xs font-semibold flex items-center space-x-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Section 2: Verification Badge System (#19) */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
            user?.is_verified ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' : 'bg-white/60 border-white/80 text-slate-500'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Profile Verification
              {user?.is_verified && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-200 shadow-xs">
                  Verified ✓
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {user?.is_verified
                ? 'Your identity is confirmed. Other members can see your verified blue badge.'
                : 'Confirm your authenticity with an instant camera selfie pose to earn your blue verification checkmark.'}
            </p>
          </div>
        </div>

        {!user?.is_verified && (
          <button
            onClick={handleRequestVerification}
            disabled={verifying}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-200/50 flex items-center space-x-1.5 transition-all shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{verifying ? 'Verifying Selfie...' : 'Verify Now'}</span>
          </button>
        )}

        {verificationSuccess && (
          <span className="text-xs font-bold text-blue-600">Verification Approved!</span>
        )}
      </div>

      {/* Section 3: Personal Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-6">
        <h3 className="text-base font-bold text-slate-900">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
            <input
              type="number"
              min="18"
              max="99"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Pronouns</label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="e.g. She/Her, He/Him, They/Them"
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State/Country"
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700">Bio / About Me</label>
            <span className="text-[11px] text-slate-400">{bio.length} / 500</span>
          </div>
          <textarea
            maxLength={500}
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none resize-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
            placeholder="Share what excites you, your favorite weekend rituals, and what you're looking for..."
          />
        </div>

        {/* Details (Work, School, Height, Intent) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Occupation / Job Title</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Education / School</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship Goal</label>
            <select
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/70 focus:bg-white/95 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 shadow-xs"
            >
              <option>Long-term relationship</option>
              <option>Marriage</option>
              <option>Short-term dating</option>
              <option>Casual dating</option>
              <option>Friendship</option>
              <option>Still figuring it out</option>
            </select>
          </div>
        </div>

        {/* Passions & Interests */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Interests & Passions ({interests.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map(item => {
              const isSelected = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleInterestToggle(item)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200/50'
                      : 'border border-white/60 bg-white/50 hover:bg-white/80 text-slate-700 backdrop-blur-md shadow-xs'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200/50 transition-all"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Photo Upload & Gallery Modal */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddPhoto={handleAddPhotoDirectly}
        currentPhotosCount={user?.photos?.length || 0}
        maxPhotos={6}
        existingPhotoUrls={user?.photos?.map(p => p.image_url) || []}
      />

    </div>
  );
};
