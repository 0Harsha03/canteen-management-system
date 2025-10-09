const express = require('express');
const router = express.Router();

// Import individual route modules
const authRoutes = require('./auth');
const menuRoutes = require('./menu');
const orderRoutes = require('./orders');

// Mount routes
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Canteen Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      health: '/health'
    }
  });
});

module.exports = router;