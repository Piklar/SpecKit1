import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Chip, Grid, Divider,
  FormControl, InputLabel, Select, MenuItem, TextField, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function CropModal({ crop, open, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [plantedDate, setPlantedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user farms when modal opens and user is logged in
  useEffect(() => {
    if (open && user && crop) {
      const fetchFarms = async () => {
        try {
          const res = await api.get('/api/farm');
          const userFarms = res.data;
          setFarms(userFarms);
          if (userFarms.length > 0) {
            // Default to most recently updated farm
            const sortedFarms = [...userFarms].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setSelectedFarm(sortedFarms[0]._id);
          }
        } catch (err) {
          console.error('Failed to fetch farms:', err);
        }
      };
      fetchFarms();
      // Set default date to today
      setPlantedDate(new Date().toISOString().split('T')[0]);
      setError('');
      setSuccess('');
    }
  }, [open, user, crop]);

  const handleAddToFarm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedFarm || !plantedDate) {
      setError('Please select a farm and planting date.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post(`/api/farm/${selectedFarm}/crops`, {
        cropId: crop._id,
        plantedDate
      });
      setSuccess(`Successfully added ${crop.name} to your farm!`);
      // Optionally wait a bit before closing
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add crop to farm');
    } finally {
      setLoading(false);
    }
  };

  if (!crop) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          {crop.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip label={`Type: ${crop.type || 'N/A'}`} size="small" />
          <Chip label={`Season: ${crop.season}`} size="small" variant="outlined" />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="body1" paragraph>
              {crop.description}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Farming Tips & Tricks
            </Typography>
            <Typography variant="body2" paragraph>
              {crop.farmingTips || 'No specific tips available.'}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              End Products
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {crop.endProducts && crop.endProducts.length > 0 ? (
                crop.endProducts.map((ep, i) => (
                  <Chip key={i} label={ep} size="small" sx={{ bgcolor: 'grey.200' }} />
                ))
              ) : (
                <Typography variant="body2">N/A</Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Estimated Grow Time</Typography>
              <Typography variant="h6" gutterBottom>{crop.growingTimeDays} Days</Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle2" color="text.secondary">Market Price (est.)</Typography>
              <Typography variant="h6">₱{crop.marketPrice?.toFixed(2) || '0.00'} / kg</Typography>
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Add to My Farm
            </Typography>
            
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!user ? (
              <Alert severity="info" action={
                <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                  Log In
                </Button>
              }>
                Please log in to track crops on your farm.
              </Alert>
            ) : farms.length === 0 ? (
              <Alert severity="warning" action={
                <Button color="inherit" size="small" onClick={() => navigate('/farm/add')}>
                  Create
                </Button>
              }>
                You don't have any farms yet.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Farm</InputLabel>
                  <Select
                    value={selectedFarm}
                    label="Select Farm"
                    onChange={(e) => setSelectedFarm(e.target.value)}
                  >
                    {farms.map(f => (
                      <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Planting Date"
                  type="date"
                  size="small"
                  value={plantedDate}
                  onChange={(e) => setPlantedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={handleAddToFarm}
                  disabled={loading || !selectedFarm || !plantedDate}
                >
                  {loading ? 'Adding...' : 'Add to Farm'}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
