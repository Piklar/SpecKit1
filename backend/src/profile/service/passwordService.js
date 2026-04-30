/**
 * passwordService.js — Feature 002: User Profile Dashboard
 *
 * Password validation and change logic for the profile domain.
 * Implemented in Phase 4 (T024/T025); stub provided here so
 * the controller can import it without crashing during Phase 3.
 */

const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// Regex: min 8 chars, ≥1 uppercase, ≥1 special character
const PASSWORD_POLICY = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * Validate a password against the policy.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
const validatePasswordPolicy = (password) => {
  if (!password || !PASSWORD_POLICY.test(password)) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters, include 1 uppercase and 1 special character',
    };
  }
  return { valid: true, message: '' };
};

/**
 * Change a user's password after verifying the current one.
 * Throws sentinel strings so the controller can map to HTTP status codes.
 * @param {string|ObjectId} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Fetch the full user doc (need the hashed password for comparison)
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('CurrentPasswordIncorrect');

  const { valid } = validatePasswordPolicy(newPassword);
  if (!valid) throw new Error('WeakPassword');

  // Use the same salt rounds as registration (User pre-save hook uses genSalt(10))
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
};

module.exports = { validatePasswordPolicy, changePassword };
