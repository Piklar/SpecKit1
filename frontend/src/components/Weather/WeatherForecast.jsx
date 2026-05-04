import { Box, Typography, Card, CardContent } from '@mui/material';
import { format } from 'date-fns';

export default function WeatherForecast({ data }) {
  if (!data || !data.list) return null;

  // The API returns 3-hour intervals, we'll grab one per day (e.g., at index 0, 8, 16...)
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        5-Day Forecast
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {dailyForecasts.map((day, i) => (
          <Card key={i} variant="outlined" sx={{ minWidth: 100, textAlign: 'center', flex: 1 }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(day.dt * 1000), 'EEE')}
              </Typography>
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                alt={day.weather[0].description}
                style={{ width: 40, height: 40 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {Math.round(day.main.temp)}°C
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
