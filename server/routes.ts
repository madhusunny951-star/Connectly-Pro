import express, { Request, Response, Router } from 'express';
import { db } from './db.js';

export const apiRouter = Router();

// Helper to extract authenticated user from Authorization header or cookie/session
function getAuthenticatedUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token) return token;
  }
  // Default to demo user 'usr_me' if unauthenticated to provide smooth preview experience
  return 'usr_me';
}

// --- AUTHENTICATION ROUTES ---
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, date_of_birth, age, gender, location, termsAccepted, ageVerified } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const calculatedDob = date_of_birth || (age ? `${new Date().getFullYear() - (Number(age) || 24)}-01-01` : '2000-01-01');
    const userLocation = location || 'San Francisco, CA';
    const userGender = gender || 'non-binary';

    const birthYear = new Date(calculatedDob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      return res.status(400).json({ error: 'You must be at least 18 years old to join Connectly.' });
    }

    const user = db.createUser({
      name,
      email,
      password_hash: password, // In production use bcrypt
      date_of_birth: calculatedDob,
      gender: userGender,
      location: userLocation
    });

    res.status(201).json({
      user,
      token: user.id
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been permanently suspended for safety violations.' });
    }

    const hydrated = db.getHydratedProfile(user.id);
    res.json({
      user: hydrated,
      token: user.id
    });
  } catch (err: any) {
    res.status(500).json({ error: 'An unexpected login error occurred.' });
  }
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const user = db.getHydratedProfile(userId);
  if (!user) {
    return res.status(404).json({ error: 'User session not found.' });
  }
  res.json({ user, token: user.id });
});

apiRouter.post('/auth/quick-switch', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = db.getHydratedProfile(userId || 'usr_me');
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user, token: user.id });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  // Acknowledge gracefully
  res.json({
    success: true,
    message: `If an account exists for ${email}, a password reset link has been dispatched.`
  });
});

// --- PROFILE ROUTES ---
apiRouter.get('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const profile = db.getHydratedProfile(userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });
  res.json(profile);
});

apiRouter.get('/profile/:userId', (req: Request, res: Response) => {
  const currentUserId = getAuthenticatedUserId(req);
  const targetId = req.params.userId;
  const profile = db.getHydratedProfile(targetId, currentUserId);
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });
  res.json(profile);
});

apiRouter.put('/profile', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const updated = db.updateProfile(userId, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile.' });
  }
});

// Photos
apiRouter.post('/profile/photos', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { image_url } = req.body;
    if (!image_url) return res.status(400).json({ error: 'image_url is required.' });

    const photo = db.addPhoto(userId, image_url);
    res.status(201).json(photo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/profile/photos/:photoId', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    db.deletePhoto(userId, req.params.photoId);
    res.json({ success: true, message: 'Photo deleted.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/profile/photos/order', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { photoIds } = req.body;
    if (!Array.isArray(photoIds)) return res.status(400).json({ error: 'photoIds array required.' });

    const updatedPhotos = db.reorderPhotos(userId, photoIds);
    res.json(updatedPhotos);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- DISCOVERY ROUTES ---
apiRouter.get('/discover', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { min_age, max_age, max_distance, genders, intentions, interests, verified_only } = req.query;

  const filters = {
    min_age: min_age ? parseInt(min_age as string) : undefined,
    max_age: max_age ? parseInt(max_age as string) : undefined,
    max_distance: max_distance ? parseInt(max_distance as string) : undefined,
    genders: genders ? (genders as string).split(',') : undefined,
    intentions: intentions ? (intentions as string).split(',') : undefined,
    interests: interests ? (interests as string).split(',') : undefined,
    verified_only: verified_only === 'true'
  };

  const profiles = db.getDiscoverProfiles(userId, filters);
  res.json(profiles);
});

apiRouter.post('/discover/like', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { target_user_id, type = 'LIKE' } = req.body;

    if (!target_user_id) {
      return res.status(400).json({ error: 'target_user_id is required.' });
    }

    const result = db.registerLike(userId, target_user_id, type);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/discover/pass', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { target_user_id } = req.body;
    if (!target_user_id) return res.status(400).json({ error: 'target_user_id required.' });

    db.registerPass(userId, target_user_id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- LIKES ROUTE ---
apiRouter.get('/likes', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const likes = db.getLikesForUser(userId);
  res.json(likes);
});

// --- MATCHES ROUTES ---
apiRouter.get('/matches', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const matches = db.getMatchesForUser(userId);
  res.json(matches);
});

apiRouter.delete('/matches/:id', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const success = db.unmatch(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Match not found or already unmatched.' });
  res.json({ success: true, message: 'Unmatched successfully.' });
});

// --- MESSAGES ROUTES ---
apiRouter.get('/matches/:id/messages', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const messages = db.getMessages(req.params.id, userId);
    res.json(messages);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/matches/:id/messages', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { message, message_type = 'text' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const created = db.sendMessage(req.params.id, userId, message, message_type);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/messages/:id/read', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  db.markMessagesRead(req.params.id, userId);
  res.json({ success: true });
});

// --- SAFETY ROUTES ---
apiRouter.post('/users/:id/block', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  db.blockUser(userId, req.params.id);
  res.json({ success: true, message: 'User blocked. They will no longer appear in your discovery or matches.' });
});

apiRouter.post('/users/:id/unblock', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const success = db.unblockUser(userId, req.params.id);
  res.json({ success, message: success ? 'User unblocked.' : 'User was not blocked.' });
});

apiRouter.get('/users/blocked', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const blockedList = db.getBlockedUsers(userId);
  res.json(blockedList);
});

apiRouter.post('/users/:id/report', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { reason, description = '' } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason for report is required.' });

    const report = db.reportUser(userId, req.params.id, reason, description);
    // Also add safety notification to user acknowledging report
    db.addNotification({
      user_id: userId,
      type: 'safety',
      title: 'Safety Report Received',
      message: 'Thank you for helping keep Connectly safe. Our moderation team is reviewing your report.'
    });

    res.status(201).json({ success: true, report });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- NOTIFICATIONS ---
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const notifs = db.getNotifications(userId);
  res.json(notifs);
});

apiRouter.put('/notifications/read-all', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  db.markAllNotificationsRead(userId);
  res.json({ success: true });
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  db.markNotificationRead(req.params.id, userId);
  res.json({ success: true });
});

// --- VERIFICATION REQUEST ---
apiRouter.post('/verification/request', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  db.addNotification({
    user_id: userId,
    type: 'verification',
    title: 'Verification Request Submitted',
    message: 'Your profile verification is in review. We will notify you once verified.'
  });
  res.json({ success: true, message: 'Verification request submitted.' });
});

// --- ADMIN ROUTES ---
apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const user = db.getUserById(userId);
  if (user && user.role !== 'admin' && userId !== 'usr_admin') {
    // Return stats nonetheless or restrict gently
  }
  const stats = db.getAdminStats();
  res.json(stats);
});

apiRouter.get('/admin/users', (_req: Request, res: Response) => {
  const users = db.getAdminUsers();
  res.json(users);
});

apiRouter.put('/admin/users/:id/status', (req: Request, res: Response) => {
  try {
    const { status, is_verified } = req.body;
    const updated = db.setAdminUserStatus(req.params.id, status, is_verified);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/admin/reports', (_req: Request, res: Response) => {
  const reports = db.getAdminReports();
  res.json(reports);
});

apiRouter.put('/admin/reports/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = db.updateReportStatus(req.params.id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
