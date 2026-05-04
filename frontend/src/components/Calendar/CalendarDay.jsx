import { memo } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { isSameDay, isSameMonth, format, isToday } from 'date-fns';

// Fixed height for every cell — the key to symmetry
const CELL_HEIGHT = 96;

const CalendarDay = memo(function CalendarDay({
  day,
  monthStart,
  selectedDate,
  tasksForDay = [],
  holiday,
  onClick,
}) {
  const isCurrentMonth = isSameMonth(day, monthStart);
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const isTodayDate = isToday(day);
  const taskCount = tasksForDay.length;

  const dayLabel = `${format(day, 'MMMM d, yyyy')}${isTodayDate ? ', today' : ''}${
    holiday ? `, holiday: ${holiday.name}` : ''
  }${taskCount > 0 ? `, ${taskCount} task${taskCount > 1 ? 's' : ''}` : ''}`;

  return (
    <Box
      component="button"
      onClick={() => onClick(day)}
      aria-label={dayLabel}
      aria-pressed={isSelected}
      aria-current={isTodayDate ? 'date' : undefined}
      sx={{
        // ─── Reset button defaults ───────────────────────────────
        all: 'unset',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        cursor: 'pointer',

        // ─── Fixed dimensions — every cell identical ─────────────
        width: '100%',
        height: CELL_HEIGHT,
        overflow: 'hidden',

        // ─── Borders ────────────────────────────────────────────
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',

        // ─── Padding ─────────────────────────────────────────────
        p: '6px 8px',

        // ─── Background ──────────────────────────────────────────
        bgcolor: isTodayDate
          ? '#e8f4ff'
          : isSelected
          ? 'primary.50'
          : !isCurrentMonth
          ? '#fafafa'
          : 'background.paper',

        // ─── Today: left accent bar ───────────────────────────────
        borderLeft: isTodayDate ? '3px solid' : '1px solid',
        borderLeftColor: isTodayDate ? 'primary.main' : 'divider',

        // ─── Selected: outline ───────────────────────────────────
        outline: isSelected ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: '-2px',

        // ─── Opacity for out-of-month days ───────────────────────
        opacity: isCurrentMonth ? 1 : 0.38,

        // ─── Hover ───────────────────────────────────────────────
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          bgcolor: isTodayDate ? '#d4ecff' : 'action.hover',
          boxShadow: 'inset 0 0 0 2px rgba(25,118,210,0.25)',
          zIndex: 1,
          position: 'relative',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '-2px',
          zIndex: 2,
          position: 'relative',
        },
      }}
    >
      {/* ── Row 1: Day number + holiday icon ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Day number badge */}
        {isTodayDate ? (
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem', lineHeight: 1 }}
            >
              {format(day, 'd')}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            fontWeight={isSelected ? 700 : 400}
            color={isCurrentMonth ? 'text.primary' : 'text.disabled'}
            sx={{ lineHeight: 1.2, minWidth: 20, textAlign: 'center' }}
          >
            {format(day, 'd')}
          </Typography>
        )}

        {/* Holiday red dot */}
        {holiday && (
          <Tooltip title={holiday.name} placement="top" arrow>
            <Box
              component="span"
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: 'error.main',
                flexShrink: 0,
                display: 'block',
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* ── Row 2: Holiday name (single line, truncated) ── */}
      {holiday && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            fontSize: '0.6rem',
            lineHeight: 1.3,
            mt: '2px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block',
            flexShrink: 0,
            maxWidth: '100%',
          }}
        >
          {holiday.name}
        </Typography>
      )}

      {/* ── Spacer pushes task dots to bottom ── */}
      <Box sx={{ flexGrow: 1 }} />

      {/* ── Row 3: Task dots (pinned to bottom) ── */}
      {taskCount > 0 && (
        <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden', flexShrink: 0 }}>
          {/* Show up to 5 dots, then "+N" */}
          {tasksForDay.slice(0, 5).map((t, i) => (
            <Box
              key={t._id || i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: t.completionStatus ? 'success.main' : 'primary.main',
                opacity: t.completionStatus ? 0.6 : 1,
                flexShrink: 0,
              }}
            />
          ))}
          {taskCount > 5 && (
            <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', lineHeight: 1 }}>
              +{taskCount - 5}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
});

export default CalendarDay;
