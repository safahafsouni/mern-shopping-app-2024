import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  // Get user information from Redux store
  const { userInfo } = useSelector((state) => state.userLogin);

  // Return the component or redirect
  return userInfo ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
