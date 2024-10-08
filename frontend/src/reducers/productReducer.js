import {
  ADD_PRODUCT_REVIEW,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_RESET,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAILS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAILS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  RELATED_PRODUCTS_FAILS,
  RELATED_PRODUCTS_REQUEST,
  RELATED_PRODUCTS_SUCCESS,
} from '../constants/productConstant';

export const productListReducer = (
  state = { products: [], total: 0, currentPage: 1, totalPages: 1 },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload,
        total: action.total,
        currentPage: action.currentPage,
        totalPages: action.totalPages,
      };
    case PRODUCT_LIST_FAILS:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] }, relatedProducts: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAILS:
      return { loading: false, error: action.payload };
    case RELATED_PRODUCTS_REQUEST:
      return { ...state, loadingRelated: true };
    case RELATED_PRODUCTS_SUCCESS:
      return {
        ...state,
        loadingRelated: false,
        relatedProducts: action.payload,
      };
    case RELATED_PRODUCTS_FAILS:
      return {
        ...state,
        loadingRelated: false,
        relatedProductsError: action.payload,
      };
    case ADD_PRODUCT_REVIEW:
      return {
        ...state,
        product: {
          ...state.product,
          reviews: [...state.product.reviews, action.payload.review],
        },
      };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        message: action.payload.message,
        product: action.payload.product,
      };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {}; // Reset state
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DELETE_RESET:
      return {}; // Reset the state
    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        message: action.payload.message,
        product: action.payload.product,
      };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
