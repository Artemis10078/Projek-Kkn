import { createClient } from "@supabase/supabase-js";

// Ambil dari environment variables (.env)
// VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY didapat dari dashboard project Supabase kamu
// Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diset. " +
      "Buat file .env di root project (lihat .env.example) dan isi dengan kredensial dari dashboard Supabase kamu."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export type UserRole = "admin" | "customer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  role: UserRole;
  created_at: string;
}
