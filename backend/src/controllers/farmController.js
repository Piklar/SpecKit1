const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

const getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ user: req.user._id }).populate('crops').populate('plantedCrops.crop');
    res.json(farms);
  } catch (error) { next(error); }
};

const createFarm = async (req, res, next) => {
  try {
    const farm = await Farm.create({ ...req.body, user: req.user._id });
    res.status(201).json(farm);
  } catch (error) { next(error); }
};

const addCropToFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cropId, plantedDate } = req.body;

    if (!cropId || !plantedDate) {
      return res.status(400).json({ message: 'cropId and plantedDate are required' });
    }

    const farm = await Farm.findOne({ _id: id, user: req.user._id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found or unauthorized' });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Add to new plantedCrops array
    farm.plantedCrops.push({ crop: cropId, plantedDate });
    // Also push to legacy crops array for backward compatibility
    if (!farm.crops.includes(cropId)) {
      farm.crops.push(cropId);
    }
    
    await farm.save();

    res.json(farm);
  } catch (error) {
    next(error);
  }
};

module.exports = { getFarms, createFarm, addCropToFarm };
