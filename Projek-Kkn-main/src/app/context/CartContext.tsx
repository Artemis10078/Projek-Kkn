import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Fruit } from "../../lib/products";
import type { CartItem } from "../components/CartDrawer";

interface CartContextValue {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  addToCart: (fruit: Fruit, qty?: number) => void;
  changeQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "freshgrove-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  // Persist keranjang ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      /* ignore quota errors */
    }
  }, [cartItems]);

  // Batasi qty pada stok yang tersedia (jika stok diketahui).
  const capToStock = (item: CartItem): CartItem => {
    const max = typeof item.stock === "number" ? item.stock : Infinity;
    return { ...item, qty: Math.min(item.qty, Math.max(0, max)) };
  };

  const addToCart = (fruit: Fruit, qty: number = 1) => {
    const max = typeof fruit.stock === "number" ? fruit.stock : Infinity;
    if (max <= 0) return; // stok habis, jangan tambahkan
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === fruit.id);
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, max);
        return prev.map((i) => (i.id === fruit.id ? { ...i, qty: nextQty, stock: fruit.stock } : i));
      }
      return [...prev, { ...fruit, qty: Math.min(qty, max) }];
    });
    setCartOpen(true);
  };

  const changeQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i;
          const max = typeof i.stock === "number" ? i.stock : Infinity;
          return { ...i, qty: Math.min(i.qty + delta, max) };
        })
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id: number) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const value: CartContextValue = {
    cartOpen,
    setCartOpen,
    cartItems,
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
