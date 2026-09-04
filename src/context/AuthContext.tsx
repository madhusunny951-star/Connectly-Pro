import React, { createContext, useContext, useState, useEffect } from 'react';
import { HydratedProfile, Match } from '../types.ts';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: HydratedProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  backendConnected: boolean | null;
  backendPingMs: number | null;
  isBackendModalOpen: boolean;
  openBackendModal: () => void;
  closeBackendModal: () => void;
  checkBackendHealth: () => Promise<void>;
  currentRoute: string;
  selectedMatchId: string | null;
  matchedUserData: { match: Match; otherUser: HydratedProfile } | null;
  inspectedProfileId: string | null;
  reportingUserId: string | null;
  unreadNotifsCount: number;
  unreadMessagesCount: number;
  setCurrentRoute: (route: string) => void;
  navigateTo: (route: string, matchId?: string) => void;
  openProfileModal: (userId: string) => void;
  closeProfileModal: () => void;
  openReportModal: (userId: string) => void;
  closeReportModal: () => void;
  triggerMatchModal: (match: Match, otherUser: HydratedProfile) => void;
  closeMatchModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  quickSwitchUser: (userId: string) => Promise<void>;
  updateUser: (updatedProfile: HydratedProfile) => void;
  refreshUser: () => Promise<void>;
  refreshCounts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<HydratedProfile | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [backendPingMs, setBackendPingMs] = useState<number | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>('/discover');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchedUserData, setMatchedUserData] = useState<{ match: Match; otherUser: HydratedProfile } | null>(null);
  const [inspectedProfileId, setInspectedProfileId] = useState<string | null>(null);
  const [reportingUserId, setReportingUserId] = useState<string | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

  const checkBackendHealth = async () => {
    try {
      const res = await api.checkHealth();
      setBackendConnected(true);
      setBackendPingMs(res.latency);
    } catch (err) {
      setBackendConnected(false);
      setBackendPingMs(null);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      await checkBackendHealth();
      const res = await api.getMe();
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      await fetchCounts();
    } catch (err) {
      console.warn('Session check failed, staying on current view or landing:', err);
      // Fallback: try demo user
      try {
        const fallback = await api.quickSwitch('usr_me');
        setUser(fallback.user);
        setToken(fallback.token);
        setStoredToken(fallback.token);
        await fetchCounts();
      } catch (e) {
        setUser(null);
        setToken(null);
        removeStoredToken();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [notifs, matches] = await Promise.all([
        api.getNotifications().catch(() => []),
        api.getMatches().catch(() => [])
      ]);
      const unreadN = notifs.filter(n => !n.is_read).length;
      let unreadM = 0;
      (matches as Match[]).forEach(m => {
        unreadM += m.unread_count || 0;
      });
      setUnreadNotifsCount(unreadN);
      setUnreadMessagesCount(unreadM);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      await fetchCounts();
      setCurrentRoute(res.user.role === 'admin' ? '/admin' : '/discover');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      await fetchCounts();
      setCurrentRoute('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      removeStoredToken();
      setCurrentRoute('/landing');
    }
  };

  const quickSwitchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await api.quickSwitch(userId);
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      await fetchCounts();
      if (res.user.role === 'admin') {
        setCurrentRoute('/admin');
      } else if (currentRoute === '/admin') {
        setCurrentRoute('/discover');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedProfile: HydratedProfile) => {
    setUser(updatedProfile);
  };

  const refreshUser = async () => {
    try {
      const updated = await api.getProfile();
      setUser(updated);
    } catch {
      // ignore
    }
  };

  const navigateTo = (route: string, matchId?: string) => {
    if (matchId) {
      setSelectedMatchId(matchId);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchCounts();
  };

  const openProfileModal = (userId: string) => {
    setInspectedProfileId(userId);
  };

  const closeProfileModal = () => {
    setInspectedProfileId(null);
  };

  const openReportModal = (userId: string) => {
    setReportingUserId(userId);
  };

  const closeReportModal = () => {
    setReportingUserId(null);
  };

  const triggerMatchModal = (match: Match, otherUser: HydratedProfile) => {
    setMatchedUserData({ match, otherUser });
    fetchCounts();
  };

  const closeMatchModal = () => {
    setMatchedUserData(null);
  };

  const openBackendModal = () => {
    setIsBackendModalOpen(true);
  };

  const closeBackendModal = () => {
    setIsBackendModalOpen(false);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    backendConnected,
    backendPingMs,
    isBackendModalOpen,
    openBackendModal,
    closeBackendModal,
    checkBackendHealth,
    currentRoute,
    selectedMatchId,
    matchedUserData,
    inspectedProfileId,
    reportingUserId,
    unreadNotifsCount,
    unreadMessagesCount,
    setCurrentRoute,
    navigateTo,
    openProfileModal,
    closeProfileModal,
    openReportModal,
    closeReportModal,
    triggerMatchModal,
    closeMatchModal,
    login,
    register,
    logout,
    quickSwitchUser,
    updateUser,
    refreshUser,
    refreshCounts: fetchCounts
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
