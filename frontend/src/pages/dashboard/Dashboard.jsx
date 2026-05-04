import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>

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
