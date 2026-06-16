import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  SEED_PRODUCTS,
  mapRowToProduct,
  type Product,
} from "../../lib/products";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  /** sumber data aktif: "supabase" jika berhasil dari DB, "seed" jika fallback lokal */
  source: "supabase" | "seed";
  refetch: () => void;
}

/**
 * Mengambil produk secara hybrid:
 * 1. Coba ambil dari tabel Supabase `products`.
 * 2. Jika gagal / kosong / tabel belum ada, gunakan SEED_PRODUCTS lokal.
 * Dengan begitu katalog SELALU tampil meski DB belum dikonfigurasi.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "seed">("seed");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (!active) return;

        if (error || !data || data.length === 0) {
          setProducts(SEED_PRODUCTS);
          setSource("seed");
        } else {
          setProducts(data.map(mapRowToProduct));
          setSource("supabase");
        }
      } catch {
        if (!active) return;
        setProducts(SEED_PRODUCTS);
        setSource("seed");
      } finally {
        if (active) {
          // beri sedikit jeda agar skeleton terlihat halus
          setTimeout(() => active && setLoading(false), 350);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [tick]);

  return { products, loading, source, refetch: () => setTick((t) => t + 1) };
}
