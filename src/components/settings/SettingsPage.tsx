import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { HydratedProfile } from '../../types.ts';
import { 
  Settings, Lock, Eye, Bell, Shield, LogOut, Trash2, 
  UserCheck, ShieldOff, Check, AlertCircle, Server, RefreshCw, Database, Activity 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout, navigateTo, quickSwitchUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'privacy' | 'account' | 'notifications' | 'blocked' | 'backend'>('privacy');
  const [blockedUsers, setBlockedUsers] = useState<HydratedProfile[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState<boolean>(false);

  // Backend tab state
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [pingLoading, setPingLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Privacy toggles
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [showDistance, setShowDistance] = useState<boolean>(true);
  const [showOnline, setShowOnline] = useState<boolean>(true);

  // Notifications toggles
  const [notifyMatches, setNotifyMatches] = useState<boolean>(true);
  const [notifyMessages, setNotifyMessages] = useState<boolean>(true);
  const [notifyLikes, setNotifyLikes] = useState<boolean>(true);

  // Status message
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'blocked') {
      setLoadingBlocked(true);
      api.getBlockedUsers()
        .then(res => setBlockedUsers(res))
        .catch(e => console.error(e))
        .finally(() => setLoadingBlocked(false));
    }
  }, [activeTab]);

  const handleUnblock = async (targetId: string) => {
    try {
      await api.unblockUser(targetId);
      setBlockedUsers(prev => prev.filter(u => u.id !== targetId));
      showToast('User has been unblocked.');
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & Privacy</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account safety, discovery visibility, and privacy preferences.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-800 text-xs font-medium rounded-2xl flex items-center space-x-2 animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'privacy', label: 'Privacy & Discovery', icon: Eye },
          { id: 'account', label: 'Account & Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'blocked', label: 'Blocked Accounts', icon: ShieldOff },
          { id: 'backend', label: 'Backend & API Health', icon: Server }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'backend' && !backendHealth) {
                  setPingLoading(true);
                  api.checkHealth()
                    .then(res => setBackendHealth(res))
                    .catch(err => setTestResult(err.message))
                    .finally(() => setPingLoading(false));
                }
              }}
              className={`py-2.5 px-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200/50'
                  : 'bg-white/40 hover:bg-white/70 text-slate-700 border border-white/60 backdrop-blur-md shadow-xs'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Privacy */}
      {activeTab === 'privacy' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-6 animate-in fade-in">
          <div className="space-y-4 divide-y divide-white/40">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Pause Discovery (Incognito)</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Hide your profile from new people in Discover. Your existing matches can still message you.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isIncognito}
                onChange={(e) => {
                  setIsIncognito(e.target.checked);
                  showToast(e.target.checked ? 'Discovery paused.' : 'Discovery active.');
                }}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Display Approximate Distance</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Show approximate distance (e.g. "~8 km away") to other members instead of exact coordinates.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showDistance}
                onChange={(e) => {
                  setShowDistance(e.target.checked);
                  showToast('Distance preference updated.');
                }}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Show Online Status</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Allow your mutual matches to see when you are active on the application.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showOnline}
                onChange={(e) => {
                  setShowOnline(e.target.checked);
                  showToast('Activity status updated.');
                }}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Account */}
      {activeTab === 'account' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-6 animate-in fade-in">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'taylor@example.com'}
                className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/40 text-slate-500 backdrop-blur-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Account Role</label>
              <input
                type="text"
                disabled
                value={user?.role === 'admin' ? 'Administrator / Moderator' : 'Standard Member'}
                className="w-full text-xs p-3 rounded-2xl border border-white/60 bg-white/40 text-slate-500 capitalize backdrop-blur-xs"
              />
            </div>

            <div className="pt-4 border-t border-white/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Password & Security</h4>
                <p className="text-xs text-slate-500">Your account is secured with salt-hashed credentials.</p>
              </div>
              <button
                onClick={() => showToast('Password reset link sent to registered email.')}
                className="px-4 py-2 border border-white/60 bg-white/40 hover:bg-white/70 text-slate-800 rounded-2xl text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
              >
                Change Password
              </button>
            </div>

            <div className="pt-4 border-t border-white/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-600">Delete Account</h4>
                <p className="text-xs text-slate-500">Permanently delete your profile, messages, and photos.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you wish to permanently delete your Connectly profile? This action is irreversible.')) {
                    logout();
                  }
                }}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 hover:bg-rose-500/20 rounded-2xl text-xs font-semibold flex items-center space-x-1.5 backdrop-blur-md transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4 animate-in fade-in divide-y divide-white/40">
          <div className="flex items-center justify-between pt-1">
            <div>
              <h4 className="text-sm font-bold text-slate-900">New Mutual Matches</h4>
              <p className="text-xs text-slate-500">Receive alerts when someone you like likes you back.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyMatches}
              onChange={(e) => setNotifyMatches(e.target.checked)}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Direct Messages</h4>
              <p className="text-xs text-slate-500">Receive instant alerts when a mutual match messages you.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyMessages}
              onChange={(e) => setNotifyMessages(e.target.checked)}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Profile Likes & Super Likes</h4>
              <p className="text-xs text-slate-500">Receive notifications when other members like your profile.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyLikes}
              onChange={(e) => setNotifyLikes(e.target.checked)}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* TAB 4: Blocked Accounts */}
      {activeTab === 'blocked' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Blocked Profiles</h4>
            <p className="text-xs text-slate-500">
              Blocked members cannot see your profile, swipe on you, or message you.
            </p>
          </div>

          {loadingBlocked ? (
            <div className="p-4 text-xs text-slate-400">Loading blocked list...</div>
          ) : blockedUsers.length === 0 ? (
            <div className="p-8 text-center bg-white/30 backdrop-blur-md rounded-2xl border border-white/60">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No blocked users</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Your block list is currently clean.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/40">
              {blockedUsers.map(b => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={b.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={b.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/60 shadow-xs"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{b.name}</h5>
                      <p className="text-[11px] text-slate-400">{b.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnblock(b.id)}
                    className="px-3 py-1.5 rounded-2xl border border-white/60 bg-white/40 hover:bg-white/70 text-slate-700 text-xs font-semibold backdrop-blur-md transition-colors shadow-xs"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Backend & API Health */}
      {activeTab === 'backend' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900">Backend Server & Database Status</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connected to local Express REST server and JSON file database storage engine.
              </p>
            </div>

            <button
              onClick={async () => {
                setPingLoading(true);
                setTestResult(null);
                try {
                  const res = await api.checkHealth();
                  setBackendHealth(res);
                  setTestResult(`Ping test passed: ${res.latency}ms latency`);
                } catch (e: any) {
                  setTestResult(`Ping test failed: ${e.message}`);
                } finally {
                  setPingLoading(false);
                }
              }}
              disabled={pingLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingLoading ? 'animate-spin' : ''}`} />
              <span>{pingLoading ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-mono text-[11px]">{testResult}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-md space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Server className="w-3.5 h-3.5" />
                <span className="font-semibold">REST API Server</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Express 4.21 on Node.js</p>
              <p className="text-[11px] text-slate-500 font-mono">Port 3000 • Ingress routed via /api</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-md space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Database className="w-3.5 h-3.5" />
                <span className="font-semibold">Database Engine</span>
              </div>
              <p className="text-sm font-bold text-slate-900">data_connectly_db.json</p>
              <p className="text-[11px] text-slate-500 font-mono">Persistent file storage • Hydrated in-memory</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-md space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Activity className="w-3.5 h-3.5" />
                <span className="font-semibold">Server Roundtrip Ping</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {backendHealth?.latency ? `${backendHealth.latency} ms` : 'Active'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">Endpoint: GET /api/health</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-md space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">Current Session</span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Unauthenticated'}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">Bearer token: {user?.id || 'none'}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/40 space-y-2">
            <p className="text-xs font-bold text-slate-700">Quick Test Personas:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'usr_me', label: 'Taylor Morgan', role: 'Default Demo User' },
                { id: 'usr_1', label: 'Sophia Chen', role: 'Female 25' },
                { id: 'usr_admin', label: 'Admin Moderator', role: 'Moderation Console' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={async () => {
                    await quickSwitchUser(p.id);
                    showToast(`Switched backend session to ${p.label}`);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    user?.id === p.id 
                      ? 'bg-rose-500/15 border-rose-300 font-bold text-rose-900' 
                      : 'bg-white/50 hover:bg-white/80 border-white/60 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-slate-900 truncate">{p.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{p.role}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-sky-500/10 border border-sky-400/30 rounded-2xl text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sky-950">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse"></span>
              <span>Netlify Deployment Architecture</span>
            </div>
            <p className="text-[11px] text-sky-900 leading-relaxed">
              Connectly includes full configuration for seamless Netlify hosting:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-slate-700">
              <div className="p-2 rounded-xl bg-white/70 border border-sky-100">
                <span className="font-bold block text-slate-900">netlify.toml</span>
                <span>Build & SPA redirects</span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 border border-sky-100">
                <span className="font-bold block text-slate-900">public/_redirects</span>
                <span>Vite asset routing</span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 border border-sky-100">
                <span className="font-bold block text-slate-900">netlify/functions/api.ts</span>
                <span>Express Serverless Lambda</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
