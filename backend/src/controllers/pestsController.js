const Pest = require('../models/Pest');
const getPests = async (req, res, next) => {
  try {
    const pests = await Pest.find().populate('affectedCrops');
    res.json(pests);
  } catch (error) { next(error); }
};
const getPestById = async (req, res, next) => {
  try {
    const pest = await Pest.findById(req.params.id).populate('affectedCrops');
    if (!pest) return res.status(404).json({ message: 'Not found' });
    res.json(pest);
  } catch (error) { next(error); }
};
module.exports = { getPests, getPestById };
