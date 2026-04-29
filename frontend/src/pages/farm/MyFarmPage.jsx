import { Container, Typography, Button } from '@mui/material';
import { useFarm } from '../../contexts/FarmContext';

export default function MyFarmPage() {
  const { farms, loading } = useFarm();
  if (loading) return <Typography>Loading...</Typography>;
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Farm</Typography>
      {farms.length === 0 ? <Typography>No farms added yet.</Typography> : (
        farms.map(f => <Typography key={f._id}>{f.name}</Typography>)
      )}
      <Button variant="contained" sx={{ mt: 2 }}>Add Farm</Button>
    </Container>
  );
}
