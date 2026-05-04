import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';

export default function CropHero({ crop, onOpenModal }) {
  if (!crop) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="overline" color="success.main" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpaIcon fontSize="small" /> Most Recommended for Current Season
        </Typography>
        <Grid container spacing={3} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="text.primary">
              {crop.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 3, maxWidth: 600 }}>
              {crop.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Paper elevation={0} sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                <Typography variant="caption" display="block" color="text.secondary">Type</Typography>
                <Typography variant="body1" fontWeight="medium">{crop.type || 'N/A'}</Typography>
              </Paper>
              <Paper elevation={0} sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                <Typography variant="caption" display="block" color="text.secondary">Grow Time</Typography>
                <Typography variant="body1" fontWeight="medium">{crop.growingTimeDays} Days</Typography>
              </Paper>
            </Box>
            <Button 
              variant="contained" 
              color="success" 
              size="large" 
              onClick={() => onOpenModal(crop)}
              sx={{ borderRadius: 2, px: 4 }}
            >
              View Full Details
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
