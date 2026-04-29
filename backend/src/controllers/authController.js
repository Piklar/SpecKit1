const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const logout = (req, res) => {
  // Clear token logic is mostly handled on the frontend
  res.json({ message: 'User logged out successfully' });
};

module.exports = { register, login, logout };
