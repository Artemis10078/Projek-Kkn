# Candimulyo Park Tour — Audit & Roadmap

Disusun dari pembacaan source code `Candimulyo-Park-Tour (1).zip`.
Stack tidak diubah: React 18 + TS + Vite 6 + Tailwind v4 + Supabase + react-router 7.
Tidak ada fitur, halaman, route, atau komponen yang dihapus.

---

## 1. Ringkasan audit

### P0 — Keamanan kritis (uang & data pribadi)

| # | File/Komponen | Masalah | Dampak | Status |
|---|---|---|---|---|
| 1 | `setup.sql` policy `profiles_update_own` | Policy mengizinkan update seluruh baris **termasuk kolom `role`** | User login bisa jadi admin lewat 1 baris Console, lalu baca **semua** data pelanggan (nama, telepon, alamat). Pelanggaran UU PDP | **Ditutup** |
| 2 | `setup.sql` policy `orders_insert_own` | Tidak membatasi `status`/`paid_at` | Pembeli menyisipkan pesanan `status:'paid'` tanpa bayar | **Ditutup** |
| 3 | `place_order` + `CheckoutPage.tsx:203` | `p_total` dari client dipercaya apa adanya | Durian Rp 62.000 dibeli Rp 1. Kerugian uang nyata | **Ditutup** |
| 4 | `supabase/functions/` | **Tidak ada webhook Midtrans.** Status `paid` bergantung admin manual | Pesanan lunas tidak terdeteksi / pesanan gagal dianggap lunas | **Ditutup (fungsi baru)** |
| 5 | `create-transaction/index.ts` | CORS `*`, identitas dari body, `console.log` data sensitif | Situs mana pun bisa memanggil; order atas nama orang lain; token bocor di log | **Ditutup** |
| 6 | `setup.sql` policy `auth_write_avatars` | Tidak mengikat folder ke `auth.uid()` | User bisa menimpa/hapus avatar orang lain | **Ditutup** |
| 7 | `vercel.json` | Tidak ada header keamanan sama sekali | Rentan clickjacking, MIME sniffing, kebocoran referrer | **Ditutup** |
| 8 | `db.ts` `updateProfile` | Menerima `Record<string, unknown>` mentah | Lapisan kedua escalation `role` | **Ditutup** |

### P1 — Fungsionalitas

| # | File/Komponen | Masalah | Dampak | Status |
|---|---|---|---|---|
| 9 | `AdminDashboard.tsx` `fetchProducts` + `useProducts.ts` | Kalau tabel `products` kosong → fallback `SEED_PRODUCTS` dan masuk **"mode lokal"**. CRUD hanya ubah state React | Admin menambah produk, terlihat berhasil, **hilang saat refresh**. Fitur produk praktis mati | **Ditutup (guard SQL)** |
| 10 | `db.ts` `fetchArcheryPackages` | Filter `active` dilakukan **di klien** | Paket & harga yang belum dirilis terlihat di Network tab | **Ditutup** |
| 11 | `ReviewsSection.tsx` | `textarea` tanpa `maxLength` | Setelah batas DB dipasang, ulasan panjang gagal dengan galat Postgres mentah | **Ditutup (pemangkasan di db.ts)** |
| 12 | `place_order` | `order_id` tidak dijaga unik di level fungsi | Double-submit membuat pesanan ganda / stok terpotong 2× | **Ditutup (idempotensi)** |
| 13 | `place_order` | `customer_email` dari body client | Email bisa diisi email orang lain; kolom bisa kosong | **Ditutup (ambil dari `auth.users`)** |
| 14 | `App.tsx` | Tidak ada route `*` dan tidak ada error boundary | URL salah → layar kosong; satu komponen crash → web putih total | **Ditutup** |
| 15 | `AdminDashboard.tsx` `saveProduct` | Tidak mengirim `gallery`, `tags`, `nutrition`, `badge_color` | Produk buatan admin tampil lebih miskin dari produk seed | **Belum** (butuh keputusanmu, lihat §4) |
| 16 | `LoginPage.tsx:73` | Nama merek masih **"FreshGrove"** (sisa template) | Pengunjung bingung, merek tidak konsisten | **Belum** (mengubah tampilan — butuh izin) |

### P2 — Polish, performa, SEO

| # | File/Komponen | Masalah | Dampak | Status |
|---|---|---|---|---|
| 17 | `index.html` | Tidak ada OG tag / structured data | Tautan di WA/IG tampil polos; tidak muncul sebagai objek wisata di Google | **Ditutup** |
| 18 | `public/` | Tidak ada `robots.txt` / `sitemap.xml`; `/admin` & `/checkout` bisa terindeks | SEO lemah, halaman privat terindeks | **Ditutup** |
| 19 | `Footer.tsx`, `ContactPage.tsx`, `HomePage.tsx`, `WisataPage.tsx` | `rel="noreferrer"` tanpa `noopener` | Risiko tabnabbing (kecil, karena `noreferrer` sudah menutup sebagian) | **Ditutup** |
| 20 | `App.tsx` | Semua halaman di-import statis, tidak ada code splitting | Bundle awal besar (recharts + MUI + motion ikut terunduh walau hanya buka beranda) | **Belum** (lihat §4 Opsi B) |
| 21 | `styles/globals.css`, `immersive/MistCanvas` | Animasi belum menghormati `prefers-reduced-motion` | Tidak nyaman bagi pengguna sensitif gerak; baterai HP terkuras | **Belum** |
| 22 | `ui/dialog`, `CartDrawer`, `ProductModal` | Perlu audit fokus keyboard & `aria-label` | Aksesibilitas | **Belum** |

---

## 2. Roadmap

### Fase 0 — Keamanan kritis (P0) — **SUDAH DIKERJAKAN di zip ini**
File: `supabase/sql/99-security-hardening.sql` (baru), `supabase/functions/create-transaction/index.ts`,
`supabase/functions/midtrans-webhook/index.ts` (baru), `vercel.json`, `netlify.toml`, `src/lib/db.ts`.
Effort: sudah selesai — sisanya eksekusi SQL + deploy (±30 menit).

### Fase 1 — Fungsionalitas (P1) — sebagian sudah
Sudah: guard katalog kosong, idempotensi order, email dari akun, filter server, 404, error boundary.
Belum: `saveProduct` lengkap (#15), merek LoginPage (#16). Effort: 1–2 jam, butuh keputusanmu.

### Fase 2 — Polish UI/UX
Search + filter harga/stok + sorting + pagination di `BuahPage`/`TumbuhanPage`, galeri di `ProductModal`,
timeline status di `OrdersPage`, konfirmasi aksi destruktif di `AdminDashboard` (ganti `confirm()` dengan
AlertDialog shadcn), validasi `react-hook-form` di `CheckoutPage`. Effort: 1–2 hari.

### Fase 3 — Performa & SEO
`React.lazy` per route (#20), `prefers-reduced-motion` (#21), audit aria (#22),
konversi gambar ke WebP, `npm audit`. Effort: 1 hari.

### Fase 4 — Pre-launch
Lihat §5. Effort: setengah hari + waktu tunggu approval Midtrans production.

---

## 3. Perubahan di zip ini

**Baru**
- `supabase/sql/99-security-hardening.sql` — migrasi idempoten, aman diulang
- `supabase/functions/midtrans-webhook/index.ts` — verifikasi `signature_key` SHA-512
- `src/app/pages/NotFoundPage.tsx`, `src/app/components/ErrorBoundary.tsx`
- `public/robots.txt`, `public/sitemap.xml`
- `AUDIT-DAN-ROADMAP.md` (dokumen ini)

**Diubah**
- `src/lib/db.ts` — allowlist profil, validasi upload, pemangkasan ulasan, filter paket server-side
- `src/app/App.tsx` — `+ErrorBoundary`, `+route *`
- `index.html` — OG tag, theme-color, structured data `TouristAttraction`
- `vercel.json`, `netlify.toml` — 6 header keamanan + CSP Report-Only
- 4 file — `rel="noreferrer"` → `rel="noopener noreferrer"`

**Tidak disentuh:** seluruh komponen UI, CSS, tema, i18n, Context, dan halaman lain.

---

## 4. Keputusan yang butuh pilihanmu

### A. Alur pembayaran — QRIS manual vs Midtrans (keduanya tetap ada)

| | Opsi 1: Midtrans utama | Opsi 2: QRIS utama |
|---|---|---|
| Verifikasi | Otomatis via webhook | Manual cek mutasi rekening |
| Biaya | ~0,7–2% per transaksi | Gratis / MDR QRIS |
| Risiko | Rendah | Pembeli klaim "sudah bayar" padahal belum |
| Cocok saat | Transaksi rutin | Volume masih kecil |

**Saran:** Midtrans utama, QRIS sebagai alternatif dengan label jelas *"perlu konfirmasi admin"*. Belum saya ubah karena ini keputusan bisnis.

### B. Code splitting (#20)
Opsi B1 `React.lazy` semua route — bundle awal turun banyak, tapi perlu `Suspense` + fallback skeleton (ada risiko flicker).
Opsi B2 lazy hanya `/admin` (recharts+MUI paling berat) — hasil 70% dengan risiko hampir nol. **Saran: B2.**

### C. Merek "FreshGrove" di `LoginPage.tsx:73` (#16)
Ganti jadi "Candimulyo Park Tour"? Ini mengubah tampilan, jadi saya tunggu izinmu. (Sisa nama di komentar CSS/`products.ts` tidak terlihat pengunjung — aman dibiarkan.)

### D. `saveProduct` tanpa gallery/tags/nutrition (#15)
Perlu tambah field di form admin — **menambah** UI. Konfirmasi dulu karena kamu minta tampilan tidak berubah.

---

## 5. Cara verifikasi manual

### Langkah penerapan (urut — SQL dulu, baru push)
1. **Cek katalog:** Supabase → Table Editor → `products` harus ada 12+ baris. Kalau kosong: jalankan `setup.sql` lalu `upgrade-candimulyo.sql`.
2. **Jalankan** `supabase/sql/99-security-hardening.sql` di SQL Editor. Skrip berhenti sendiri kalau langkah 1 belum selesai.
3. **Pastikan kamu masih admin:**
   ```sql
   update public.profiles set role = 'admin'
    where lower(trim(email)) = lower(trim('EMAIL_ANDA@gmail.com'))
    returning email, role;
   ```
4. **Push zip ini** ke GitHub → Vercel auto-deploy.
5. **Deploy Edge Function** (jika pakai Midtrans):
   ```bash
   supabase secrets set ALLOWED_ORIGINS="https://domainmu.vercel.app,http://localhost:5173"
   supabase functions deploy create-transaction
   supabase functions deploy midtrans-webhook --no-verify-jwt
   ```
   Daftarkan Payment Notification URL di dashboard Midtrans:
   `https://<project-ref>.supabase.co/functions/v1/midtrans-webhook`
   > `--no-verify-jwt` **wajib** untuk webhook — Midtrans bukan pengguna Supabase. Keamanannya dari verifikasi SHA-512, bukan JWT.

### Uji fungsional (lakukan semua)
| Uji | Cara | Harapan |
|---|---|---|
| Checkout | Beli 1 produk sampai selesai | Berhasil, total sama dengan yang tampil |
| Ongkir gratis | Belanja ≥ Rp 200.000 | Ongkir Rp 0, checkout lolos |
| Admin produk | Tambah produk, **refresh** | Produk masih ada (bukan mode lokal) |
| Admin status | Ubah status pesanan | Tersimpan setelah refresh |
| Ulasan | Kirim ulasan >1000 karakter | Tersimpan terpotong, tanpa galat merah |
| Upload | Unggah file >10 MB | Pesan "maksimal 10 MB" |
| Avatar | Ganti foto profil | Berhasil |
| 404 | Buka `/halaman-ngawur` | Halaman 404, bukan layar kosong |
| Paket panahan | Nonaktifkan paket, cek Network tab pengunjung | Paket tidak terkirim ke browser |

### Uji keamanan — login sebagai user **biasa**, tempel di Console (F12). Semua harus **gagal**
```js
// 1. Naikkan diri jadi admin
const { data: u } = await window.supabase.auth.getUser();
await window.supabase.from('profiles').update({ role:'admin' }).eq('id', u.user.id);
console.log(await window.supabase.from('profiles').select('role').eq('id', u.user.id));
// HARUS tetap "customer"

// 2. Pesanan palsu berstatus lunas
console.log(await window.supabase.from('orders').insert({
  order_id:'UJI-'+Date.now(), user_id:u.user.id, customer_name:'Uji',
  items:[], total:0, status:'paid', paid_at:new Date().toISOString() }));
// HARUS error policy

// 3. Manipulasi harga
console.log(await window.supabase.rpc('place_order', {
  p_order_id:'UJI-'+Date.now(),
  p_items:[{product_id:8, name:'Durian', price:1, quantity:10}],
  p_total:1, p_customer_name:'Uji', p_customer_email:null,
  p_customer_phone:null, p_shipping:{}, p_payment_method:'qris' }));
// HARUS "Total pesanan tidak sesuai harga terbaru"

// 4. Baca data pelanggan lain
console.log(await window.supabase.from('profiles').select('*'));
// HARUS hanya 1 baris: milikmu
```
> Kalau `window.supabase` tidak ada, tambahkan sementara `window.supabase = supabase` di `src/lib/supabase.ts` — **hapus lagi sebelum push.**

### CSP
CSP saya pasang **Report-Only**: hanya melapor di Console, tidak memblokir apa pun, jadi tampilan aman. Setelah beberapa hari tanpa laporan pelanggaran, ubah nama header di `vercel.json` dari `Content-Security-Policy-Report-Only` menjadi `Content-Security-Policy`.

---

## 6. Checklist pre-launch & migrasi domain

**Env**
- Public (boleh terlihat di bundle): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MIDTRANS_CLIENT_KEY` — keamanannya bergantung RLS, bukan kerahasiaan.
- Secret (hanya di Supabase Secrets, **jangan pernah** `VITE_`): `MIDTRANS_SERVER_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Verifikasi tidak bocor: `npm run build && grep -r "SB-Mid-server\|service_role" dist/` → **harus kosong**.
- Cek riwayat git: `git log -p -- .env`. Kalau `.env` pernah ter-commit, **rotate kuncinya** — hapus file saja tidak cukup.

**Auth hardening (dashboard Supabase)**
- Authentication → Providers → aktifkan **Confirm email**
- Minimum password length 8+, aktifkan leaked-password protection
- Rate limit login/signup: Authentication → Rate Limits
- Aktifkan 2FA di akun Google yang jadi admin — akun admin adalah satu titik kegagalan

**Midtrans sandbox → production**
1. Selesaikan verifikasi merchant
2. Ganti `VITE_MIDTRANS_CLIENT_KEY` ke client key production
3. `supabase secrets set MIDTRANS_SERVER_KEY=... MIDTRANS_IS_PRODUCTION=true`
4. `VITE_MIDTRANS_IS_PRODUCTION=true` di Vercel
5. Daftarkan Notification URL production
6. Uji 1 transaksi nominal kecil (Rp 1.000) end-to-end sampai status `paid` otomatis

**Pindah ke domain berbayar — 5 tempat yang harus diubah bersamaan**
1. Supabase → Authentication → URL Configuration → Site URL + Redirect URLs (tambahkan domain baru, **jangan hapus** yang lama sebelum DNS propagasi selesai)
2. `supabase secrets set ALLOWED_ORIGINS="https://domainbaru.com,https://www.domainbaru.com"`
3. Google Cloud Console → OAuth → Authorized redirect URIs (untuk login Google)
4. `public/robots.txt` + `public/sitemap.xml` → ganti `GANTI-DENGAN-DOMAINMU`
5. Webhook Midtrans tidak perlu diubah (menunjuk ke Supabase, bukan ke domainmu)

**Backup & monitoring**
- Supabase → Database → Backups (aktifkan daily; free tier terbatas — pertimbangkan Pro sebelum transaksi nyata)
- Error tracking: Sentry free tier
- Uji di HP asli (Android Chrome + iOS Safari), bukan hanya DevTools

**Privasi / UU PDP** — belum dibuat, disarankan sebelum launch:
- Halaman Kebijakan Privasi & Syarat-Ketentuan (data apa yang dikumpulkan, untuk apa, berapa lama disimpan, cara minta hapus)
- Minimalkan data: saat ini nama/email/telepon/alamat — semua memang perlu untuk pengiriman, jadi sudah wajar
- Retensi: pertimbangkan hapus/anonimkan alamat pesanan >2 tahun

---

## 7. Yang masih belum aman (jujur)

1. **QRIS manual tetap berbasis kepercayaan.** Pembeli klik "Saya Sudah Bayar" → pesanan `pending`. Tidak ada verifikasi otomatis; admin harus cek mutasi. Untuk otomatis, perlu QRIS dinamis lewat Midtrans (masuk alur webhook yang sudah ada).
2. **Bucket storage masih publik.** Siapa pun yang tahu URL bisa lihat avatar. Untuk foto profil umumnya diterima; kalau mau ketat perlu signed URL — **itu akan mengubah kode komponen**.
3. **Belum ada rate limiting di form ulasan/kontak** dan belum ada honeypot. Sanitasi XSS sendiri sudah ditangani React (auto-escape) selama tidak ada `dangerouslySetInnerHTML` — saya cek, tidak ada.
4. **CSP masih Report-Only** (sengaja, agar tampilan tidak pecah).
5. **Titik buta audit saya:** konfigurasi dashboard Supabase, riwayat git, hasil `npm audit`, dan konfigurasi akun Midtrans. Ketiganya di luar jangkauan source code.
6. **Patch ini belum pernah dijalankan di database aslimu.** Saya menulisnya dari pembacaan kode dan memeriksa sintaks SQL/TS, tapi hanya langkah 1–5 di §5 yang bisa membuktikan ia benar-benar bekerja. **Build `npm run build` juga belum saya jalankan** karena sandbox tanpa `node_modules` dan tanpa akses jaringan — jalankan lokal sebelum push.
