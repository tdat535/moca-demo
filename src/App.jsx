import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ZaloButton from './components/ZaloButton';
import PageLoader from './components/PageLoader';
import PromoPopup from './components/PromoPopup';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';

const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const News = lazy(() => import('./pages/News'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

function LazyFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
          <WishlistProvider>
            <ToastProvider>
            <ScrollToTop />
            <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              <Route path="/dang-ky" element={<GuestOnly><Register /></GuestOnly>} />
              <Route
                path="*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <PageLoader />
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/san-pham/:slug" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/dat-hang" element={<Checkout />} />
                        <Route path="/tai-khoan" element={<RequireAuth><Profile /></RequireAuth>} />
                        <Route path="/ve-cua-hang" element={<About />} />
                        <Route path="/tin-tuc" element={<News />} />
                        <Route path="/yeu-thich" element={<Wishlist />} />
                      </Routes>
                    </main>
                    <Footer />
                    <ZaloButton />
                    <BackToTop />
                    <PromoPopup />
                  </div>
                }
              />
            </Routes>
            </Suspense>
          </ToastProvider>
          </WishlistProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
