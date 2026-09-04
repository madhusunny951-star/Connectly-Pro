import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { 
  Server, Activity, CheckCircle2, X, RefreshCw, Database, 
  ShieldCheck, Zap, AlertCircle, ArrowRight, UserCheck
} from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const { user, quickSwitchUser } = useAuth();

  const [healthData, setHealthData] = useState<{
    status: string;
    app: string;
    version?: string;
    database?: string;
    timestamp: string;
    latency: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  const pingBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.checkHealth();
      setHealthData(res);
      setLastTestedAt(new Date().toLocaleTimeString());
      setTestResultMsg(`Backend responded in ${res.latency}ms (Status: ${res.status})`);
    } catch (err: any) {
      setError(err.message || 'Could not reach backend');
      setTestResultMsg(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      pingBackend();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200 border border-white/70 relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200/50">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Backend & API Status</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">Express Node.js REST API with file-backed JSON database</p>
          </div>
        </div>

        {/* Status Highlight Banner */}
        <div className="p-4 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-md shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">
                  {healthData ? 'Server Online & Responding' : 'Connecting to Server...'}
                </span>
                {healthData && (
                  <span className="text-[11px] text-slate-500 ml-2">
                    Ping: <strong className="text-emerald-600 font-semibold">{healthData.latency} ms</strong>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={pingBackend}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Pinging...' : 'Ping Now'}</span>
            </button>
          </div>

          {testResultMsg && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 font-mono">
              ✓ {testResultMsg}
            </p>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Server Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Server className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Server Layer</span>
            </div>
            <p className="font-bold text-slate-900">Express REST API</p>
            <p className="text-[10px] text-slate-500 font-mono">Port 3000 /api/*</p>
          </div>

          <div className="p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Database className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Database</span>
            </div>
            <p className="font-bold text-slate-900">data_connectly_db.json</p>
            <p className="text-[10px] text-slate-500 font-mono">20+ Profiles & Seed Records</p>
          </div>

          <div className="p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Active Session</span>
            </div>
            <p className="font-bold text-slate-900 truncate">{user ? user.name : 'Unauthenticated'}</p>
            <p className="text-[10px] text-slate-500 font-mono truncate">ID: {user?.id || 'none'}</p>
          </div>

          <div className="p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Last Response</span>
            </div>
            <p className="font-bold text-slate-900">{lastTestedAt || 'Checking...'}</p>
            <p className="text-[10px] text-slate-500 font-mono">HTTP 200 OK</p>
          </div>
        </div>

        {/* Quick Persona Switcher for Backend Testing */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Quick Test Personas (Switch Active Backend Session):</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'usr_me', label: 'Taylor Morgan', sub: 'Demo User' },
              { id: 'usr_1', label: 'Sophia Chen', sub: 'Female 25' },
              { id: 'usr_admin', label: 'Admin Moderator', sub: 'Safety Role' }
            ].map(persona => (
              <button
                key={persona.id}
                onClick={async () => {
                  await quickSwitchUser(persona.id);
                  await pingBackend();
                }}
                className={`p-2 rounded-xl text-left border transition-all ${
                  user?.id === persona.id
                    ? 'bg-rose-500/15 border-rose-300 text-rose-900 font-bold'
                    : 'bg-white/60 hover:bg-white/90 border-white/80 text-slate-700'
                }`}
              >
                <p className="text-xs font-semibold truncate">{persona.label}</p>
                <p className="text-[10px] text-slate-500 truncate">{persona.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Netlify Readiness Info */}
        <div className="p-3 bg-sky-500/10 border border-sky-400/30 rounded-2xl text-xs space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-sky-900">
            <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
            <span>Netlify Deployment Ready</span>
          </div>
          <p className="text-[11px] text-sky-800 leading-relaxed">
            Configured with <code className="bg-white/60 px-1 py-0.5 rounded font-mono text-[10px]">netlify.toml</code>, <code className="bg-white/60 px-1 py-0.5 rounded font-mono text-[10px]">public/_redirects</code>, and serverless function adapter in <code className="bg-white/60 px-1 py-0.5 rounded font-mono text-[10px]">netlify/functions/api.ts</code>.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200/50 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
