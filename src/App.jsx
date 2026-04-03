import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AiRecipe from './pages/AiRecipe';
import RecipeHistory from './pages/RecipeHistory';
import Stores from './pages/Stores';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import Orders from './pages/Orders';
import AccessDenied from './pages/AccessDenied';

import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

// Protected & Public Route Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Admin Imports
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
import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import AvailableOrders from './pages/delivery/AvailableOrders';
import MyDeliveries from './pages/delivery/MyDeliveries';
import DeliveryMap from './pages/delivery/DeliveryMap';
import DeliveryProfile from './pages/delivery/DeliveryProfile';

// Vendor Imports
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
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
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
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Delivery Routes */}
          <Route path="/delivery/*" element={
            <ProtectedRoute allowedRoles={['delivery']}>
              <DeliveryLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DeliveryDashboard />} />
            <Route path="available" element={<AvailableOrders />} />
            <Route path="active" element={<MyDeliveries />} />
            <Route path="map" element={<DeliveryMap />} />
            <Route path="profile" element={<DeliveryProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor/*" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="add-product" element={<VendorAddProduct />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="earnings" element={<VendorEarnings />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Access Denied Route */}
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Public Routes with restriction for administrative roles */}
          <Route path="/*" element={
            <PublicRoute>
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
                    <Route path="/recipe-history" element={<RecipeHistory />} />
                    <Route path="/stores" element={<Stores />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/notifications" element={<Notifications />} />
                    
                    {/* Protected Client-only Routes */}
                    <Route path="/orders" element={
                      <ProtectedRoute allowedRoles={['client']}>
                        <Orders />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </PublicRoute>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
