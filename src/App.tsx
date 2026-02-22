import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CompareBar } from "@/components/compare/CompareBar";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Banners from "./pages/admin/Banners";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import SpecialOffers from "./pages/admin/SpecialOffers";
import UsersPage from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import EmailMarketing from "./pages/admin/EmailMarketing";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import BlogPosts from "./pages/admin/BlogPosts";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute requireAdmin><Products /></ProtectedRoute>} />
                  <Route path="/admin/banners" element={<ProtectedRoute requireAdmin><Banners /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><Orders /></ProtectedRoute>} />
                  <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><Categories /></ProtectedRoute>} />
                  <Route path="/admin/offers" element={<ProtectedRoute requireAdmin><SpecialOffers /></ProtectedRoute>} />
                  <Route path="/admin/customers" element={<ProtectedRoute requireAdmin><UsersPage /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>} />
                  <Route path="/admin/email-marketing" element={<ProtectedRoute requireAdmin><EmailMarketing /></ProtectedRoute>} />
                  <Route path="/admin/blog" element={<ProtectedRoute requireAdmin><BlogPosts /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <CompareBar />
              </BrowserRouter>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
