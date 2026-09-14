-- =========================================================
-- SETUP DATABASE UNTUK FRESHGROVE (Fruit Shop Catalog)
-- Jalankan script ini di: Supabase Dashboard -> SQL Editor
-- =========================================================

-- 1. Tabel PROFILES
-- Menyimpan data tambahan user (nama, role admin/customer)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- User boleh baca profile sendiri
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- User boleh update profile sendiri (tapi TIDAK boleh ubah role lewat policy ini)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admin boleh lihat semua profile (dipakai di dashboard, opsional)
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 2. FUNCTION + TRIGGER: otomatis buat row di profiles saat user baru daftar
-- (mengambil nama & foto dari Google OAuth jika ada)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Tabel ORDERS
-- Menyimpan data pesanan dari checkout
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  shipping_address jsonb,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','completed','cancelled')),
  midtrans_token text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Customer boleh lihat pesanan miliknya sendiri
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Customer boleh membuat pesanan miliknya sendiri
create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Admin boleh lihat & update semua pesanan
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =========================================================
-- 4. CARA MENJADIKAN AKUN SEBAGAI ADMIN
-- Setelah user mendaftar/login minimal sekali (sehingga muncul
-- di tabel profiles), jalankan query berikut dengan email
-- akun yang ingin dijadikan admin:
--
--   update public.profiles set role = 'admin' where email = 'emailkamu@gmail.com';
--
-- =========================================================
