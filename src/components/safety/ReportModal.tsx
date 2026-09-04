import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';

const REASONS = [
  'Harassment',
  'Spam',
  'Fake profile',
  'Scammer',
  'Inappropriate content',
  'Hate speech',
  'Threats',
  'Other'
];

export const ReportModal: React.FC = () => {
  const { reportingUserId, closeReportModal } = useAuth();
  const [selectedReason, setSelectedReason] = useState<string>('Harassment');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!reportingUserId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.reportUser(reportingUserId, selectedReason, description);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeReportModal();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-white/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/40 mb-4">
          <div className="flex items-center space-x-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">Report Account</h3>
          </div>
          <button
            onClick={closeReportModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs backdrop-blur-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Report Submitted</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for keeping Connectly safe. Our moderation safety team will review this case promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              Please select the primary reason why you are reporting this user. Reports are confidential and reviewed by our trust & safety team.
            </p>

            {error && (
              <div className="p-3 bg-white/70 backdrop-blur-md border border-rose-200 text-rose-700 rounded-2xl text-xs shadow-xs">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REASONS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedReason(r)}
                    className={`py-2 px-3 text-left rounded-2xl text-xs border transition-all shadow-xs backdrop-blur-md ${
                      selectedReason === r
                        ? 'border-rose-500 bg-rose-500/15 text-rose-800 font-bold'
                        : 'border-white/80 bg-white/60 hover:bg-white/80 text-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what occurred or paste relevant messages..."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md text-slate-800 focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none resize-none shadow-xs transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/40">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 backdrop-blur-md shadow-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 rounded-xl shadow-md shadow-rose-200/50 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
