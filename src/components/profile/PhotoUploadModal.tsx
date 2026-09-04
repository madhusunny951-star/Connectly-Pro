import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, Image as ImageIcon, Link as LinkIcon, 
  Sparkles, Check, AlertCircle, Loader2, Plus, Camera 
} from 'lucide-react';
import { processImageFile } from '../../utils/imageCompressor.ts';
import { CURATED_PORTRAIT_PHOTOS, CuratedPhotoItem } from '../../data/curatedPhotos.ts';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (imageUrl: string) => Promise<void>;
  currentPhotosCount: number;
  maxPhotos?: number;
  existingPhotoUrls?: string[];
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
  currentPhotosCount,
  maxPhotos = 6,
  existingPhotoUrls = []
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'curated' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; sizeKb: number } | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlPreviewValid, setUrlPreviewValid] = useState<boolean | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isFull = currentPhotosCount >= maxPhotos;

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isFull) {
      setErrorMessage(`You have reached the maximum limit of ${maxPhotos} photos.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    try {
      setIsSubmitting(true);
      const dataUrl = await processImageFile(file);
      setPreviewDataUrl(dataUrl);
      setFileInfo({
        name: file.name,
        sizeKb: Math.round(dataUrl.length / 1024)
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileSelect(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!previewDataUrl) return;
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onAddPhoto(previewDataUrl);
      setSuccessMessage('Photo added successfully!');
      setTimeout(() => {
        setPreviewDataUrl(null);
        setFileInfo(null);
        setSuccessMessage(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save photo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCurated = async (item: CuratedPhotoItem) => {
    if (isFull) {
      setErrorMessage(`Maximum limit of ${maxPhotos} photos reached.`);
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onAddPhoto(item.url);
      setSuccessMessage(`Added "${item.title}" to profile photos!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add photo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddByUrl = async () => {
    if (!urlInput.trim()) return;
    if (isFull) {
      setErrorMessage(`Maximum limit of ${maxPhotos} photos reached.`);
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onAddPhoto(urlInput.trim());
      setSuccessMessage('Photo added successfully!');
      setTimeout(() => {
        setUrlInput('');
        setSuccessMessage(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add image link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCurated = selectedCategory === 'All' 
    ? CURATED_PORTRAIT_PHOTOS 
    : CURATED_PORTRAIT_PHOTOS.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Add Profile Pictures</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload personal photos or choose from curated lifestyle portraits ({currentPhotosCount}/{maxPhotos})
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-6 pt-3 pb-1 border-b border-white/40 gap-2">
          {[
            { id: 'upload', label: 'Upload From Device', icon: UploadCloud },
            { id: 'curated', label: 'Curated Portraits', icon: Sparkles },
            { id: 'url', label: 'Paste Image URL', icon: LinkIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setErrorMessage(null);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: File Upload (Click & Drag-and-Drop) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {!previewDataUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
                      : 'border-white/80 hover:border-rose-400 bg-white/40 hover:bg-white/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 mb-3 shadow-xs">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Click to browse or drag & drop photo here
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Supports high-resolution PNG, JPG, or WebP. Images are automatically optimized for fast dating profile loading.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl border border-white/80 shadow-xs"
                  >
                    Select From Computer / Phone
                  </button>
                </div>
              ) : (
                /* Selected File Preview */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white/80 shadow-xs">
                    <div className="w-32 h-40 rounded-xl overflow-hidden shadow-md bg-slate-900 shrink-0">
                      <img
                        src={previewDataUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Ready to upload</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {fileInfo?.name || 'Selected Image'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Processed size: ~{fileInfo?.sizeKb} KB (Optimized)
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewDataUrl(null);
                            setFileInfo(null);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-white/80 border border-white/80"
                        >
                          Choose Different
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={isSubmitting || isFull}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200/50 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Picture...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Picture to Profile</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Curated Portrait Gallery */}
          {activeTab === 'curated' && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Portraits', 'Outdoor', 'Cozy', 'Style', 'Active'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-white/50 text-slate-600 hover:bg-white/80 border border-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredCurated.map((photo) => {
                  const isAlreadyAdded = existingPhotoUrls.includes(photo.url);
                  return (
                    <div
                      key={photo.id}
                      className="group relative aspect-3/4 rounded-2xl overflow-hidden border border-white/80 bg-slate-900 shadow-xs cursor-pointer"
                      onClick={() => !isAlreadyAdded && !isSubmitting && handleSelectCurated(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-[11px] font-semibold truncate drop-shadow-xs">
                          {photo.title}
                        </span>
                        {isAlreadyAdded ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold">
                            Added
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold transition-opacity">
                            + Select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Web Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Public Image Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlPreviewValid(null);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 text-xs p-3 rounded-2xl border border-white/80 bg-white/60 focus:bg-white/90 focus:border-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddByUrl}
                    disabled={!urlInput.trim() || isSubmitting || isFull}
                    className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200/50 flex items-center space-x-1.5 disabled:opacity-40 transition-all"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Add</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Paste direct image URLs from Unsplash, Imgur, or cloud storage.
                </p>
              </div>

              {urlInput.trim() && (
                <div className="p-3 rounded-2xl bg-white/50 border border-white/80 flex items-center space-x-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={urlInput}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => setUrlPreviewValid(true)}
                      onError={() => setUrlPreviewValid(false)}
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Preview</p>
                    {urlPreviewValid === true && (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" /> Valid image link
                      </span>
                    )}
                    {urlPreviewValid === false && (
                      <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> Image cannot be loaded from this URL
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white/40 border-t border-white/40 flex items-center justify-between text-xs text-slate-500">
          <span>{currentPhotosCount} of {maxPhotos} photos used</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl hover:bg-white/80 text-slate-700 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
