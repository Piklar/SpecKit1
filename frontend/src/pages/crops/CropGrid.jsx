import { Grid, Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function CropGrid({ crops, onOpenModal }) {
  if (!crops || crops.length === 0) return null;

  return (
    <Grid container spacing={3}>
      {crops.map((crop) => (
        <Grid item xs={12} sm={6} md={4} key={crop._id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                  {crop.name}
                </Typography>
                {crop.type && <Chip label={crop.type} size="small" color="primary" variant="outlined" />}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" /> {crop.growingTimeDays}d
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WaterDropIcon fontSize="small" /> {crop.waterRequirement}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {crop.description?.substring(0, 100)}
                {crop.description?.length > 100 ? '...' : ''}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => onOpenModal(crop)}
                sx={{ borderRadius: 2 }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
