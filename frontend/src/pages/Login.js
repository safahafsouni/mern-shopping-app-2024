import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Icon for profile
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import Message from '../components/shared/Message';
import Loader from '../components/shared/Loader';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      toast.success(userInfo.message);
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(login(email, password));
    } else {
      setMessage('Please fill in both fields');
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        {/* Profile Icon */}
        <div className="flex justify-center items-center mb-6">
          <FaUserCircle size={80} className="text-red-500" />
        </div>

        {/* Messages */}
        <div className="mt-4">
          {error && <Message variant="error">{error}</Message>}
          {loading && <Loader />}
          {message && <Message variant="error">{message}</Message>}
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-red-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Login
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-gray-700">
            New here?{' '}
            <Link
              to="/register"
              className="text-red-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
