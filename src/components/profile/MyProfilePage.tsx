import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { 
  Camera, CheckCircle2, ShieldCheck, Trash2, Plus, Star, 
  Save, Eye, Sparkles, Heart, Check, ArrowUpRight 
} from 'lucide-react';

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

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    try {
      await api.addPhoto(newPhotoUrl.trim());
      const refreshed = await api.getProfile();
      updateUser(refreshed);
      setNewPhotoUrl('');
    } catch (e) {
      console.error(e);
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
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Profile Photos</h3>
            <p className="text-xs text-slate-500">
              Add up to 6 photos. The first image will be your main card cover photo.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {user?.photos?.length || 0} / 6
          </span>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {user?.photos?.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-3/4 rounded-2xl overflow-hidden border border-white/60 group bg-slate-900 shadow-xs"
            >
              <img src={photo.image_url} alt="Profile" className="w-full h-full object-cover" />
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Cover
                </span>
              )}
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xs"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add photo slot */}
          {(user?.photos?.length || 0) < 6 && (
            <div className="aspect-3/4 rounded-2xl border-2 border-dashed border-white/80 hover:border-rose-400 bg-white/20 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center transition-colors">
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-[10px] text-slate-500 font-medium">Add Photo</span>
            </div>
          )}
        </div>

        {/* Quick add image URL input */}
        <div className="flex items-center gap-2 pt-2">
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
            <span>Add</span>
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

    </div>
  );
};
