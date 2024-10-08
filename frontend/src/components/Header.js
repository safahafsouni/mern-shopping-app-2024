import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { toast } from 'react-toastify';
import { Dropdown, Menu } from 'antd';
import { searchProducts } from '../actions/productActions';

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { cartItems } = useSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState('');

  const logoutHandler = () => {
    toast.success('Logged out successfully');
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
      setSearchQuery(''); // Clear the search input after submitting
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile" className="text-gray-700">
          Profile
        </Link>
      </Menu.Item>
      <Menu.Item
        key={userInfo && userInfo.user.isAdmin ? 'dashboard' : 'my-orders'}
      >
        <Link
          to={userInfo && userInfo.user.isAdmin ? '/admin' : '/my-orders'}
          className="text-gray-700"
        >
          {userInfo && userInfo.user.isAdmin ? 'Dashboard' : 'My Orders'}
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <button
          onClick={logoutHandler}
          className="w-full text-left text-gray-700"
        >
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-gray-800">
          <Link to={'/'}>e-SHOP</Link>
        </div>
        <div className="relative flex-1 mx-6">
          <form className="flex" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaSearch className="absolute top-3 right-6 text-red-500" />
          </form>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-600 transition duration-300 ease-in-out" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs w-5 h-5 bg-red-600 rounded-full flex justify-center items-center text-white">
                {cartItems.length}
              </span>
            )}
          </Link>
          {userInfo ? (
            <Dropdown overlay={menu} trigger={['click']}>
              <button className="flex items-center space-x-2 py-2 px-3 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out">
                {/* Display user icon only on small screens */}
                <FaUser className="text-lg text-gray-700" />
                {/* Display user name only on larger screens */}
                <span className="hidden md:block text-gray-700 font-semibold">
                  {userInfo.user.name}
                </span>
              </button>
            </Dropdown>
          ) : (
            <Link to={'/login'}>
              <button className="block px-4 py-2 border-2 border-gray-500 text-gray-700 font-semibold rounded-full hover:border-red-600 hover:text-white hover:bg-red-600 transition duration-300 ease-in-out">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-12 py-4 text-sm font-bold text-gray-600">
        <Link
          to={'/'}
          className="hover:underline hover:text-red-600 transition duration-300"
        >
          Home
        </Link>
        <Link
          to={'/shop'}
          className="hover:underline hover:text-red-600 transition duration-300"
        >
          Shop
        </Link>
        <Link
          to={'/contact'}
          className="hover:underline hover:text-red-600 transition duration-300"
        >
          Contact
        </Link>
        <Link
          to={'/about'}
          className="hover:underline hover:text-red-600 transition duration-300"
        >
          About
        </Link>
      </div>
    </nav>
  );
};

export default Header;
