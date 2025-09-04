import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import AboutUs from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import ReturnPolicy from './components/ReturnPolicy';
import SafetyStandards from './components/SafetyStandards';
import OrdersList from './pages/OrdersList';
import UpiPayment from './pages/UpiPayment';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Faq from './pages/Faq';
import PartnerHowItWorks from './pages/PartnerHowItWorks';
import PartnerSignup from './pages/PartnerSignup';
import PartnerLoginPage from './pages/PartnerLoginPage';

// Seller components
import SellerDashboard from './layout/SellerDashboardLayout/SellerDashboard';
import AddProducts from './layout/SellerDashboardLayout/AddProduct';
import SellerOrders from './layout/SellerDashboardLayout/SellerOrders';
import SellerProducts from './layout/SellerDashboardLayout/SellerProducts';
import SellerProfile from './layout/SellerDashboardLayout/SellerProfile';

/* ---------------- CUSTOMER LAYOUT ---------------- */
function CustomerLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Header cartItemCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <Outlet />
      <Footer />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ThemeProvider>
            <Router>
              <Routes>

                {/* Customer routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/orders" element={<OrdersList />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/returns" element={<ReturnPolicy />} />
                  <Route path="/safety" element={<SafetyStandards />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/upi" element={<UpiPayment />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/partner/signup" element={<PartnerSignup />} />
                  <Route path="/partner/how-it-works" element={<PartnerHowItWorks />} />
                  <Route path="/partner/faq" element={<Faq />} />
                </Route>

                {/* Seller routes using SellerDashboard layout */}
                <Route element={<SellerDashboard />}>
                  <Route path="/seller/dashboard" element={<></>} /> {/* default dashboard */}
                  <Route path="/seller/add-product" element={<AddProducts />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route path="/seller/products" element={<SellerProducts />} />
                  <Route path="/seller/profile" element={<SellerProfile />} />
                  <Route path="/seller/login" element={<PartnerLoginPage />} />
                </Route>

              </Routes>
            </Router>
          </ThemeProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
