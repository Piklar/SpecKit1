/**
 * avatarService.js — Feature 002: User Profile Dashboard
 *
 * Handles avatar upload / delete for the profile domain.
 *
 * NOTE: multer-storage-cloudinary@4.x targets cloudinary@^1.x. Since this project
 * uses cloudinary@^2.x, we use multer with in-memory storage and pipe the buffer
 * to cloudinary.uploader.upload_stream() directly. This is the recommended approach
 * for cloudinary SDK v2.
 */

const multer = require('multer');
const cloudinary = require('../../config/cloudinary');
const User = require('../../models/User');

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ── Multer — memory storage (buffer passed to Cloudinary stream) ───────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File must be JPEG, PNG, or WebP'), false);
  }
};

/** Express middleware that parses the 'avatar' field from multipart/form-data */
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('avatar');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Upload a buffer to Cloudinary and return { url, publicId }.
 * @param {Buffer} buffer
 * @param {string} folder  Cloudinary folder path
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = (buffer, folder = 'agriklima/avatars') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * Upload or replace a user's avatar.
 * Deletes the previous Cloudinary asset if one exists.
 * @param {string} userId
 * @param {Express.Multer.File} file  — req.file from uploadMiddleware
 * @returns {Promise<string>} new avatarUrl
 */
const uploadAvatar = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Delete old avatar from Cloudinary if it exists
  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (_) {
      // Non-fatal — old asset may already be gone
    }
  }

  const { url, publicId } = await uploadToCloudinary(file.buffer);

  user.avatarUrl = url;
  user.avatarPublicId = publicId;
  await user.save();

  return url;
};

/**
 * Remove a user's avatar (resets to null).
 * Deletes the Cloudinary asset by its stored publicId.
 * @param {string} userId
 * @returns {Promise<null>}
 */
const deleteAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (_) {
      // Non-fatal
    }
  }

  user.avatarUrl = null;
  user.avatarPublicId = null;
  await user.save();

  return null;
};

module.exports = { uploadMiddleware, uploadAvatar, deleteAvatar };
