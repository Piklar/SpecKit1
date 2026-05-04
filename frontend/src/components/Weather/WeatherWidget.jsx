import { Box, CircularProgress, Typography, Button, Skeleton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useWeather } from '../../hooks/useWeather';
import WeatherCurrent from './WeatherCurrent';
import WeatherForecast from './WeatherForecast';

export default function WeatherWidget({ lat, lon }) {
  const { current, forecast, loading, error, refreshWeather } = useWeather(lat, lon);

  if (loading && !current) {
    return (
      <Box aria-label="Loading weather data" aria-busy="true">
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1.5 }} />
        <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ flex: 1, borderRadius: 1 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error && !current) {
    return (
      <Box
        role="alert"
        sx={{
          p: 2,
          bgcolor: 'error.50',
          border: '1px solid',
          borderColor: 'error.light',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography color="error" variant="body2" gutterBottom>
          ⚠️ Unable to load weather data.
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          {error}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={refreshWeather}
          sx={{ textTransform: 'none' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <WeatherCurrent data={current} loading={loading} />
      <WeatherForecast data={forecast} />
    </Box>
  );
}
