import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

export default function WeatherCard({ weather, loading, error }) {
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weather) return null;

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Current Weather in {weather.location}
        </Typography>
        <Typography variant="h3" component="div">
          {weather.temperature}°C
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {weather.description} | Humidity: {weather.humidity}%
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
