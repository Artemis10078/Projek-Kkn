import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Package, ScanLine, X, ShoppingBag, Clock } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { fetchMyOrders, type OrderRow } from "../../lib/db";
import { formatRupiah } from "../../lib/products";

export const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-600",
  paid: "bg-blue-500/15 text-blue-600",
  processing: "bg-purple-500/15 text-purple-600",
  shipped: "bg-indigo-500/15 text-indigo-600",
  completed: "bg-green-500/15 text-green-600",
  cancelled: "bg-red-500/15 text-red-600",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    changeQty,
    removeFromCart,
    totalCount,
  } = useCart();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrisOrder, setQrisOrder] = useState<OrderRow | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyOrders()
      .then((o) => setOrders(o))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar cartCount={totalCount} onCartClick={() => setCartOpen(true)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-grad-leaf flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Pesanan Saya</h1>
            <p className="text-sm text-muted-foreground">Riwayat dan status pesanan Anda</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-10 text-center">Memuat pesanan...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <ShoppingBag size={48} strokeWidth={1.2} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-grad-leaf text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-glow transition-all"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-border rounded-3xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{o.order_id}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {formatDate(o.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      STATUS_STYLE[o.status] || "bg-secondary text-foreground"
                    }`}
                  >
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-border pt-3">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {it.name} <span className="text-xs">x{it.quantity}</span>
                      </span>
                      <span className="text-foreground">{formatRupiah(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border mt-3 pt-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-lg text-foreground font-semibold">
                    {formatRupiah(o.total)}
                  </span>
                </div>

                {o.status === "pending" && (
                  <button
                    onClick={() => setQrisOrder(o)}
                    className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-grad-citrus text-white text-sm font-semibold px-4 py-2 rounded-full hover:shadow-glow transition-all"
                  >
                    <ScanLine size={14} /> Bayar Sekarang (QRIS)
                  </button>
                )}
              </div>
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

      {/* Modal QRIS */}
      {qrisOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setQrisOrder(null)} />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl p-6 text-center">
            <button
              onClick={() => setQrisOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X size={16} />
            </button>
            <h2 className="font-display text-xl text-foreground mb-1">Pembayaran QRIS</h2>
            <p className="text-xs text-muted-foreground mb-4">{qrisOrder.order_id}</p>
            <div className="bg-white rounded-2xl p-3 inline-block shadow-sm">
              <img src="/qris.jpeg" alt="QRIS" className="w-56 h-56 object-contain mx-auto" />
            </div>
            <p className="font-display text-2xl text-primary font-semibold mt-3">
              {formatRupiah(qrisOrder.total)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              Scan dengan aplikasi e-wallet / m-banking. Setelah membayar, tunggu admin
              memverifikasi pesanan Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
