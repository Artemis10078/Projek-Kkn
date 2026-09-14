import { useMemo, useState } from "react";
import { Tag, Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { SkeletonCard } from "./SkeletonCard";
import { Reveal } from "./Reveal";
import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../context/WishlistContext";
import { useLang } from "../context/LanguageContext";
import { CATEGORIES, type Product } from "../../lib/products";

// Re-export tipe untuk kompatibilitas dengan kode lama.
export type { Product as Fruit } from "../../lib/products";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { key: SortKey; labelKey: string }[] = [
  { key: "popular", labelKey: "catalog.sortPopular" },
  { key: "price-asc", labelKey: "catalog.sortPriceAsc" },
  { key: "price-desc", labelKey: "catalog.sortPriceDesc" },
  { key: "rating", labelKey: "catalog.sortRating" },
];

interface CatalogProps {
  onAddToCart: (item: Product, qty?: number) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  // Saring berdasarkan lini produk. Kosong = tampilkan semua.
  productType?: "buah" | "tumbuhan";
  categories?: readonly string[];
  heading?: string;
  eyebrow?: string;
}

export function FruitCatalog({
  onAddToCart,
  searchQuery = "",
  onSearchChange,
  productType,
  categories = CATEGORIES,
  heading = "Katalog Buah Segar",
  eyebrow = "Koleksi Kami",
}: CatalogProps) {
  const { products, loading, source } = useProducts();
  const { isLiked, toggleLike } = useWishlist();
  const { t, tCat } = useLang();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("popular");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter((p) => {
      const pType = p.type ?? "buah";
      const matchType = !productType || pType === productType;
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchType && matchCat && matchSearch;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.reviews - a.reviews;
      }
    });
    return list;
  }, [products, activeCategory, searchQuery, sort, productType]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-1">{eyebrow}</p>
          <h2 className="font-display text-4xl text-foreground">{heading}</h2>
          {source === "supabase" && (
            <span className="inline-block mt-2 text-[11px] text-primary bg-primary-soft px-2 py-0.5 rounded-full">
              {t("catalog.live")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Tag size={14} /> {filtered.length} {t("catalog.products")}
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal className="flex flex-col lg:flex-row gap-3 mb-8">
        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2.5 flex-1 max-w-md">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={t("catalog.searchPlaceholder")}
            className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange?.("")}>
              <X size={15} className="text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                sort === opt.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary"
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Category chips */}
      <Reveal className="flex items-center gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-card text-muted-foreground border-border hover:border-primary"
            }`}
          >
            {tCat(cat)}
          </button>
        ))}
      </Reveal>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">{t("catalog.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <Reveal key={p.id}>
              <ProductCard
                product={p}
                liked={isLiked(p.id)}
                onToggleLike={() => toggleLike(p.id)}
                onAddToCart={() => onAddToCart(p)}
                onView={() => setSelected(p)}
              />
            </Reveal>
          ))}
        </div>
      )}

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={onAddToCart}
          liked={isLiked(selected.id)}
          onToggleLike={() => toggleLike(selected.id)}
        />
      )}
    </section>
  );
}
