import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CropCard({ crop }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {crop.name}
        </Typography>
        <Typography color="text.secondary">
          Season: {crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}
        </Typography>
        <Typography color="text.secondary">
          Water: {crop.waterRequirement}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {crop.description.substring(0, 100)}...
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/crops/${crop._id}`)}>View Details</Button>
      </CardActions>
    </Card>
  );
}
