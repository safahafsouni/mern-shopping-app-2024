import React, { useState } from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Import icons
import { addToCart } from '../actions/cartActions';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, qty));
    toast.success('Item added to cart!');
  };

  return (
    <div className="bg-white p-4 shadow rounded relative border">
      <Link to={`/product/${product._id}`}>
        <img
          alt={product.name}
          src={product?.picture.secure_url}
          className="w-full h-48 object-contain mb-4"
        />
      </Link>
      <Link to={`/product/${product._id}`}>
        <h3 className="text-lg font-semibold">{product.name}</h3>
      </Link>
      <p className="text-gray-500">${product.price}</p>
      <div className="flex items-center mt-2">
        <Rating value={product.rating} />
        <span className="text-gray-500 ml-2">
          {product.numReviews} review{product.numReviews > 1 ? 's' : ''}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addToCartHandler}
          className={`flex items-center justify-center py-2 px-4 text-sm font-semibold border rounded-md transition duration-200 ease-in-out ${
            product.countInStock > 0
              ? 'bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={product.countInStock === 0}
        >
          <FaShoppingCart className="mr-1" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
