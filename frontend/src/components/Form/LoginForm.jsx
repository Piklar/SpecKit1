import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Box, Alert } from '@mui/material';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField margin="normal" required fullWidth label="Email Address" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
      <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
    </Box>
  );
}
