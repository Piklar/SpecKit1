/**
 * userProfile.db.js — Feature 002: User Profile Dashboard
 *
 * Mongoose query helpers for the profile domain.
 * Controller and service layers call these functions; they never
 * talk to Mongoose directly.
 *
 * Functions implemented per phase:
 *   Phase 3 (T010): getProfile
 *   Phase 4 (T018): updateProfile
 *   Phase 5 (T033): getFarmsByUser, getCropsBySeason, getPestsByCrops,
 *                   getUpcomingEvents, getSeasonalCrops
 */

const User = require('../../models/User');
const Farm = require('../../models/Farm');
const Crop = require('../../models/Crop');
const Pest = require('../../models/Pest');
const CalendarEvent = require('../../models/CalendarEvent');
const NewsArticle = require('../../models/NewsArticle');

// ── Phase 3 ───────────────────────────────────────────────────────────────────

/**
 * Fetch a user's profile fields (excludes password and internal fields).
 * @param {string|ObjectId} userId
 * @returns {Promise<User|null>}
 */
const getProfile = async (userId) => {
  return User.findById(userId).select('-password -avatarPublicId');
};

/**
 * Update a user's profile fields and return the updated document.
 * @param {string|ObjectId} userId
 * @param {{ name: string, municipality: string|null, bio: string|null }} fields
 * @returns {Promise<User|null>}
 */
const updateProfile = async (userId, fields) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: fields },
    { new: true, runValidators: true }
  ).select('-password -avatarPublicId');
};

// ── Phase 5 (T033) ────────────────────────────────────────────────────────────

/** All farms belonging to a user, each populated with crop IDs. */
const getFarmsByUser = async (userId) =>
  Farm.find({ user: userId }).select('name sizeHectares crops').lean();

/**
 * Crops whose IDs appear in cropIds AND whose season matches (or is 'all').
 * @param {string[]} cropIds
 * @param {'wet'|'dry'} season
 */
const getCropsBySeason = async (cropIds, season) =>
  Crop.find({ _id: { $in: cropIds }, season: { $in: [season, 'all'] } })
    .select('name season')
    .lean();

/** Pests that list at least one of the given cropIds in affectedCrops. */
const getPestsByCrops = async (cropIds) =>
  Pest.find({ affectedCrops: { $in: cropIds } })
    .select('name mitigation')
    .lean();

/**
 * Calendar events falling within [fromDate, toDate].
 * CalendarEvent has no user field, so returns all events in range.
 * @param {Date} fromDate
 * @param {Date} toDate
 */
const getUpcomingEvents = async (fromDate, toDate) =>
  CalendarEvent.find({ date: { $gte: fromDate, $lte: toDate } })
    .sort({ date: 1 })
    .select('title date type')
    .lean();

/** Crops suitable for the given season (for the empty-state suggestions). */
const getSeasonalCrops = async (season) =>
  Crop.find({ season: { $in: [season, 'all'] } })
    .select('name season')
    .limit(6)
    .lean();

/** Latest news articles for the empty-state suggestions. */
const getLatestNews = async (limit = 3) =>
  NewsArticle.find()
    .sort({ datePublished: -1 })
    .select('title datePublished source')
    .limit(limit)
    .lean();

module.exports = {
  getProfile,
  updateProfile,
  getFarmsByUser,
  getCropsBySeason,
  getPestsByCrops,
  getUpcomingEvents,
  getSeasonalCrops,
  getLatestNews,
};
