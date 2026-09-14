import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { fetchWishlist, addWishlist, removeWishlist } from "../../lib/db";

interface WishlistContextValue {
  likedIds: number[];
  isLiked: (id: number) => boolean;
  toggleLike: (id: number) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = "freshgrove-wishlist";

function loadLocal(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState<number[]>(loadLocal);

  // Saat status login berubah: ambil dari DB jika login, atau dari localStorage jika tidak.
  useEffect(() => {
    let active = true;
    if (user) {
      fetchWishlist()
        .then((ids) => {
          if (active) setLikedIds(ids);
        })
        .catch(() => {});
    } else {
      setLikedIds(loadLocal());
    }
    return () => {
      active = false;
    };
  }, [user]);

  // Simpan ke localStorage hanya saat belum login.
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
      } catch {
        /* ignore */
      }
    }
  }, [likedIds, user]);

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((x) => x !== id) : [...prev, id];
      if (user) {
        if (has) removeWishlist(id).catch(() => {});
        else addWishlist(id).catch(() => {});
      }
      return next;
    });
  };

  const isLiked = (id: number) => likedIds.includes(id);

  const value: WishlistContextValue = {
    likedIds,
    isLiked,
    toggleLike,
    count: likedIds.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
