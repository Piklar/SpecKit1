import { memo } from 'react';
import { Box, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight, Today as TodayIcon } from '@mui/icons-material';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';

const CalendarHeader = memo(function CalendarHeader({ currentMonth, onMonthChange }) {
  const nextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const prevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const goToToday = () => onMonthChange(new Date());

  const isCurrentMonth = isSameMonth(currentMonth, new Date());

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        gap: 1,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      {/* Month / Year label */}
      <Typography
        variant="h5"
        fontWeight="bold"
        component="h2"
        sx={{ flexShrink: 0, minWidth: 180 }}
      >
        {format(currentMonth, 'MMMM yyyy')}
      </Typography>

      {/* Navigation controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* Jump-to-today */}
        {!isCurrentMonth && (
          <Tooltip title="Go to today" arrow>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={goToToday}
              aria-label="Go to current month"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.78rem',
                px: 1.5,
                py: 0.5,
                mr: 0.5,
              }}
            >
              Today
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Previous month" arrow>
          <IconButton
            onClick={prevMonth}
            aria-label="Go to previous month"
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>

        <Tooltip title="Next month" arrow>
          <IconButton
            onClick={nextMonth}
            aria-label="Go to next month"
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
});

export default CalendarHeader;
