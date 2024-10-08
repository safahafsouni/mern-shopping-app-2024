import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_CLEAR_ITEMS,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstant';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/product/${id}`);

    // Check if product data exists
    if (data.success) {
      const product = data.product; // Extract product details

      const payload = {
        product: product._id,
        name: product.name,
        price: product.price,
        countInStock: product.countInStock,
        picture: {
          secure_url: product.picture?.secure_url,
          public_id: product.picture?.public_id,
        },
        qty,
      };

      dispatch({
        type: CART_ADD_ITEM,
        payload,
      });

      localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
      );
    } else {
      console.error('Failed to fetch product:', data.message);
    }
  } catch (error) {
    console.error('Error adding to cart:', error); // Catch any errors from the API
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_CLEAR_ITEMS });
  localStorage.removeItem('cartItems');
};
