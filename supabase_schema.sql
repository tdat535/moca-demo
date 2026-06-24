-- ============================================================
-- MOCA Living - Database Schema hoàn chỉnh
-- Có thể chạy lại nhiều lần mà không lỗi (idempotent)
-- Chạy trong Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. PROFILES ──
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  address text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

drop policy if exists "Users insert own profile" on profiles;
create policy "Users insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Tự tạo profile khi user đăng ký
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ── 2. CATEGORIES ──
create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  icon text default '',
  description text default '',
  parent_id bigint references categories(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_categories_parent on categories(parent_id);

alter table categories enable row level security;

drop policy if exists "Categories public read" on categories;
create policy "Categories public read"
  on categories for select using (true);

drop policy if exists "Admin manage categories" on categories;
create policy "Admin manage categories"
  on categories for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 3. PRODUCTS ──
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  category_id bigint references categories(id) on delete set null,
  price bigint not null default 0,
  original_price bigint not null default 0,
  images jsonb not null default '[]'::jsonb,
  description text not null default '',
  content jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  stock int not null default 0,
  rating numeric(2,1) not null default 0,
  reviews int not null default 0,
  sold int not null default 0,
  is_new boolean not null default false,
  is_sale boolean not null default false,
  is_featured boolean not null default false,
  material text default '',
  brand text default '',
  color text default '',
  dimensions text default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_is_sale on products(is_sale) where is_sale = true;
create index if not exists idx_products_is_new on products(is_new) where is_new = true;
create index if not exists idx_products_created on products(created_at desc);

alter table products enable row level security;

drop policy if exists "Products public read" on products;
create policy "Products public read"
  on products for select using (true);

drop policy if exists "Admin manage products" on products;
create policy "Admin manage products"
  on products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 4. ORDERS ──
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null default '',
  customer_email text not null default '',
  customer_address text not null default '',
  note text,
  payment_method text not null default 'cod' check (payment_method in ('cod', 'bank')),
  items jsonb not null default '[]'::jsonb,
  total_price bigint not null default 0,
  coupon_code text,
  discount_amount bigint not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);

alter table orders enable row level security;

drop policy if exists "Users read own orders" on orders;
create policy "Users read own orders"
  on orders for select
  using (auth.uid() = user_id);

drop policy if exists "Anyone can place order" on orders;
create policy "Anyone can place order"
  on orders for insert
  with check (true);

drop policy if exists "Admin manage orders" on orders;
create policy "Admin manage orders"
  on orders for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 5. REVIEWS ──
create table if not exists reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_reviews_rating on reviews(rating);

alter table reviews enable row level security;

drop policy if exists "Reviews public read" on reviews;
create policy "Reviews public read"
  on reviews for select using (true);

drop policy if exists "Anyone can add review" on reviews;
create policy "Anyone can add review"
  on reviews for insert with check (true);

drop policy if exists "Admin delete reviews" on reviews;
create policy "Admin delete reviews"
  on reviews for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Tự cập nhật rating trung bình và số reviews trên products
create or replace function update_product_rating()
returns trigger as $$
declare
  p_id bigint;
begin
  p_id := coalesce(new.product_id, old.product_id);
  update products set
    rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where product_id = p_id), 0),
    reviews = (select count(*) from reviews where product_id = p_id)
  where id = p_id;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_product_rating on reviews;
create trigger trg_update_product_rating
  after insert or delete on reviews
  for each row execute function update_product_rating();


-- ── 6. COUPONS ──
create table if not exists coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_percent int not null check (discount_percent between 1 and 100),
  min_order bigint not null default 0,
  expires_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_coupons_code on coupons(code);

alter table coupons enable row level security;

drop policy if exists "Active coupons public read" on coupons;
create policy "Active coupons public read"
  on coupons for select using (true);

drop policy if exists "Admin manage coupons" on coupons;
create policy "Admin manage coupons"
  on coupons for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 7. BANNERS ──
create table if not exists banners (
  id bigint generated always as identity primary key,
  image_url text not null,
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table banners enable row level security;

drop policy if exists "Banners public read" on banners;
create policy "Banners public read"
  on banners for select using (true);

drop policy if exists "Admin manage banners" on banners;
create policy "Admin manage banners"
  on banners for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 8. CARTS ──
create table if not exists carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function update_carts_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists carts_updated_at on carts;
create trigger carts_updated_at
  before update on carts
  for each row execute function update_carts_timestamp();

alter table carts enable row level security;

drop policy if exists "Users manage own cart" on carts;
create policy "Users manage own cart"
  on carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 9. SETTINGS (cài đặt cửa hàng) ──
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'MOCA Living',
  phone1 text not null default '',
  phone2 text not null default '',
  address text not null default '',
  working_hours text not null default 'T2 – CN: 8h00 – 21h00',
  zalo_phone text not null default '',
  facebook_url text not null default '',
  tiktok_url text not null default '',
  bank_id text not null default '',
  bank_account_no text not null default '',
  bank_account_name text not null default '',
  updated_at timestamptz not null default now()
);

-- Chèn row mặc định
insert into settings (id) values (1) on conflict (id) do nothing;

alter table settings enable row level security;

drop policy if exists "Settings public read" on settings;
create policy "Settings public read"
  on settings for select using (true);

drop policy if exists "Admin update settings" on settings;
create policy "Admin update settings"
  on settings for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- ── 10. WISHLISTS (yêu thích theo tài khoản) ──
create table if not exists wishlists (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_wishlists_user on wishlists(user_id);

alter table wishlists enable row level security;

drop policy if exists "Users manage own wishlist" on wishlists;
create policy "Users manage own wishlist"
  on wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 10. ADDRESSES (nhiều địa chỉ giao hàng) ──
create table if not exists addresses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Nhà',
  full_name text not null default '',
  phone text not null default '',
  address text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_addresses_user on addresses(user_id);

alter table addresses enable row level security;

drop policy if exists "Users manage own addresses" on addresses;
create policy "Users manage own addresses"
  on addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 11. ORDER STATUS HISTORY (lịch sử trạng thái đơn hàng) ──
create table if not exists order_status_history (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_history_order on order_status_history(order_id);

alter table order_status_history enable row level security;

drop policy if exists "Users read own order history" on order_status_history;
create policy "Users read own order history"
  on order_status_history for select
  using (
    exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "System insert order history" on order_status_history;
create policy "System insert order history"
  on order_status_history for insert
  with check (true);

-- Tự ghi lịch sử khi đổi trạng thái đơn hàng
create or replace function log_order_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into order_status_history (order_id, old_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_order_status_change on orders;
create trigger trg_order_status_change
  after update on orders
  for each row execute function log_order_status_change();

-- Tự ghi trạng thái 'pending' khi tạo đơn mới
create or replace function log_order_created()
returns trigger as $$
begin
  insert into order_status_history (order_id, old_status, new_status)
  values (new.id, null, new.status);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_order_created on orders;
create trigger trg_order_created
  after insert on orders
  for each row execute function log_order_created();


-- ── 12. NOTIFICATIONS (thông báo) ──
create table if not exists notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  type text not null default 'info' check (type in ('info', 'order', 'promo', 'system')),
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_unread on notifications(user_id, is_read) where is_read = false;

alter table notifications enable row level security;

drop policy if exists "Users read own notifications" on notifications;
create policy "Users read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on notifications;
create policy "Users update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

drop policy if exists "System insert notifications" on notifications;
create policy "System insert notifications"
  on notifications for insert
  with check (true);

-- Tự thông báo admin khi có đơn hàng mới
create or replace function notify_admin_new_order()
returns trigger as $$
begin
  insert into notifications (user_id, title, body, type, link)
  select p.id,
    'Đơn hàng mới #' || new.id,
    new.customer_name || ' - ' || to_char(new.total_price, 'FM999,999,999') || '₫',
    'order',
    '/admin'
  from profiles p where p.role = 'admin';
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_notify_new_order on orders;
create trigger trg_notify_new_order
  after insert on orders
  for each row execute function notify_admin_new_order();


-- ── 13. STOCK & SOLD TRIGGERS (chỉ xử lý khi giao hàng / hủy) ──

-- Xoá trigger cũ: không còn trừ stock khi đặt hàng nữa
drop trigger if exists trg_decrease_stock on orders;
drop function if exists decrease_stock_on_order();

create or replace function handle_order_status_stock()
returns trigger as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(new.items)
  loop
    -- Chuyển sang 'delivered': trừ stock + cộng sold
    if new.status = 'delivered' and old.status != 'delivered' then
      update products
      set stock = greatest(stock - (item->>'qty')::int, 0),
          sold = sold + (item->>'qty')::int
      where id = (item->>'product_id')::bigint;
    end if;

    -- Chuyển từ 'delivered' sang 'cancelled': hoàn stock + giảm sold
    if new.status = 'cancelled' and old.status = 'delivered' then
      update products
      set stock = stock + (item->>'qty')::int,
          sold = greatest(sold - (item->>'qty')::int, 0)
      where id = (item->>'product_id')::bigint;
    end if;
  end loop;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_order_status_stock on orders;
create trigger trg_order_status_stock
  after update on orders
  for each row execute function handle_order_status_stock();


-- ── 14. STORAGE BUCKET ──
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "Public read images" on storage.objects;
create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists "Admin upload images" on storage.objects;
create policy "Admin upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admin delete images" on storage.objects;
create policy "Admin delete images"
  on storage.objects for delete
  using (
    bucket_id = 'images'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
