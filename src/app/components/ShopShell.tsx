import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "./Navbar";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { useCart } from "../context/CartContext";
import type { Product } from "../../lib/products";

interface ShellApi {
  addToCart: (item: Product, qty?: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

// Kerangka halaman publik: Navbar + konten + Footer + Keranjang.
// Dipakai ulang oleh Beranda, Buah, Tumbuhan, Keris, dan Panahan.
export function ShopShell({
  children,
  navOverDark = false,
}: {
  children: (api: ShellApi) => ReactNode;
  navOverDark?: boolean | "photo";
}) {
  const navigate = useNavigate();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    addToCart,
    changeQty,
    removeFromCart,
    totalCount,
  } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar
        cartCount={totalCount}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        overDark={navOverDark}
      />
      {children({ addToCart, searchQuery, setSearchQuery })}
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onQtyChange={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />
    </div>
  );
}
