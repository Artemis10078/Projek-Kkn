# Keputusan yang diterapkan setelah audit (Fase 0 lanjutan)

Dokumen ini mencatat empat keputusan pengelola dan bagaimana masing-masing
diterapkan, termasuk hal yang sengaja TIDAK diubah.

---

## 1. QRIS dijadikan alur pembayaran utama

**Berkas:** `src/app/pages/CheckoutPage.tsx`

- Default `payMethod` sudah `"qris"` sejak awal, jadi tidak ada perubahan logika.
- Tombol QRIS diberi label kecil **"Disarankan"**.
- Teks bantuan diperjelas: pesanan QRIS masuk dengan status **Menunggu Pembayaran**
  dan dikonfirmasi admin setelah bukti pembayaran diterima.
- **Midtrans TIDAK dihapus.** Tombolnya tetap ada dan tetap berfungsi penuh.

### Mengapa ini pilihan paling aman

Keamanan alur pembayaran tidak ditentukan oleh metode yang dipilih pengunjung,
melainkan oleh **siapa yang berhak menetapkan status `paid`**. Karena itu:

| Lapisan | Aturan |
|---|---|
| Pembuatan pesanan | Pengunjung hanya boleh membuat pesanan `status = 'pending'`, `paid_at = null` (policy `orders_insert_own`) |
| Harga & total | Dihitung ulang di server oleh `compute_order_total`; total dari browser hanya dibandingkan, tidak dipercaya |
| Pelunasan Midtrans | Hanya webhook `midtrans-webhook` yang boleh menaikkan status, setelah `signature_key` SHA-512 diverifikasi |
| Pelunasan QRIS | Hanya admin (policy `orders_admin_update`), manual, setelah mencocokkan mutasi masuk |

Artinya QRIS manual **tidak menambah lubang keamanan baru**: pesanan tetap
`pending` sampai ada manusia berwenang yang mengonfirmasi. Risikonya murni
operasional (admin harus rajin cek mutasi), bukan risiko keamanan. Sebaliknya,
menghapus Midtrans justru akan menghapus satu-satunya jalur pelunasan otomatis
yang terverifikasi kriptografis — jadi keduanya dipertahankan.

**Konsekuensi operasional yang perlu Anda tahu:** dengan QRIS sebagai jalur
utama, tidak ada sistem yang tahu pesanan sudah dibayar kecuali admin
memeriksanya. Stok sudah dipotong saat pesanan dibuat, sehingga pesanan iseng
yang tidak dibayar akan menahan stok. Disarankan rutin membatalkan pesanan
`pending` yang lewat 1x24 jam agar stok kembali.

---

## 2. Code splitting terbatas

**Berkas baru:** `src/app/components/RouteFallback.tsx`,
`src/app/components/immersive/LazyImmersive.tsx`

| Dipisah (lazy) | Tidak dipisah (sesuai instruksi) |
|---|---|
| `AdminDashboard` (rute `/admin`) | `HomePage` |
| `AdminKerisPanel` (tab Keris) | `BuahPage`, `TumbuhanPage`, `KerisPage`, `WisataPage` |
| `AdminArcheryPanel` (tab Panahan) | `CartDrawer` |
| `MistCanvas` | `CheckoutPage` |
| `Tilt3DCard` | `LoginPage`, `OrdersPage`, `ProfilePage`, `WishlistPage`, `ContactPage` |

### Strategi anti-flicker

- **Rute `/admin`** → `RouteFallback`: `PageBanner` + grid `SkeletonCard`.
  Kerangka halaman langsung tampil, bukan layar kosong atau spinner polos.
- **Tab admin** → `PanelFallback`: grid `SkeletonCard` saja (tanpa banner,
  karena banner & tab bar sudah tampil di halaman induk).
- **`MistCanvas`** → fallback `null`. Ini latar dekoratif; ketiadaannya selama
  sesaat tidak terlihat dan tidak menggeser layout.
- **`Tilt3DCard`** → fallback merender **children di dalam `<div>` dengan
  `className` yang sama**. Jadi kartu langsung tampil utuh; yang datang
  belakangan hanya efek miringnya. Nol flicker, nol layout shift.

Halaman publik yang memakai `Tilt3DCard` (`HomePage`, `KerisPage`,
`WisataPage`) hanya berubah baris impornya — menunjuk ke `LazyImmersive`
sebagai pengganti transparan. Tidak ada JSX di halaman tersebut yang diubah.

---

## 3. Identitas merek "FreshGrove" dibersihkan

Diperlakukan sebagai **bug**, bukan perubahan desain. Nama tidak di-hardcode:
`LoginPage.tsx` sekarang membaca `SITE.name` dari `src/lib/config.ts`.

| Berkas | Perubahan |
|---|---|
| `src/app/pages/LoginPage.tsx` | `FreshGrove` → `{SITE.name}` (satu-satunya lokasi yang terlihat pengunjung) |
| `package.json` | `"@figma/my-make-file"` → `"candimulyo-park-tour"` |
| `src/lib/products.ts` | komentar |
| `src/styles/globals.css`, `src/styles/theme.css` | komentar |
| `supabase/sql/setup.sql`, `schema.sql`, `products.sql` | komentar header |
| `DEPLOY.md` | judul, nama repo & domain contoh |

**`index.html` tidak perlu diubah** — pada Fase 0 sebelumnya title, description,
OG, dan JSON-LD sudah memakai "Candimulyo Park Tour".

### Kunci localStorage: diganti TAPI dimigrasikan

`freshgrove-cart` / `-wishlist` / `-theme` → `candimulyo-*`.

Mengganti kunci begitu saja akan **menghapus keranjang, wishlist, dan pilihan
tema semua pengunjung lama** saat deploy. Karena itu ketiga context sekarang
membaca kunci baru dulu, dan **jatuh ke kunci lama bila kunci baru belum ada**
(`LEGACY_STORAGE_KEY`). Data lama ikut terbawa sekali, lalu tersimpan di kunci
baru. Tiga baris `LEGACY_STORAGE_KEY` inilah satu-satunya sisa kata
"freshgrove" di kode, dan itu memang disengaja. Boleh dihapus setelah beberapa
bulan.

---

## 4. `saveProduct` kini menyimpan gallery / tags / nutrition

**Berkas:** `src/app/pages/AdminDashboard.tsx`, `src/app/components/ProductModal.tsx`

### Akar masalah

Objek `row` di `saveProduct` tidak pernah menyertakan `gallery`, `tags`,
`nutrition`, dan `badge_color` — padahal keempat kolom itu **sudah ada** di
`setup.sql` dan sudah dibaca oleh `mapRowToProduct`. Akibatnya produk buatan
admin selalu lebih miskin daripada produk seed, tanpa pesan galat apa pun.

### UI: tertutup secara default

Keempat field diletakkan dalam `Collapsible` **"Detail tambahan (opsional)"**
yang tertutup saat modal dibuka (`setDetailsOpen(false)` setiap kali editor
dibuka). Form admin sekilas tetap sama seperti sebelumnya.

Field `nutrition` hanya dirender bila `type` adalah `buah` atau `tumbuhan`.
Keris dan paket panahan/wisata dikelola di `AdminKerisPanel` /
`AdminArcheryPanel` yang terpisah, sehingga tidak terpengaruh sama sekali.

### Validasi ringan

| Aspek | Aturan |
|---|---|
| Jumlah galeri | maksimal **6** URL (`MAX_GALLERY_IMAGES`), duplikat dibuang |
| Tipe/URL galeri | wajib `http:`/`https:`; ekstensi `jpg, jpeg, png, webp, gif, avif`; URL tanpa ekstensi diterima hanya bila `https:` (Supabase Storage & Unsplash sering tanpa ekstensi). Skema seperti `javascript:` ditolak |
| URL tidak valid | diabaikan, dan admin diberi tahu jumlahnya |
| Tag | karakter `< > " ' \`` dibuang, maks. 24 karakter per tag, maks. **8** tag, duplikat dibuang |
| Nutrisi | hanya angka ≥ 0 yang disimpan; field kosong dibuang |

### Rapi saat kosong

- Nilai kosong disimpan sebagai **`null`**, bukan `[]` atau `{}`.
- `ProductModal` sudah menyaring `tags` dengan `length > 0`, jadi aman.
- `ProductModal` **diperbaiki**: blok nutrisi dulu tampil bila objek `nutrition`
  ada meski isinya kosong — hasilnya empat kotak berisi tanda `-` yang terlihat
  seperti bagian rusak. Sekarang blok itu hanya tampil bila **minimal satu**
  nilainya berupa angka.
- `ProductCard` tidak menampilkan gallery/tags/nutrition sama sekali, jadi tidak
  ada section kosong yang mungkin menganga di sana.

---

## Yang perlu Anda lakukan / verifikasi manual

1. **`npm install && npm run build`** di lokal. Build penuh belum pernah
   dijalankan (sandbox tanpa `node_modules` dan tanpa jaringan); yang sudah
   diverifikasi hanya sintaks.
2. **Jalankan `supabase/sql/99-security-hardening.sql` SEBELUM push**, lalu
   pastikan akun Anda masih `role = 'admin'`.
3. **Uji tab admin Keris & Panahan** — pastikan skeleton muncul lalu panel
   tampil normal (memastikan code splitting per tab bekerja).
4. **Uji simpan produk** dengan Detail tambahan diisi, lalu buka produk itu di
   halaman publik: tag dan nutrisi harus muncul. Simpan juga produk **tanpa**
   mengisi Detail tambahan: tidak boleh ada blok kosong di modal produk.
5. **Cek keranjang lama** — buka situs dengan browser yang sebelumnya punya isi
   keranjang; isinya harus tetap ada (migrasi kunci localStorage).
6. **Isi placeholder** `https://GANTI-DENGAN-DOMAINMU` di `public/robots.txt`
   dan `public/sitemap.xml`.
7. **Deploy 2 Edge Function**; `midtrans-webhook` wajib `--no-verify-jwt`.
