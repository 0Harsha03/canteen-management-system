const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory,
  updateStock,
  toggleAvailability,
  getLowStockItems
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

// Protected routes - Admin and Staff only
router.use(protect); // Protect all routes below this middleware

// Reports - Admin and Staff only
router.get('/reports/low-stock', authorize('admin', 'staff'), getLowStockItems);

// CRUD operations - Admin and Staff only
router.post('/', authorize('admin', 'staff'), createMenuItem);
router.put('/:id', authorize('admin', 'staff'), updateMenuItem);
router.patch('/:id/stock', authorize('admin', 'staff'), updateStock);
router.patch('/:id/availability', authorize('admin', 'staff'), toggleAvailability);

// Delete - Admin only
router.delete('/:id', authorize('admin'), deleteMenuItem);

module.exports = router;