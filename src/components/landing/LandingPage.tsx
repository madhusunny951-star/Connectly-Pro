import React, { useState } from 'react';
import { 
  Heart, Shield, Sparkles, CheckCircle2, MessageCircle, 
  Lock, Flame, Users, ArrowRight, ChevronDown, ChevronUp, Server 
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { openBackendModal, backendPingMs } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const faqs = [
    {
      q: 'Can anyone message me without my consent?',
      a: 'Never. Connectly strictly enforces mutual consent: you will only ever receive messages from people you have mutually liked and matched with. Unsolicited messages are impossible by architectural design.'
    },
    {
      q: 'How does the blue profile verification work?',
      a: 'We use real-time selfie posture matching to verify that every verified member is truly the person shown in their profile photos. Verified accounts display a confirmed blue checkmark.'
    },
    {
      q: 'Is my exact address or location ever shared?',
      a: 'No. Connectly never exposes precise GPS coordinates. Profiles only display approximate distance (e.g. "~8 km away") or broad city locations to safeguard your privacy.'
    },
    {
      q: 'How is the compatibility score calculated?',
      a: 'Our compatibility engine compares relationship goals, overlapping passions & interests, lifestyle habits, and age preferences to provide an honest estimate of alignment.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/45 backdrop-blur-xl border-b border-white/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Connectly</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={openBackendModal}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/60 hover:bg-white/80 text-emerald-800 border border-white/80 backdrop-blur-md shadow-xs transition-all cursor-pointer"
              title="Inspect Express API & Database Status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Backend Connected {backendPingMs ? `(${backendPingMs}ms)` : ''}</span>
            </button>

            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200/50 transition-all"
            >
              Join Connectly
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-white/80 text-rose-700 text-xs font-semibold backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Authentic, safe & verified matchmaking</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Meet someone who <br />
                <span className="text-rose-600">truly gets you.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connectly is modern dating built around mutual consent, verified profiles, and deep lifestyle compatibility. No spam, no unsolicited messages, and zero fake accounts.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => openAuth('register')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-200/50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Create Free Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/70 hover:bg-white/90 border border-white/80 text-slate-800 font-semibold text-sm backdrop-blur-md shadow-xs transition-all flex items-center justify-center space-x-2"
                  title="Connect to the live demo backend as Taylor Morgan"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>Explore Demo (Live Backend)</span>
                </button>
              </div>

              {/* Badges row */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Verified Selfies
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-500" /> Mutual Consent Chat
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-500" /> Safety Moderation
                </span>
              </div>
            </div>

            {/* Visual Hero Mockup Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 sm:w-80 h-[430px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Sophia"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>94% Match</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Sophia, 25</h3>
                    <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white" />
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">Architect • San Francisco, CA</p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Art</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Coffee</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Design</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 border-y border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Dating designed with purpose
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Three simple steps to finding genuine, lasting connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs backdrop-blur-md">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Authentic Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Showcase your genuine self with verified photos, personal passions, relationship intentions, and lifestyle habits.
              </p>
            </div>

            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs backdrop-blur-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Meaningful Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Swipe smoothly through thoughtfully curated profiles. Discover approximate compatibility scores based on shared values.
              </p>
            </div>

            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs backdrop-blur-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Safe, Mutual Conversations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Celebrate mutual matches with confetti and enjoy private, real-time messaging with full unmatch, block, and reporting safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Pledge (#18, #31) */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/55 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-emerald-200/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Our Trust & Safety Pledge</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your boundaries and privacy are non-negotiable.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe modern online dating should feel empowering and safe. With approximate distance masking, selfie verification, and proactive report moderation, you stay in total control of your dating journey.
              </p>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-200/50 transition-all shrink-0"
            >
              Join Our Verified Community
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-12">
            Real Stories, Real Connections ❤️
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "Finding someone who also valued long-term goals and mutual respect felt impossible on other apps. With Connectly, Sophia and I clicked on day one."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus & Chloe"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Marcus & Chloe</h4>
                  <p className="text-[11px] text-slate-500">Together 14 months • San Francisco</p>
                </div>
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "The fact that nobody can message you without both of you liking each other completely changed the experience for me. I felt respected and secure."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                  alt="Elena & David"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Elena & David</h4>
                  <p className="text-[11px] text-slate-500">Engaged • Seattle</p>
                </div>
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg space-y-3">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "The compatibility breakdown was actually super accurate. We had so many overlapping hobbies that our first date conversation flowed for 4 hours."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Julian & Maya"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Julian & Maya</h4>
                  <p className="text-[11px] text-slate-500">Together 8 months • Austin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/45 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-white/40 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed bg-white/20">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl text-slate-400 py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Connectly</span>
            <span className="text-xs text-slate-400">© 2026 Connectly Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <button onClick={onGetStarted} className="hover:text-white transition-colors">Safety Guidelines</button>
            <button onClick={onGetStarted} className="hover:text-white transition-colors">Community Standards</button>
            <button onClick={onGetStarted} className="hover:text-white transition-colors">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
};
