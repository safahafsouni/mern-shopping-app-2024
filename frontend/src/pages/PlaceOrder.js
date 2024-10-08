import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutStep from '../components/shared/CheckoutStep';
import { createOrder } from '../actions/orderActions';
import Message from '../components/shared/Message'; // Ensure you import your Message component
import { clearCart } from '../actions/cartActions';

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate; // Add error to destructure the orderCreate state

  // Calculate prices
  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimal(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimal(cart.itemsPrice > 500 ? 0 : 50);
  cart.taxPrice = addDecimal(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
    dispatch(clearCart());
  };

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success]);

  return (
    <div className="container mx-auto p-5">
      <CheckoutStep step1 step2 step3 step4 />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Order Details */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-5 space-y-5">
          {/* Shipping Section */}
          <div className="border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Shipping Address
            </h2>
            <p className="text-sm">
              <strong>Street Address: </strong>
              {cart.shippingAddress.address}
            </p>
            <p className="text-sm">
              <strong>City: </strong>
              {cart.shippingAddress.city}
            </p>
            <p className="text-sm">
              <strong>Postal Code: </strong>
              {cart.shippingAddress.postalCode}
            </p>
            <p className="text-sm">
              <strong>Country: </strong>
              {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Section */}
          <div className="border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Payment Method
            </h2>
            <p className="text-sm">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          {/* Order Items Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Order Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <div>Your Cart is Empty</div>
            ) : (
              <ul className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-3 border-b"
                  >
                    <Link
                      to={`/product/${item.product}`}
                      className="flex items-center"
                    >
                      <img
                        src={item?.picture?.secure_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover mr-3"
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </Link>
                    <span className="text-sm text-gray-500">
                      {item.qty} x ${item.price} = $
                      {(item.qty * item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-gray-50 shadow-lg rounded-lg p-6 self-start">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${cart.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cart.totalPrice}</span>
            </div>
          </div>
          {/* Error Message */}
          {error && <Message variant="error">{error}</Message>}{' '}
          {/* Add error message here */}
          <button
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
            className="bg-green-600 text-white py-2 px-4 mt-4 rounded hover:bg-green-700 w-full text-center"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
