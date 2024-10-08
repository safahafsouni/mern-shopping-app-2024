const Category = require('../models/category.model');
const slugify = require('slugify');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: 'Category name is required',
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }
    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
    });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.log(`creteCategoryController Error ${error}`);
    res.status(400).json({
      success: false,
      message: 'Error while creating category',
      error,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }
    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.log(`updateCategoryController Error ${error}`);
    res.status(400).json({
      success: false,
      message: 'Error while updating category',
      error,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (error) {
    console.log(`getCategoriesController Error ${error}`);
    res.status(400).json({
      success: false,
      message: 'Error while fetching categories',
      error,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: true,
        message: 'Category not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      category,
    });
  } catch (error) {
    console.log(`getCategoryController Error ${error}`);
    res.status(400).json({
      success: false,
      message: 'An error occurred while fetching the category',
      error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });

    if (!category) {
      res.status(404).json({
        success: true,
        message: 'Category not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.log(`deleteCategoryController Error ${error}`);
    res.status(400).json({
      success: false,
      message: 'Error while deleting category',
      error,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
};
