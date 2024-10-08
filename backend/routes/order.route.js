const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/auth.middleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/', requireSignIn, createOrder);
router.get('/my-orders', requireSignIn, getMyOrders);
router.get('/all', requireSignIn, isAdmin, getOrders);
router.get('/:id', requireSignIn, getOrderById);
router.put('/:id/pay', requireSignIn, updateOrderToPaid);
router.put('/:id/deliver', requireSignIn, isAdmin, updateOrderToDelivered);

module.exports = router;
