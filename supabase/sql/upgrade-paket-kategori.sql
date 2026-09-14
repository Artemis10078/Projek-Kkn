-- ============================================================
-- Candimulyo Park Tour - Upgrade: Kategori Paket (buah / panahan)
-- Menyamakan isi tabel paket dengan daftar paket terbaru.
-- Aman dijalankan berulang (idempotent).
-- Jalankan SETELAH setup.sql dan upgrade-candimulyo.sql.
-- ============================================================

-- 1) Tambah kolom kategori pada tabel paket
alter table public.archery_packages
  add column if not exists category text not null default 'panahan';

-- Batasi nilai kategori agar tidak salah isi dari dashboard admin
alter table public.archery_packages
  drop constraint if exists archery_packages_category_check;

alter table public.archery_packages
  add constraint archery_packages_category_check
  check (category in ('panahan', 'buah'));

update public.archery_packages
  set category = 'panahan'
  where category is null or category = '';

-- 2) Hapus paket lama yang sudah tidak dipakai
delete from public.archery_packages
  where name in ('Paket 1 - Pemula', 'Paket 2 - Reguler');

-- 3) Tambah paket baru (hanya jika namanya belum ada)
insert into public.archery_packages
  (category, name, tagline, price, duration, arrows, capacity, includes, description, popular, active, sort)
select t.category, t.name, t.tagline, t.price, t.duration, t.arrows, t.capacity,
       t.includes::jsonb, t.description, t.popular, t.active, t.sort
from (values
  ('buah','Paket Buah Segar','Buah hasil dari perkebunan yang unik dan juga bisa dinikmati',100000,
   '45 menit','10 Aneka Buah Unik','1-10 orang',
   '["Sepeda bersama","Pendampingan instruktur","Buah unik seperti Black Sappote dan Buah Ajaib"]',
   'Cocok untuk pemula yang ingin mencoba sensasi buah dari perkebunan Candimulyo pertama kali.',false,true,1),
  ('buah','Paket Buah dan Panah','Paling dicari',150000,
   '60 menit','30 anak panah','4 orang',
   '["Sepeda Bersama","Sewa busur & anak panah","Pendampingan instruktur","Target jarak ganda","Buah unik seperti Black Sappote dan Buah Ajaib"]',
   'Durasi lebih panjang dengan lebih banyak anak panah untuk berlatih lebih serius.',true,true,2),
  ('panahan','Paket 5 Anak Panah','Coba-coba seru',20000,'30 menit','5 anak panah','1 orang',
   '["Sewa busur & anak panah","Pendampingan instruktur"]',
   'Paket hemat untuk mencoba 5 tembakan.',false,true,4),
  ('panahan','Paket 10 Anak Panah','Lebih puas ngemil',50000,'60 menit','10 anak panah','1-2 orang',
   '["Sewa busur & anak panah","Pendampingan instruktur","Snack & Minuman"]',
   '10 tembakan lengkap dengan snack dan minuman penyegar.',false,true,5)
) as t(category text, name text, tagline text, price numeric, duration text, arrows text,
       capacity text, includes text, description text, popular boolean, active boolean, sort int)
where not exists (
  select 1 from public.archery_packages a where a.name = t.name
);

-- 4) Samakan detail Paket 3 - Rombongan dengan versi terbaru
update public.archery_packages set
  category = 'panahan',
  tagline = 'Seru bareng keluarga',
  price = 100000,
  duration = '90 menit',
  arrows = 'Anak panah tanpa batas',
  capacity = '3 - 5 orang',
  includes = '["Sewa busur & anak panah","Pendampingan instruktur","Target jarak ganda","Air mineral & snack","Dokumentasi foto"]'::jsonb,
  description = 'Paket hemat untuk keluarga atau rombongan yang ingin bermain bersama.',
  popular = false,
  active = true,
  sort = 3
where name = 'Paket 3 - Rombongan';

-- 5) Cek hasil
-- select category, name, price, sort from public.archery_packages order by category, sort;
