const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');

const requireSignIn = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    try {
      token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not Authorized , Token failed');
    }
  if (!token) {
    res.status(401);
    throw new Error('Not Authorized, not token');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      res.status(403);
      throw new Error('Unauthorized access');
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Error in admin middleware');
  }
});

module.exports = { requireSignIn, isAdmin };
