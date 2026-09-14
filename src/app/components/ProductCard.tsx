import { ShoppingCart, Heart, Star, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatRupiah, type Product } from "../../lib/products";

interface ProductCardProps {
  product: Product;
  liked: boolean;
  onToggleLike: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onView: (product: Product) => void;
}

export function ProductCard({ product, liked, onToggleLike, onAddToCart, onView }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const badgeStyle = { backgroundColor: product.badgeColor ?? "#2D6A4F", color: "#fff" };
  const hasStockInfo = typeof product.stock === "number";
  const outOfStock = hasStockInfo && (product.stock as number) <= 0;
  const lowStock = hasStockInfo && (product.stock as number) > 0 && (product.stock as number) <= 20;

  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden border border-border hover-lift">
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-square bg-secondary cursor-pointer"
        onClick={() => onView(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="bg-white/95 text-destructive text-xs font-bold px-4 py-1.5 rounded-full shadow">Stok Habis</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span style={badgeStyle} className="text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md w-fit">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md w-fit">
              -{discount}%
            </span>
          )}
        </div>

        {/* Like */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
          aria-label="Suka"
          className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-transform"
        >
          <Heart size={15} className={liked ? "fill-[#E63946] stroke-[#E63946]" : "stroke-foreground"} />
        </button>

        {/* Quick view button */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(product); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 glass text-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-md"
        >
          Lihat Detail
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[11px] text-muted-foreground">{product.origin}</p>
          {outOfStock ? (
            <span className="text-[10px] font-semibold text-destructive">Habis</span>
          ) : lowStock ? (
            <span className="text-[10px] font-semibold text-accent">Stok {product.stock}</span>
          ) : null}
        </div>
        <h3 className="font-display text-foreground mb-1 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} fill="#F4A623" stroke="#F4A623" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[11px] text-muted-foreground line-through">{formatRupiah(product.oldPrice)}</span>
            )}
            <div>
              <span className="font-display text-primary font-semibold">{formatRupiah(product.price)}</span>
              <span className="text-[11px] text-muted-foreground ml-1">/{product.unit}</span>
            </div>
          </div>
          <button
            onClick={() => !outOfStock && onAddToCart(product)}
            disabled={outOfStock}
            aria-label="Tambah ke keranjang"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all text-white ${
              outOfStock
                ? "bg-muted-foreground/40 cursor-not-allowed"
                : "bg-grad-leaf hover:shadow-glow hover:scale-110 active:scale-95"
            }`}
          >
            <ShoppingCart size={15} />
            {!outOfStock && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <Plus size={10} className="text-accent-foreground" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
