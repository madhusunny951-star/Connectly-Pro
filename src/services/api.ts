import { HydratedProfile, Match, Message, NotificationItem, Report, Photo, User } from '../types.ts';

const TOKEN_KEY = 'connectly_auth_token';

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) || 'usr_me';
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
    }
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Health & Backend Diagnostics
  checkHealth: async () => {
    const start = performance.now();
    const data = await request<{ status: string; app: string; timestamp: string; database?: string; connected?: boolean }>('/health');
    const latency = Math.round(performance.now() - start);
    return { ...data, latency };
  },

  // Auth
  register: (payload: any) => request<{ user: HydratedProfile; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  login: (payload: { email: string; password: string }) => request<{ user: HydratedProfile; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  getMe: () => request<{ user: HydratedProfile; token: string }>('/auth/me'),

  quickSwitch: (userId: string) => request<{ user: HydratedProfile; token: string }>('/auth/quick-switch', {
    method: 'POST',
    body: JSON.stringify({ userId })
  }),

  forgotPassword: (email: string) => request<{ success: boolean; message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  // Profile
  getProfile: () => request<HydratedProfile>('/profile'),

  getUserProfile: (userId: string) => request<HydratedProfile>(`/profile/${userId}`),

  updateProfile: (updates: any) => request<HydratedProfile>('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  addPhoto: (imageUrl: string) => request<Photo>('/profile/photos', {
    method: 'POST',
    body: JSON.stringify({ image_url: imageUrl })
  }),

  deletePhoto: (photoId: string) => request<{ success: boolean }>(`/profile/photos/${photoId}`, {
    method: 'DELETE'
  }),

  reorderPhotos: (photoIds: string[]) => request<Photo[]>('/profile/photos/order', {
    method: 'PUT',
    body: JSON.stringify({ photoIds })
  }),

  // Discovery
  getDiscoverProfiles: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, Array.isArray(val) ? val.join(',') : String(val));
      }
    });
    const qStr = query.toString();
    return request<HydratedProfile[]>(`/discover${qStr ? `?${qStr}` : ''}`);
  },

  likeUser: (targetUserId: string, type: 'LIKE' | 'SUPER_LIKE' = 'LIKE') => request<{
    isMatch: boolean;
    match?: Match;
    matchedUser?: HydratedProfile;
  }>('/discover/like', {
    method: 'POST',
    body: JSON.stringify({ target_user_id: targetUserId, type })
  }),

  passUser: (targetUserId: string) => request<{ success: boolean }>('/discover/pass', {
    method: 'POST',
    body: JSON.stringify({ target_user_id: targetUserId })
  }),

  getLikes: () => request<Array<HydratedProfile & { like_type: 'LIKE' | 'SUPER_LIKE'; liked_at: string }>>('/likes'),

  // Matches
  getMatches: () => request<Match[]>('/matches'),

  unmatch: (matchId: string) => request<{ success: boolean }>(`/matches/${matchId}`, {
    method: 'DELETE'
  }),

  // Messages
  getMessages: (matchId: string) => request<Message[]>(`/matches/${matchId}/messages`),

  sendMessage: (matchId: string, message: string, message_type: 'text' | 'image' = 'text') => request<Message>(`/matches/${matchId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message, message_type })
  }),

  markMessagesRead: (matchId: string) => request<{ success: boolean }>(`/messages/${matchId}/read`, {
    method: 'PUT'
  }),

  // Safety
  blockUser: (userId: string) => request<{ success: boolean; message: string }>(`/users/${userId}/block`, {
    method: 'POST'
  }),

  unblockUser: (userId: string) => request<{ success: boolean; message: string }>(`/users/${userId}/unblock`, {
    method: 'POST'
  }),

  getBlockedUsers: () => request<HydratedProfile[]>('/users/blocked'),

  reportUser: (userId: string, reason: string, description: string) => request<{ success: boolean; report: Report }>(`/users/${userId}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason, description })
  }),

  // Notifications
  getNotifications: () => request<NotificationItem[]>('/notifications'),

  markAllNotificationsRead: () => request<{ success: boolean }>('/notifications/read-all', {
    method: 'PUT'
  }),

  markNotificationRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'PUT'
  }),

  requestVerification: () => request<{ success: boolean; message: string }>('/verification/request', {
    method: 'POST'
  }),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),

  getAdminUsers: () => request<HydratedProfile[]>('/admin/users'),

  updateAdminUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned', verified?: boolean) => request<User>(`/admin/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, is_verified: verified })
  }),

  getAdminReports: () => request<Report[]>('/admin/reports'),

  updateAdminReportStatus: (reportId: string, status: string) => request<Report>(`/admin/reports/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};
