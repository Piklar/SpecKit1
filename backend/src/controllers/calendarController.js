const CalendarEvent = require('../models/CalendarEvent');
const getEvents = async (req, res, next) => {
  try {
    const events = await CalendarEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (error) { next(error); }
};
module.exports = { getEvents };
