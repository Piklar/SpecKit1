/**
 * ProfilePage.jsx — Feature 002: User Profile Dashboard (Final)
 *
 * Phase 3 (T014/T016): fetches dashboard, renders ProfileHeader
 * Phase 4 (T030):      EditProfileForm + ChangePasswordForm in Accordion
 * Phase 5 (T036):      FarmSummaryWidget + CalendarWidget
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';

import ProfileHeader       from './ProfileHeader';
import EditProfileForm     from './EditProfileForm';
import ChangePasswordForm  from './ChangePasswordForm';
import FarmSummaryWidget   from './FarmSummaryWidget';
import CalendarWidget      from './CalendarWidget';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const fetchDashboard = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/profile/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export default function ProfilePage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Track which accordion panel is open ('edit' | 'password' | false)
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchDashboard();
      setData(payload);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">Loading your profile…</Typography>
      </Box>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert
          severity="error"
          action={
            <Button id="profile-retry-btn" color="inherit" size="small" onClick={load}>
              ↺ Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  const {
    profile              = {},
    farms                = { count: 0, list: [] },
    activeCrops          = [],
    prevalentPests       = [],
    upcomingCalendarEvents = [],
    emptyStateSuggestions  = { seasonalCrops: [], news: [] },
  } = data || {};

  // Optimistically update avatarUrl in local state without a full refetch
  const handleAvatarChange = (newUrl) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, avatarUrl: newUrl } }));
  };

  // After saving profile edits, update name/municipality in local state
  const handleProfileSaved = (updated) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, name: updated.name, municipality: updated.municipality, bio: updated.bio },
    }));
    setExpanded(false); // collapse accordion after save
  };

  const handleAccordion = (panel) => (_e, isOpen) => setExpanded(isOpen ? panel : false);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* ── Profile header with avatar controls ── */}
      <ProfileHeader
        profile={profile}
        onEdit={() => setExpanded((v) => v === 'edit' ? false : 'edit')}
        onAvatarChange={handleAvatarChange}
      />

      {/* ── Edit forms (collapsible) ── */}
      <Box>
        {/* Edit profile details */}
        <Accordion
          expanded={expanded === 'edit'}
          onChange={handleAccordion('edit')}
          disableGutters
          sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<span>▾</span>}
            id="edit-profile-accordion"
            aria-controls="edit-profile-panel"
          >
            <Typography fontWeight={600}>✏️ Edit Profile Details</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <EditProfileForm profile={profile} onSaved={handleProfileSaved} />
          </AccordionDetails>
        </Accordion>

        {/* Change password */}
        <Accordion
          expanded={expanded === 'password'}
          onChange={handleAccordion('password')}
          disableGutters
          sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}
        >
          <AccordionSummary
            expandIcon={<span>▾</span>}
            id="change-password-accordion"
            aria-controls="change-password-panel"
          >
            <Typography fontWeight={600}>🔑 Change Password</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <ChangePasswordForm />
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* ── Farm & calendar widgets ── */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <FarmSummaryWidget
            farms={farms}
            activeCrops={activeCrops}
            prevalentPests={prevalentPests}
            emptyStateSuggestions={emptyStateSuggestions}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CalendarWidget events={upcomingCalendarEvents} />
        </Grid>
      </Grid>

    </Container>
  );
}
