const Task = require('../models/Task');

/**
 * TaskService — Feature 004
 * Business logic layer for Task CRUD operations.
 */

/**
 * Create a new task for a user.
 * @param {string} userId
 * @param {{ title, description, dueDate, dueTime }} data
 */
const createTask = async (userId, { title, description, dueDate, dueTime }) => {
  return Task.create({ userId, title, description, dueDate, dueTime });
};

/**
 * Get all tasks for a user, sorted by dueDate ascending.
 * @param {string} userId
 */
const getTasksByUser = async (userId) => {
  return Task.find({ userId }).sort({ dueDate: 1, dueTime: 1 });
};

/**
 * Get tasks for a specific date (date-only match).
 * @param {string} userId
 * @param {string|Date} date
 */
const getTasksByDate = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return Task.find({ userId, dueDate: { $gte: start, $lte: end } }).sort({ dueTime: 1 });
};

/**
 * Update a task by ID (only if it belongs to the user).
 * @param {string} taskId
 * @param {string} userId
 * @param {object} updates
 */
const updateTask = async (taskId, userId, updates) => {
  const allowedFields = ['title', 'description', 'dueDate', 'dueTime', 'completionStatus'];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowedFields.includes(k))
  );
  return Task.findOneAndUpdate({ _id: taskId, userId }, filtered, { new: true, runValidators: true });
};

/**
 * Delete a task by ID (only if it belongs to the user).
 * @param {string} taskId
 * @param {string} userId
 */
const deleteTask = async (taskId, userId) => {
  return Task.findOneAndDelete({ _id: taskId, userId });
};

/**
 * Toggle the completionStatus of a task.
 * @param {string} taskId
 * @param {string} userId
 */
const toggleTaskCompletion = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) return null;
  task.completionStatus = !task.completionStatus;
  return task.save();
};

module.exports = { createTask, getTasksByUser, getTasksByDate, updateTask, deleteTask, toggleTaskCompletion };
