import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button, Paper, Grid } from '@mui/material';
import api from '../../services/api';

export default function CropDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const { data } = await api.get(`/crops/${id}`);
        setCrop(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (!crop) return <Typography align="center" mt={4}>Crop not found.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/crops')} sx={{ mb: 2 }}>&larr; Back to Crops</Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>{crop.name}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Season</Typography>
            <Typography paragraph>{crop.season}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Growing Time</Typography>
            <Typography paragraph>{crop.growingTimeDays} days</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Water Requirement</Typography>
            <Typography paragraph>{crop.waterRequirement}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Ideal Soil Type</Typography>
            <Typography paragraph>{crop.soilType}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Description</Typography>
          <Typography paragraph>{crop.description}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
