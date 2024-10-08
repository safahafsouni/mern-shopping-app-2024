import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../actions/userActions';
import Message from '../components/shared/Message';
import Loader from '../components/shared/Loader';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector(
    (state) => state.userResetPassword
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, password));
  };

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-center text-2xl mb-6">Reset Password</h2>

        {/* Messages */}
        <div className="mt-4">
          {error && <Message variant="error">{error}</Message>}
          {message && <Message variant="success">{message}</Message>}
          {loading && <Loader />}
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
