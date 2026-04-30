/**
 * ProfileHeader.jsx — Feature 002: User Profile Dashboard
 * Phase 3 (T015): header display
 * Phase 4 (T029): avatar upload / remove wired in
 */

import { useRef, useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const roleConfig = {
  farmer: { label: 'Farmer', color: 'success' },
  admin:  { label: 'Admin',  color: 'warning' },
};

/**
 * @param {{
 *   profile: object,
 *   onEdit: () => void,
 *   onAvatarChange: (newUrl: string|null) => void
 * }} props
 */
export default function ProfileHeader({ profile = {}, onEdit, onAvatarChange }) {
  const { name = '', email = '', role = 'farmer', avatarUrl = null, municipality = null } = profile;
  const role_cfg = roleConfig[role] ?? roleConfig.farmer;

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' });

  const showSnack = (msg, severity = 'success') =>
    setSnack({ open: true, severity, msg });

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-selected

    // Client-side pre-check
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showSnack('Only JPEG, PNG, or WebP images are allowed', 'error'); return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      showSnack('Image must be under 2 MB', 'error'); return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const form  = new FormData();
      form.append('avatar', file);

      const res  = await fetch(`${API_BASE}/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      onAvatarChange?.(data.avatarUrl);
      showSnack('Avatar updated ✓');
    } catch (err) {
      showSnack(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Avatar remove ──────────────────────────────────────────────────────────
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API_BASE}/profile/avatar`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      onAvatarChange?.(null);
      showSnack('Avatar removed');
    } catch (err) {
      showSnack(err.message || 'Remove failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: 3,
        p: { xs: 2, sm: 3 },
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        borderRadius: 3,
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileRef}
        id="avatar-file-input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar column */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Avatar
          src={avatarUrl || undefined}
          alt={name}
          sx={{
            width: { xs: 88, sm: 108 },
            height: { xs: 88, sm: 108 },
            fontSize: { xs: 28, sm: 36 },
            border: '4px solid rgba(255,255,255,0.35)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            bgcolor: 'primary.light',
            flexShrink: 0,
          }}
        >
          {!avatarUrl && getInitials(name)}
        </Avatar>

        {/* Avatar action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Change avatar">
            <span>
              <Button
                id="change-avatar-btn"
                size="small"
                variant="text"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                sx={{ color: 'white', fontSize: 11, minWidth: 0, px: 1 }}
              >
                {uploading ? <CircularProgress size={14} color="inherit" /> : '📷 Change'}
              </Button>
            </span>
          </Tooltip>

          {avatarUrl && (
            <Tooltip title="Remove avatar">
              <Button
                id="remove-avatar-btn"
                size="small"
                variant="text"
                disabled={uploading}
                onClick={handleRemoveAvatar}
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, minWidth: 0, px: 1 }}
              >
                🗑️
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
          <Typography variant="h5" fontWeight={700} noWrap>
            {name || '—'}
          </Typography>
          <Chip
            size="small"
            label={role_cfg.label}
            color={role_cfg.color}
            sx={{ fontWeight: 600, fontSize: 11 }}
          />
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.85, mb: municipality ? 0.5 : 0 }}>
          {email}
        </Typography>

        {municipality && (
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            📍 {municipality}
          </Typography>
        )}
      </Box>

      {/* Edit profile button */}
      {onEdit && (
        <Tooltip title="Edit profile">
          <IconButton
            id="profile-edit-btn"
            onClick={onEdit}
            sx={{
              position: { xs: 'static', sm: 'absolute' },
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
            }}
          >
            ✏️
          </IconButton>
        </Tooltip>
      )}

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
