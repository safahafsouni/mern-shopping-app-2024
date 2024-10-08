import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { ToastContainer } from 'react-toastify';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import MyOrders from './pages/MyOrders';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Orders from './admin/pages/Orders';
import Products from './admin/pages/Products';
import Users from './admin/pages/Users';
import Categories from './admin/pages/Categories';
import CreateProduct from './admin/pages/CreateProduct';
import UpdateProduct from './admin/pages/UpdateProduct';
import AdminRoute from './admin/components/AdminRoute';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Header />}
      <ToastContainer autoClose={3000} theme="colored" />
      <Routes>
        {/* Non-protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected routes */}
        <Route
          path="/my-orders"
          element={<ProtectedRoute element={MyOrders} />}
        />
        <Route
          path="/place-order"
          element={<ProtectedRoute element={PlaceOrder} />}
        />
        <Route path="/order/:id" element={<ProtectedRoute element={Order} />} />
        <Route path="/payment" element={<ProtectedRoute element={Payment} />} />
        <Route
          path="/shipping"
          element={<ProtectedRoute element={Shipping} />}
        />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminRoute element={Dashboard} />} />
          <Route path="orders" element={<AdminRoute element={Orders} />} />
          <Route path="products" element={<AdminRoute element={Products} />} />
          <Route path="users" element={<AdminRoute element={Users} />} />
          <Route
            path="categories"
            element={<AdminRoute element={Categories} />}
          />
          <Route
            path="products/create"
            element={<AdminRoute element={CreateProduct} />}
          />
          <Route
            path="products/update/:id"
            element={<AdminRoute element={UpdateProduct} />}
          />
        </Route>
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default App;
