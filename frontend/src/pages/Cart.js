import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { Button } from 'antd'; // Import Button from Ant Design
import emptycart from '../assets/images/emptycart.png';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const increaseQty = (id, qty, countInStock) => {
    const newQty = qty + 1;
    if (newQty > countInStock) return;
    dispatch(addToCart(id, newQty));
  };

  const decreaseQty = (id, qty) => {
    const newQty = qty - 1;
    if (newQty <= 0) return;
    dispatch(addToCart(id, newQty));
  };

  const checkout = () => {
    if (userInfo) {
      navigate('/shipping'); // Navigate to shipping if logged in
    } else {
      navigate('/login'); // Navigate to login if not logged in
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">SHOPPING CART</h1>
            <div className="bg-white shadow-md rounded-lg p-4">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-5 gap-4 border-b pb-2 font-semibold">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Subtotal</span>
                <span className="text-right">Remove</span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center border-b py-2"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 col-span-1 lg:col-span-1">
                    <img
                      src={item?.picture?.secure_url}
                      alt={item.name}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product}`}
                        className="text-sm font-semibold"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center text-base font-medium hidden lg:block">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center space-x-2 col-span-1 lg:col-span-1">
                    <Button
                      onClick={() => decreaseQty(item.product, item.qty)}
                      disabled={item.qty <= 1} // Disable when qty is 1
                      shape="circle"
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      className="w-12 text-center border"
                      value={item.qty}
                      readOnly
                    />
                    <Button
                      onClick={() =>
                        increaseQty(item.product, item.qty, item.countInStock)
                      }
                      disabled={item.qty >= item.countInStock} // Disable when qty reaches countInStock
                      shape="circle"
                    >
                      +
                    </Button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right text-base font-medium hidden lg:block">
                    ${(item.qty * item.price).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-end col-span-1 lg:col-span-1">
                    <Button
                      onClick={() => removeFromCartHandler(item.product)}
                      shape="circle"
                      style={{ color: 'red' }} // Change trash icon color to red
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 font-medium">Total items :</span>
                <span className="text-lg font-medium text-gray-600">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="w-full bg-red-600 flex items-center justify-center space-x-2 text-white font-semibold py-3 hover:bg-red-800 transition-colors mt-4"
                disabled={cartItems.length === 0}
                onClick={checkout}
              >
                <FaShoppingCart className="text-lg" />
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Full-page empty cart image
        <div className="flex justify-center items-center h-screen">
          <img
            src={emptycart}
            alt="Empty Cart"
            className="h-96 w-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
