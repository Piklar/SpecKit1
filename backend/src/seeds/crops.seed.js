const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const dotenv = require('dotenv');

dotenv.config();

const crops = [
  {
    name: 'Rice (Palay)',
    season: 'wet',
    growingTimeDays: 120,
    waterRequirement: 'high',
    soilType: 'Clay loam',
    description: 'Staple crop of Pampanga, best planted during the rainy season.'
  },
  {
    name: 'Corn (Mais)',
    season: 'dry',
    growingTimeDays: 90,
    waterRequirement: 'medium',
    soilType: 'Sandy loam',
    description: 'Common secondary crop during the dry season.'
  },
  {
    name: 'Eggplant (Talong)',
    season: 'all',
    growingTimeDays: 80,
    waterRequirement: 'medium',
    soilType: 'Loam',
    description: 'Hardy vegetable that grows well year-round in Pampanga.'
  }
];

const seedCrops = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agriklima');
    await Crop.deleteMany();
    await Crop.insertMany(crops);
    console.log('Crops seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedCrops();
