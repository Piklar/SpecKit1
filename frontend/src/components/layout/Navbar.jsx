import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          AgriKlima Dashboard
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick={() => navigate('/farm')}>My Farm</Button>
          <Button color="inherit" onClick={() => navigate('/crops')}>Crops</Button>
          <Button color="inherit" onClick={() => navigate('/pests')}>Pests</Button>
          <Button color="inherit" onClick={() => navigate('/weather')}>Weather</Button>
          <Button color="inherit" onClick={() => navigate('/calendar')}>Calendar</Button>
          <Button color="inherit" onClick={() => navigate('/news')}>News</Button>
          <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
