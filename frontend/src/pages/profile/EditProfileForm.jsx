/**
 * EditProfileForm.jsx — Feature 002 / Phase 4 / T027
 * MUI form: Name (required), Municipality (optional), Bio (optional ≤300 chars).
 * Calls PUT /api/profile/me; shows inline errors and success snackbar.
 */

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * @param {{ profile: object, onSaved: (updated: object) => void }} props
 */
export default function EditProfileForm({ profile = {}, onSaved }) {
  const [name, setName]               = useState(profile.name || '');
  const [municipality, setMunicipality] = useState(profile.municipality || '');
  const [bio, setBio]                 = useState(profile.bio || '');

  const [nameError, setNameError]     = useState('');
  const [bioError,  setBioError]      = useState('');
  const [saving,    setSaving]        = useState(false);
  const [snack,     setSnack]         = useState({ open: false, severity: 'success', msg: '' });

  const showSnack = (msg, severity = 'success') =>
    setSnack({ open: true, severity, msg });

  const validate = () => {
    let ok = true;
    if (!name.trim()) { setNameError('Name is required'); ok = false; }
    else setNameError('');
    if (bio.length > 300) { setBioError('Bio must be 300 characters or fewer'); ok = false; }
    else setBioError('');
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          municipality: municipality || null,
          bio: bio || null,
          clientUpdatedAt: profile.updatedAt || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      onSaved?.(data);
      showSnack('Profile updated successfully ✓');
    } catch (err) {
      showSnack(err.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Edit Profile
      </Typography>

      {/* Name */}
      <TextField
        id="edit-name"
        label="Name"
        value={name}
        onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
        error={!!nameError}
        helperText={nameError}
        required
        fullWidth
        size="small"
      />

      {/* Municipality */}
      <TextField
        id="edit-municipality"
        label="Municipality"
        value={municipality}
        onChange={(e) => setMunicipality(e.target.value)}
        fullWidth
        size="small"
        placeholder="e.g. San Fernando"
      />

      {/* Bio */}
      <TextField
        id="edit-bio"
        label="Bio"
        value={bio}
        onChange={(e) => { setBio(e.target.value); if (bioError) setBioError(''); }}
        error={!!bioError}
        helperText={bioError || `${bio.length}/300`}
        multiline
        rows={3}
        fullWidth
        size="small"
        inputProps={{ maxLength: 300 }}
        InputProps={{
          endAdornment: bio.length > 270 ? (
            <InputAdornment position="end">
              <Typography variant="caption" color={bio.length >= 300 ? 'error' : 'text.secondary'}>
                {300 - bio.length}
              </Typography>
            </InputAdornment>
          ) : null,
        }}
      />

      <Button
        id="edit-profile-submit"
        type="submit"
        variant="contained"
        disabled={saving}
        sx={{ alignSelf: 'flex-start' }}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
