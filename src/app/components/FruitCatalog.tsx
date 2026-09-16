import { useEffect, useMemo, useState } from "react";
import { Tag, Search, X, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
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

// Jumlah produk per halaman. 12 habis dibagi 2, 3, dan 4 sehingga grid
// tetap rapi di semua ukuran layar.
const PAGE_SIZE = 12;

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
  const [page, setPage] = useState(1);

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

  // Paginasi: sebelumnya seluruh hasil dirender sekaligus, sehingga halaman
  // makin berat dan panjang saat katalog bertambah.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Kembali ke halaman 1 setiap kali filter/pencarian/urutan berubah,
  // supaya pengguna tidak terjebak di halaman yang kosong.
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery, sort, productType]);

  const goToPage = (n: number) => {
    setPage(n);
    // Gulir ke awal katalog, bukan ke atas halaman, agar konteks terjaga.
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setActiveCategory("All");
    setSort("popular");
    onSearchChange?.("");
  };

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-1">{eyebrow}</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">{heading}</h2>
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

        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap lg:flex-wrap pb-1 -mx-1 px-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`shrink-0 text-xs px-3 py-2 rounded-full border transition-colors ${
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
      <Reveal className="flex items-center gap-2 overflow-x-auto flex-nowrap sm:flex-wrap mb-10 pb-1 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${
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
        /* Empty state: sebelumnya hanya satu baris teks tanpa jalan keluar.
           Kini ada ikon, saran, dan tombol reset filter. */
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <SearchX size={44} strokeWidth={1.2} className="text-muted-foreground" />
          <p className="text-lg text-foreground">{t("catalog.empty")}</p>
          <p className="text-sm text-muted-foreground max-w-xs">{t("catalog.emptyHint")}</p>
          <button
            onClick={resetFilters}
            className="mt-1 text-sm font-semibold text-primary border border-primary/40 px-5 py-2 rounded-full hover:bg-primary-soft transition-colors"
          >
            {t("catalog.resetFilter")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paged.map((p) => (
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

      {/* Paginasi: hanya muncul bila hasil lebih dari satu halaman. */}
      {!loading && totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-10" aria-label={t("catalog.page")}>
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label={t("aria.prevPage")}
            className="w-9 h-9 rounded-full border border-border bg-card text-foreground flex items-center justify-center hover:border-primary disabled:opacity-40 disabled:hover:border-border transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            // Tampilkan halaman pertama, terakhir, dan sekitar halaman aktif.
            const near = Math.abs(n - safePage) <= 1;
            const edge = n === 1 || n === totalPages;
            if (!near && !edge) {
              if (n === 2 || n === totalPages - 1)
                return (
                  <span key={n} className="text-muted-foreground text-sm px-1">
                    &hellip;
                  </span>
                );
              return null;
            }
            return (
              <button
                key={n}
                onClick={() => goToPage(n)}
                aria-current={n === safePage ? "page" : undefined}
                className={`min-w-9 h-9 px-3 rounded-full border text-sm transition-colors ${
                  n === safePage
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary"
                }`}
              >
                {n}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label={t("aria.nextPage")}
            className="w-9 h-9 rounded-full border border-border bg-card text-foreground flex items-center justify-center hover:border-primary disabled:opacity-40 disabled:hover:border-border transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}

      {!loading && totalPages > 1 && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          {t("catalog.showing")} {(safePage - 1) * PAGE_SIZE + 1}&ndash;
          {Math.min(safePage * PAGE_SIZE, filtered.length)} {t("catalog.of")} {filtered.length}{" "}
          {t("catalog.products")}
        </p>
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
