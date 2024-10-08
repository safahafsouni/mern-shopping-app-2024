const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
  getRelatedProducts,
  searchProducts,
} = require('../controllers/product.controller');
const { requireSignIn, isAdmin } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware');

const router = express.Router();

router.post(
  '/create',
  upload.single('picture'),
  requireSignIn,
  isAdmin,
  createProduct
);
// Get all products
router.get('/', getProducts);

// search product
router.get('/search', searchProducts);

// Get product by ID
router.get('/:id', getProduct);

// Update an existing product
router.put(
  '/update/:id',
  upload.single('picture'),
  requireSignIn,
  isAdmin,
  updateProduct
);

// Delete a specific review
router.delete('/:id/reviews/:reviewId', requireSignIn, deleteProductReview);

// Create a product review
router.post('/:id/reviews', requireSignIn, createProductReview);

// Get all reviews for a product
router.get('/:id/reviews', getProductReviews);

// Delete a product
router.delete('/delete/:id', requireSignIn, deleteProduct);

// Get related products by product ID
router.get('/:id/related', getRelatedProducts);

module.exports = router;
