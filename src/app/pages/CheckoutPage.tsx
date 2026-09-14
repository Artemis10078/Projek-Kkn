import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  Leaf,
  ScanLine,
  QrCode,
  CreditCard,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  placeOrder,
  createMidtransTransaction,
  type OrderItem,
  type MidtransItem,
} from "../../lib/db";
import { formatRupiah } from "../../lib/products";
import { SITE } from "../../lib/config";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

const SHIPPING_FEE = 10000;
const FREE_SHIPPING_MIN = 200000;

const MIDTRANS_IS_PRODUCTION =
  import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY as
  | string
  | undefined;
const SNAP_SRC = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

type PayMethod = "qris" | "midtrans";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("qris");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [paidTotal, setPaidTotal] = useState(0);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setName((v) => v || profile.full_name || "");
      setPhone((v) => v || profile.phone || "");
      setAddress((v) => v || profile.address || "");
      setCity((v) => v || profile.city || "");
      setPostalCode((v) => v || profile.postal_code || "");
    }
  }, [profile]);

  // Muat skrip Midtrans Snap sekali (production / sandbox sesuai env).
  useEffect(() => {
    if (!MIDTRANS_CLIENT_KEY) return;
    if (document.getElementById("midtrans-snap")) return;
    const s = document.createElement("script");
    s.id = "midtrans-snap";
    s.src = SNAP_SRC;
    s.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const shippingFee =
    totalPrice >= FREE_SHIPPING_MIN || cartItems.length === 0
      ? 0
      : SHIPPING_FEE;
  const grandTotal = totalPrice + shippingFee;

  const validate = (): boolean => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (cartItems.length === 0) {
      setError("Keranjang masih kosong.");
      return false;
    }
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Mohon lengkapi nama, nomor telepon, alamat, dan kota.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate() || !user) return;

    const orderId = "ORDER-" + Date.now();
    const shipping = {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      notes: notes.trim(),
    };

    // ----- Pembayaran via Midtrans (Snap) -----
    if (payMethod === "midtrans") {
      if (!MIDTRANS_CLIENT_KEY || !window.snap) {
        setError(
          "Pembayaran Midtrans belum siap. Coba muat ulang halaman, atau gunakan QRIS.",
        );
        return;
      }
      setSubmitting(true);
      const items: MidtransItem[] = cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.qty,
      }));
      if (shippingFee > 0) {
        items.push({
          id: 0,
          name: "Ongkos Kirim",
          price: shippingFee,
          quantity: 1,
        });
      }
      const res = await createMidtransTransaction({
        orderId,
        grossAmount: grandTotal,
        customer: {
          user_id: user.id,
          name: name.trim(),
          email: user.email ?? null,
          phone: phone.trim(),
        },
        shipping,
        items,
      });
      setSubmitting(false);
      if (res.error || !res.token) {
        setError(res.error || "Gagal membuat transaksi pembayaran.");
        return;
      }
      window.snap.pay(res.token, {
        onSuccess: () => {
          clearCart();
          navigate("/orders");
        },
        onPending: () => {
          clearCart();
          navigate("/orders");
        },
        onError: () => {
          setError("Pembayaran gagal diproses. Silakan coba lagi.");
        },
        onClose: () => {
          /* pengguna menutup popup tanpa membayar */
        },
      });
      return;
    }

    // ----- Pembayaran via QRIS (manual) -----
    setSubmitting(true);
    const items: OrderItem[] = cartItems.map((i) => ({
      product_id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.qty,
      image: i.image,
      unit: i.unit,
    }));
    if (shippingFee > 0) {
      items.push({ name: "Ongkos Kirim", price: shippingFee, quantity: 1 });
    }
    const res = await placeOrder({
      orderId,
      items,
      total: grandTotal,
      customerName: name.trim(),
      customerEmail: user.email ?? null,
      customerPhone: phone.trim(),
      shipping,
      paymentMethod: "qris",
    });
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setPaidTotal(grandTotal);
    clearCart();
    setPlacedOrderId(orderId);
  };

  // ----- Layar sukses + pembayaran QRIS -----
  if (placedOrderId) {
    return (
      <div className="min-h-screen bg-background font-body flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-soft p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={34} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl text-foreground mb-1">
            Pesanan Dibuat!
          </h1>
          <p className="text-sm text-muted-foreground mb-1">
            Kode pesanan{" "}
            <span className="font-semibold text-foreground">
              {placedOrderId}
            </span>
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Selesaikan pembayaran dengan scan QRIS di bawah ini.
          </p>

          <div className="bg-secondary/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
              <ScanLine size={14} className="text-primary" /> Scan untuk
              membayar
            </div>
            <div className="bg-white rounded-2xl p-3 inline-block shadow-sm">
              <img
                src="/qris.jpeg"
                alt="Kode QRIS pembayaran"
                className="w-56 h-56 object-contain mx-auto"
              />
            </div>
            <p className="font-display text-2xl text-primary font-semibold mt-3">
              {formatRupiah(paidTotal)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Gunakan aplikasi e-wallet / mobile banking apa pun (GoPay, OVO,
              DANA, ShopeePay, dll).
            </p>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Setelah membayar, klik tombol di bawah. Admin akan memverifikasi
            pembayaran Anda dan memproses pesanan. Anda bisa memantau status di
            halaman Pesanan Saya.
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-grad-leaf text-white py-3 rounded-full font-semibold hover:shadow-glow transition-all active:scale-95 mb-2"
          >
            Saya Sudah Bayar — Lihat Pesanan Saya
          </button>
          <Link
            to="/"
            className="block w-full text-sm text-muted-foreground hover:text-primary py-2"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // ----- Keranjang kosong -----
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background font-body flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag
          size={48}
          strokeWidth={1.2}
          className="text-muted-foreground mb-3"
        />
        <h1 className="font-display text-2xl text-foreground mb-2">
          Keranjang Anda kosong
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          Yuk pilih produk favorit Anda dulu.
        </p>
        <Link
          to="/"
          className="bg-grad-leaf text-white px-6 py-3 rounded-full font-semibold hover:shadow-glow transition-all"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // ----- Form checkout -----
  return (
    <div className="min-h-screen bg-background font-body">
      <div className="glass border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} /> <span className="text-sm">Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-grad-leaf flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold gradient-text">
              {SITE.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl text-foreground mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="font-display text-lg text-foreground">
              Informasi Pengiriman
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nama Lengkap"
                value={name}
                onChange={setName}
                placeholder="Nama penerima"
              />
              <Field
                label="Nomor Telepon"
                value={phone}
                onChange={setPhone}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <Field
              label="Alamat Lengkap"
              value={address}
              onChange={setAddress}
              placeholder="Jalan, nomor rumah, RT/RW"
              textarea
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Kota / Kabupaten"
                value={city}
                onChange={setCity}
                placeholder="Kota"
              />
              <Field
                label="Kode Pos"
                value={postalCode}
                onChange={setPostalCode}
                placeholder="00000"
              />
            </div>
            <Field
              label="Catatan (opsional)"
              value={notes}
              onChange={setNotes}
              placeholder="Patokan / instruksi pengiriman"
              textarea
            />

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
          </div>

          {/* Ringkasan */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 sticky top-24">
              <h2 className="font-display text-lg text-foreground mb-4">
                Ringkasan Pesanan
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartItems.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {i.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i.qty} x {formatRupiah(i.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {formatRupiah(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkos kirim</span>
                  <span>
                    {shippingFee === 0 ? "Gratis" : formatRupiah(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-display text-lg text-foreground font-semibold pt-1">
                  <span>Total</span>
                  <span>{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Metode pembayaran */}
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Metode Pembayaran
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod("qris")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      payMethod === "qris"
                        ? "border-primary bg-primary-soft text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <QrCode size={16} /> QRIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod("midtrans")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      payMethod === "midtrans"
                        ? "border-primary bg-primary-soft text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <CreditCard size={16} /> Midtrans
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {payMethod === "qris"
                    ? "Scan QRIS dengan GoPay, OVO, DANA, ShopeePay, atau mobile banking."
                    : "Kartu kredit/debit, e-wallet, & Virtual Account otomatis via Midtrans."}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-4 bg-grad-leaf text-white py-3 rounded-full font-semibold hover:shadow-glow transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Memproses...
                  </>
                ) : payMethod === "midtrans" ? (
                  <>
                    <CreditCard size={16} /> Bayar dengan Midtrans
                  </>
                ) : (
                  <>
                    <QrCode size={16} /> Bayar dengan QRIS
                  </>
                )}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-3">
                {payMethod === "qris"
                  ? "Pesanan disimpan, lalu Anda membayar lewat QRIS. Stok otomatis berkurang."
                  : "Anda akan diarahkan ke jendela pembayaran aman Midtrans."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}

function Field({ label, value, onChange, placeholder, textarea }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      )}
    </label>
  );
}
