/**
 * ChangePasswordForm.jsx — Feature 002 / Phase 4 / T028
 * Inline password change with real-time policy feedback.
 * Calls PUT /api/profile/password.
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
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Password policy checks — must match backend passwordService.js
const checks = [
  { id: 'len',   label: 'At least 8 characters',        test: (p) => p.length >= 8 },
  { id: 'upper', label: 'At least 1 uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { id: 'spec',  label: 'At least 1 special character',  test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function ChangePasswordForm() {
  const [current,  setCurrent]  = useState('');
  const [newPw,    setNewPw]    = useState('');
  const [confirm,  setConfirm]  = useState('');

  // Show/hide password toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [snack,  setSnack]  = useState({ open: false, severity: 'success', msg: '' });

  const showSnack = (msg, severity = 'success') =>
    setSnack({ open: true, severity, msg });

  const policyMet  = checks.every((c) => c.test(newPw));
  const confirmErr = confirm && newPw !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!current)    { showSnack('Enter your current password', 'warning'); return; }
    if (!policyMet)  { showSnack('New password does not meet requirements', 'warning'); return; }
    if (newPw !== confirm) { showSnack('Passwords do not match', 'warning'); return; }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      showSnack('Password changed successfully ✓');
      setCurrent(''); setNewPw(''); setConfirm('');
    } catch (err) {
      showSnack(err.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Change Password
      </Typography>

      {/* Current password */}
      <TextField
        id="pw-current"
        label="Current Password"
        type={showCurrent ? 'text' : 'password'}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        fullWidth
        size="small"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowCurrent((v) => !v)} tabIndex={-1}>
                {showCurrent ? '🙈' : '👁️'}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* New password + live policy feedback */}
      <TextField
        id="pw-new"
        label="New Password"
        type={showNew ? 'text' : 'password'}
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        fullWidth
        size="small"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowNew((v) => !v)} tabIndex={-1}>
                {showNew ? '🙈' : '👁️'}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Policy checklist — visible once user starts typing */}
      {newPw.length > 0 && (
        <List dense disablePadding sx={{ pl: 1 }}>
          {checks.map((c) => {
            const ok = c.test(newPw);
            return (
              <ListItem key={c.id} disableGutters sx={{ py: 0 }}>
                <ListItemText
                  primary={`${ok ? '✅' : '❌'} ${c.label}`}
                  primaryTypographyProps={{
                    variant: 'caption',
                    color: ok ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Confirm password */}
      <TextField
        id="pw-confirm"
        label="Confirm New Password"
        type={showConfirm ? 'text' : 'password'}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        fullWidth
        size="small"
        required
        error={confirmErr}
        helperText={confirmErr ? 'Passwords do not match' : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                {showConfirm ? '🙈' : '👁️'}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        id="change-pw-submit"
        type="submit"
        variant="outlined"
        color="warning"
        disabled={saving}
        sx={{ alignSelf: 'flex-start' }}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {saving ? 'Updating…' : 'Update Password'}
      </Button>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
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
