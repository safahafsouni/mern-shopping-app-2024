import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import Message from '../components/shared/Message';
import Loader from '../components/shared/Loader';

const UserProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, message: successMessage } = userUpdateProfile;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails(userInfo.user._id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, user, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch
    dispatch(updateUserProfile({ id: user._id, name, email, password }));
  };

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold mb-8">
          Update My Profile
        </h1>

        {/* Messages */}
        <div className="mt-4">
          {error && <Message variant="error">{error}</Message>}
          {success && <Message variant="success">{successMessage}</Message>}
          {loading && <Loader />}
          {message && <Message variant="error">{message}</Message>}
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-lg">
              Name
            </label>
            <input
              type="text"
              id="name" // Added id
              className="w-full px-4 py-3 border rounded-md focus:outline-none"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-lg">
              Email
            </label>
            <input
              type="email"
              id="email" // Added id
              className="w-full px-4 py-3 border rounded-md focus:outline-none"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-lg">
              Password
            </label>
            <input
              type="password"
              id="password" // Added id
              className="w-full px-4 py-3 border rounded-md focus:outline-none"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-lg"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword" // Added id
              className="w-full px-4 py-3 border rounded-md focus:outline-none"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserProfile;
