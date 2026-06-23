-- ============================================================
-- Fix: thêm user_id vào reviews + tạo settings nếu thiếu
-- ============================================================

-- Thêm user_id vào reviews (nếu chưa có)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Tạo settings nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name text NOT NULL DEFAULT 'MOCA Living',
  phone1 text NOT NULL DEFAULT '',
  phone2 text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  working_hours text NOT NULL DEFAULT 'T2 – CN: 8h00 – 21h00',
  zalo_phone text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  tiktok_url text NOT NULL DEFAULT '',
  bank_id text NOT NULL DEFAULT '',
  bank_account_no text NOT NULL DEFAULT '',
  bank_account_name text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings public read" ON settings;
CREATE POLICY "Settings public read"
  ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update settings" ON settings;
CREATE POLICY "Admin update settings"
  ON settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
