-- =============================================================
-- 99-security-hardening.sql  (IDEMPOTEN -- aman dijalankan ulang)
--
-- Jalankan SETELAH: setup.sql -> upgrade-candimulyo.sql ->
-- upgrade-paket-kategori.sql, di Supabase SQL Editor.
--
-- Menutup:
--  (1) escalate role sendiri (user jadi admin)
--  (2) insert pesanan palsu berstatus paid
--  (3) manipulasi harga/total dari client
--  (4) tulis/timpa avatar milik orang lain
--  (5) ulasan tanpa batas panjang
--  (6) policy update orders yang terlalu longgar
--  (7) tabel tanpa RLS
-- =============================================================

-- ---------- (0) Pemeriksaan awal ----------
-- Kalau tabel products kosong, web memakai data seed lokal dan
-- dashboard admin masuk "mode lokal" (perubahan tidak tersimpan).
-- Skrip sengaja berhenti di sini supaya masalah itu ketahuan.
do $$
declare v_count int;
begin
  select count(*) into v_count from public.products;
  if v_count = 0 then
    raise exception 'Tabel products masih kosong. Jalankan setup.sql dan upgrade-candimulyo.sql lebih dulu, lalu ulangi skrip ini.';
  end if;
  raise notice 'Pemeriksaan awal OK: % produk ditemukan.', v_count;
end $$;

-- ---------- (0b) Pengaman kolom orders ----------
-- schema.sql (versi lama) membuat tabel orders TANPA kolom payment_method
-- dan paid_at, sedangkan setup.sql memilikinya. Kalau database dibuat dari
-- schema.sql, policy dan fungsi di bawah akan gagal dengan error 42703
-- (column does not exist). Tiga baris ini idempoten dan tidak mengubah apa pun
-- bila kolomnya memang sudah ada.
alter table public.orders add column if not exists payment_method text default 'qris';
alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists midtrans_token text;

-- ---------- (1) KRITIS: kunci kolom sensitif di profiles ----------
-- Policy profiles_update_own mengizinkan user meng-update barisnya,
-- TERMASUK kolom role. Trigger ini membekukan role/id/email/created_at
-- untuk pengguna biasa, tanpa menyentuh policy yang ada (tidak rekursif,
-- karena tidak ada query ke profiles di dalam trigger selain is_admin()
-- yang security definer).
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_jwt_role text;
begin
  begin
    v_jwt_role := coalesce(
      nullif(current_setting('request.jwt.claim.role', true), ''),
      current_setting('request.jwt.claims', true)::json->>'role',
      ''
    );
  exception when others then
    v_jwt_role := '';
  end;

  -- Diizinkan mengubah kolom sensitif:
  --  a) service_role (Edge Function dengan service key)
  --  b) SQL Editor / koneksi langsung (tanpa JWT dan tanpa auth.uid())
  --     -> jalur resmi mengangkat admin pertama
  --  c) admin yang sudah sah
  if v_jwt_role = 'service_role'
     or (v_jwt_role = '' and auth.uid() is null)
     or public.is_admin() then
    return new;
  end if;

  -- Pengguna biasa: kolom sensitif dipaksa kembali ke nilai lama.
  new.role := old.role;
  new.id := old.id;
  new.email := old.email;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_columns on public.profiles;
create trigger trg_protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ---------- (2) KRITIS: pesanan baru wajib pending ----------
drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and paid_at is null
    and midtrans_token is null
    and coalesce(payment_method, 'qris') in ('qris', 'midtrans')
    and total >= 0
  );

-- ---------- (3) KRITIS: harga dihitung ulang di server ----------
-- Pengaturan ongkir di database, nilai awal SAMA dengan konstanta
-- SHIPPING_FEE / FREE_SHIPPING_MIN di CheckoutPage.tsx.
-- KALAU MENGUBAH SALAH SATU, UBAH JUGA YANG SATUNYA, contoh:
--   update public.shop_settings set value = 12000 where key = 'shipping_fee';
create table if not exists public.shop_settings (
  key text primary key,
  value numeric not null
);
insert into public.shop_settings (key, value) values
  ('shipping_fee', 10000),
  ('free_shipping_min', 200000)
on conflict (key) do nothing;

alter table public.shop_settings enable row level security;
drop policy if exists shop_settings_read on public.shop_settings;
create policy shop_settings_read on public.shop_settings
  for select using (true);
drop policy if exists shop_settings_admin_write on public.shop_settings;
create policy shop_settings_admin_write on public.shop_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- Hitung total dari HARGA DI DATABASE, bukan dari client.
-- Baris tanpa product_id (mis. "Ongkos Kirim" dari CheckoutPage)
-- sengaja DILEWATI; ongkir ditambahkan sendiri oleh fungsi ini.
create or replace function public.compute_order_total(p_items jsonb)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_pid bigint;
  v_qty int;
  v_price numeric;
  v_subtotal numeric := 0;
  v_fee numeric;
  v_free numeric;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Format item tidak valid.';
  end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 100 then
    raise exception 'Jumlah item tidak wajar.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    -- lewati baris non-produk (contoh: Ongkos Kirim)
    if not (v_item ? 'product_id')
       or (v_item->>'product_id') is null
       or (v_item->>'product_id') !~ '^[0-9]+$' then
      continue;
    end if;

    v_pid := (v_item->>'product_id')::bigint;
    v_qty := coalesce(nullif(v_item->>'quantity', '') ::int, 0);
    if v_qty < 1 or v_qty > 1000 then
      raise exception 'Jumlah beli tidak wajar.';
    end if;

    select price into v_price from public.products where id = v_pid;
    if v_price is null then
      raise exception 'Produk dengan id % tidak ditemukan.', v_pid;
    end if;

    v_subtotal := v_subtotal + (v_price * v_qty);
  end loop;

  select value into v_fee from public.shop_settings where key = 'shipping_fee';
  select value into v_free from public.shop_settings where key = 'free_shipping_min';
  v_fee := coalesce(v_fee, 10000);
  v_free := coalesce(v_free, 200000);

  if v_subtotal > 0 and v_subtotal < v_free then
    return v_subtotal + v_fee;
  end if;
  return v_subtotal;
end;
$$;

revoke all on function public.compute_order_total(jsonb) from public;
grant execute on function public.compute_order_total(jsonb) to authenticated, service_role;

-- place_order ditulis ulang. TANDA TANGAN & RETURN TIDAK BERUBAH,
-- jadi frontend (db.ts) lama maupun baru tetap kompatibel.
-- Tambahan: validasi input, idempotensi order_id, total server-side,
-- email dari auth.users, pengurangan stok tetap pakai FOR UPDATE.
-- PERBAIKAN: fungsi place_order versi lama memakai nilai default pada
-- parameternya. PostgreSQL menolak "create or replace" yang menghapus default
-- (ERROR 42P13), jadi seluruh varian lama harus di-drop lebih dulu.
-- Blok di bawah menghapus SEMUA overload place_order apa pun tanda tangannya,
-- sehingga tidak ada fungsi kembar yang membuat pemanggilan jadi ambigu.
do $drop_place_order$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'place_order'
  loop
    execute format('drop function if exists %s cascade', r.sig);
    raise notice 'place_order lama dihapus: %', r.sig;
  end loop;
end
$drop_place_order$;

create or replace function public.place_order(
  p_order_id text,
  p_items jsonb,
  p_total numeric,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping jsonb,
  -- default 'qris' dipertahankan persis seperti setup.sql, supaya pemanggilan
  -- lama dengan 7 argumen tetap berfungsi.
  p_payment_method text default 'qris'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v_item jsonb;
  v_pid bigint;
  v_qty int;
  v_stock int;
  v_server_total numeric;
  v_order_uuid uuid;
  v_email text;
begin
  if v_uid is null then
    raise exception 'Harus login untuk memesan.';
  end if;
  if p_order_id is null or p_order_id !~ '^[A-Za-z0-9_-]{4,64}$' then
    raise exception 'Nomor pesanan tidak valid.';
  end if;
  if coalesce(p_payment_method, 'qris') not in ('qris', 'midtrans') then
    raise exception 'Metode pembayaran tidak dikenal.';
  end if;
  if p_customer_name is null or length(trim(p_customer_name)) = 0
     or length(p_customer_name) > 120 then
    raise exception 'Nama pemesan tidak valid.';
  end if;
  if p_customer_phone is not null and length(p_customer_phone) > 30 then
    raise exception 'Nomor telepon terlalu panjang.';
  end if;
  if p_shipping is not null and length(p_shipping::text) > 4000 then
    raise exception 'Data alamat terlalu panjang.';
  end if;

  -- Idempotensi: satu order_id hanya boleh dipakai sekali.
  if exists (select 1 from public.orders where order_id = p_order_id) then
    raise exception 'Nomor pesanan sudah dipakai.';
  end if;

  -- Total versi server. Total kiriman client hanya dicocokkan.
  v_server_total := public.compute_order_total(p_items);
  if abs(coalesce(p_total, -1) - v_server_total) > 0.01 then
    raise exception 'Total pesanan tidak sesuai harga terbaru. Muat ulang halaman lalu coba lagi.';
  end if;

  -- Email dari akun, bukan dari kiriman browser.
  select email into v_email from auth.users where id = v_uid;

  -- Kurangi stok. FOR UPDATE mengunci baris -> aman dari race condition
  -- (dua pembeli rebutan stok terakhir).
  for v_item in select * from jsonb_array_elements(p_items) loop
    if not (v_item ? 'product_id')
       or (v_item->>'product_id') is null
       or (v_item->>'product_id') !~ '^[0-9]+$' then
      continue;
    end if;
    v_pid := (v_item->>'product_id')::bigint;
    v_qty := coalesce(nullif(v_item->>'quantity', '') ::int, 0);

    select stock into v_stock from public.products where id = v_pid for update;
    if v_stock is null then
      raise exception 'Produk dengan id % tidak ditemukan.', v_pid;
    end if;
    if v_stock < v_qty then
      raise exception 'Stok tidak cukup untuk produk id %.', v_pid;
    end if;
    update public.products set stock = stock - v_qty where id = v_pid;
  end loop;

  insert into public.orders (
    order_id, user_id, customer_name, customer_email, customer_phone,
    items, total, status, payment_method, shipping_address
  ) values (
    p_order_id, v_uid, trim(p_customer_name), v_email, p_customer_phone,
    p_items, v_server_total, 'pending', coalesce(p_payment_method, 'qris'), p_shipping
  )
  returning id into v_order_uuid;

  return v_order_uuid;
end;
$fn$;

grant execute on function public.place_order(text, jsonb, numeric, text, text, text, jsonb, text) to authenticated;

-- ---------- (4) Storage: avatar hanya folder milik sendiri ----------
drop policy if exists auth_write_avatars on storage.objects;
create policy auth_write_avatars on storage.objects
  for all to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- (5) Batas panjang ulasan ----------
-- Dipasang NOT VALID dulu supaya baris lama yang kepanjangan (kalau ada)
-- tidak menggagalkan skrip; baris baru tetap divalidasi.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_comment_len_check') then
    alter table public.reviews
      add constraint reviews_comment_len_check check (char_length(comment) <= 1000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reviews_user_name_len_check') then
    alter table public.reviews
      add constraint reviews_user_name_len_check check (char_length(user_name) <= 120) not valid;
  end if;
end $$;

-- ---------- (6) Update/delete orders hanya admin ----------
-- PENTING: policy orders_admin_update WAJIB ada, karena dropdown status
-- di AdminDashboard meng-update tabel orders secara langsung.
drop policy if exists orders_update_own on public.orders;
drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists orders_admin_delete on public.orders;
create policy orders_admin_delete on public.orders
  for delete using (public.is_admin());

-- ---------- (7) Pastikan RLS menyala di semua tabel ----------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.shop_settings enable row level security;
do $$
begin
  if to_regclass('public.keris') is not null then
    execute 'alter table public.keris enable row level security';
  end if;
  if to_regclass('public.archery_packages') is not null then
    execute 'alter table public.archery_packages enable row level security';
  end if;
end $$;

-- ---------- (8) Laporan akhir ----------
do $$
declare v_txt text;
begin
  select string_agg(tablename, ', ') into v_txt
  from pg_tables
  where schemaname = 'public' and rowsecurity = false;
  if v_txt is null then
    raise notice 'OK: RLS aktif di seluruh tabel public.';
  else
    raise warning 'PERHATIAN: RLS masih MATI di tabel: %', v_txt;
  end if;
end $$;

-- ---------- Catatan operasional ----------
-- Mengangkat admin pertama (jalankan dari SQL Editor -- trigger (1)
-- sengaja mengizinkan jalur ini):
--   update public.profiles set role = 'admin'
--    where lower(trim(email)) = lower(trim('EMAIL_ANDA@gmail.com'))
--    returning email, role;
