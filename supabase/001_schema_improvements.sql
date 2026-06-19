-- ============================================================
-- MOCA Living — Bổ sung schema cho shop nội thất
-- Chạy trong Supabase → SQL Editor
-- ============================================================

-- ── 1. Cột bổ sung cho products (nội thất) ──
ALTER TABLE products ADD COLUMN IF NOT EXISTS material text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text DEFAULT 'MOCA Living';
ALTER TABLE products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions text;  -- VD: "200 x 90 x 85 cm"
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ── 2. Cột bổ sung cho orders (checkout) ──
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount bigint DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee bigint DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ── 3. Cột bổ sung cho categories ──
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- ── 4. Ràng buộc & index ──
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products (slug);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique ON categories (slug);
CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_unique ON coupons (code);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews (product_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

-- Foreign keys (bỏ qua nếu đã tạo)
DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Trạng thái đơn hàng hợp lệ
DO $$ BEGIN
  ALTER TABLE orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check
    CHECK (rating >= 1 AND rating <= 5);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 5. Bảng banners (trang chủ — thay hardcode trong Home.jsx) ──
CREATE TABLE IF NOT EXISTS banners (
  id            serial PRIMARY KEY,
  title         text NOT NULL,
  subtitle      text,
  price_label   text,
  badge         text,
  image         text,
  link          text DEFAULT '/',
  bg_gradient   text,
  sort_order    integer DEFAULT 0,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ── 6. Bảng tin tức (navbar có link /tin-tuc) ──
CREATE TABLE IF NOT EXISTS posts (
  id            bigserial PRIMARY KEY,
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  excerpt       text,
  content       text,
  image         text,
  is_published  boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ── 7. Cài đặt cửa hàng (1 row) ──
CREATE TABLE IF NOT EXISTS store_settings (
  id              integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  shop_name       text DEFAULT 'MOCA Living',
  tagline         text DEFAULT 'Kiến tạo không gian đẳng cấp',
  phone           text,
  email           text,
  address         text,
  free_ship_min   bigint DEFAULT 5000000,
  updated_at      timestamptz DEFAULT now()
);

INSERT INTO store_settings (shop_name, tagline, phone, email, address, free_ship_min)
VALUES (
  'MOCA Living',
  'Kiến tạo không gian đẳng cấp',
  '0934.638.622',
  'hello@mocaliving.vn',
  'TP. Hồ Chí Minh, Việt Nam',
  5000000
)
ON CONFLICT (id) DO NOTHING;
