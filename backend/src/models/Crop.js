const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, enum: ['wet', 'dry', 'all'], required: true },
  growingTimeDays: { type: Number, required: true },
  waterRequirement: { type: String, enum: ['low', 'medium', 'high'], required: true },
  soilType: { type: String, required: true },
  suitableRegions: [{ type: String, default: ['Pampanga'] }],
  description: String,
  type: { type: String },
  farmingTips: { type: String },
  marketPrice: { type: Number },
  endProducts: [{ type: String }],
  pests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pest' }]
});

module.exports = mongoose.model('Crop', cropSchema);
