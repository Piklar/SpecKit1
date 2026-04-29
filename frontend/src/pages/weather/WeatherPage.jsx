import { Box, Container, Typography } from '@mui/material';
import useWeather from '../../hooks/useWeather';
import WeatherCard from '../../components/Cards/WeatherCard';

export default function WeatherPage() {
  const { weather, loading, error } = useWeather();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Localized Weather Forecast
      </Typography>
      <Box sx={{ mt: 2 }}>
        <WeatherCard weather={weather} loading={loading} error={error} />
      </Box>
    </Container>
  );
}
