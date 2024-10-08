import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa'; // Icon for email
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/userActions';
import Message from '../components/shared/Message';
import Loader from '../components/shared/Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector(
    (state) => state.userForgotPassword
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-center text-2xl mb-6">Forgot Password</h2>

        {/* Messages */}
        <div className="mt-4">
          {error && <Message variant="error">{error}</Message>}
          {message && <Message variant="success">{message}</Message>}
          {loading && <Loader />}
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
