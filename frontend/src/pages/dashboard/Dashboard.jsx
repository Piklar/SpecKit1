import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AgriKlima Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/farm')}>My Farm</Button>
          <Button color="inherit" onClick={() => navigate('/crops')}>Crops</Button>
          <Button color="inherit" onClick={() => navigate('/pests')}>Pests</Button>
          <Button color="inherit" onClick={() => navigate('/weather')}>Weather</Button>
          <Button color="inherit" onClick={() => navigate('/calendar')}>Calendar</Button>
          <Button color="inherit" onClick={() => navigate('/news')}>News</Button>
          <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || 'Farmer'}
        </Typography>
        <Typography variant="body1">
          This is your central hub for localized weather, crop recommendations, and farm management.
        </Typography>
      </Container>
    </Box>
  );
}
