import "../styles/fonts.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { KerisPage } from "./pages/KerisPage";
import { WisataPage } from "./pages/WisataPage";
import { BuahPage } from "./pages/BuahPage";
import { TumbuhanPage } from "./pages/TumbuhanPage";
import { LoginPage } from "./pages/LoginPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { WishlistPage } from "./pages/WishlistPage";
import  ContactPage  from "./pages/ContactPage";
// BARU: halaman 404 + error boundary global (tidak mengubah halaman lain).
import { NotFoundPage } from "./pages/NotFoundPage";
// Halaman legal: wajib ada karena situs mengumpulkan data pribadi & pembayaran.
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouteFallback } from "./components/RouteFallback";

// Code splitting: HANYA dashboard admin yang dipisah dari bundle utama.
// Halaman publik (Home, kategori, checkout) tetap dimuat langsung agar
// pengunjung tidak pernah melihat kedipan. Admin berisi recharts + tabel
// besar yang tidak pernah dibuka pengunjung biasa.
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/keris" element={<KerisPage />} />
                <Route path="/wisata" element={<WisataPage />} />
                <Route path="/buah" element={<BuahPage />} />
                <Route path="/tumbuhan" element={<TumbuhanPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/kontak" element={<ContactPage />} />
                <Route path="/privasi" element={<PrivacyPage />} />
                <Route path="/syarat-ketentuan" element={<TermsPage />} />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Suspense
                        fallback={
                          <RouteFallback
                            eyebrow="Admin"
                            title="Memuat Dashboard"
                            subtitle="Menyiapkan data pesanan dan produk."
                          />
                        }
                      >
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all: alamat tidak dikenal -> 404, bukan layar kosong */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
