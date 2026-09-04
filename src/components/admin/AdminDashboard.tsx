import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { HydratedProfile, Report } from '../../types.ts';
import { 
  ShieldAlert, Users, MessageCircle, Heart, CheckCircle2, 
  Ban, ShieldCheck, AlertTriangle, Search, Filter, RefreshCw 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { openProfileModal } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<HydratedProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, reportsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminReports()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setReports(reportsData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (userId: string, status: 'active' | 'suspended' | 'banned', verified?: boolean) => {
    try {
      await api.updateAdminUserStatus(userId, status, verified);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status, is_verified: verified !== undefined ? verified : u.is_verified } : u));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateReport = async (reportId: string, status: string, banUserId?: string) => {
    try {
      await api.updateAdminReportStatus(reportId, status);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: status as any } : r));
      if (banUserId) {
        await api.updateAdminUserStatus(banUserId, 'suspended');
        setUsers(prev => prev.map(u => u.id === banUserId ? { ...u, status: 'suspended' } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    u.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-7 h-7 text-purple-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Trust & Safety Moderation Console
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time platform telemetry, identity verification management, and user moderation queue.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-white/60 border border-white/80 hover:bg-white/80 text-slate-700 rounded-2xl text-xs font-semibold flex items-center space-x-1.5 transition-all backdrop-blur-md shadow-xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Row (#16) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.total_users || 0}</p>
        </div>

        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats?.active_users || 0}</p>
        </div>

        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Matches</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.total_matches || 0}</p>
        </div>

        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Messages</span>
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.total_messages || 0}</p>
        </div>

        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Reports</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats?.pending_reports || 0}</p>
        </div>

        <div className="bg-white/55 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Verified</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{stats?.verified_users || 0}</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/60 gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center space-x-1.5 rounded-t-2xl ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 bg-white/50 backdrop-blur-md shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center space-x-1.5 rounded-t-2xl ${
            activeTab === 'reports'
              ? 'border-purple-600 text-purple-700 bg-white/50 backdrop-blur-md shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/30'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Safety Incident Queue ({reports.length})</span>
        </button>
      </div>

      {/* TAB 1: User Directory */}
      {activeTab === 'users' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden space-y-4">
          
          {/* Table Search Header */}
          <div className="p-4 border-b border-white/40 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full text-xs py-2 pl-9 pr-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white/90 focus:border-purple-400 outline-none backdrop-blur-md shadow-xs transition-all"
              />
            </div>
            <span className="text-xs text-slate-600">
              Showing {filteredUsers.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/30 text-slate-600 uppercase text-[10px] font-semibold tracking-wider border-b border-white/40">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Identity Verified</th>
                  <th className="px-6 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 text-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-3.5 flex items-center space-x-3">
                      <img
                        src={u.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover cursor-pointer shadow-xs border border-white/60"
                        onClick={() => openProfileModal(u.id)}
                      />
                      <div>
                        <span 
                          onClick={() => openProfileModal(u.id)}
                          className="font-bold text-slate-900 cursor-pointer hover:underline flex items-center gap-1"
                        >
                          {u.name}, {u.age}
                          {u.is_verified && <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />}
                        </span>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-white/60 border border-white/80 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : u.status === 'suspended'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleUpdateStatus(u.id, u.status, !u.is_verified)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 border transition-all ${
                          u.is_verified 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-white/60 border-white/80 text-slate-600 hover:bg-white/80'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{u.is_verified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>

                    <td className="px-6 py-3.5 text-right space-x-1.5">
                      {u.status === 'active' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'suspended')}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-all"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'banned')}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-all"
                          >
                            Ban
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'active')}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-all"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Safety Incident Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No reports currently in moderation queue.
            </div>
          ) : (
            <div className="divide-y divide-white/40">
              {reports.map(report => (
                <div key={report.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {report.reason}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Report against user ID: {report.reported_user_id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Status: <strong className="capitalize">{report.status}</strong>
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-xs text-slate-700 italic">
                        "{report.description}"
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500">
                      Filed at: {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => openProfileModal(report.reported_user_id)}
                      className="px-3 py-1.5 rounded-2xl border border-white/80 bg-white/60 hover:bg-white/80 text-slate-700 text-xs font-semibold backdrop-blur-md shadow-xs transition-all"
                    >
                      Inspect User
                    </button>
                    <button
                      onClick={() => handleUpdateReport(report.id, 'action_taken', report.reported_user_id)}
                      className="px-3 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all"
                    >
                      Suspend Reported User
                    </button>
                    <button
                      onClick={() => handleUpdateReport(report.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-2xl bg-white/60 hover:bg-white/80 border border-white/80 text-slate-600 text-xs font-semibold backdrop-blur-md transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
