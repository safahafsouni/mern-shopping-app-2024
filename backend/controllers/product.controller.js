const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const {
  uploadImageOnCloudinary,
  deleteImageOnCloudinary,
} = require('../utils/cloudinary');

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      countInStock,
      rating,
      numReviews,
    } = req.body;

    const picture = req.file?.fieldname;
    const picturePath = req.file?.path;

    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !countInStock ||
      !picture ||
      !picturePath
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Uploading image to Cloudinary
    const { secure_url, public_id } = await uploadImageOnCloudinary(
      picturePath,
      'products'
    );

    if (!secure_url) {
      return res.status(400).json({
        success: false,
        message: 'Error while uploading image',
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      countInStock,
      rating,
      numReviews,
      user: req.user._id,
      picture: {
        secure_url,
        public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while creating product',
      error,
    });
  }
});

// Get All Products with Pagination
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 9; // Number of products per page
  const skip = (page - 1) * limit; // Calculate skip value

  try {
    const totalProducts = await Product.countDocuments(); // Get total product count
    const products = await Product.find({})
      .skip(skip)
      .limit(limit)
      .populate('user', 'name')
      .populate('category', 'name');

    return res.status(200).json({
      success: true,
      total: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      message: 'All products were fetched successfully',
      products,
    });
  } catch (error) {
    console.error(`getProductsController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while fetching products',
      error,
    });
  }
});

// Get Product by ID
const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name')
      .populate('category', 'name');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product details fetched successfully',
      product,
    });
  } catch (error) {
    console.error(`getProductController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while fetching product details',
      error,
    });
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, countInStock } = req.body;

    const picturePath = req.file?.path;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (countInStock) product.countInStock = countInStock;

    let secure_url = product.picture?.secure_url;
    let public_id = product.picture?.public_id;

    // Upload new image if provided
    if (picturePath) {
      const uploadResult = await uploadImageOnCloudinary(
        picturePath,
        'products'
      );
      secure_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;

      // Delete the old image from Cloudinary
      if (product.picture && product.picture.public_id) {
        await deleteImageOnCloudinary(product.picture.public_id);
      }
    }

    // Update product picture
    product.picture = {
      secure_url,
      public_id,
    };

    await product.save();

    res.json({
      success: true,
      message: 'Product details updated successfully!',
      product,
    });
  } catch (error) {
    console.error(`updateProductController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while updating product details',
      error,
    });
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete product image from cloudinary
    if (product.picture && product.picture.public_id) {
      await deleteImageOnCloudinary(product.picture.public_id);
    }

    await Product.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    console.error(`deleteProductController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while deleting product',
      error,
    });
  }
});

// Create Product Review
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product',
    });
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully!',
  });
});

// Get Product Reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Product Review
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const review = product.reviews.id(req.params.reviewId); // Use `id` method to find the review
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Ensure the user has permission to delete the review
  if (review.user.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ message: 'Not authorized to delete this review' });
  }

  // Remove the review
  product.reviews.pull(review._id); // Use pull to remove the review
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length
    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    : 0;

  await product.save();

  res.json({ message: 'Review deleted successfully!' });
});

// Get Related Products by Category
const getRelatedProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find related products excluding the current product
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }, // Exclude the current product
    })
      .populate('user', 'name')
      .populate('category', 'name');

    return res.status(200).json({
      success: true,
      message: 'Related products fetched successfully',
      relatedProducts,
    });
  } catch (error) {
    console.error(`getRelatedProductsController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while fetching related products',
      error,
    });
  }
});

// Search Products
const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query; // Extract the search query from the request

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  try {
    // Perform case-insensitive search in the product name and description
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('user', 'name')
      .populate('category', 'name');

    return res.status(200).json({
      success: true,
      total: products.length,
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    console.error(`searchProductsController Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error while fetching products',
      error: error.message,
    });
  }
});

module.exports = {
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
};
