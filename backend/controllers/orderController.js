const Order = require('../models/Order');
const MenuItem = require('../models/Menu');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, specialRequests } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate and get menu items
    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item ${item.menuItem} not found`
        });
      }

      if (!menuItem.isActive || !menuItem.availability.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is not available`
        });
      }

      if (menuItem.stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${menuItem.name}. Available: ${menuItem.stock.quantity}`
        });
      }

      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        specialInstructions: item.specialInstructions || ''
      });
    }

    // Calculate tax and total (you can adjust tax rate as needed)
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      orderSummary: {
        subtotal,
        tax,
        total
      },
      paymentMethod,
      specialRequests,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        updatedBy: req.user.id
      }]
    });

    // Calculate estimated pickup time
    order.calculateEstimatedPickupTime();
    await order.save();

    // Update stock for ordered items
    for (const item of orderItems) {
      await MenuItem.findByIdAndUpdate(
        item.menuItem,
        { $inc: { 'stock.quantity': -item.quantity } }
      );
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone studentId')
      .populate('items.menuItem', 'name category preparationTime');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.menuItem', 'name category image')
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone studentId')
      .populate('items.menuItem', 'name category image preparationTime')
      .populate('assignedStaff', 'name email')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all orders (Admin/Staff)
// @route   GET /api/orders
// @access  Private (Admin/Staff)
const getAllOrders = async (req, res) => {
  try {
    const { status, date, customer } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (customer) {
      query.customer = customer;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone studentId')
      .populate('items.menuItem', 'name category')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin/Staff)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Assign staff to order if not already assigned
    if (!order.assignedStaff) {
      order.assignedStaff = req.user.id;
    }

    await order.updateStatus(status, req.user.id, notes);

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone studentId')
      .populate('assignedStaff', 'name email');

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private (Customer for own orders, Admin/Staff for any)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role === 'customer' && order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can't cancel if already completed or cancelled
    if (['completed', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Restore stock for cancelled items
    for (const item of order.items) {
      await MenuItem.findByIdAndUpdate(
        item.menuItem,
        { $inc: { 'stock.quantity': item.quantity } }
      );
    }

    await order.updateStatus('cancelled', req.user.id, 'Order cancelled by user');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add rating to completed order
// @route   PATCH /api/orders/:id/rate
// @access  Private (Customer)
const rateOrder = async (req, res) => {
  try {
    const { score, comment } = req.body;
    
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if customer owns this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this order'
      });
    }

    // Can only rate completed orders
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed orders'
      });
    }

    // Check if already rated
    if (order.rating.score) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been rated'
      });
    }

    order.rating = {
      score,
      comment: comment || '',
      ratedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order rated successfully',
      data: order.rating
    });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get today's orders
// @route   GET /api/orders/today
// @access  Private (Admin/Staff)
const getTodaysOrders = async (req, res) => {
  try {
    const orders = await Order.getTodaysOrders();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get today\'s orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Private (Admin/Staff)
const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.getByStatus(status);

    res.status(200).json({
      success: true,
      status,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  rateOrder,
  getTodaysOrders,
  getOrdersByStatus
};