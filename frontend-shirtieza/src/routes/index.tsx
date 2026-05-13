import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryPage from '../pages/CategoryPage';
import CollectionsPage from '../pages/CollectionsPage';
import CollectionPage from '../pages/CollectionPage';
import ProfilePage from '../pages/ProfilePage';
import OrderDetailPage from '../pages/OrderDetailPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

// Layouts
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AdminLayout from '../layouts/AdminLayout';

interface ProtectedRouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}

function ProtectedRoute({ element, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-bold animate-pulse">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;

  return element;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/orders/:id" element={<ProtectedRoute element={<OrderDetailPage />} />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly element={
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="orders" element={<div className="p-12 text-center text-neutral-400 font-bold uppercase tracking-widest border-2 border-dashed border-neutral-100 rounded-3xl">Orders Management Coming Soon</div>} />
                  <Route path="settings" element={<div className="p-12 text-center text-neutral-400 font-bold uppercase tracking-widest border-2 border-dashed border-neutral-100 rounded-3xl">Settings Coming Soon</div>} />
                </Routes>
              </AdminLayout>
            } />
          } />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

