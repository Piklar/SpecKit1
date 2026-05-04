const mongoose = require('mongoose');

/**
 * Task Schema — Feature 004: Calendar & Weather Integration with Task Management
 *
 * Represents a user-created reminder/task tied to a specific date.
 * Tasks are private to the creating user (userId reference).
 */
const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    dueTime: {
      type: String, // "HH:MM" 24-hour format, optional
      default: null,
    },
    completionStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for efficient per-user per-date queries
taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
