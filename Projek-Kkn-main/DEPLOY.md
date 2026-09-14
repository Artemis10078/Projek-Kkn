# 🚀 Panduan Hosting Gratis FreshGrove

Website ini = React (Vite) di frontend + Supabase di backend. Keduanya punya tier GRATIS.
Frontend di-deploy ke Vercel/Netlify/Cloudflare; backend tetap di Supabase Anda.

---

## Persiapan (sekali saja)

1. Pastikan proyek bisa di-build lokal:
   ```bash
   npm install
   npm run build
   ```
   Hasilnya ada di folder `dist/`.
2. Siapkan nilai environment variable dari Supabase Anda:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (opsional pembayaran) `VITE_MIDTRANS_CLIENT_KEY`, `VITE_MIDTRANS_IS_PRODUCTION`
3. Upload kode ke GitHub (cara termudah untuk auto-deploy):
   ```bash
   git init && git add . && git commit -m "FreshGrove"
   # buat repo kosong di github.com lalu:
   git remote add origin https://github.com/USERNAME/freshgrove.git
   git push -u origin main
   ```

---

## Opsi A — Vercel (paling direkomendasikan, termudah)

1. Buka https://vercel.com → daftar pakai akun GitHub.
2. **Add New → Project** → pilih repo `freshgrove`.
3. Vercel otomatis mendeteksi Vite. Biarkan:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   (Sudah diatur juga lewat file `vercel.json`.)
4. Buka **Environment Variables** → tambahkan `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, dst.
5. Klik **Deploy**. Selesai! Anda dapat URL seperti `https://freshgrove.vercel.app` untuk dibagikan ke teman.

Setiap `git push` berikutnya akan otomatis update website.

---

## Opsi B — Netlify

1. Buka https://app.netlify.com → login GitHub.
2. **Add new site → Import an existing project** → pilih repo.
3. Build command `npm run build`, publish directory `dist` (sudah diatur di `netlify.toml`).
4. **Site settings → Environment variables** → tambahkan variabel `VITE_...`.
5. Deploy. URL: `https://namasitus.netlify.app`.

---

## Opsi C — Cloudflare Pages

1. https://pages.cloudflare.com → Connect to Git.
2. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
3. Tambahkan Environment variables `VITE_...`.
4. Deploy. File `public/_redirects` sudah menjaga routing SPA.

---

## Penting tentang Supabase

- Backend (database, auth) sudah online di Supabase — tidak perlu hosting tambahan.
- Di dashboard Supabase → **Authentication → URL Configuration**, tambahkan domain hosting Anda
  (mis. `https://freshgrove.vercel.app`) ke **Site URL** & **Redirect URLs** agar login berfungsi.
- Jalankan SQL di `supabase/sql/products.sql` dan `schema.sql` lewat **SQL Editor** Supabase
  agar data produk & tabel pesanan aktif. Tanpa ini, situs tetap tampil pakai data contoh (seed).
- Pembayaran Midtrans (opsional) butuh deploy Edge Function:
  ```bash
  npx supabase functions deploy create-transaction
  ```

---

## Ringkasan

| Bagian | Hosting | Biaya |
|---|---|---|
| Frontend (web) | Vercel / Netlify / Cloudflare | Gratis |
| Database & Auth | Supabase | Gratis (tier free) |

Bagikan URL hasil deploy ke teman Anda — selesai! 🎉
