import React, { useState } from 'react';
import { FilterOptions } from '../../types.ts';
import { X, Check, RotateCcw, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

const ALL_INTERESTS = [
  'Music', 'Movies', 'Travel', 'Photography', 'Gaming', 'Fitness',
  'Cooking', 'Reading', 'Art', 'Sports', 'Technology', 'Fashion',
  'Dancing', 'Nature', 'Food', 'Pets', 'Coffee', 'Yoga', 'Hiking'
];

const GENDERS = [
  { label: 'Women', value: 'woman' },
  { label: 'Men', value: 'man' },
  { label: 'Non-Binary', value: 'non-binary' }
];

const INTENTIONS = [
  'Long-term relationship',
  'Marriage',
  'Short-term dating',
  'Casual dating',
  'Friendship',
  'Still figuring it out'
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApply
}) => {
  const [filters, setFilters] = useState<FilterOptions>({ ...currentFilters });

  if (!isOpen) return null;

  const handleGenderToggle = (val: string) => {
    setFilters(prev => {
      const exists = prev.genders.includes(val);
      const updated = exists ? prev.genders.filter(g => g !== val) : [...prev.genders, val];
      return { ...prev, genders: updated };
    });
  };

  const handleIntentionToggle = (val: string) => {
    setFilters(prev => {
      const exists = prev.intentions.includes(val);
      const updated = exists ? prev.intentions.filter(i => i !== val) : [...prev.intentions, val];
      return { ...prev, intentions: updated };
    });
  };

  const handleInterestToggle = (val: string) => {
    setFilters(prev => {
      const exists = prev.interests.includes(val);
      const updated = exists ? prev.interests.filter(i => i !== val) : [...prev.interests, val];
      return { ...prev, interests: updated };
    });
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      min_age: 18,
      max_age: 50,
      max_distance: 50,
      genders: ['woman', 'man', 'non-binary'],
      intentions: [],
      interests: [],
      verified_only: false
    };
    setFilters(defaultFilters);
  };

  const handleSave = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900">Discovery Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 flex-1 text-neutral-800">
          
          {/* Age Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Age Range
              </label>
              <span className="text-sm font-bold text-rose-600">
                {filters.min_age} - {filters.max_age} years
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-neutral-500">Min Age: {filters.min_age}</span>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.min_age}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFilters(prev => ({ ...prev, min_age: Math.min(val, prev.max_age) }));
                  }}
                  className="w-full accent-rose-600"
                />
              </div>
              <div>
                <span className="text-[11px] text-neutral-500">Max Age: {filters.max_age}</span>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.max_age}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFilters(prev => ({ ...prev, max_age: Math.max(val, prev.min_age) }));
                  }}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Maximum Distance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Maximum Distance
              </label>
              <span className="text-sm font-bold text-rose-600">
                Within {filters.max_distance} km
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={filters.max_distance}
              onChange={(e) => setFilters(prev => ({ ...prev, max_distance: parseInt(e.target.value) }))}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>5 km</span>
              <span>25 km</span>
              <span>50 km</span>
              <span>100+ km</span>
            </div>
          </div>

          {/* Interested in Gender */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-2.5">
              Interested in Meeting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map(g => {
                const isSelected = filters.genders.includes(g.value);
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => handleGenderToggle(g.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relationship Intentions */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-2.5">
              Relationship Intention
            </label>
            <div className="flex flex-wrap gap-2">
              {INTENTIONS.map(intent => {
                const isSelected = filters.intentions.includes(intent);
                return (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => handleIntentionToggle(intent)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    {intent}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification toggle */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-neutral-900">Verified Profiles Only</p>
                <p className="text-[11px] text-neutral-500">Only discover profiles with confirmed selfie verification</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="filter-verified-toggle"
              checked={filters.verified_only}
              onChange={(e) => setFilters(prev => ({ ...prev, verified_only: e.target.checked }))}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          {/* Shared Interests */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-2.5">
              Passions & Interests ({filters.interests.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-neutral-100 rounded-xl">
              {ALL_INTERESTS.map(interest => {
                const isSelected = filters.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`py-1 px-2.5 rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/40 bg-white/40 backdrop-blur-md flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 py-2 px-3 rounded-xl hover:bg-white/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET FILTERS</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-rose-200 transition-all flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>APPLY FILTERS</span>
          </button>
        </div>

      </div>
    </div>
  );
};
