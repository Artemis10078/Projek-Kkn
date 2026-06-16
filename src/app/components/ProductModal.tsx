import { useEffect, useState } from "react";
import { X, Star, Minus, Plus, ShoppingCart, Leaf, MapPin, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatRupiah, type Product } from "../../lib/products";
import { ReviewsSection } from "./ReviewsSection";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  liked: boolean;
  onToggleLike: (id: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart, liked, onToggleLike }: ProductModalProps) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (product) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const nutrition = product.nutrition;
  const badgeStyle = { backgroundColor: product.badgeColor ?? "#2D6A4F", color: "#fff" };
  const maxStock = typeof product.stock === "number" ? product.stock : Infinity;
  const outOfStock = maxStock <= 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-up" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 glass rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[320px] bg-secondary overflow-hidden">
            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span style={badgeStyle} className="text-xs font-semibold px-3 py-1 rounded-full shadow-md w-fit">{product.badge}</span>
              )}
              {discount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md w-fit">Hemat {discount}%</span>
              )}
            </div>
          </div>

          {/* Detail */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <MapPin size={13} /> {product.origin}
              <span className="mx-1">·</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">{product.category}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star size={15} fill="#F4A623" stroke="#F4A623" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} ulasan)</span>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary-soft text-primary px-2.5 py-1 rounded-full">
                    <Leaf size={11} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {nutrition && (
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                  { label: "Kalori", value: nutrition.calories, unit: "" },
                  { label: "Vit C", value: nutrition.vitaminC, unit: "mg" },
                  { label: "Serat", value: nutrition.fiber, unit: "g" },
                  { label: "Gula", value: nutrition.sugar, unit: "g" },
                ].map((n) => (
                  <div key={n.label} className="text-center bg-secondary rounded-xl py-2">
                    <div className="text-sm font-semibold text-foreground">{n.value ?? "-"}{n.unit}</div>
                    <div className="text-[10px] text-muted-foreground">{n.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto">
              <div className="flex items-end gap-2 mb-4">
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formatRupiah(product.oldPrice)}</span>
                )}
                <span className="font-display text-2xl text-primary font-semibold">{formatRupiah(product.price)}</span>
                <span className="text-xs text-muted-foreground mb-1">/{product.unit}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Qty stepper */}
                <div className="flex items-center gap-3 bg-secondary rounded-full px-2 py-1.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
                    disabled={qty >= maxStock}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => onToggleLike(product.id)}
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Heart size={17} className={liked ? "fill-[#E63946] stroke-[#E63946]" : "stroke-foreground"} />
                </button>

                <button
                  onClick={() => { if (!outOfStock) { onAddToCart(product, qty); onClose(); } }}
                  disabled={outOfStock}
                  className={`flex-1 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
                    outOfStock
                      ? "bg-muted-foreground/40 cursor-not-allowed"
                      : "bg-grad-leaf hover:shadow-glow active:scale-95"
                  }`}
                >
                  <ShoppingCart size={16} /> {outOfStock ? "Stok Habis" : `Tambah · ${formatRupiah(product.price * qty)}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <ReviewsSection productId={product.id} />
        </div>
      </div>
    </div>
  );
}
