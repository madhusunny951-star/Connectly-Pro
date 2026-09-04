import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { 
  Check, ArrowRight, ArrowLeft, Camera, Sparkles, Heart, 
  MapPin, Briefcase, GraduationCap, Plus, Trash2, ShieldCheck,
  UploadCloud, Star, Link as LinkIcon, Loader2 
} from 'lucide-react';
import { processImageFile } from '../../utils/imageCompressor.ts';
import { CURATED_PORTRAIT_PHOTOS } from '../../data/curatedPhotos.ts';

const ALL_INTERESTS = [
  'Music', 'Movies', 'Travel', 'Photography', 'Gaming', 'Fitness',
  'Cooking', 'Reading', 'Art', 'Sports', 'Technology', 'Fashion',
  'Dancing', 'Nature', 'Food', 'Pets', 'Coffee', 'Yoga', 'Hiking'
];

const PRESET_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
];

export const OnboardingFlow: React.FC = () => {
  const { user, updateUser, navigateTo } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>(user?.name || '');
  const [gender, setGender] = useState<string>(user?.gender || 'woman');
  const [pronouns, setPronouns] = useState<string>(user?.profile?.pronouns || '');
  const [location, setLocation] = useState<string>(user?.location || 'San Francisco, CA');
  const [age, setAge] = useState<number>(user?.age || 25);

  const [photos, setPhotos] = useState<string[]>(
    user?.photos?.map(p => p.image_url) || [PRESET_SAMPLE_PHOTOS[0]]
  );

  const [bio, setBio] = useState<string>(user?.profile?.bio || '');
  const [occupation, setOccupation] = useState<string>(user?.profile?.occupation || '');
  const [education, setEducation] = useState<string>(user?.profile?.education || '');
  const [height, setHeight] = useState<string>(user?.profile?.height || "5'8\"");

  const [interests, setInterests] = useState<string[]>(user?.interests || ['Coffee', 'Travel', 'Photography']);

  const [exercise, setExercise] = useState<string>(user?.profile?.lifestyle_data?.exercise || 'Active');
  const [drinking, setDrinking] = useState<string>(user?.profile?.lifestyle_data?.drinking || 'Socially');
  const [smoking, setSmoking] = useState<string>(user?.profile?.lifestyle_data?.smoking || 'Never');
  const [diet, setDiet] = useState<string>(user?.profile?.lifestyle_data?.diet || 'Omnivore');

  const [intention, setIntention] = useState<string>(
    user?.profile?.relationship_intention || 'Long-term relationship'
  );
  const [interestedGender, setInterestedGender] = useState<string[]>(
    user?.preferences?.gender || ['man', 'woman']
  );
  const [minAge, setMinAge] = useState<number>(user?.preferences?.age_min || 22);
  const [maxAge, setMaxAge] = useState<number>(user?.preferences?.age_max || 35);
  const [maxDistance, setMaxDistance] = useState<number>(user?.preferences?.distance_km || 30);

  const [isDraggingPhoto, setIsDraggingPhoto] = useState<boolean>(false);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [photoProcessing, setPhotoProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInterestToggle = (item: string) => {
    setInterests(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddPhotoUrl = (url: string) => {
    if (!photos.includes(url) && photos.length < 6) {
      setPhotos(prev => [...prev, url]);
    }
  };

  const handleSetMainPhoto = (idx: number) => {
    if (idx <= 0 || idx >= photos.length) return;
    const target = photos[idx];
    const rest = photos.filter((_, i) => i !== idx);
    setPhotos([target, ...rest]);
  };

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPEG, PNG, WebP).');
      return;
    }
    if (photos.length >= 6) {
      alert('You have reached the limit of 6 photos.');
      return;
    }
    setPhotoProcessing(true);
    try {
      const dataUrl = await processImageFile(file);
      handleAddPhotoUrl(dataUrl);
    } catch (e: any) {
      alert(e.message || 'Failed to process selected picture.');
    } finally {
      setPhotoProcessing(false);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    if (photos.length > 1) {
      setPhotos(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // 1. Update basic profile info
      const updated = await api.updateProfile({
        name,
        age,
        gender,
        location,
        pronouns,
        bio,
        occupation,
        education,
        height,
        relationship_intention: intention,
        interests,
        lifestyle_data: {
          exercise,
          drinking,
          smoking,
          diet,
          pets: ['Dog lover'],
          languages: ['English', 'Spanish']
        },
        preferences: {
          gender: interestedGender,
          age_min: minAge,
          age_max: maxAge,
          distance_km: maxDistance,
          relationship_intention: intention
        }
      });

      // 2. Persist chosen photos
      if (photos && photos.length > 0) {
        const existingUrls = updated?.photos?.map(p => p.image_url) || [];
        for (const photoUrl of photos) {
          if (!existingUrls.includes(photoUrl)) {
            try {
              await api.addPhoto(photoUrl);
            } catch (e) {
              console.warn('Could not add photo during onboarding sync:', e);
            }
          }
        }
      }

      const refreshed = await api.getProfile();
      updateUser(refreshed);
      navigateTo('/discover');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round((step / 6) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>STEP {step} OF 6</span>
          <span className="text-rose-600 font-bold">{progressPercent}% COMPLETED</span>
        </div>
        <div className="w-full h-2.5 bg-white/60 border border-white/80 rounded-full overflow-hidden backdrop-blur-md shadow-xs">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Wizard Card Container */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 p-6 sm:p-8 shadow-lg">
        
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Basic Information</h2>
              <p className="text-xs text-slate-600 mt-1">
                Tell us about yourself. You must be at least 18 years old to join Connectly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  placeholder="Your first and last name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pronouns</label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="e.g. She/Her, He/Him, They/Them"
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['woman', 'man', 'non-binary'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-2xl text-xs font-medium capitalize border transition-all ${
                        gender === g 
                          ? 'bg-rose-500/15 border-rose-400 text-rose-700 font-bold shadow-xs' 
                          : 'bg-white/60 border-white/80 text-slate-700 hover:bg-white/80'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City / Approximate Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Photos */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Photos</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Upload at least 1 clear photo. Profiles with 3+ photos receive 4x more mutual matches. ({photos.length}/6)
                </p>
              </div>

              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 text-white rounded-2xl text-xs font-bold shadow-xs flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Picture</span>
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUploadFile(e.target.files[0]);
                }
              }}
            />

            {/* Drag & Drop Upload Zone if photos < 6 */}
            {photos.length < 6 && (
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
                    handleUploadFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
                  isDraggingPhoto
                    ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
                    : 'border-white/80 hover:border-rose-400 bg-white/30 hover:bg-white/50'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                  {photoProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {photoProcessing ? 'Optimizing photo...' : 'Click to upload or drag & drop photo here'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  High-res JPG, PNG, or WebP from your device
                </p>
              </div>
            )}

            {/* Current Selected Photos Grid */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Your Selected Photos:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-3/4 rounded-2xl overflow-hidden border border-white/80 group bg-slate-900 shadow-xs">
                    <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    
                    {i === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Main</span>
                      </span>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                      {i !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainPhoto(i)}
                          className="p-1 rounded-lg bg-black/60 hover:bg-amber-500 text-white transition-colors"
                          title="Set as Main Photo"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      ) : <div />}

                      {photos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {photos.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-3/4 rounded-2xl border-2 border-dashed border-white/80 hover:border-rose-400 bg-white/20 hover:bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer group"
                  >
                    <Plus className="w-5 h-5 text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-slate-700 font-bold">Add Pic</span>
                  </button>
                )}
              </div>
            </div>

            {/* Curated Sample Portraits Library */}
            <div className="pt-2 border-t border-white/40">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Choose from curated portraits:</span>
                </p>
                <span className="text-[10px] text-slate-500">Tap to add</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CURATED_PORTRAIT_PHOTOS.slice(0, 8).map((preset) => {
                  const isAdded = photos.includes(preset.url);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={isAdded || photos.length >= 6}
                      onClick={() => handleAddPhotoUrl(preset.url)}
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

            {/* Quick URL Input */}
            <div className="pt-1">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="Or paste an image URL..."
                  className="flex-1 text-xs p-2.5 rounded-2xl border border-white/80 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
                />
                <button
                  type="button"
                  disabled={!photoUrlInput.trim() || photos.length >= 6}
                  onClick={() => {
                    if (photoUrlInput.trim()) {
                      handleAddPhotoUrl(photoUrlInput.trim());
                      setPhotoUrlInput('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-2xl text-xs font-semibold disabled:opacity-40 transition-all shadow-xs"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: About Me */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">About You</h2>
              <p className="text-xs text-slate-600 mt-1">
                Share a few words about what makes you smile and what you are passionate about.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Bio</label>
                  <span className="text-[11px] text-slate-500">{bio.length}/500</span>
                </div>
                <textarea
                  maxLength={500}
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a fun fact, what a typical Sunday looks like, or your favorite local spot..."
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none resize-none shadow-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. UX Designer"
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Education</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 5'9&quot; (175 cm)"
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Interests */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Passions</h2>
              <p className="text-xs text-slate-600 mt-1">
                Select at least 3 interests to help our compatibility engine recommend like-minded people.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {ALL_INTERESTS.map(item => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleInterestToggle(item)}
                    className={`py-2 px-3.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-400 text-rose-700 font-semibold shadow-xs'
                        : 'bg-white/60 border-white/80 hover:bg-white/80 text-slate-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Lifestyle */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lifestyle & Habits</h2>
              <p className="text-xs text-slate-600 mt-1">
                Honest answers help create more authentic and harmonious connections.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Exercise</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 outline-none shadow-xs transition-all"
                >
                  <option>Active (Daily)</option>
                  <option>Often (3-4x/week)</option>
                  <option>Sometimes</option>
                  <option>Never</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Drinking</label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 outline-none shadow-xs transition-all"
                >
                  <option>Socially</option>
                  <option>Frequently</option>
                  <option>Rarely</option>
                  <option>Never / Sober</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Smoking</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 outline-none shadow-xs transition-all"
                >
                  <option>Never</option>
                  <option>Socially</option>
                  <option>Regularly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 outline-none shadow-xs transition-all"
                >
                  <option>Omnivore</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Pescatarian</option>
                  <option>Keto</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Preferences */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dating Intentions</h2>
              <p className="text-xs text-slate-600 mt-1">
                Tell us who you're looking to meet and what type of relationship you desire.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship Goal</label>
                <select
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md font-medium focus:bg-white/90 focus:border-rose-400 outline-none shadow-xs transition-all"
                >
                  <option>Long-term relationship</option>
                  <option>Marriage</option>
                  <option>Short-term dating</option>
                  <option>Casual dating</option>
                  <option>Friendship</option>
                  <option>Still figuring it out</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Interested in Meeting</label>
                <div className="grid grid-cols-3 gap-2">
                  {['woman', 'man', 'non-binary'].map(g => {
                    const isSelected = interestedGender.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setInterestedGender(prev => 
                            prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
                          );
                        }}
                        className={`py-2 px-3 rounded-2xl text-xs font-medium capitalize border transition-all ${
                          isSelected 
                            ? 'bg-rose-500/15 border-rose-400 text-rose-700 font-bold shadow-xs' 
                            : 'bg-white/60 border-white/80 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Age Range</span>
                  <span className="text-rose-600 font-bold">{minAge} - {maxAge} years</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={minAge}
                    onChange={(e) => setMinAge(parseInt(e.target.value))}
                    className="accent-rose-600"
                  />
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={maxAge}
                    onChange={(e) => setMaxAge(parseInt(e.target.value))}
                    className="accent-rose-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Maximum Distance</span>
                  <span className="text-rose-600 font-bold">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-white/40 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white/80 border border-white/80 backdrop-blur-md shadow-xs flex items-center space-x-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-200/50 flex items-center space-x-1.5 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinishOnboarding}
              className="py-2.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-200/50 flex items-center space-x-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Activating Profile...' : 'Complete & Start Swiping'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
