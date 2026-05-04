const mongoose = require('mongoose');
const pestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classification: { type: String, required: true, default: 'Unknown' },
  description: { type: String, required: true },
  mitigation: { type: String, required: true },
  affectedCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }]
});
module.exports = mongoose.model('Pest', pestSchema);
