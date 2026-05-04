import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import Calendar from '../../components/Calendar/Calendar';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import WeatherWidget from '../../components/Weather/WeatherWidget';
import TaskModal from '../../components/Task/TaskModal';
import TaskList from '../../components/Task/TaskList';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useTasks } from '../../hooks/useTasks';
import { useHolidays } from '../../hooks/useHolidays';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [initialDate, setInitialDate] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const currentYear = currentMonth.getFullYear();

  // Custom Hooks
  const { tasks, loading: tasksLoading, error: tasksError, updateTask, toggleTask, deleteTask } =
    useTasks();
  const { holidays, loading: holidaysLoading, error: holidaysError } = useHolidays(currentYear);

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Day Selection
  const handleDateSelect = useCallback((day) => {
    setSelectedDate(day);
    setIsDayViewOpen(true);
  }, []);

  // Month navigation — also clears selected date when changing month
  const handleMonthChange = useCallback((newMonth) => {
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  }, []);

  // Task actions
  const handleAddTaskClick = useCallback(() => {
    setTaskToEdit(null);
    setInitialDate(null);
    setIsTaskModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setInitialDate(null);
    setIsTaskModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(
    async (task) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        try {
          await deleteTask(task._id);
          showToast('Task deleted successfully.');
        } catch {
          showToast('Failed to delete task. Please try again.', 'error');
        }
      }
    },
    [deleteTask, showToast]
  );

  const handleToggleTask = useCallback(
    async (taskId) => {
      try {
        await toggleTask(taskId);
      } catch {
        showToast('Failed to update task status.', 'error');
      }
    },
    [toggleTask, showToast]
  );

  const handleTaskSaveSuccess = useCallback(() => {
    showToast(taskToEdit ? 'Task updated!' : 'Task created!');
  }, [taskToEdit, showToast]);

  // Tasks for selected day
  const tasksForSelectedDay = selectedDate
    ? tasks.filter(
        (t) =>
          new Date(t.dueDate).toISOString().split('T')[0] === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  const isSelectedToday = selectedDate && isToday(selectedDate);

  return (
    <Box sx={{ flexGrow: 1, py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Page header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
            Farm Calendar &amp; Weather
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plan your farm activities, track tasks, and monitor weather conditions.
          </Typography>
        </Box>

        {/* Error banner for tasks */}
        {tasksError && (
          <Alert severity="error" sx={{ mb: 2 }} variant="outlined">
            Could not load tasks: {tasksError}. Your calendar may be incomplete.
          </Alert>
        )}

        {/* Error banner for holidays */}
        {holidaysError && (
          <Alert severity="warning" sx={{ mb: 2 }} variant="outlined">
            Could not load Philippine holidays: {holidaysError}.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Calendar */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
              aria-label="Calendar view"
            >
              {/* Header row: CalendarHeader + Add Task */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 1,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <CalendarHeader
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={handleAddTaskClick}
                  startIcon={<AddIcon />}
                  aria-label="Add a new task"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                  }}
                >
                  Add Task
                </Button>
              </Box>

              {/* Calendar grid or loading skeleton */}
              {tasksLoading && tasks.length === 0 ? (
                <Box>
                  <Grid container spacing={0} sx={{ mb: 1 }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Grid item xs={12 / 7} key={i}>
                        <Skeleton variant="text" sx={{ mx: 1 }} />
                      </Grid>
                    ))}
                  </Grid>
                  <Grid container spacing={0}>
                    {Array.from({ length: 35 }).map((_, i) => (
                      <Grid item xs={12 / 7} key={i}>
                        <Skeleton
                          variant="rectangular"
                          height={90}
                          sx={{ m: 0.25, borderRadius: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Calendar
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  tasks={tasks}
                  holidays={holidays}
                />
              )}

              {/* Legend */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  gap: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 'bold' }}>
                      {new Date().getDate()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Today
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    Pending task
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', opacity: 0.6 }} />
                  <Typography variant="caption" color="text.secondary">
                    Completed task
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    component="span"
                    sx={{ color: 'error.main', fontSize: '1rem', lineHeight: 1 }}
                  >
                    ●
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Holiday
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar: Weather */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
              aria-label="Farm weather conditions"
            >
              <Typography variant="h6" gutterBottom fontWeight="bold" component="h2">
                Farm Conditions
              </Typography>
              {/* Default location: Pampanga (15.0794, 120.62) */}
              <WeatherWidget lat={15.0794} lon={120.62} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Task Create / Edit Modal */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        initialDate={initialDate}
        onSaveSuccess={handleTaskSaveSuccess}
      />

      {/* Day Task View Modal */}
      <Dialog
        open={isDayViewOpen}
        onClose={() => setIsDayViewOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="day-view-title"
      >
        <DialogTitle id="day-view-title" sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography variant="h6" component="span">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
              </Typography>
              {isSelectedToday && (
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    borderRadius: 1,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    verticalAlign: 'middle',
                    letterSpacing: '0.05em',
                  }}
                >
                  TODAY
                </Typography>
              )}
            </Box>
          </Box>
          {tasksForSelectedDay.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {tasksForSelectedDay.filter((t) => t.completionStatus).length} of{' '}
              {tasksForSelectedDay.length} tasks completed
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {tasksLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <ErrorBoundary>
              <TaskList
                tasks={tasksForSelectedDay}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            </ErrorBoundary>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={() => setIsDayViewOpen(false)} variant="outlined" sx={{ textTransform: 'none' }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setTaskToEdit(null);
              setInitialDate(selectedDate);
              setIsTaskModalOpen(true);
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
