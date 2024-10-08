import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ element: Component, ...rest }) => {
  // Get user information from Redux store
  const { userInfo } = useSelector((state) => state.userLogin);

  // Check if user is an admin
  return userInfo && userInfo.user.isAdmin ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute;
