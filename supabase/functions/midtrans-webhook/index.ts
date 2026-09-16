// =============================================================
// midtrans-webhook (BARU)
//
// Satu-satunya sumber kebenaran status "paid" untuk pesanan
// Midtrans. Memverifikasi signature_key resmi Midtrans:
//   sha512(order_id + status_code + gross_amount + SERVER_KEY)
// sehingga notifikasi tidak bisa dipalsukan.
//
// Deploy (JWT WAJIB dimatikan; Midtrans bukan pengguna Supabase):
//   supabase functions deploy midtrans-webhook --no-verify-jwt
//
// Daftarkan di dashboard Midtrans:
//   Settings -> Configuration -> Payment Notification URL
//   https://<project-ref>.supabase.co/functions/v1/midtrans-webhook
// =============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Perbandingan waktu-konstan agar tidak bocor lewat timing attack.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sha512Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-512", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Status yang tidak boleh diturunkan lagi oleh webhook, karena
// admin sudah memprosesnya lebih jauh.
const FINAL_STATUSES = ["processing", "shipped", "completed"];

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!SERVER_KEY) {
    return new Response("Not configured", { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const orderId = String(body.order_id ?? "");
  const statusCode = String(body.status_code ?? "");
  const grossAmount = String(body.gross_amount ?? "");
  const signature = String(body.signature_key ?? "");
  const transactionStatus = String(body.transaction_status ?? "");
  const fraudStatus = String(body.fraud_status ?? "");

  if (!orderId || !signature) {
    return new Response("Bad request", { status: 400 });
  }

  // ---- 1. Verifikasi tanda tangan ----
  const expected = await sha512Hex(
    orderId + statusCode + grossAmount + SERVER_KEY,
  );
  if (!safeEqual(signature.toLowerCase(), expected)) {
    // Jangan beri tahu penyerang apa yang salah.
    return new Response("Forbidden", { status: 403 });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // ---- 2. Pastikan pesanan ada & nominal cocok ----
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id, total, status")
    .eq("order_id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return new Response("Not found", { status: 404 });
  }

  const paid = Number(grossAmount);
  if (Number.isFinite(paid) && Math.abs(paid - Number(order.total)) > 0.01) {
    // Nominal yang dibayar tidak sama dengan total tercatat.
    // Jangan tandai lunas; biarkan admin memeriksa manual.
    return new Response("Amount mismatch", { status: 409 });
  }

  // ---- 3. Petakan status Midtrans ke status pesanan ----
  let newStatus: string | null = null;

  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    newStatus = fraudStatus === "deny" ? "cancelled" : "paid";
  } else if (transactionStatus === "pending") {
    newStatus = "pending";
  } else if (
    ["deny", "cancel", "expire", "failure"].includes(transactionStatus)
  ) {
    newStatus = "cancelled";
  }

  if (!newStatus) {
    return new Response("OK", { status: 200 });
  }

  // Jangan menurunkan status yang sudah diproses admin.
  if (FINAL_STATUSES.includes(String(order.status))) {
    return new Response("OK", { status: 200 });
  }

  const patch: Record<string, unknown> = { status: newStatus };
  if (newStatus === "paid") {
    patch.paid_at = new Date().toISOString();
  }

  await admin.from("orders").update(patch).eq("order_id", orderId);

  return new Response("OK", { status: 200 });
});
