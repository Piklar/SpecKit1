/**
 * profileController.js — Feature 002: User Profile Dashboard
 *
 * Express Router for all /api/profile/* endpoints.
 * All routes are pre-protected by authenticateJWT (applied in server.js).
 *
 * Handlers are implemented incrementally:
 *   Phase 2 (T009): Router stub — all handlers return 501 Not Implemented
 *   Phase 3 (T012/T013): GET /me, GET /dashboard implemented
 *   Phase 4 (T019/T022/T023/T026): remaining handlers implemented
 */

const express = require('express');
const router = express.Router();

const profileService = require('../service/profileService');
const { uploadMiddleware, uploadAvatar, deleteAvatar } = require('../service/avatarService');
const passwordService = require('../service/passwordService');
const { getProfile } = require('../db/userProfile.db');

// ── GET /api/profile/me ────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const profile = await getProfile(req.user._id);
    if (!profile) return res.status(404).json({ message: 'User not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/profile/dashboard ────────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const payload = await profileService.getDashboardPayload(req.user._id);
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/profile/me ───────────────────────────────────────────────────────
router.put('/me', async (req, res) => {
  try {
    const { name, municipality, bio, clientUpdatedAt } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const updated = await profileService.updateProfile(req.user._id, {
      name: name.trim(),
      municipality: municipality || null,
      bio: bio || null,
      clientUpdatedAt: clientUpdatedAt || null,
    });
    res.json(updated);
  } catch (err) {
    if (err.message === 'Conflict') {
      return res.status(409).json({ message: 'Profile was modified by another session. Please refresh and try again.' });
    }
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/profile/avatar ──────────────────────────────────────────────────
router.post('/avatar', uploadMiddleware, async (req, res) => {
  // uploadMiddleware has already run — if it rejected the file, req.file is undefined
  if (!req.file) {
    return res.status(400).json({ message: 'File must be JPEG, PNG, or WebP and under 2 MB' });
  }
  try {
    const avatarUrl = await uploadAvatar(req.user._id, req.file);
    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/profile/avatar ────────────────────────────────────────────────
router.delete('/avatar', async (req, res) => {
  try {
    await deleteAvatar(req.user._id);
    res.json({ message: 'Avatar removed', avatarUrl: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/profile/password ─────────────────────────────────────────────────
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    await passwordService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    if (err.message === 'CurrentPasswordIncorrect') {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    if (err.message === 'WeakPassword') {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include 1 uppercase and 1 special character',
      });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
