import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Heart, X, Check, AlertCircle, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose
}) => {
  const { login, register, quickSwitchUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('woman');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (age < 18) {
        setError('You must be at least 18 years of age to register.');
        return;
      }
      if (!agreedTerms) {
        setError('You must accept the Community Safety Guidelines and Terms.');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          age,
          gender
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async (demoId: string) => {
    setSubmitting(true);
    try {
      await quickSwitchUser(demoId);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 border border-white/70 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-200/60">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Join Connectly'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {mode === 'login' 
              ? 'Enter your account credentials to access your matches.' 
              : 'Create an authentic profile and discover meaningful matches.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-white/70 backdrop-blur-md border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age (18+)</label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all capitalize"
                  >
                    <option value="woman">Woman</option>
                    <option value="man">Man</option>
                    <option value="non-binary">Non-Binary</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md focus:bg-white/90 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none shadow-xs transition-all"
            />
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 accent-rose-600 rounded"
              />
              <span>I confirm I am at least 18 years old and agree to the Terms, Privacy Policy, and Community Safety Guidelines.</span>
            </label>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200/50 transition-all"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-xs text-rose-600 hover:underline font-medium"
          >
            {mode === 'login'
              ? "Don't have an account yet? Create one"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Demo 1-Click Login Quick Test Helpers */}
        <div className="mt-6 pt-4 border-t border-white/40 text-center">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Or Sign In With 1-Click Demo Persona
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => handleDemoSignIn('usr_me')}
              className="px-2.5 py-1 text-[11px] rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-700 font-medium backdrop-blur-md shadow-xs transition-all"
            >
              Taylor (They/Them)
            </button>
            <button
              onClick={() => handleDemoSignIn('usr_1')}
              className="px-2.5 py-1 text-[11px] rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-700 font-medium backdrop-blur-md shadow-xs transition-all"
            >
              Sophia (Woman)
            </button>
            <button
              onClick={() => handleDemoSignIn('usr_2')}
              className="px-2.5 py-1 text-[11px] rounded-xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-700 font-medium backdrop-blur-md shadow-xs transition-all"
            >
              Marcus (Man)
            </button>
            <button
              onClick={() => handleDemoSignIn('usr_admin')}
              className="px-2.5 py-1 text-[11px] rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-200 text-purple-800 font-bold backdrop-blur-md shadow-xs transition-all"
            >
              Admin Moderator
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
