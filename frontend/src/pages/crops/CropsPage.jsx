import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useState, useMemo } from 'react';
import useCrops from '../../hooks/useCrops';
import CropHero from './CropHero';
import CropGrid from './CropGrid';
import CropModal from './CropModal';

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  return (month >= 4 && month <= 9) ? 'wet' : 'dry';
};

export default function CropsPage() {
  const currentSeason = useMemo(() => getCurrentSeason(), []);
  const { crops, loading, error } = useCrops('all');
  
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (crop) => {
    setSelectedCrop(crop);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCrop(null);
  };

  // Filter crops based on season
  const seasonalCrops = useMemo(() => {
    if (!crops) return [];
    return crops.filter(c => c.season === currentSeason || c.season === 'all');
  }, [crops, currentSeason]);

  // Pick the first crop as hero for the MVP
  const heroCrop = seasonalCrops.length > 0 ? seasonalCrops[0] : null;
  const gridCrops = seasonalCrops.length > 1 ? seasonalCrops.slice(1) : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Crops Directory
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover localized crop recommendations for Pampanga's {currentSeason} season.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <CropHero crop={heroCrop} onOpenModal={handleOpenModal} />
          
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, mt: 6 }}>
            Other Viable Crops
          </Typography>
          
          {gridCrops.length > 0 ? (
            <CropGrid crops={gridCrops} onOpenModal={handleOpenModal} />
          ) : (
            <Alert severity="info">No other crops found for this season.</Alert>
          )}
        </>
      )}

      <CropModal 
        crop={selectedCrop} 
        open={modalOpen} 
        onClose={handleCloseModal} 
      />
    </Container>
  );
}
