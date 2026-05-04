import { memo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
} from 'date-fns';
import CalendarDay from './CalendarDay';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = memo(function Calendar({
  currentMonth,
  selectedDate,
  onDateSelect,
  tasks = [],
  holidays = [],
}) {
  const handleDayClick = useCallback(
    (day) => onDateSelect(day),
    [onDateSelect]
  );

  const buildWeeks = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const weekCells = [];
      for (let i = 0; i < 7; i++) {
        const fd = format(day, 'yyyy-MM-dd');
        const tasksForDay = tasks.filter(
          (t) => new Date(t.dueDate).toISOString().split('T')[0] === fd
        );
        const holiday = holidays.find((h) => h.date === fd);
        const currentDay = day;

        weekCells.push(
          <Box
            key={day.toISOString()}
            sx={{
              // Each column is exactly 1/7 of grid width
              width: `${100 / 7}%`,
              flexShrink: 0,
              // Left border only on first column to avoid double-borders
              borderLeft: i === 0 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <CalendarDay
              day={currentDay}
              monthStart={monthStart}
              selectedDate={selectedDate}
              tasksForDay={tasksForDay}
              holiday={holiday}
              onClick={handleDayClick}
            />
          </Box>
        );
        day = addDays(day, 1);
      }

      weeks.push(
        <Box key={day.toISOString()} sx={{ display: 'flex', width: '100%' }}>
          {weekCells}
        </Box>
      );
    }

    return weeks;
  };

  return (
    <Box
      role="grid"
      aria-label="Farm calendar"
      sx={{ width: '100%', border: '1px solid', borderColor: 'divider', borderBottom: 'none', borderRight: 'none' }}
    >
      {/* Day-of-week header row */}
      <Box
        role="row"
        sx={{
          display: 'flex',
          width: '100%',
          borderBottom: '2px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        {DAYS_OF_WEEK.map((d, i) => (
          <Box
            key={d}
            role="columnheader"
            aria-label={d}
            sx={{
              width: `${100 / 7}%`,
              flexShrink: 0,
              py: 1,
              textAlign: 'center',
              borderLeft: i === 0 ? 'none' : '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.68rem' }}
            >
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Week rows */}
      <Box role="rowgroup" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {buildWeeks()}
      </Box>
    </Box>
  );
});

export default Calendar;
