const express = require('express');
const {
  register,
  login,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/user.controller');
const { requireSignIn, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', requireSignIn, updateUserProfile);
router.get('/all', requireSignIn, isAdmin, getAllUsers);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/:id', requireSignIn, getUserProfile);

module.exports = router;
