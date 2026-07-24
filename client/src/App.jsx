import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import CustomerRoute from "./components/CustomerRoute.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import NotFound from "./pages/NotFound.jsx";

// User dashboard (Module 2)
import AccountLayout from "./pages/account/AccountLayout.jsx";
import Profile from "./pages/account/Profile.jsx";
import Orders from "./pages/account/Orders.jsx";
import OrderDetail from "./pages/account/OrderDetail.jsx";
import Wishlist from "./pages/account/Wishlist.jsx";
import Addresses from "./pages/account/Addresses.jsx";

// Admin dashboard (Module 3)
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";


// Root component - defines the layout and all routes
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {!isAdminRoute && <Navbar />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CustomerRoute><Home /></CustomerRoute>} />
          <Route path="/shop" element={<CustomerRoute><Shop /></CustomerRoute>} />
          <Route path="/product/:id" element={<CustomerRoute><ProductDetails /></CustomerRoute>} />
          <Route path="/login" element={<CustomerRoute><Login /></CustomerRoute>} />
          <Route path="/register" element={<CustomerRoute><Register /></CustomerRoute>} />
          <Route path="/cart" element={<CustomerRoute><Cart /></CustomerRoute>} />
          <Route
            path="/checkout"
            element={
              <CustomerRoute>
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              </CustomerRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <CustomerRoute>
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              </CustomerRoute>
            }
          />

          {/* User dashboard - nested routes under /account */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
            <Route path="orders/:id" element={<CustomerRoute><OrderDetail /></CustomerRoute>} />
            <Route path="wishlist" element={<CustomerRoute><Wishlist /></CustomerRoute>} />
            <Route path="addresses" element={<CustomerRoute><Addresses /></CustomerRoute>} />
          </Route>

          {/* Admin dashboard - nested routes under /admin */}
          <Route path="/admin" element={<AdminRoute> <AdminLayout /> </AdminRoute>} >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;