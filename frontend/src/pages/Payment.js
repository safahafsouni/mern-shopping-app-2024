import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutStep from '../components/shared/CheckoutStep';
import { Radio } from 'antd'; // Using Ant Design Radio for selection

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Redirect to shipping if shipping address is not set
  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order'); // Redirect to the place order page
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <CheckoutStep step1 step2 step3 />
      <h1 className="text-2xl font-bold text-center mb-6">Payment Method</h1>
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <h2 className="mb-2">Select Payment Method</h2>
          <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
            className="flex flex-col"
          >
            <Radio value="paypal" className="mb-2">
              Paypal or Credit Card
            </Radio>
            {/* Add more payment options here if needed */}
          </Radio.Group>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Continue to Place Order
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
