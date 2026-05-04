import { useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(t => (t._id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleTask(taskId);
      setTasks(prev => prev.map(t => (t._id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    refreshTasks: fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask
  };
};
