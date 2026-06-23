-- ============================================================
-- MOCA Living — Migration: coupon_usage + payment_transactions
-- Chạy trong Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. Bổ sung coupons ──
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses int;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses_per_user int DEFAULT 1;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS used_count int NOT NULL DEFAULT 0;

-- ── 2. Bảng theo dõi sử dụng mã giảm giá ──
CREATE TABLE IF NOT EXISTS coupon_usage (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  coupon_id bigint NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT '',
  discount_amount bigint NOT NULL DEFAULT 0,
  used_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);

ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage coupon_usage" ON coupon_usage;
CREATE POLICY "Admin manage coupon_usage"
  ON coupon_usage FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "System insert coupon_usage" ON coupon_usage;
CREATE POLICY "System insert coupon_usage"
  ON coupon_usage FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own coupon_usage" ON coupon_usage;
CREATE POLICY "Users read own coupon_usage"
  ON coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

-- ── 3. Bảng giao dịch thanh toán ──
CREATE TABLE IF NOT EXISTS payment_transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL DEFAULT 'bank',
  amount bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  transaction_code text,
  bank_name text,
  note text,
  confirmed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_status ON payment_transactions(status);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage payment_transactions" ON payment_transactions;
CREATE POLICY "Admin manage payment_transactions"
  ON payment_transactions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "System insert payment_transactions" ON payment_transactions;
CREATE POLICY "System insert payment_transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own payment_transactions" ON payment_transactions;
CREATE POLICY "Users read own payment_transactions"
  ON payment_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid()));

-- ── 4. Hàm tự tăng used_count khi dùng coupon ──
CREATE OR REPLACE FUNCTION increment_coupon_used()
RETURNS trigger AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_coupon_used ON coupon_usage;
CREATE TRIGGER trg_coupon_used
  AFTER INSERT ON coupon_usage
  FOR EACH ROW EXECUTE FUNCTION increment_coupon_used();

-- ── 5. Hàm tự giảm used_count khi xóa coupon_usage ──
CREATE OR REPLACE FUNCTION decrement_coupon_used()
RETURNS trigger AS $$
BEGIN
  UPDATE coupons SET used_count = GREATEST(used_count - 1, 0) WHERE id = OLD.coupon_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_coupon_unused ON coupon_usage;
CREATE TRIGGER trg_coupon_unused
  AFTER DELETE ON coupon_usage
  FOR EACH ROW EXECUTE FUNCTION decrement_coupon_used();

-- ── 6. Seed data mẫu: thêm max_uses cho coupons ──
UPDATE coupons SET max_uses = 100, max_uses_per_user = 1 WHERE code = 'MOCA10';
UPDATE coupons SET max_uses = 200, max_uses_per_user = 1 WHERE code = 'FREESHIP';
UPDATE coupons SET max_uses = 50,  max_uses_per_user = 1 WHERE code = 'WELCOME';
