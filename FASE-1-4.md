# Fase 1–4 — Perubahan yang Diterapkan

Semua perubahan di bawah ini **tidak menghapus fitur, halaman, route, atau komponen apa pun**.
Identitas visual situs publik tidak diubah: tidak ada palet baru, tidak ada font baru,
tidak ada layout yang dirombak. Yang ditambahkan hanyalah kontrol dan halaman baru.

## 1. Berkas BARU

| Berkas | Fungsi |
|---|---|
| `src/app/components/ConfirmDialog.tsx` | Dialog konfirmasi hapus bertema (mengganti `window.confirm()`) |
| `src/app/hooks/useDocumentMeta.ts` | Set title/description/OG + JSON-LD per halaman |
| `src/app/pages/PrivacyPage.tsx` | Kebijakan Privasi (UU 27/2022 PDP) |
| `src/app/pages/TermsPage.tsx` | Syarat & Ketentuan (pemesanan, pembayaran, pembatalan) |

## 2. Perubahan per berkas

| Berkas | Perubahan | Alasan |
|---|---|---|
| `src/app/App.tsx` | Route `/privasi` dan `/syarat-ketentuan` | Halaman legal wajib diakses |
| `src/app/components/Footer.tsx` | 2 tautan legal di kolom **Informasi** yang sudah ada | Tidak menambah kolom baru → layout footer tetap |
| `src/lib/i18n.ts` | 9 kunci baru di kamus **id** dan **en** | Tidak ada teks hardcode baru |
| `src/app/components/FruitCatalog.tsx` | Paginasi 12 produk/halaman + empty state dengan tombol *Reset filter* | Katalog panjang jadi berat; empty state lama tak punya jalan keluar |
| `src/app/pages/OrdersPage.tsx` | Timeline status: Dipesan → Dibayar → Diproses → Dikirim → Selesai; `cancelled` ditampilkan terpisah | Pembeli tahu posisi pesanannya; modal QRIS tetap utuh |
| `src/app/components/ReviewsSection.tsx` | `maxLength={1000}` + penghitung karakter | Menyamai CHECK constraint `reviews_comment_len_check` → ditolak di UI, bukan di server |
| `src/app/pages/AdminDashboard.tsx` | `confirm()` → `ConfirmDialog` | Konfirmasi destruktif yang aksesibel & tak bisa diblokir browser |
| `src/app/components/AdminKerisPanel.tsx` | idem | idem |
| `src/app/components/AdminArcheryPanel.tsx` | idem | idem |
| `src/app/pages/HomePage.tsx` | `useDocumentMeta` + JSON-LD `LocalBusiness` | SEO lokal |

## 3. Catatan jujur (batas yang TIDAK saya lewati)

1. **Koreksi audit saya sendiri.** Audit sebelumnya menyebut katalog belum punya
   pencarian/filter/sort/skeleton/empty state. Itu **salah** — `FruitCatalog.tsx`
   sudah punya semuanya. Yang benar-benar kurang hanya **paginasi**, dan itulah
   yang saya tambahkan. Begitu pula `prefers-reduced-motion`: **sudah ada** di
   `src/styles/globals.css` (baris 106 dan 382), jadi tidak saya ubah.
2. **Checkout TIDAK ditulis ulang ke `react-hook-form`.** Alur pembayaran baru
   saja diperkeras di Fase 0 (validasi total server-side, idempotensi `order_id`,
   pengurangan stok dengan `for update`). Menukar lapisan form di atas alur itu
   berisiko tinggi dengan manfaat kecil: validasi yang menentukan sudah ada di
   database, bukan di form. Validasi client tetap berjalan seperti sekarang.
3. **Meta per halaman berjalan di sisi browser.** Crawler yang tidak menjalankan
   JavaScript (pratinjau tautan WhatsApp/Facebook) hanya membaca meta statis di
   `index.html`. Pratinjau per halaman yang sempurna butuh SSR/prerender =
   mengubah stack, dan itu dilarang oleh brief Anda.
4. **`npm install` dan `vite build` belum pernah dijalankan** di lingkungan saya
   (tidak ada `node_modules`, tanpa jaringan). Yang terverifikasi adalah sintaks
   TypeScript/JSX, validitas `vercel.json`, dan validitas `sitemap.xml`.

## 4. Verifikasi manual setelah Anda tarik zip ini

```bash
npm install
npm run build      # WAJIB lulus sebelum push
npm run dev
```

Lalu cek satu per satu:

1. `/buah` dan `/tumbuhan` — paginasi muncul hanya bila produk > 12; ganti kategori → kembali ke halaman 1.
2. Cari kata acak (mis. `zzz`) → empty state + tombol **Reset filter** berfungsi.
3. `/orders` — timeline sesuai status; tombol QRIS masih muncul untuk status *Menunggu Pembayaran*.
4. `/admin` → Produk/Keris/Panahan → **Hapus** → dialog muncul, **Batal** tidak menghapus, **Hapus** menghapus.
5. Tulis ulasan > 1000 karakter → terhenti di 1000, penghitung berubah warna.
6. Footer → **Kebijakan Privasi** dan **Syarat & Ketentuan** terbuka; ganti bahasa ke English → label tautan ikut berubah.
7. Judul tab peramban berubah per halaman.

## 5. Masih menjadi tugas Anda (belum bisa saya lakukan dari sini)

- Jalankan `supabase/sql/99-security-hardening.sql` **sebelum** push.
- Deploy dua Edge Function dan daftarkan URL webhook di dashboard Midtrans.
- Ganti placeholder `https://GANTI-DENGAN-DOMAINMU` di `public/robots.txt` dan `public/sitemap.xml`.
- Pertimbangkan membatalkan pesanan `pending` yang lewat 24 jam agar stok kembali (konsekuensi QRIS manual).
