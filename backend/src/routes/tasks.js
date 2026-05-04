const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authenticateJWT = require('../middleware/authenticateJWT');
const { create, getAll, getByDate, update, remove, toggleCompletion } = require('../controllers/taskController');

// All task routes require authentication
router.use(authenticateJWT);

// POST /api/tasks — Create a new task
router.post(
  '/',
  [
    body('title').notEmpty().trim().withMessage('Title is required').isLength({ max: 200 }),
    body('dueDate').isISO8601().withMessage('dueDate must be a valid ISO date'),
    body('description').optional().isLength({ max: 1000 }),
    body('dueTime').optional().matches(/^\d{2}:\d{2}$/).withMessage('dueTime must be in HH:MM format'),
  ],
  create
);

// GET /api/tasks — Get all tasks for current user
router.get('/', getAll);

// GET /api/tasks/date/:date — Get tasks for a specific date (YYYY-MM-DD)
router.get('/date/:date', getByDate);

// PUT /api/tasks/:id — Update a task
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().trim().isLength({ max: 200 }),
    body('dueDate').optional().isISO8601(),
    body('description').optional().isLength({ max: 1000 }),
    body('dueTime').optional({ nullable: true }).matches(/^\d{2}:\d{2}$/).withMessage('dueTime must be in HH:MM format'),
    body('completionStatus').optional().isBoolean(),
  ],
  update
);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', remove);

// PATCH /api/tasks/:id/toggle — Toggle completion status
router.patch('/:id/toggle', toggleCompletion);

module.exports = router;
