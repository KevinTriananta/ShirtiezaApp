import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthContext';

// Pages
const HomePage = lazy(() => import('@pages/HomePage'));
const ProductsPage = lazy(() => import('@pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@pages/ProductDetailPage'));
const CartPage = lazy(() => import('@pages/CartPage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));
const CategoriesPage = lazy(() => import('@pages/CategoriesPage'));
const CategoryPage = lazy(() => import('@pages/CategoryPage'));
const CollectionsPage = lazy(() => import('@pages/CollectionsPage'));
const CollectionPage = lazy(() => import('@pages/CollectionPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));
const OrderDetailPage = lazy(() => import('@pages/OrderDetailPage'));
const CheckoutNowPage = lazy(() => import('@pages/CheckoutNowPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard'));
const AdminProductsPage = lazy(() => import('@pages/admin/AdminProductsPage'));
const AdminUsersPage = lazy(() => import('@pages/admin/AdminUsersPage'));
const AdminOrdersPage = lazy(() => import('@pages/admin/AdminOrdersPage'));
const AdminSettingsPage = lazy(() => import('@pages/admin/AdminSettingsPage'));
const AdminCatalogPage = lazy(() => import('@pages/admin/AdminCatalogPage'));
const AdminVouchersPage = lazy(() => import('@pages/admin/AdminVouchersPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

// Layouts
import Header from '@app/layout/Header';
import Footer from '@app/layout/Footer';
import AdminLayout from '@app/layout/AdminLayout';

interface ProtectedRouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}

function ProtectedRoute({ element, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <RouteLoader label="Authenticating" />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;

  return element;
}

function RouteLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-bold animate-pulse">
          {label}
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Suspense fallback={<RouteLoader />}>
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
            <Route path="/checkout-now/:productId" element={<ProtectedRoute element={<CheckoutNowPage />} />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly element={
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="catalog" element={<AdminCatalogPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="vouchers" element={<AdminVouchersPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Routes>
                </AdminLayout>
              } />
            } />

            {/* Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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
