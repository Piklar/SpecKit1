const mongoose = require('mongoose');
const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['planting', 'harvest', 'maintenance'], required: true },
  description: String
});
module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
