const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

/**
 * TaskController — Feature 004
 * Thin HTTP layer; delegates all logic to TaskService.
 */

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const task = await taskService.createTask(req.user._id, req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByUser(req.user._id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getByDate = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByDate(req.user._id, req.params.date);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user._id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

const toggleCompletion = async (req, res, next) => {
  try {
    const task = await taskService.toggleTaskCompletion(req.params.id, req.user._id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getByDate, update, remove, toggleCompletion };
