import { Dialog, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import TaskForm from './TaskForm';
import { useTasks } from '../../hooks/useTasks';

export default function TaskModal({ open, onClose, taskToEdit = null, initialDate = null, onSaveSuccess }) {
  const { addTask, updateTask } = useTasks();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      if (taskToEdit && taskToEdit._id) {
        await updateTask(taskToEdit._id, formData);
      } else {
        await addTask(formData);
      }
      onSaveSuccess && onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <TaskForm task={taskToEdit} initialDate={initialDate} onSubmit={handleSubmit} onCancel={onClose} />
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
