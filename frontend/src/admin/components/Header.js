import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../actions/userActions';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    toast.success('Logged out successfully');
    dispatch(logout());
    navigate('/');
  };
  return (
    <header className="bg-white p-2 flex justify-end items-center shadow-sm">
      <button
        onClick={logoutHandler}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2"
      >
        <FiLogOut className="text-white" size={20} /> {/* White Logout Icon */}
        <span className="font-semibold">Logout</span>
      </button>
    </header>
  );
};

export default Header;
