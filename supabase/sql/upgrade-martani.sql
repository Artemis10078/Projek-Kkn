-- ============================================================
-- Martani Park Tour - Upgrade: Keris, Panahan, Tipe Produk
-- Aman dijalankan berulang (idempotent). Jalankan SETELAH setup.sql.
-- ============================================================

-- 1) PRODUK: tambah kolom tipe (buah / tumbuhan)
alter table public.products
  add column if not exists type text not null default 'buah';

update public.products set type = 'buah' where type is null;

-- 2) TABEL KERIS (galeri / pameran, kelola lewat dashboard admin)
create table if not exists public.keris (
  id bigint generated always as identity primary key,
  name text not null,
  era text,
  origin text,
  dapur text,
  pamor text,
  description text,
  image text,
  gallery jsonb default '[]'::jsonb,
  featured boolean default false,
  sort int default 0,
  created_at timestamptz default now()
);

alter table public.keris enable row level security;

drop policy if exists "keris read" on public.keris;
create policy "keris read" on public.keris for select using (true);

drop policy if exists "keris admin write" on public.keris;
create policy "keris admin write" on public.keris for all
  using (public.is_admin()) with check (public.is_admin());

-- 3) TABEL PAKET PANAHAN
create table if not exists public.archery_packages (
  id bigint generated always as identity primary key,
  name text not null,
  tagline text,
  price numeric not null default 0,
  duration text,
  arrows text,
  capacity text,
  includes jsonb default '[]'::jsonb,
  description text,
  image text,
  popular boolean default false,
  active boolean default true,
  sort int default 0,
  created_at timestamptz default now()
);

alter table public.archery_packages enable row level security;

drop policy if exists "archery read" on public.archery_packages;
create policy "archery read" on public.archery_packages for select using (true);

drop policy if exists "archery admin write" on public.archery_packages;
create policy "archery admin write" on public.archery_packages for all
  using (public.is_admin()) with check (public.is_admin());

-- 4) SEED TUMBUHAN (hanya jika belum ada produk bertipe tumbuhan)
insert into public.products (name, category, price, unit, rating, reviews, image, origin, description, stock, tags, type, badge, badge_color)
select t.name, t.category, t.price, t.unit, t.rating, t.reviews, t.image, t.origin, t.description, t.stock, t.tags::jsonb, t.type, t.badge, t.badge_color
from (values
  ('Monstera Deliciosa','Tanaman Hias',120000,'per pot',4.8,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Feuille%20Monstera%20deliciosa.jpg?width=700','Nursery Martani','Tanaman hias daun ikonik berlubang alami, mudah dirawat dan menyegarkan ruangan.',25,'["Indoor","Populer"]','tumbuhan','Populer','#2D6A4F'),
  ('Lidah Mertua (Sansevieria)','Tanaman Hias',65000,'per pot',4.7,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Snake%20plant.jpg?width=700','Nursery Martani','Tanaman penyaring udara yang sangat tahan banting, cocok untuk pemula.',40,'["Indoor","Tahan Banting"]','tumbuhan',null,null),
  ('Aglaonema Merah','Tanaman Hias',95000,'per pot',4.8,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Aglaonema%20modestum.jpg?width=700','Nursery Martani','Aglaonema dengan corak daun cantik, primadona koleksi tanaman hias.',18,'["Indoor","Berwarna"]','tumbuhan','Favorit','#E63946'),
  ('Anggrek Bulan',  'Tanaman Hias',85000,'per pot',4.9,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Anggrek%20Bulan.jpg?width=700','Kebun Martani','Anggrek bulan (Phalaenopsis), bunga pesona nasional Indonesia yang elegan.',22,'["Bunga","Elegan"]','tumbuhan',null,null),
  ('Bonsai Beringin','Bonsai',350000,'per pot',4.9,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Acer%20palmatum-Bonsai.jpg?width=700','Kebun Martani','Bonsai dengan bentuk artistik, mahakarya hidup untuk penghias ruangan premium.',8,'["Premium","Seni"]','tumbuhan','Premium','#C9A227'),
  ('Kaktus Mini','Sukulen & Kaktus',25000,'per pot',4.6,0,'https://commons.wikimedia.org/wiki/Special:FilePath/Small%20size%20cactus%20assortment%20in%20a%20pot.jpg?width=700','Nursery Martani','Kaktus mini lucu dalam pot, perawatan super mudah dan cocok untuk meja kerja.',60,'["Mini","Mudah Rawat"]','tumbuhan',null,null)
) as t(name text, category text, price numeric, unit text, rating numeric, reviews int, image text, origin text, description text, stock int, tags text, type text, badge text, badge_color text)
where not exists (select 1 from public.products where type = 'tumbuhan');

-- 5) SEED KERIS (hanya jika tabel keris masih kosong)
insert into public.keris (name, era, origin, dapur, pamor, description, image, featured, sort)
select t.name, t.era, t.origin, t.dapur, t.pamor, t.description, t.image, t.featured, t.sort
from (values
  ('Keris Naga Sasra','Abad ke-18','Surakarta, Jawa Tengah','Naga Sasra','Beras Wutah','Keris luk tiga belas dengan ukiran naga pada bilah, melambangkan kewibawaan dan kekuatan.','https://commons.wikimedia.org/wiki/Special:FilePath/Keris%20Naga%20Sonobudoyo.jpg?width=800',true,1),
  ('Keris Semar Mesem','Abad ke-19','Yogyakarta','Semar Mesem','Wos Wutah','Dipercaya membawa wibawa dan kharisma bagi pemiliknya, dengan garap bilah halus.','https://commons.wikimedia.org/wiki/Special:FilePath/Keris%20Semar%20Mesem.jpg?width=800',true,2),
  ('Keris Alang','Abad ke-19','Sumatra Barat','Keris Panjang','Pamor Beras Wutah','Keris bilah panjang khas Melayu yang anggun, biasa dipakai dalam upacara adat.','https://commons.wikimedia.org/wiki/Special:FilePath/Keris%20Alang.jpg?width=800',false,3),
  ('Keris Cundrik','Abad ke-18','Jawa Tengah','Cundrik','Pamor Ngulit Semangka','Keris kecil pusaka yang dahulu menjadi senjata pendamping para bangsawan.','https://commons.wikimedia.org/wiki/Special:FilePath/Keris%20Cundrik.jpg?width=800',false,4),
  ('Keris Bali','Abad ke-19','Bali','Tilam Upih','Pamor Wengkon','Keris Bali dengan hulu berukir detail, kaya nilai seni dan ritual.','https://commons.wikimedia.org/wiki/Special:FilePath/Kris%20bali.jpg?width=800',true,5),
  ('Keris Sumatra','Abad ke-19','Sumatra','Bahari','Pamor Sanak','Keris koleksi museum dengan warangka kayu pilihan dan tempaan bilah berkarakter.','https://commons.wikimedia.org/wiki/Special:FilePath/Sumatra%20Keris-Dolch%20Museum%20Rietberg.jpg?width=800',false,6)
) as t(name text, era text, origin text, dapur text, pamor text, description text, image text, featured boolean, sort int)
where not exists (select 1 from public.keris);

-- 6) SEED PAKET PANAHAN (hanya jika tabel masih kosong)
insert into public.archery_packages (name, tagline, price, duration, arrows, capacity, includes, description, popular, active, sort)
select t.name, t.tagline, t.price, t.duration, t.arrows, t.capacity, t.includes::jsonb, t.description, t.popular, t.active, t.sort
from (values
  ('Paket 1 - Pemula','Coba-coba seru',25000,'30 menit','10 anak panah','1 orang','["Busur & 10 anak panah","Pendampingan dasar","Air mineral"]','Cocok untuk pemula yang ingin merasakan serunya memanah.',false,true,1),
  ('Paket 2 - Reguler','Paling diminati',50000,'60 menit','30 anak panah','1-2 orang','["Busur & 30 anak panah","Instruktur","Sertifikat partisipasi","Air mineral"]','Pengalaman memanah lebih puas dengan bimbingan instruktur.',true,true,2),
  ('Paket 3 - Rombongan','Hemat untuk grup',100000,'90 menit','Tanpa batas','3-5 orang','["Busur untuk grup","Anak panah tanpa batas","Instruktur khusus","Sertifikat","Snack & air mineral","Dokumentasi foto"]','Paket lengkap untuk keluarga, komunitas, atau acara gathering.',false,true,3)
) as t(name text, tagline text, price numeric, duration text, arrows text, capacity text, includes text, description text, popular boolean, active boolean, sort int)
where not exists (select 1 from public.archery_packages);
