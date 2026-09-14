import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Package,
  LogOut,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  X,
  LayoutDashboard,
  Boxes,
  Sun,
  Moon,
  Users,
  AlertTriangle,
  Upload,
  Loader2,
  Eye,
  Phone,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  fetchAllProfiles,
  uploadImage,
  type ProfileRow,
} from "../../lib/db";
import {
  formatRupiah,
  mapRowToProduct,
  SEED_PRODUCTS,
  type Product,
} from "../../lib/products";
import { Sword, Target } from "lucide-react";
import { AdminKerisPanel } from "../components/AdminKerisPanel";
import { AdminArcheryPanel } from "../components/AdminArcheryPanel";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  unit?: string;
}

interface Order {
  id: string;
  order_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: {
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  } | null;
  total: number;
  status: string;
  payment_method?: string;
  paid_at?: string | null;
  created_at: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];
const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
const CHART_COLORS = ["#F4A623", "#2D6A4F", "#52B788", "#9D4EDD", "#40916C", "#E63946"];
const LOW_STOCK_THRESHOLD = 20;

type Tab = "overview" | "orders" | "products" | "keris" | "panahan" | "customers";

const EMPTY_FORM: Partial<Product> = {
  name: "",
  type: "buah",
  category: "Tropical",
  price: 0,
  unit: "per kg",
  origin: "",
  image: "",
  stock: 0,
  badge: "",
  description: "",
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("overview");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsFromDb, setProductsFromDb] = useState(false);
  const [productFilter, setProductFilter] = useState<"all" | "buah" | "tumbuhan">("all");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [customers, setCustomers] = useState<ProfileRow[]>([]);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id");
    if (error || !data || data.length === 0) {
      setProducts(SEED_PRODUCTS);
      setProductsFromDb(false);
    } else {
      setProducts(data.map(mapRowToProduct));
      setProductsFromDb(true);
    }
  };

  const loadCustomers = async () => {
    const rows = await fetchAllProfiles();
    setCustomers(rows);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    loadCustomers();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const patch: Record<string, unknown> = { status };
    if (status === "paid" || status === "completed") {
      patch.paid_at = new Date().toISOString();
    }
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } as Order : o)),
    );
    setDetailOrder((prev) => (prev && prev.id === id ? { ...prev, ...patch } as Order : prev));
  };

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => ["paid", "completed", "shipped", "processing"].includes(o.status))
      .reduce((s, o) => s + Number(o.total || 0), 0);
    return {
      totalOrders: orders.length,
      revenue,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
    };
  }, [orders]);

  const statusData = useMemo(
    () =>
      STATUS_OPTIONS.map((s) => ({
        name: STATUS_LABEL[s] || s,
        value: orders.filter((o) => o.status === s).length,
      })).filter((d) => d.value > 0),
    [orders],
  );

  const trendData = useMemo(() => {
    const days: { day: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      const dayOrders = orders.filter((o) => (o.created_at || "").slice(0, 10) === key);
      days.push({
        day: label,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
      });
    }
    return days;
  }, [orders]);

  const lowStock = useMemo(
    () =>
      products.filter(
        (p) => typeof p.stock === "number" && (p.stock as number) <= LOW_STOCK_THRESHOLD,
      ),
    [products],
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const res = await uploadImage("product-images", file);
    setUploadingImg(false);
    if (res.error || !res.url) {
      setError(res.error || "Gagal mengunggah gambar.");
      return;
    }
    setEditing((prev) => ({ ...prev, image: res.url || "" }));
  };

  const saveProduct = async () => {
    if (!editing || !editing.name) return;
    setSaving(true);
    const row = {
      name: editing.name,
      type: editing.type || "buah",
      category: editing.category,
      price: Number(editing.price) || 0,
      old_price: editing.oldPrice ? Number(editing.oldPrice) : null,
      unit: editing.unit,
      origin: editing.origin,
      image: editing.image,
      stock: Number(editing.stock) || 0,
      badge: editing.badge || null,
      description: editing.description || null,
    };
    if (productsFromDb) {
      if (editing.id) {
        const { error } = await supabase.from("products").update(row).eq("id", editing.id);
        if (error) {
          setError(error.message);
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from("products").insert(row);
        if (error) {
          setError(error.message);
          setSaving(false);
          return;
        }
      }
      await fetchProducts();
    } else {
      setProducts((prev) => {
        if (editing.id)
          return prev.map((p) => (p.id === editing.id ? ({ ...p, ...editing } as Product) : p));
        return [
          ...prev,
          { ...EMPTY_FORM, ...editing, id: Date.now(), rating: 5, reviews: 0 } as Product,
        ];
      });
    }
    setSaving(false);
    setEditing(null);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    if (productsFromDb) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        setError(error.message);
        return;
      }
      await fetchProducts();
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const setStock = async (p: Product, stock: number) => {
    const newStock = Math.max(0, stock);
    if (productsFromDb) {
      const { error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", p.id);
      if (error) {
        setError(error.message);
        return;
      }
    }
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? ({ ...x, stock: newStock } as Product) : x)),
    );
  };

  const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { key: "orders", label: "Pesanan", icon: ShoppingCart },
    { key: "products", label: "Produk", icon: Boxes },
    { key: "keris", label: "Keris", icon: Sword },
    { key: "panahan", label: "Panahan", icon: Target },
    { key: "customers", label: "Pelanggan", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-grad-leaf flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-foreground leading-none">Admin Dashboard</h1>
                <p className="text-[11px] text-muted-foreground">{profile?.full_name || profile?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-secondary transition-colors">
              {theme === "dark" ? <Sun size={18} className="text-accent" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
                loadCustomers();
              }}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <RefreshCw size={17} />
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-destructive hover:bg-secondary px-3 py-2 rounded-full transition-colors"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-grad-leaf text-white shadow-md"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X size={15} />
            </button>
          </div>
        )}

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Pesanan", value: stats.totalOrders, icon: ShoppingCart, color: "bg-primary-soft text-primary" },
                { label: "Pendapatan", value: formatRupiah(stats.revenue), icon: DollarSign, color: "bg-accent/15 text-accent" },
                { label: "Menunggu", value: stats.pending, icon: Clock, color: "bg-yellow-100 text-yellow-700" },
                { label: "Selesai", value: stats.completed, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover-lift">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <div className="font-display text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {lowStock.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-yellow-700 text-sm font-semibold mb-2">
                  <AlertTriangle size={16} /> Stok Menipis ({lowStock.length} produk)
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStock.map((p) => (
                    <span key={p.id} className="text-xs bg-card border border-border rounded-full px-3 py-1 text-foreground">
                      {p.name}: <span className="font-semibold">{p.stock}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display text-foreground mb-4">Tren Pendapatan (7 hari)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52B788" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} width={70} tickFormatter={(v) => formatRupiah(Number(v))} />
                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    <Area type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={2} fill="url(#gRev)" name="Pendapatan" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display text-foreground mb-4">Distribusi Status</h3>
                {statusData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-20 text-center">Belum ada data pesanan.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Jumlah">
                        {statusData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">Memuat pesanan...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">Belum ada pesanan.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Order ID</th>
                      <th className="text-left px-4 py-3 font-medium">Pelanggan</th>
                      <th className="text-left px-4 py-3 font-medium">Total</th>
                      <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-border hover:bg-secondary/30">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{o.order_id}</td>
                        <td className="px-4 py-3">
                          <div className="text-foreground">{o.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{formatRupiah(Number(o.total))}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${
                              STATUS_COLOR[o.status] ?? "bg-secondary"
                            }`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s] || s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDetailOrder(o)}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Eye size={13} /> Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-foreground">Kelola Produk</h3>
                <p className="text-xs text-muted-foreground">
                  {productsFromDb
                    ? "Tersinkron dengan database Supabase"
                    : "Mode lokal (perubahan tidak tersimpan ke database)"}
                </p>
              </div>
              <button
                onClick={() => setEditing({ ...EMPTY_FORM })}
                className="flex items-center gap-2 bg-grad-leaf text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-glow transition-all"
              >
                <Plus size={15} /> Tambah Produk
              </button>
            </div>

            <div className="flex items-center gap-2">
              {([
                { k: "all", l: "Semua" },
                { k: "buah", l: "Buah" },
                { k: "tumbuhan", l: "Tumbuhan" },
              ] as const).map((f) => (
                <button
                  key={f.k}
                  onClick={() => setProductFilter(f.k)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    productFilter === f.k
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {f.l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter((p) => productFilter === "all" || (p.type ?? "buah") === productFilter)
                .map((p) => {
                const stock = typeof p.stock === "number" ? p.stock : 0;
                const isLow = stock <= LOW_STOCK_THRESHOLD;
                return (
                  <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden hover-lift">
                    <div className="flex gap-3 p-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{p.name}</h4>
                        <p className="text-xs text-muted-foreground">{p.category} · {p.origin}</p>
                        <p className="text-sm text-primary font-semibold mt-1">
                          {formatRupiah(p.price)}
                          <span className="text-muted-foreground font-normal text-xs">/{p.unit}</span>
                        </p>
                        <p className={`text-[11px] ${isLow ? "text-yellow-600 font-semibold" : "text-muted-foreground"}`}>
                          Stok: {stock}{isLow ? " (menipis)" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 pb-2">
                      <button
                        onClick={() => setStock(p, stock + 10)}
                        className="flex-1 text-[11px] py-1 rounded-lg bg-primary-soft text-primary hover:opacity-80 transition"
                      >
                        +10 stok
                      </button>
                      <button
                        onClick={() => setStock(p, 0)}
                        className="flex-1 text-[11px] py-1 rounded-lg bg-secondary text-foreground hover:opacity-80 transition"
                      >
                        Habiskan
                      </button>
                    </div>
                    <div className="flex border-t border-border">
                      <button
                        onClick={() => setEditing(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-destructive hover:bg-secondary transition-colors border-l border-border"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "customers" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">Belum ada pelanggan terdaftar.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Nama</th>
                      <th className="text-left px-4 py-3 font-medium">Email</th>
                      <th className="text-left px-4 py-3 font-medium">Telepon</th>
                      <th className="text-left px-4 py-3 font-medium">Kota</th>
                      <th className="text-left px-4 py-3 font-medium">Peran</th>
                      <th className="text-left px-4 py-3 font-medium">Bergabung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-t border-border hover:bg-secondary/30">
                        <td className="px-4 py-3 text-foreground">{c.full_name || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.phone || "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.city || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${c.role === "admin" ? "bg-primary-soft text-primary" : "bg-secondary text-foreground"}`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString("id-ID") : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "keris" && <AdminKerisPanel />}

        {tab === "panahan" && <AdminArcheryPanel />}
      </main>

      {/* Order detail modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailOrder(null)} />
          <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-display text-foreground">Detail Pesanan</h3>
                <p className="text-xs text-muted-foreground font-mono">{detailOrder.order_id}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-1.5 rounded-full hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <select
                  value={detailOrder.status}
                  onChange={(e) => updateStatus(detailOrder.id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${
                    STATUS_COLOR[detailOrder.status] ?? "bg-secondary"
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s] || s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-secondary/40 rounded-xl p-3 text-sm space-y-1">
                <p className="text-foreground font-semibold">{detailOrder.customer_name}</p>
                <p className="text-muted-foreground text-xs">{detailOrder.customer_email}</p>
                {detailOrder.customer_phone && (
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Phone size={11} /> {detailOrder.customer_phone}
                  </p>
                )}
                {detailOrder.shipping_address && (
                  <p className="text-muted-foreground text-xs flex items-start gap-1">
                    <MapPin size={11} className="mt-0.5" />
                    <span>
                      {detailOrder.shipping_address.address}
                      {detailOrder.shipping_address.city ? ", " + detailOrder.shipping_address.city : ""}
                      {detailOrder.shipping_address.postalCode ? " " + detailOrder.shipping_address.postalCode : ""}
                      {detailOrder.shipping_address.notes ? " (" + detailOrder.shipping_address.notes + ")" : ""}
                    </span>
                  </p>
                )}
                <p className="text-muted-foreground text-xs">Metode: {detailOrder.payment_method || "qris"}</p>
                <p className="text-muted-foreground text-xs">Dibayar: {formatDateTime(detailOrder.paid_at)}</p>
              </div>

              <div className="space-y-2">
                {(detailOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {it.name} <span className="text-xs text-muted-foreground">x{it.quantity}</span>
                    </span>
                    <span className="text-foreground">{formatRupiah(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-lg text-foreground font-semibold">
                  {formatRupiah(detailOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product editor modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-foreground">{editing.id ? "Edit Produk" : "Tambah Produk"}</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Gambar Produk</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
                    {editing.image ? (
                      <img src={editing.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={22} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImg}
                      className="inline-flex items-center gap-2 text-sm bg-secondary px-3 py-2 rounded-xl hover:opacity-80 transition disabled:opacity-60"
                    >
                      {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Unggah Gambar
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <input
                      value={editing.image ?? ""}
                      onChange={(e) => setEditing((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="atau tempel URL gambar"
                      className="w-full mt-2 bg-secondary rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Nama", span: 2, type: "text" },
                  { key: "category", label: "Kategori", span: 1, type: "text" },
                  { key: "origin", label: "Asal", span: 1, type: "text" },
                  { key: "price", label: "Harga", span: 1, type: "number" },
                  { key: "oldPrice", label: "Harga Lama (opsional)", span: 1, type: "number" },
                  { key: "unit", label: "Satuan", span: 1, type: "text" },
                  { key: "stock", label: "Stok", span: 1, type: "number" },
                  { key: "badge", label: "Badge (opsional)", span: 2, type: "text" },
                ].map((f) => (
                  <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                    <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={((editing as Record<string, unknown>)[f.key] as string) ?? ""}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                        }))
                      }
                      className="w-full bg-secondary rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Lini Produk</label>
                  <select
                    value={(editing.type as string) ?? "buah"}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, type: e.target.value as "buah" | "tumbuhan" }))
                    }
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  >
                    <option value="buah">Buah</option>
                    <option value="tumbuhan">Tumbuhan</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={editing.description ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-foreground resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full text-sm text-foreground hover:bg-secondary">
                Batal
              </button>
              <button
                onClick={saveProduct}
                disabled={saving}
                className="px-5 py-2 rounded-full text-sm font-medium bg-grad-leaf text-white hover:shadow-glow transition-all disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
