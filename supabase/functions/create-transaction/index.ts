// =============================================================
// create-transaction (versi diperkeras)
//
// Respons TETAP { token } supaya CheckoutPage.tsx tidak berubah.
//
// Perubahan:
//  1. Wajib Authorization: Bearer <access_token>. Identitas diambil
//     dari token, bukan dari body kiriman browser.
//  2. gross_amount dihitung ulang di server lewat RPC
//     compute_order_total. Harga dari browser diabaikan.
//  3. Pesanan dibuat lewat RPC place_order memakai token pengguna,
//     sehingga RLS tetap berlaku.
//  4. Service role HANYA dipakai untuk menyimpan midtrans_token,
//     dibatasi ke order_id + user_id milik pemanggil.
//  5. CORS dibatasi daftar origin (ALLOWED_ORIGINS), bukan "*".
//  6. Tidak ada lagi console.log yang membocorkan token/stack.
//
// Deploy:
//   supabase secrets set ALLOWED_ORIGINS="https://domainmu.vercel.app,http://localhost:5173"
//   supabase functions deploy create-transaction
// =============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{4,64}$/;

function allowedOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const list = allowedOrigins();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  // Bila ALLOWED_ORIGINS belum diisi, izinkan origin pemanggil agar
  // fungsi tidak mati total saat pertama kali deploy. Segera isi
  // secret-nya supaya benar-benar terbatas.
  if (list.length === 0 && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (origin && list.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function fail(message: string, status: number, origin: string | null) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders(origin),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return fail("Metode tidak diizinkan.", 405, origin);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
  const IS_PROD = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";

  if (!SERVER_KEY) {
    return fail("Pembayaran belum dikonfigurasi.", 500, origin);
  }

  // ---- 1. Identitas dari token, bukan dari body ----
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return fail("Harus login untuk membayar.", 401, origin);
  }

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  const user = userData?.user;
  if (userErr || !user) {
    return fail("Sesi tidak valid. Silakan login ulang.", 401, origin);
  }

  // ---- 2. Baca body ----
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Permintaan tidak valid.", 400, origin);
  }

  const orderId = String(body.orderId ?? "");
  if (!ORDER_ID_PATTERN.test(orderId)) {
    return fail("Nomor pesanan tidak valid.", 400, origin);
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return fail("Keranjang kosong.", 400, origin);
  }

  const customer = (body.customer ?? {}) as Record<string, string>;
  const shipping = body.shipping ?? null;

  // ---- 3. Total dihitung ulang di server ----
  const { data: totalData, error: totalErr } = await userClient.rpc(
    "compute_order_total",
    { p_items: items },
  );
  if (totalErr || totalData === null) {
    return fail(
      totalErr?.message ?? "Gagal menghitung total pesanan.",
      400,
      origin,
    );
  }
  const grossAmount = Math.round(Number(totalData));
  if (!Number.isFinite(grossAmount) || grossAmount <= 0) {
    return fail("Total pesanan tidak valid.", 400, origin);
  }

  // ---- 4. Simpan pesanan lewat RPC (RLS tetap berlaku) ----
  const { error: orderErr } = await userClient.rpc("place_order", {
    p_order_id: orderId,
    p_items: items,
    p_total: grossAmount,
    p_customer_name: customer.name ?? user.email ?? "Pelanggan",
    p_customer_email: user.email ?? null,
    p_customer_phone: customer.phone ?? null,
    p_shipping: shipping,
    p_payment_method: "midtrans",
  });
  if (orderErr) {
    return fail(orderErr.message, 400, origin);
  }

  // ---- 5. Minta token Snap ----
  const snapUrl = IS_PROD
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const snapRes = await fetch(snapUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + btoa(SERVER_KEY + ":"),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer.name ?? "",
        email: user.email ?? "",
        phone: customer.phone ?? "",
      },
      credit_card: { secure: true },
    }),
  });

  if (!snapRes.ok) {
    return fail("Gagal membuat transaksi pembayaran.", 502, origin);
  }

  const snapJson = await snapRes.json();
  const token = snapJson?.token;
  if (!token) {
    return fail("Gagal membuat transaksi pembayaran.", 502, origin);
  }

  // ---- 6. Simpan token, dibatasi ke pesanan milik pemanggil ----
  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
  await adminClient
    .from("orders")
    .update({ midtrans_token: token })
    .eq("order_id", orderId)
    .eq("user_id", user.id);

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: corsHeaders(origin),
  });
});
