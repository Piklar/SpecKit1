import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  if (!task) return null;

  const isCompleted = Boolean(task?.completionStatus);

  return (
    <ListItem
      divider
      alignItems="flex-start"
      secondaryAction={
        <Box>
          <IconButton
            edge="end"
            aria-label={`Edit task "${task?.title || 'Untitled'}"`}
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            size="small"
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            edge="end"
            aria-label={`Delete task "${task?.title || 'Untitled'}"`}
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{
        opacity: isCompleted ? 0.65 : 1,
        transition: 'opacity 0.2s ease, background 0.15s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        pr: 12, // room for action buttons
      }}
    >
      <Checkbox
        checked={isCompleted}
        onChange={(e) => { e.stopPropagation(); onToggle(task._id); }}
        color="primary"
        size="small"
        aria-label={`Mark "${task?.title || 'Untitled'}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        sx={{ mt: 0.5, mr: 0.5 }}
      />

      <ListItemText
        primary={
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.disabled' : 'text.primary',
              lineHeight: 1.4,
            }}
          >
            {task?.title || 'Untitled Task'}
          </Typography>
        }
        secondary={
          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.4 }}>
            {Boolean(task?.dueTime) && (
              <Typography variant="caption" color="text.secondary">
                🕒 {task.dueTime}
              </Typography>
            )}
            {Boolean(task?.description) && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.description}
              </Typography>
            )}
            {isCompleted && (
              <Chip
                label="Done"
                size="small"
                color="success"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', height: 18, fontSize: '0.6rem' }}
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );
}
