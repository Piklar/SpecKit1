import { Card, CardContent, CardMedia, Typography, Box, Button, Chip } from '@mui/material';

export default function PestItem({ pest, onOpenModal }) {
  const imageUrl = pest.images && pest.images.length > 0 
    ? pest.images[0] 
    : 'https://images.unsplash.com/photo-1616016147492-b430cc36e2f1?auto=format&fit=crop&w=400&q=80';

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={pest.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
            {pest.name}
          </Typography>
          <Chip label={pest.classification || 'Pest'} size="small" color="error" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          mb: 2
        }}>
          {pest.description}
        </Typography>
        
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => onOpenModal(pest)}
            fullWidth
            color="secondary"
          >
            View Mitigation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
