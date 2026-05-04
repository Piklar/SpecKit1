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
    description: 'Staple crop of Pampanga, best planted during the rainy season.',
    type: 'Cereal',
    farmingTips: 'Ensure continuous flooding during early vegetative stage. Apply nitrogen fertilizer in splits.',
    marketPrice: 25.50,
    endProducts: ['White rice', 'Rice flour', 'Rice bran']
  },
  {
    name: 'Corn (Mais)',
    season: 'dry',
    growingTimeDays: 90,
    waterRequirement: 'medium',
    soilType: 'Sandy loam',
    description: 'Common secondary crop during the dry season.',
    type: 'Cereal',
    farmingTips: 'Plant seeds 1-2 inches deep. Requires full sun and well-drained soil.',
    marketPrice: 18.00,
    endProducts: ['Corn kernels', 'Cornmeal', 'Animal feed']
  },
  {
    name: 'Eggplant (Talong)',
    season: 'all',
    growingTimeDays: 80,
    waterRequirement: 'medium',
    soilType: 'Loam',
    description: 'Hardy vegetable that grows well year-round in Pampanga.',
    type: 'Fruit-bearing',
    farmingTips: 'Stake the plants to support heavy fruits. Watch out for fruit and shoot borers.',
    marketPrice: 60.00,
    endProducts: ['Fresh eggplant', 'Grilled eggplant (Tortang Talong)']
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
