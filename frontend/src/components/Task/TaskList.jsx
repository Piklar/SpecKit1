import { List, Typography, Box } from '@mui/material';
import { EventNote as EventNoteIcon } from '@mui/icons-material';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0) {
    return (
      <Box
        sx={{
          py: 5,
          px: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
        }}
        role="status"
        aria-label="No tasks for this day"
      >
        <EventNoteIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          No tasks for this day
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Click &ldquo;Add Task&rdquo; to schedule something here.
        </Typography>
      </Box>
    );
  }

  const pending = tasks.filter((t) => !t.completionStatus);
  const completed = tasks.filter((t) => t.completionStatus);

  return (
    <List disablePadding aria-label={`Task list: ${tasks.length} task${tasks.length > 1 ? 's' : ''}`}>
      {/* Pending tasks first */}
      {pending.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}

      {/* Completed tasks at bottom with divider */}
      {completed.length > 0 && pending.length > 0 && (
        <Box sx={{ px: 2, py: 0.5 }}>
          <Typography variant="caption" color="text.disabled" fontWeight={600}>
            COMPLETED ({completed.length})
          </Typography>
        </Box>
      )}
      {completed.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </List>
  );
}
