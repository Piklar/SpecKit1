/**
 * CalendarWidget.jsx — Feature 002 / Phase 5 / T035
 * Lists upcoming CalendarEvent items (next 30 days).
 * Empty state: "No upcoming tasks" message.
 */

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
} from '@mui/material';

const typeConfig = {
  planting:    { label: 'Planting',    color: 'success' },
  harvest:     { label: 'Harvest',     color: 'warning' },
  maintenance: { label: 'Maintenance', color: 'info'    },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * @param {{ events: object[] }} props
 */
export default function CalendarWidget({ events = [] }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          📅 Upcoming Tasks
        </Typography>

        {events.length === 0 ? (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">No upcoming tasks in the next 30 days.</Typography>
            <Typography variant="caption">
              Go to the Calendar page to add planting or harvest events.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {events.map((event, idx) => {
              const cfg = typeConfig[event.type] ?? typeConfig.maintenance;
              return (
                <Box key={event._id ?? idx}>
                  <ListItem disableGutters sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" fontWeight={500}>
                            {event.title}
                          </Typography>
                          <Chip
                            label={cfg.label}
                            color={cfg.color}
                            size="small"
                            sx={{ fontSize: 10 }}
                          />
                        </Box>
                      }
                      secondary={formatDate(event.date)}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  {idx < events.length - 1 && <Divider component="li" />}
                </Box>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
