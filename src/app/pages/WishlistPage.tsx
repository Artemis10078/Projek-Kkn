import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../hooks/useProducts";
import { type Product } from "../../lib/products";

export function WishlistPage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { likedIds, isLiked, toggleLike } = useWishlist();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    changeQty,
    removeFromCart,
    totalCount,
    addToCart,
  } = useCart();
  const [selected, setSelected] = useState<Product | null>(null);

  const likedProducts = useMemo(
    () => products.filter((p) => likedIds.includes(p.id)),
    [products, likedIds],
  );

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar cartCount={totalCount} onCartClick={() => setCartOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-grad-citrus flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Wishlist</h1>
            <p className="text-sm text-muted-foreground">Buah favorit yang Anda simpan</p>
          </div>
        </div>

        {likedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Heart size={48} strokeWidth={1.2} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Wishlist Anda masih kosong.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-grad-leaf text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-glow transition-all"
            >
              Jelajahi Buah
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {likedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                liked={isLiked(p.id)}
                onToggleLike={toggleLike}
                onAddToCart={(prod) => addToCart(prod, 1)}
                onView={setSelected}
              />
            ))}
          </div>
        )}
      </div>

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

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={(prod, qty) => {
          addToCart(prod, qty);
          setSelected(null);
        }}
        liked={selected ? isLiked(selected.id) : false}
        onToggleLike={toggleLike}
      />
    </div>
  );
}
