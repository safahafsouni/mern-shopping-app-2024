const {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const { requireSignIn, isAdmin } = require('../middlewares/auth.middleware');

const express = require('express');

const router = express.Router();

router.post('/create', requireSignIn, isAdmin, createCategory);

router.put('/update/:slug', requireSignIn, isAdmin, updateCategory);

router.get('/all', getCategories);

router.delete('/delete/:slug', requireSignIn, isAdmin, deleteCategory);

router.get('/:slug', getCategory);

module.exports = router;
