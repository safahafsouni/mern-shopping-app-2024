import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Message from '../components/shared/Message';
import Loader from '../components/shared/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import axios from 'axios';
import { ORDER_PAY_RESET } from '../constants/orderConstant';
import { PayPalButton } from 'react-paypal-button-v2';

const Order = () => {
  const { id: orderId } = useParams();
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  useEffect(() => {
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, order, successPay]);

  const successPaymentHandler = (paymentResult) => {
    // Payment success logic
    console.log('Payment Successful:', paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  if (!loading) {
    // Calculate prices
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="error">{error}</Message>
  ) : (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Order {order._id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-5 space-y-5">
          {/* Shipping Section */}
          <div className="border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Shipping
            </h2>
            <p>
              <strong>Name: </strong>
              {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>
              {order.user.email}
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalcode},{' '}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered On {order.deliveredAt}
              </Message>
            ) : (
              <Message variant="error">Not Delivered</Message>
            )}
          </div>

          {/* Payment Section */}
          <div className="border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Payment Method
            </h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">Paid On {order.paidAt}</Message>
            ) : (
              <Message variant="error">Not Paid</Message>
            )}
          </div>

          {/* Order Items Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Order Items
            </h2>
            {order.orderItems.length === 0 ? (
              <Message>Your Cart is Empty</Message>
            ) : (
              <ul className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-3 border-b"
                  >
                    <div className="flex items-center">
                      <img
                        src={item?.picture?.secure_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover mr-3"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="text-sm text-gray-600"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <span>
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
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {/* PayPal Button Section */}
          {!order.isPaid && (
            <div className="mt-4">
              {loadingPay && <Loader />}
              {!sdkReady ? (
                <Loader />
              ) : (
                <PayPalButton
                  amount={order.totalPrice}
                  onSuccess={successPaymentHandler}
                />
              )}
            </div>
          )}

          {error && <Message variant="error">{error}</Message>}
        </div>
      </div>
    </div>
  );
};

export default Order;
