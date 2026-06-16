import { X, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { formatRupiah, type Product } from "../../lib/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLang } from "../context/LanguageContext";

export interface CartItem extends Product {
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (id: number, delta: number) => void;
  onRemove?: (id: number) => void;
  onCheckout?: () => void;
}

const FREE_SHIPPING_MIN = 200000;

export function CartDrawer({ open, onClose, items, onQtyChange, onRemove, onCheckout }: CartDrawerProps) {
  const { t } = useLang();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const remaining = Math.max(0, FREE_SHIPPING_MIN - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_MIN) * 100);
  const progressStyle = { width: `${progress}%` };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm animate-fade-in-up" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <h2 className="font-display text-foreground">{t("cart.title")}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Truck size={13} className="text-primary" />
              {remaining > 0 ? (
                <>{t("cart.addMore1")} <span className="text-primary font-semibold">{formatRupiah(remaining)}</span> {t("cart.addMore2")}</>
              ) : (
                <span className="text-primary font-semibold">{t("cart.freeShip")} 🎉</span>
              )}
            </p>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-grad-leaf rounded-full transition-all duration-500" style={progressStyle} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <ShoppingBag size={40} strokeWidth={1.2} />
              <p className="text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-secondary/50 rounded-2xl p-2.5 group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                    <button onClick={() => onRemove?.(item.id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-primary font-semibold">{formatRupiah(item.price)}<span className="text-muted-foreground font-normal">/{item.unit}</span></p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-2 bg-card rounded-full px-1.5 py-1">
                      <button onClick={() => onQtyChange(item.id, -1)} className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center"><Minus size={12} /></button>
                      <span className="text-xs w-4 text-center font-semibold">{item.qty}</span>
                      <button onClick={() => onQtyChange(item.id, 1)} className="w-6 h-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{formatRupiah(item.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("cart.total")}</span>
              <span className="font-display text-xl text-foreground font-semibold">{formatRupiah(total)}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-grad-leaf text-white py-3 rounded-full font-semibold hover:shadow-glow transition-all active:scale-95">
              {t("cart.checkout")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
