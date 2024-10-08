const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error while creating order',
      error,
    });
  }
});

// Get Order by ID
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      order,
    });
  } catch (error) {
    console.error(`getOrderByIdController Error: ${error}`);
    return res.status(400).json({
      success: false,
      message: 'Error while fetching order details',
      error,
    });
  }
});

// Update Order to Paid
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      (order.isPaid = true),
        (order.paidAt = Date.now()),
        (order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
        });
      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        error,
      });
    }
  } catch (error) {
    console.error(`updateOrderToPaidController Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error while updating order payment status',
      error,
    });
  }
});

// Update Order to Delivered
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    return res.json({
      success: true,
      message: 'Order delivered successfully',
      updatedOrder,
    });
  } catch (error) {
    console.error(`updateOrderToDeliveredController Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error while updating order delivery status',
      error,
    });
  }
});

// Get Logged In User's Orders
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: 'User orders fetched successfully',
      orders,
    });
  } catch (error) {
    console.error(`getMyOrdersController Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error while fetching user orders',
      error,
    });
  }
});

// Get All Orders (Admin)
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      orders,
    });
  } catch (error) {
    console.error(`getOrdersController Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error while fetching all orders',
      error,
    });
  }
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
