const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true, default: 'Pampanga' },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  description: { type: String, required: true },
  forecast: [{
    date: Date,
    temp: Number,
    description: String
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', weatherSchema);
