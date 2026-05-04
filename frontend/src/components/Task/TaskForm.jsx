import { useState, useEffect } from 'react';
import { Box, TextField, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function TaskForm({ task, initialDate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: ''
  });

  useEffect(() => {
    if (task && task._id) {
      // Format date for date input (YYYY-MM-DD)
      const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: dateStr,
        dueTime: task.dueTime || ''
      });
    } else if (initialDate) {
      const dateStr = new Date(initialDate).toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        dueDate: dateStr,
        dueTime: ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        dueTime: ''
      });
    }
  }, [task, initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = task && task._id;

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            required
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 1000 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              required
              label="Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="dueTime"
              type="time"
              value={formData.dueTime}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
}
