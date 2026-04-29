import { Box, Container, Typography, Grid, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import useCrops from '../../hooks/useCrops';
import CropCard from '../../components/Cards/CropCard';

export default function CropsPage() {
  const [season, setSeason] = useState('all');
  const { crops, loading, error } = useCrops(season);

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Seasonal Crop Recommendations
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Season</InputLabel>
          <Select
            value={season}
            label="Season"
            onChange={(e) => setSeason(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="wet">Wet Season</MenuItem>
            <MenuItem value="dry">Dry Season</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {crops.map((crop) => (
            <Grid item key={crop._id} xs={12} sm={6} md={4}>
              <CropCard crop={crop} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
