import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import {
  WaterDrop as HumidityIcon,
  Air as WindIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

export default function WeatherCurrent({ data, loading }) {
  if (loading && !data) {
    return <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1.5 }} />;
  }
  if (!data) return null;

  const iconCode = data.weather?.[0]?.icon;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)',
        border: 'none',
        boxShadow: '0 4px 20px rgba(21, 101, 192, 0.35)',
        color: '#fff',
        overflow: 'visible',
      }}
      aria-label={`Current weather: ${Math.round(data.main?.temp)}°C, ${data.weather?.[0]?.description}`}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, opacity: 0.9 }}>
          <LocationIcon sx={{ fontSize: '0.9rem' }} />
          <Typography variant="caption" fontWeight={600} sx={{ letterSpacing: '0.04em' }}>
            {data.name || 'Your Location'}
          </Typography>
        </Box>

        {/* Temp + Icon row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{ lineHeight: 1, letterSpacing: '-2px', fontSize: { xs: '2.8rem', sm: '3.5rem' } }}
            >
              {Math.round(data.main?.temp)}°C
            </Typography>
            <Typography
              variant="body2"
              sx={{ textTransform: 'capitalize', opacity: 0.9, mt: 0.5 }}
            >
              {data.weather?.[0]?.description}
            </Typography>
          </Box>
          {iconUrl && (
            <img
              src={iconUrl}
              alt={data.weather?.[0]?.description || 'weather icon'}
              style={{ width: 72, height: 72, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}
            />
          )}
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HumidityIcon sx={{ fontSize: '0.9rem', opacity: 0.8 }} />
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {data.main?.humidity}% humidity
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WindIcon sx={{ fontSize: '0.9rem', opacity: 0.8 }} />
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {data.wind?.speed} m/s
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
