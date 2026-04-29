const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, enum: ['wet', 'dry', 'all'], required: true },
  growingTimeDays: { type: Number, required: true },
  waterRequirement: { type: String, enum: ['low', 'medium', 'high'], required: true },
  soilType: { type: String, required: true },
  suitableRegions: [{ type: String, default: ['Pampanga'] }],
  description: String
});

module.exports = mongoose.model('Crop', cropSchema);
