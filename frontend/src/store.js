import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { thunk } from 'redux-thunk';
import {
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productUpdateReducer,
} from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  userDetailsReducer,
  userForgotPasswordReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userResetPasswordReducer,
  userUpdateProfileReducer,
} from './reducers/userReducer';
import {
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListMyReducer,
  orderListReducer,
  orderPayReducer,
} from './reducers/orderReducer';
import {
  categoryCreateReducer,
  categoryDeleteReducer,
  categoryListReducer,
  categoryUpdateReducer,
} from './reducers/categoryReducer';

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

// 'combineReducers' → function is used to combine multiple reducers into a single reducer function that can be passed to the store.
// 'reducers' → functions that handle state changes based on actions
// It’s responsible for handling actions and updating the store’s state accordingly.
const reducer = combineReducers({
  productCreate: productCreateReducer,
  productDetails: productDetailsReducer,
  productList: productListReducer,
  productDelete: productDeleteReducer,
  productUpdate: productUpdateReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  userForgotPassword: userForgotPasswordReducer,
  userResetPassword: userResetPasswordReducer,
  userList: userListReducer,
  categoryList: categoryListReducer,
  categoryCreate: categoryCreateReducer,
  categoryDelete: categoryDeleteReducer,
  categoryUpdate: categoryUpdateReducer,
  orderDeliver: orderDeliverReducer,
  orderList: orderListReducer,
});
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};
// Redux Thunk is a middleware that allows you to write action creators that return a function instead of an action.
// enables you to handle asynchronous actions in your Redux application like fetching data from an API.
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  // enhances the store with middleware and development tools.
  // to debug and track state changes visually.
  // It wraps around applyMiddleware to allow for both middleware and DevTools to work together.
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
