import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CustomerPage from './pages/CustomerPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)'
    }}>
      <Header />
      <Box component="main" sx={{ flex: 1, pt: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produits" element={<ProductsPage />} />
          <Route path="/produit/:id" element={<ProductDetailPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/mon-compte" element={<CustomerPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;