// Supabase Edge Function: create-transaction
// Deploy dengan: supabase functions deploy create-transaction
//
// Function ini menerima detail pesanan dari frontend, menyimpannya
// ke tabel `orders`, lalu memanggil Midtrans Snap API untuk
// mendapatkan token pembayaran. MIDTRANS_SERVER_KEY disimpan sebagai
// secret di Supabase (tidak pernah dikirim ke browser).
//
// Set secret dengan:
//   supabase secrets set MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
//   supabase secrets set MIDTRANS_IS_PRODUCTION=false

import { createClient } from "jsr:@supabase/supabase-js@2";

const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY") ?? "";
const IS_PRODUCTION = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
const SNAP_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface RequestBody {
  order_id: string;
  gross_amount: number;
  customer: {
    user_id: string;
    name: string;
    email?: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  items: OrderItem[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔵 create-transaction function started");
    console.log("Server Key exists:", !!MIDTRANS_SERVER_KEY);
    console.log("IS_PRODUCTION:", IS_PRODUCTION);

    const body: RequestBody = await req.json();
    const { order_id, gross_amount, customer, shipping, items } = body;
    console.log("Order ID:", order_id, "Amount:", gross_amount);

    // 1. Simpan pesanan ke database (status: pending)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase.from("orders").insert({
      order_id,
      user_id: customer.user_id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: shipping,
      items,
      total: gross_amount,
      status: "pending",
    });

    if (insertError) {
      throw new Error(`Gagal menyimpan order: ${insertError.message}`);
    }

    // 2. Minta Snap Token dari Midtrans
    console.log("🟡 Calling Midtrans API:", SNAP_API_URL);
    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);

    const midtransRes = await fetch(SNAP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id,
          gross_amount,
        },
        customer_details: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          shipping_address: {
            address: shipping.address,
            city: shipping.city,
            postal_code: shipping.postalCode,
          },
        },
        item_details: items.map((item) => ({
          id: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const midtransData = await midtransRes.json();
    console.log("🟡 Midtrans Response Status:", midtransRes.status);
    console.log("🟡 Midtrans Response:", JSON.stringify(midtransData).substring(0, 200));

    if (!midtransRes.ok) {
      const errorMsg = midtransData.error_messages?.join(", ") || "Gagal membuat transaksi Midtrans";
      console.error("❌ Midtrans Error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("🟢 Snap Token generated:", midtransData.token?.substring(0, 20) + "...");

    // 3. Simpan token ke order (opsional, untuk referensi)
    await supabase.from("orders").update({ midtrans_token: midtransData.token }).eq("order_id", order_id);

    return new Response(JSON.stringify({ token: midtransData.token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const errorMsg = (err as Error).message;
    console.error("🔴 Error in create-transaction:", errorMsg);
    console.error("Stack:", (err as Error).stack);
    
    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
