// Helper akses data Supabase: pesanan, ulasan, wishlist, profil, upload gambar.
import { supabase } from "./supabase";

export interface OrderItem {
  product_id?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
}

export interface ShippingInfo {
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderRow {
  id: string;
  order_id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: ShippingInfo | null;
  items: OrderItem[];
  total: number;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface PlaceOrderParams {
  orderId: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  shipping: ShippingInfo;
  paymentMethod?: string;
}

// Buat pesanan via RPC place_order (simpan pesanan + kurangi stok secara aman di server).
export async function placeOrder(
  params: PlaceOrderParams,
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc("place_order", {
    p_order_id: params.orderId,
    p_items: params.items,
    p_total: params.total,
    p_customer_name: params.customerName,
    p_customer_email: params.customerEmail,
    p_customer_phone: params.customerPhone,
    p_shipping: params.shipping,
    p_payment_method: params.paymentMethod ?? "qris",
  });
  if (error) return { id: null, error: error.message };
  return { id: (data as string) ?? null, error: null };
}

export async function fetchMyOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[db] fetchMyOrders:", error.message);
    return [];
  }
  return (data as OrderRow[]) ?? [];
}

export async function fetchAllOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[db] fetchAllOrders:", error.message);
    return [];
  }
  return (data as OrderRow[]) ?? [];
}

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<{ error: string | null }> {
  const patch: Record<string, unknown> = { status };
  if (status === "paid" || status === "completed") {
    patch.paid_at = new Date().toISOString();
  }
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  return { error: error ? error.message : null };
}

// ---------- Ulasan ----------
export interface ReviewRow {
  id: string;
  product_id: number;
  user_id: string;
  user_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function fetchReviews(productId: number): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[db] fetchReviews:", error.message);
    return [];
  }
  return (data as ReviewRow[]) ?? [];
}

export async function upsertReview(params: {
  productId: number;
  rating: number;
  comment: string;
  userName: string;
}): Promise<{ error: string | null }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return { error: "Harus login untuk memberi ulasan" };
  const row = {
    product_id: params.productId,
    user_id: uid,
    user_name: params.userName,
    rating: params.rating,
    comment: params.comment,
  };
  const { error } = await supabase
    .from("reviews")
    .upsert(row, { onConflict: "product_id,user_id" });
  return { error: error ? error.message : null };
}

export async function deleteReview(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  return { error: error ? error.message : null };
}

// ---------- Wishlist ----------
export async function fetchWishlist(): Promise<number[]> {
  const { data, error } = await supabase.from("wishlists").select("product_id");
  if (error) {
    console.warn("[db] fetchWishlist:", error.message);
    return [];
  }
  return ((data as { product_id: number }[]) ?? []).map((r) => r.product_id);
}

export async function addWishlist(
  productId: number,
): Promise<{ error: string | null }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return { error: "not-logged-in" };
  const { error } = await supabase
    .from("wishlists")
    .upsert(
      { user_id: uid, product_id: productId },
      { onConflict: "user_id,product_id" },
    );
  return { error: error ? error.message : null };
}

export async function removeWishlist(
  productId: number,
): Promise<{ error: string | null }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return { error: "not-logged-in" };
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", uid)
    .eq("product_id", productId);
  return { error: error ? error.message : null };
}

// ---------- Profil ----------
export async function updateProfile(
  userId: string,
  fields: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", userId);
  return { error: error ? error.message : null };
}

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  role: string;
  created_at: string;
}

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[db] fetchAllProfiles:", error.message);
    return [];
  }
  return (data as ProfileRow[]) ?? [];
}

// ---------- Upload gambar ke Storage ----------
export async function uploadImage(
  bucket: string,
  file: File,
  prefix = "",
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const rand = Math.random().toString(36).slice(2, 10);
  const path = prefix + Date.now() + "-" + rand + "." + ext;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

// ============================================================
// Keris (galeri pusaka) & Paket Panahan - Martani Park Tour
// ============================================================

export interface KerisRow {
  id: number;
  name: string;
  era: string | null;
  origin: string | null;
  dapur: string | null;
  pamor: string | null;
  description: string | null;
  image: string | null;
  gallery: string[] | null;
  featured: boolean;
  sort: number;
  created_at: string;
}

export async function fetchKeris(): Promise<KerisRow[]> {
  const { data, error } = await supabase
    .from("keris")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[db] fetchKeris:", error.message);
    return [];
  }
  return (data as KerisRow[]) ?? [];
}

export async function saveKeris(
  payload: Partial<KerisRow>,
): Promise<{ error: string | null }> {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { error } = await supabase.from("keris").update(rest).eq("id", id);
    return { error: error ? error.message : null };
  }
  const { error } = await supabase.from("keris").insert(payload);
  return { error: error ? error.message : null };
}

export async function deleteKeris(
  id: number,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("keris").delete().eq("id", id);
  return { error: error ? error.message : null };
}

export interface ArcheryPackageRow {
  id: number;
  name: string;
  tagline: string | null;
  price: number;
  duration: string | null;
  arrows: string | null;
  capacity: string | null;
  includes: string[] | null;
  description: string | null;
  image: string | null;
  popular: boolean;
  active: boolean;
  sort: number;
  created_at: string;
}

export async function fetchArcheryPackages(
  adminMode = false,
): Promise<ArcheryPackageRow[]> {
  const { data, error } = await supabase
    .from("archery_packages")
    .select("*")
    .order("sort", { ascending: true });
  if (error) {
    console.warn("[db] fetchArcheryPackages:", error.message);
    return [];
  }
  let rows = (data as ArcheryPackageRow[]) ?? [];
  if (!adminMode) rows = rows.filter((r) => r.active);
  return rows;
}

export async function saveArcheryPackage(
  payload: Partial<ArcheryPackageRow>,
): Promise<{ error: string | null }> {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { error } = await supabase
      .from("archery_packages")
      .update(rest)
      .eq("id", id);
    return { error: error ? error.message : null };
  }
  const { error } = await supabase.from("archery_packages").insert(payload);
  return { error: error ? error.message : null };
}

export async function deleteArcheryPackage(
  id: number,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("archery_packages")
    .delete()
    .eq("id", id);
  return { error: error ? error.message : null };
}

// ============================================================
// Pembayaran Midtrans (Snap) - via Edge Function create-transaction
// ============================================================

export interface MidtransItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface MidtransCustomer {
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
}

// Memanggil edge function untuk membuat transaksi Snap & mendapatkan token.
// Edge function (server) menyimpan pesanan berstatus pending + memanggil Midtrans
// memakai MIDTRANS_SERVER_KEY (rahasia, tidak pernah ada di frontend).
export async function createMidtransTransaction(params: {
  orderId: string;
  grossAmount: number;
  customer: MidtransCustomer;
  shipping: ShippingInfo;
  items: MidtransItem[];
}): Promise<{ token: string | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke(
    "create-transaction",
    {
      body: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
        customer: params.customer,
        shipping: params.shipping,
        items: params.items,
      },
    },
  );
  if (error) return { token: null, error: error.message };
  const token = (data as { token?: string } | null)?.token ?? null;
  if (!token)
    return {
      token: null,
      error: "Token pembayaran tidak diterima dari server.",
    };
  return { token, error: null };
}
