const Farm = require('../models/Farm');
const getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ user: req.user._id }).populate('crops');
    res.json(farms);
  } catch (error) { next(error); }
};
const createFarm = async (req, res, next) => {
  try {
    const farm = await Farm.create({ ...req.body, user: req.user._id });
    res.status(201).json(farm);
  } catch (error) { next(error); }
};
module.exports = { getFarms, createFarm };
