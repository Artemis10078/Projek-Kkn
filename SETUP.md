# Panduan Setup: Login (Admin/Customer + Google) & Pembayaran (Midtrans)

Project ini sudah dilengkapi sistem:
- Login email/password + Google OAuth (via Supabase Auth)
- Role `admin` dan `customer`
- Halaman Checkout dengan integrasi Midtrans Snap
- Dashboard Admin untuk mengelola pesanan

Supaya semuanya berfungsi, ikuti langkah-langkah di bawah ini.

---

## 1. Setup Supabase (Login & Database)

### 1.1 Buat project
1. Buka https://supabase.com → Sign up / Login → **New Project**.
2. Tunggu sampai project selesai dibuat (±2 menit).

### 1.2 Ambil API Keys
1. Di dashboard project → **Settings → API**.
2. Copy **Project URL** dan **anon public key**.
3. Buat file `.env` di root project (copy dari `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=ey...
   ```

### 1.3 Jalankan SQL schema
1. Di dashboard Supabase → **SQL Editor** → **New query**.
2. Copy seluruh isi file `supabase/sql/schema.sql` dari project ini, paste, lalu **Run**.
3. Ini akan membuat tabel `profiles`, `orders`, trigger otomatis, dan policy keamanan (RLS).

### 1.4 Aktifkan Google Login
1. Di Google Cloud Console (https://console.cloud.google.com):
   - Buat **OAuth Client ID** (tipe: Web application).
   - Authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
     (ganti `xxxxx` dengan project ref Supabase kamu — lihat di Settings → API)
   - Copy **Client ID** dan **Client Secret**.
2. Di dashboard Supabase → **Authentication → Providers → Google**:
   - Enable, lalu masukkan Client ID & Client Secret dari Google.
   - Simpan.
3. Di **Authentication → URL Configuration**, set **Site URL** ke alamat website kamu
   (untuk development: `http://localhost:5173`).

### 1.5 Jadikan akun sebagai Admin
1. Daftar/login dulu sekali menggunakan akun yang ingin dijadikan admin
   (lewat email/password atau Google) — ini akan otomatis membuat row di tabel `profiles`.
2. Di **SQL Editor**, jalankan:
   ```sql
   update public.profiles set role = 'admin' where email = 'emailkamu@gmail.com';
   ```
3. Logout & login ulang. Sekarang akun ini bisa akses `/admin`.

> Semua user baru otomatis mendapat role `customer` secara default.

---

## 2. Setup Midtrans (Pembayaran)

### 2.1 Daftar akun
1. Buka https://midtrans.com → daftar akun (gratis, bisa pakai mode **Sandbox** dulu untuk testing).

### 2.2 Ambil Access Keys
1. Login ke dashboard Midtrans → **Settings → Access Keys**.
2. Pastikan mode **Sandbox** aktif (toggle di kanan atas) untuk testing.
3. Copy **Client Key** dan **Server Key**.

### 2.3 Set Client Key di frontend
Tambahkan ke file `.env`:
```
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
VITE_MIDTRANS_IS_PRODUCTION=false
```

### 2.4 Deploy Edge Function (untuk Server Key — wajib, demi keamanan)
Server Key Midtrans **tidak boleh** ditaruh di frontend. Karena itu, pembuatan
transaksi dilakukan lewat Supabase Edge Function (`supabase/functions/create-transaction`).

1. Install Supabase CLI: https://supabase.com/docs/guides/cli
2. Login & link project:
   ```bash
   supabase login
   supabase link --project-ref xxxxx
   ```
3. Set secrets (Server Key Midtrans, JANGAN pakai prefix VITE_):
   ```bash
   supabase secrets set MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
   supabase secrets set MIDTRANS_IS_PRODUCTION=false
   ```
4. Deploy function:
   ```bash
   supabase functions deploy create-transaction
   ```

### 2.5 Testing pembayaran (Sandbox)
- Gunakan kartu test Midtrans: nomor `4811 1111 1111 1114`, exp: bulan/tahun depan, CVV: `123`, OTP: `112233`.
- Untuk QRIS/e-wallet sandbox, Midtrans menyediakan simulator otomatis di Snap popup.

### 2.6 Go Live (production)
1. Lengkapi profil bisnis di dashboard Midtrans untuk mendapat akses production.
2. Ambil Client Key & Server Key versi production.
3. Update `.env` dan secrets:
   ```
   VITE_MIDTRANS_IS_PRODUCTION=true
   ```
   ```bash
   supabase secrets set MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxxxx
   supabase secrets set MIDTRANS_IS_PRODUCTION=true
   supabase functions deploy create-transaction
   ```

---

## 3. Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

- **Login customer**: klik ikon profil di navbar → "Lanjutkan dengan Google" atau daftar manual.
- **Login admin**: gunakan akun yang sudah diset role `admin` (lihat langkah 1.5) → setelah login, menu "Admin Dashboard" akan muncul di dropdown profil → akses `/admin`.
- **Checkout**: tambahkan produk ke keranjang → klik Checkout → isi alamat → "Bayar Sekarang" akan membuka popup Midtrans Snap.

---

## 4. Ringkasan Fitur Baru

| Fitur | Lokasi Kode |
|---|---|
| Login (email + Google) | `src/app/pages/LoginPage.tsx` |
| Auth state & role | `src/app/context/AuthContext.tsx` |
| Keranjang lintas halaman | `src/app/context/CartContext.tsx` |
| Halaman checkout + Midtrans | `src/app/pages/CheckoutPage.tsx` |
| Dashboard admin (kelola pesanan) | `src/app/pages/AdminDashboard.tsx` |
| Proteksi route admin | `src/app/components/ProtectedRoute.tsx` |
| Supabase client | `src/lib/supabase.ts` |
| Schema database | `supabase/sql/schema.sql` |
| Edge Function pembayaran | `supabase/functions/create-transaction/index.ts` |

---

## 5. Catatan
- Selama `.env` belum diisi, halaman tetap bisa dibuka, tapi Login/Google/Pembayaran
  akan menampilkan pesan error/peringatan di console — ini normal sampai kredensial diisi.
- Jangan commit file `.env` ke git (tambahkan ke `.gitignore` jika belum ada).
