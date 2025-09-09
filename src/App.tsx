import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomOrderPage from './pages/CustomOrderPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/TripsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import MessagesPage from './pages/admin/MessagesPage';
import FinancialPage from './pages/admin/FinancialPage';
import SettingsPage from './pages/admin/SettingsPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  return state.user.isAuthenticated ? <>{children}</> : <Navigate to="/admin" />;
};

// Public layout with header and footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />
        <Route path="/products" element={
          <PublicLayout>
            <ProductsPage />
          </PublicLayout>
        } />
        <Route path="/product/:id" element={
          <PublicLayout>
            <ProductDetailPage />
          </PublicLayout>
        } />
        <Route path="/custom-order" element={
          <PublicLayout>
            <CustomOrderPage />
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        } />
        <Route path="/cart" element={
          <PublicLayout>
            <CartPage />
          </PublicLayout>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="trips" element={<AdminProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="financial" element={<FinancialPage />} />
          <Route path="orders" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;