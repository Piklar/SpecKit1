/**
 * profileService.js — Feature 002: User Profile Dashboard
 * Phase 3 (T011): stub getDashboardPayload
 * Phase 4 (T017): updateProfile
 * Phase 5 (T031/T032): getCurrentSeason + full aggregation
 */

const {
  getProfile,
  updateProfile: updateProfileDb,
  getFarmsByUser,
  getCropsBySeason,
  getPestsByCrops,
  getUpcomingEvents,
  getSeasonalCrops,
  getLatestNews,
} = require('../db/userProfile.db');

// ── Phase 5 (T031) ────────────────────────────────────────────────────────────

/**
 * Derive current Philippine agricultural season from month (0-indexed).
 * Wet season: May (4) – October (9)
 * Dry season: November (10) – April (3)
 * @returns {'wet'|'dry'}
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0 = Jan
  return month >= 4 && month <= 9 ? 'wet' : 'dry';
};

// ── Phase 5 (T032) ────────────────────────────────────────────────────────────

/**
 * Build the full dashboard payload for a user.
 * @param {string|ObjectId} userId
 * @returns {Promise<DashboardPayload>}
 */
const getDashboardPayload = async (userId) => {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('User not found');

  const season = getCurrentSeason();

  // ── Farms ──────────────────────────────────────────────────────────────────
  const farmDocs = await getFarmsByUser(userId);
  const farmCount = farmDocs.length;

  // Collect all unique crop ObjectIds from user's farms
  const allCropIds = [...new Set(farmDocs.flatMap((f) => f.crops.map(String)))];

  // ── Active crops (filtered by season) ─────────────────────────────────────
  const activeCrops = allCropIds.length
    ? await getCropsBySeason(allCropIds, season)
    : [];

  const activeCropIds = activeCrops.map((c) => c._id);

  // ── Prevalent pests ────────────────────────────────────────────────────────
  const prevalentPests = activeCropIds.length
    ? await getPestsByCrops(activeCropIds)
    : [];

  // ── Upcoming calendar events (next 30 days) ────────────────────────────────
  const now   = new Date();
  const in30d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingCalendarEvents = await getUpcomingEvents(now, in30d);

  // ── Empty-state suggestions (only when no farms) ───────────────────────────
  let emptyStateSuggestions = { seasonalCrops: [], news: [] };
  if (farmCount === 0) {
    const [seasonalCrops, news] = await Promise.all([
      getSeasonalCrops(season),
      getLatestNews(3),
    ]);
    emptyStateSuggestions = { seasonalCrops, news };
  }

  return {
    profile: {
      _id:          profile._id,
      name:         profile.name,
      email:        profile.email,
      role:         profile.role,
      avatarUrl:    profile.avatarUrl    ?? null,
      municipality: profile.municipality ?? null,
      createdAt:    profile.createdAt,
    },
    farms: {
      count: farmCount,
      list:  farmDocs.map(({ _id, name, sizeHectares }) => ({ _id, name, sizeHectares })),
    },
    activeCrops,
    prevalentPests,
    upcomingCalendarEvents,
    emptyStateSuggestions,
  };
};

// ── Phase 4 (T017) ────────────────────────────────────────────────────────────

/**
 * Update a user's profile fields with validation.
 * @param {string|ObjectId} userId
 * @param {{ name: string, municipality: string|null, bio: string|null }} fields
 */
const updateProfile = async (userId, { name, municipality, bio, clientUpdatedAt }) => {
  if (!name || !name.trim()) throw new Error('Name is required');
  if (bio && bio.length > 300) throw new Error('Bio must be 300 characters or fewer');

  // Optimistic locking: if the client sent the timestamp it last saw, verify
  // the DB record hasn't been updated by another tab/session since then.
  if (clientUpdatedAt) {
    const current = await getProfile(userId);
    if (current && new Date(current.updatedAt) > new Date(clientUpdatedAt)) {
      throw new Error('Conflict');
    }
  }

  return updateProfileDb(userId, {
    name: name.trim(),
    municipality: municipality || null,
    bio: bio || null,
  });
};


module.exports = { getCurrentSeason, getDashboardPayload, updateProfile };

