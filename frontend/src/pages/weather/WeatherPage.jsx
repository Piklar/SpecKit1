import { Container, Typography } from '@mui/material';
import WeatherWidget from '../../components/Weather/WeatherWidget';

export default function WeatherPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Localized Weather Forecast
      </Typography>
      <WeatherWidget lat={15.0794} lon={120.62} />
    </Container>
  );
}
