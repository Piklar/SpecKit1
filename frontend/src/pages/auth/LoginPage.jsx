import { Container, Box, Typography, Link } from '@mui/material';
import LoginForm from '../../components/Form/LoginForm';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <LoginForm />
        <Link href="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
      </Box>
    </Container>
  );
}
