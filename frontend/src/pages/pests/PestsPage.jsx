import { Container, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import usePests from '../../hooks/usePests';

export default function PestsPage() {
  const { pests, loading } = usePests();
  if (loading) return <CircularProgress />;
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Pest Identification & Mitigation</Typography>
      <Grid container spacing={3}>
        {pests.map(pest => (
          <Grid item xs={12} sm={6} md={4} key={pest._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{pest.name}</Typography>
                <Typography variant="body2" color="text.secondary">{pest.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
