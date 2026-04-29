import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Box, Alert } from '@mui/material';

export default function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField margin="normal" required fullWidth label="Full Name" autoFocus value={name} onChange={e => setName(e.target.value)} />
      <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
    </Box>
  );
}
