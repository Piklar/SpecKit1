const mongoose = require('mongoose');
const farmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sizeHectares: { type: Number },
  crops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }],
  plantedCrops: [{
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    plantedDate: { type: Date, required: true }
  }]
}, { timestamps: true });
module.exports = mongoose.model('Farm', farmSchema);
