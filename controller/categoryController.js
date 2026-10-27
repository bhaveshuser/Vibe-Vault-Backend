import Category from "../model/categories.js";


// =====================================
// CREATE CATEGORY
// =====================================

export const createCategory = async (req, res) => {
  try {

    const {
      name,
      description,
      image,
      isActive
    } = req.body;


    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: name,
      isDeleted: false
    });


    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
        status: 0
      });
    }


    // Create category
    const category = await Category.create({
      name,
      description,
      image,
      isActive
    });


    res.status(201).json({
      message: "Category created successfully",
      status: 1,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: 0
    });

  }
};


// =====================================
// GET ALL CATEGORIES
// =====================================

export const getCategories = async (req, res) => {
  try {

    const categories = await Category.find({
      isDeleted: false
    }).sort({
      createdAt: -1
    });


    res.status(200).json({
      message: "Categories fetched successfully",
      status: 1,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: 0
    });

  }
};


// =====================================
// GET SINGLE CATEGORY
// =====================================

export const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false
    });


    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        status: 0
      });
    }


    res.status(200).json({
      message: "Category fetched successfully",
      status: 1,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: 0
    });

  }
};


// =====================================
// UPDATE CATEGORY
// =====================================

export const updateCategory = async (req, res) => {
  try {

    const {
      name,
      description,
      image,
      isActive
    } = req.body;


    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false
    });


    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        status: 0
      });
    }


    // Update category fields
    category.name = name;
    category.description = description;
    category.image = image;


    // Only update isActive if it was provided
    if (isActive !== undefined) {
      category.isActive = isActive;
    }


    await category.save();


    res.status(200).json({
      message: "Category updated successfully",
      status: 1,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: 0
    });

  }
};


// =====================================
// SOFT DELETE CATEGORY
// =====================================

export const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false
    });


    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        status: 0
      });
    }


    // Soft delete
    category.isDeleted = true;
    category.deletedAt = new Date();


    await category.save();


    res.status(200).json({
      message: "Category deleted successfully",
      status: 1
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: 0
    });

  }
};