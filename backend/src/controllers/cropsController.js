const Crop = require('../models/Crop');

const getCrops = async (req, res, next) => {
  try {
    const { season } = req.query;
    const filter = season ? { season: { $in: [season, 'all'] } } : {};
    const crops = await Crop.find(filter);
    res.json(crops);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = { getCrops, getCropById };
