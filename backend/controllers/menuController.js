const MenuItem = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, available, vegetarian, vegan, glutenFree, search } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (available === 'true') {
      query['availability.isAvailable'] = true;
    }
    
    if (vegetarian === 'true') {
      query.isVegetarian = true;
    }
    
    if (vegan === 'true') {
      query.isVegan = true;
    }
    
    if (glutenFree === 'true') {
      query.isGlutenFree = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const menuItems = await MenuItem.find(query)
      .populate('createdBy', 'name email')
      .sort({ category: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private (Admin/Staff only)
const createMenuItem = async (req, res) => {
  try {
    // Add the user who created this item
    req.body.createdBy = req.user.id;

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin/Staff only)
const updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete menu item (soft delete)
// @route   DELETE /api/menu/:id
// @access  Private (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Soft delete by setting isActive to false
    await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.getByCategory(category)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      category,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update stock quantity
// @route   PATCH /api/menu/:id/stock
// @access  Private (Admin/Staff only)
const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid stock quantity'
      });
    }

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.stock.quantity = quantity;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        id: menuItem._id,
        name: menuItem.name,
        stock: menuItem.stock,
        isLowStock: menuItem.isLowStock()
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle availability
// @route   PATCH /api/menu/:id/availability
// @access  Private (Admin/Staff only)
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.availability.isAvailable = !menuItem.availability.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item ${menuItem.availability.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: {
        id: menuItem._id,
        name: menuItem.name,
        isAvailable: menuItem.availability.isAvailable
      }
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get low stock items
// @route   GET /api/menu/reports/low-stock
// @access  Private (Admin/Staff only)
const getLowStockItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true })
      .populate('createdBy', 'name email');

    const lowStockItems = menuItems.filter(item => item.isLowStock());

    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory,
  updateStock,
  toggleAvailability,
  getLowStockItems
};