import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Shield, AlertTriangle, Lock, Eye, PhoneCall, CheckCircle2, 
  UserX, ShieldAlert, HeartHandshake, Compass 
} from 'lucide-react';

export const SafetyCenter: React.FC = () => {
  const { navigateTo } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600/90 via-teal-700/90 to-cyan-800/90 backdrop-blur-xl border border-white/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-semibold backdrop-blur-md shadow-xs">
            <Shield className="w-4 h-4" />
            <span>Trust & Safety Council</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Safety Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Your safety, privacy, and peace of mind are our highest priorities. Review our community guidelines and practical tips for dating safely online and in person.
          </p>
        </div>

        <button
          onClick={() => navigateTo('/settings')}
          className="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-emerald-900 text-xs font-bold transition-all shadow-md backdrop-blur-md shrink-0"
        >
          Manage Blocked Accounts
        </button>
      </div>

      {/* Grid of Safety Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Safety Tips Card */}
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">Meeting in Person</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong>Meet in a public place:</strong> Never meet for the first time at your home, their home, or any isolated place.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong>Tell a trusted friend:</strong> Inform a friend or family member where you are going, who you are meeting, and what time to expect you back.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong>Control your own transport:</strong> Have your own way to and from your date so you can leave whenever you feel uncomfortable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong>Keep your drinks in sight:</strong> Never leave your drink or food unattended in public venues.</span>
            </li>
          </ul>
        </div>

        {/* Online Red Flags Card */}
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4">
          <div className="flex items-center space-x-2.5 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">Online Red Flags</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Asking for financial assistance:</strong> Never send money, wire transfers, cryptocurrency, or gift cards to anyone you meet online.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Refusing video calls or meeting up:</strong> If someone persistently avoids real-time video verification, they may not be who they claim.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Pushing to move off the app too quickly:</strong> Scammers often try to redirect you to unmoderated third-party messaging apps immediately.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Inconsistent life details or stolen photos:</strong> Look for the verified blue badge indicating confirmed identity.</span>
            </li>
          </ul>
        </div>

        {/* Consent & Boundaries */}
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4">
          <div className="flex items-center space-x-2.5 text-rose-600">
            <HeartHandshake className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">Consent & Respect</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Connectly enforces a strict zero-tolerance policy against non-consensual behavior, hate speech, harassment, and unsolicited explicit media. Mutual respect and authentic consent must guide every interaction.
          </p>
          <div className="p-3.5 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-200/60 text-xs text-rose-800 shadow-xs">
            You can unmatch or block any user at any moment without justification. Your safety always comes first.
          </div>
        </div>

        {/* Immediate Resources & Support */}
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4">
          <div className="flex items-center space-x-2.5 text-blue-600">
            <PhoneCall className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-base">Helplines & Resources</h3>
          </div>
          <p className="text-xs text-slate-600">
            If you ever feel unsafe or need confidential advice, support is available 24/7:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="font-medium text-slate-800">National Domestic Violence Hotline</span>
              <span className="font-bold text-slate-900">1-800-799-SAFE</span>
            </div>
            <div className="p-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="font-medium text-slate-800">RAINN National Sexual Assault Hotline</span>
              <span className="font-bold text-slate-900">1-800-656-4673</span>
            </div>
            <div className="p-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="font-medium text-slate-800">Crisis Text Line</span>
              <span className="font-bold text-slate-900">Text HOME to 741741</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
