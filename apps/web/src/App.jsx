import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCart.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import AdminProtectedRoute from '@/components/AdminProtectedRoute.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';
import ExitIntentPopup from '@/components/ExitIntentPopup.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';

import HomePage from '@/pages/HomePage.jsx';
import ShopPage from '@/pages/ShopPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import UserDashboard from '@/pages/UserDashboard.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import BlogPostDetailPage from '@/pages/BlogPostDetailPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import { FAQPage, ContactPage, TrackOrderPage, LegalPage } from '@/pages/StaticPages.jsx';

import ShippingPolicyPage from '@/pages/ShippingPolicyPage.jsx';
import ReturnsExchangePolicyPage from '@/pages/ReturnsExchangePolicyPage.jsx';
import AthleteSponsorship from '@/pages/AthleteSponsorship.jsx';
import AffiliateProgram from '@/pages/AffiliateProgram.jsx';

import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import CollectionsManager from '@/pages/CollectionsManager.jsx';
import UserManagement from '@/pages/UserManagement.jsx';
import AdminAccountSettings from '@/pages/AdminAccountSettings.jsx';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="collections" element={<CollectionsManager />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<AdminAccountSettings />} />
              </Route>

              {/* Public Routes */}
              <Route path="/*" element={
                <div className="flex flex-col min-h-screen bg-background text-foreground">
                  <Header setIsCartOpen={setIsCartOpen} />
                  <main className="flex-grow pb-16 lg:pb-0">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/products" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<LoginPage />} />
                      <Route path="/account" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                      
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      
                      <Route path="/athlete-sponsorship" element={<AthleteSponsorship />} />
                      <Route path="/affiliate-program" element={<AffiliateProgram />} />
                      <Route path="/affiliate" element={<AffiliateProgram />} />
                      
                      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                      <Route path="/returns-policy" element={<ReturnsExchangePolicyPage />} />
                      <Route path="/return-policy" element={<ReturnsExchangePolicyPage />} />
                      
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
                      <Route path="/terms" element={<LegalPage title="Terms & Conditions" />} />

                      <Route path="*" element={
                        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
                          <h1 className="text-8xl font-black text-white mb-4">404</h1>
                          <p className="text-xl text-primary mb-8">This page got crushed under the weight.</p>
                          <a href="/" className="bg-accent text-white font-bold px-8 py-4 rounded-sm tracking-wider uppercase">Return to Base</a>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                  <MobileBottomNav setIsCartOpen={setIsCartOpen} />
                  <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
                  <ExitIntentPopup />
                </div>
              } />
            </Routes>
            <Toaster position="bottom-center" theme="dark" />
          </Router>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;