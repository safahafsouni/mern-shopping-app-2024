import { toast } from 'react-toastify';
import {
  PRODUCT_LIST_FAILS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DETAILS_FAILS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  ADD_PRODUCT_REVIEW,
  RELATED_PRODUCTS_REQUEST,
  RELATED_PRODUCTS_SUCCESS,
  RELATED_PRODUCTS_FAILS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
} from '../constants/productConstant';
import axios from 'axios';

export const listProducts =
  (page = 1, limit = 9) =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      const { data } = await axios.get(
        `/api/product?page=${page}&limit=${limit}`
      );
      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data.products,
        total: data.total,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAILS,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/product/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAILS,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };

      // Send review to the server
      const { data } = await axios.post(
        `/api/product/${productId}/reviews`,
        review,
        config
      );

      toast.success('Review submitted successfully!');

      // Dispatch action to add the review to the Redux store
      dispatch({
        type: ADD_PRODUCT_REVIEW,
        payload: { productId, review: data },
      });

      return data; // Return the new review data
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

// Delete product review action
export const deleteProductReview =
  (productId, reviewId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };

      await axios.delete(
        `/api/product/${productId}/reviews/${reviewId}`,
        config
      );

      toast.success('Review deleted successfully!');
      dispatch({ type: PRODUCT_DETAILS_REQUEST });

      // Refresh product details after deleting the review
      const { data } = await axios.get(`/api/product/${productId}`);
      dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      toast.error('Failed to delete review');
      dispatch({
        type: PRODUCT_DETAILS_FAILS,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listRelatedProducts = (id) => async (dispatch) => {
  try {
    dispatch({ type: RELATED_PRODUCTS_REQUEST });

    const { data } = await axios.get(`/api/product/${id}/related`);

    dispatch({
      type: RELATED_PRODUCTS_SUCCESS,
      payload: data.relatedProducts,
    });
  } catch (error) {
    dispatch({
      type: RELATED_PRODUCTS_FAILS,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Search Products
export const searchProducts = (query) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const { data } = await axios.get(`/api/product/search?query=${query}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAILS,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.user.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/product/create`,
      productData,
      config
    );

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.user.token}`,
      },
    };

    const { data } = await axios.delete(`/api/product/delete/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct =
  (id, updatedData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/product/update/${id}`,
        updatedData,
        config
      );

      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
