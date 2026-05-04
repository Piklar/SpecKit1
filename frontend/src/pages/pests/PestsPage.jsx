import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useState } from 'react';
import usePests from '../../hooks/usePests';
import PestList from '../../components/Pests/PestList';
import PestModal from '../../components/Pests/PestModal';

export default function PestsPage() {
  const { pests, loading, error } = usePests();
  const [selectedPest, setSelectedPest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (pest) => {
    setSelectedPest(pest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPest(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Pest Directory
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Identify common agricultural pests and learn mitigation strategies.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PestList pests={pests} onOpenModal={handleOpenModal} />
      )}

      <PestModal 
        pest={selectedPest} 
        open={modalOpen} 
        onClose={handleCloseModal} 
      />
    </Container>
  );
}
