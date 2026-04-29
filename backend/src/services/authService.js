const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

module.exports = { registerUser, loginUser };
