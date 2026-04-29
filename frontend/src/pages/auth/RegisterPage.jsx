import { Container, Box, Typography, Link } from '@mui/material';
import RegisterForm from '../../components/Form/RegisterForm';

export default function RegisterPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign up</Typography>
        <RegisterForm />
        <Link href="/login" variant="body2">{"Already have an account? Sign in"}</Link>
      </Box>
    </Container>
  );
}
