const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All filds are required',
    });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    });
  } else {
    console.log(`registerController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error in registerController',
      error,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All filds are required',
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email not registered',
      });
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.log(`loginController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error in loginController',
      error,
    });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch users who are not admins
    const users = await User.find({ isAdmin: false }).select('-password');

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No user found',
      });
    }

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error while fetching users',
      error: error.message,
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error while getting user profile',
      error,
    });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
    }
    const updateUser = await user.save();
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updateUser: {
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser._id),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error while updating profile',
      error,
    });
  }
});

// Forget Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Save token hash to user with expiration time
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  // Email message
  const message = `You are receiving this email because you requested a password reset. Click the link below to reset your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: 'Error sending email',
    });
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    token: generateToken(user._id),
  });
});

module.exports = {
  login,
  register,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
