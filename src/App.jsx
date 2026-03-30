import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AiRecipe from './pages/AiRecipe';
import Stores from './pages/Stores';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import Orders from './pages/Orders';

import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

// Admin Imports
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminVendors from './pages/admin/AdminVendors';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminSettings from './pages/admin/AdminSettings';
import AdminActivityLog from './pages/admin/AdminActivityLog';

// Delivery Imports
import DeliveryRoute from './components/DeliveryRoute';
import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import AvailableOrders from './pages/delivery/AvailableOrders';
import MyDeliveries from './pages/delivery/MyDeliveries';
import DeliveryMap from './pages/delivery/DeliveryMap';
import DeliveryProfile from './pages/delivery/DeliveryProfile';

// Vendor Imports
import VendorRoute from './components/VendorRoute';
import VendorLayout from './pages/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorAddProduct from './pages/vendor/VendorAddProduct';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorProfile from './pages/vendor/VendorProfile';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Admin Routes - no public Navbar/Footer */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="activity" element={<AdminActivityLog />} />
          </Route>

          {/* Delivery Routes */}
          <Route path="/delivery/*" element={
            <DeliveryRoute>
              <DeliveryLayout />
            </DeliveryRoute>
          }>
            <Route index element={<DeliveryDashboard />} />
            <Route path="available" element={<AvailableOrders />} />
            <Route path="active" element={<MyDeliveries />} />
            <Route path="map" element={<DeliveryMap />} />
            <Route path="profile" element={<DeliveryProfile />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor/*" element={
            <VendorRoute>
              <VendorLayout />
            </VendorRoute>
          }>
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="add-product" element={<VendorAddProduct />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="earnings" element={<VendorEarnings />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>

          {/* Public Routes */}
          <Route path="/*" element={
            <div className="min-h-screen bg-secondary/20 flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/ai-recipe" element={<AiRecipe />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
