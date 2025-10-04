const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  rateOrder,
  getTodaysOrders,
  getOrdersByStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), createOrder);
router.get('/my-orders', authorize('customer'), getMyOrders);
router.patch('/:id/rate', authorize('customer'), rateOrder);

// Shared routes (Customer can access their own, Staff/Admin can access any)
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Staff and Admin routes
router.get('/', authorize('admin', 'staff'), getAllOrders);
router.get('/today', authorize('admin', 'staff'), getTodaysOrders);
router.get('/status/:status', authorize('admin', 'staff'), getOrdersByStatus);
router.patch('/:id/status', authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;