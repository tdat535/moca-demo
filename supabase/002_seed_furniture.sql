-- ============================================================
-- MOCA Living — Dữ liệu mẫu nội thất
-- Chạy SAU file 001_schema_improvements.sql
-- ⚠️ Xóa dữ liệu cũ (điện tử) — backup trước nếu cần
-- ============================================================

TRUNCATE order_items, orders, reviews, products, coupons, categories RESTART IDENTITY CASCADE;

-- ── Danh mục ──
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
  ('Sofa & Ghế',           'sofa-ghe',        '🛋️', 'Sofa, ghế bành, ghế đơn phòng khách',           1),
  ('Bàn ăn',               'ban-an',          '🍽️', 'Bàn ăn, ghế ăn, bộ bàn ghế cao cấp',            2),
  ('Phòng ngủ',            'phong-ngu',       '🛏️', 'Giường, nệm, tủ quần áo, bàn trang điểm',       3),
  ('Tủ & Kệ',              'tu-ke',           '🗄️', 'Tủ quần áo, kệ sách, tủ giày, kệ trang trí',   4),
  ('Đèn & Trang trí',      'den-trang-tri',   '💡', 'Đèn chùm, đèn bàn, gương, tranh trang trí',     5),
  ('Phòng làm việc',       'phong-lam-viec',  '🪑', 'Bàn làm việc, ghế văn phòng, kệ tài liệu',      6);

-- ── Sản phẩm ──
INSERT INTO products (
  name, slug, category_id, price, original_price, image, images,
  rating, reviews, sold, stock, is_new, is_sale, is_featured,
  material, brand, color, dimensions, description, specs
) VALUES
(
  'Sofa góc MOCA Helsinki 3 chỗ bọc vải',
  'sofa-goc-moca-helsinki',
  1, 18990000, 22990000,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-f7ada3c80191?w=800&h=800&fit=crop'
  ],
  4.8, 42, 86, 12, true, true, true,
  'Vải bouclé cao cấp, khung gỗ tần bì', 'MOCA Living', 'Be kem',
  '280 x 180 x 85 cm',
  'Sofa góc thiết kế Bắc Âu, đệm mousse cao su non êm ái, phù hợp phòng khách hiện đại.',
  '{"Khung":"Gỗ tần bì FSC","Đệm":"Mousse HR 35kg/m³","Bảo hành":"24 tháng","Lắp đặt":"Miễn phí nội thành"}'::jsonb
),
(
  'Ghế bành MOCA Lounge bọc da PU',
  'ghe-banh-moca-lounge',
  1, 6490000, 7990000,
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop'],
  4.7, 28, 134, 20, false, true, false,
  'Da PU cao cấp, chân thép sơn tĩnh điện', 'MOCA Living', 'Nâu cognac',
  '78 x 82 x 90 cm',
  'Ghế bành đọc sách, tựa lưng cong ôm sát, phong cách mid-century.',
  '{"Chất liệu":"Da PU","Tải trọng":"120 kg","Bảo hành":"12 tháng"}'::jsonb
),
(
  'Bộ bàn ăn gỗ sồi MOCA Nordic 6 ghế',
  'ban-an-go-soi-moca-nordic',
  2, 24990000, 28990000,
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop'
  ],
  4.9, 56, 45, 8, true, true, true,
  'Gỗ sồi tự nhiên phủ dầu, ghế bọc vải lanh', 'MOCA Living', 'Gỗ tự nhiên',
  'Bàn 200 x 90 cm',
  'Bộ bàn ăn 6 ghế phong cách Scandinavian, gỗ sồi nguyên khối, bề mặt chống trầy.',
  '{"Mặt bàn":"Gỗ sồi 40mm","Ghế":"6 chiếc bọc vải","Bảo hành":"36 tháng"}'::jsonb
),
(
  'Ghế ăn MOCA Curve gỗ sồi (cái)',
  'ghe-an-moca-curve',
  2, 2890000, 3290000,
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop'],
  4.6, 19, 210, 40, false, true, false,
  'Gỗ sồi, nệm ngồi vải', 'MOCA Living', 'Gỗ + xám',
  '48 x 54 x 86 cm',
  'Ghế ăn lưng cong thoải mái, có thể mua lẻ hoặc theo bộ.',
  '{"Khung":"Gỗ sồi","Tải trọng":"100 kg"}'::jsonb
),
(
  'Giường ngủ MOCA King gỗ óc chó',
  'giuong-ngu-moca-king',
  3, 32990000, 36990000,
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop'
  ],
  4.9, 38, 32, 6, true, true, true,
  'Gỗ óc chó tự nhiên, đầu giường bọc vải', 'MOCA Living', 'Walnut',
  'King 180 x 200 cm',
  'Giường ngủ cao cấp đầu giường bọc vải, hộc kéo tiện lợi, thiết kế tối giản sang trọng.',
  '{"Kích thước":"180x200 cm","Hộc kéo":"2 ngăn","Bảo hành":"36 tháng"}'::jsonb
),
(
  'Nệm MOCA Cloud 25cm cao su non',
  'nem-moca-cloud-25cm',
  3, 8990000, 10990000,
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop'],
  4.8, 67, 156, 25, false, true, false,
  'Cao su non, vải bamboo', 'MOCA Living', 'Trắng',
  '180 x 200 x 25 cm',
  'Nệm 7 vùng nâng đỡ cột sống, vỏ vải bamboo thoáng khí, không xẹp lún.',
  '{"Độ cao":"25 cm","Cấp độ":"Firm medium","Bảo hành":"10 năm"}'::jsonb
),
(
  'Tủ quần áo MOCA Wardrobe 4 cánh',
  'tu-quan-ao-moca-4-canh',
  4, 21990000, 25990000,
  'https://images.unsplash.com/photo-1592078615290-033ee5840eae?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1592078615290-033ee5840eae?w=800&h=800&fit=crop'],
  4.7, 24, 58, 10, false, true, false,
  'MDF phủ melamine chống ẩm', 'MOCA Living', 'Trắng + gỗ',
  '240 x 60 x 220 cm',
  'Tủ 4 cánh có gương, ngăn kéo, thanh treo và kệ gấp quần áo.',
  '{"Cánh":"4 cánh + gương","Ngăn kéo":"3 ngăn","Bảo hành":"24 tháng"}'::jsonb
),
(
  'Kệ sách treo tường MOCA Float',
  'ke-sach-treo-tuong-moca-float',
  4, 3290000, 3890000,
  'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop'],
  4.5, 15, 89, 30, true, false, false,
  'Gỗ MDF phủ veneer sồi', 'MOCA Living', 'Sồi nhạt',
  '120 x 25 x 180 cm',
  'Kệ sách treo tường 5 tầng, thiết kế floating hiện đại, lắp đặt miễn phí.',
  '{"Tầng":"5 tầng","Tải trọng/tầng":"15 kg"}'::jsonb
),
(
  'Đèn chùm MOCA Aurora phòng khách',
  'den-chum-moca-aurora',
  5, 4590000, 5490000,
  'https://images.unsplash.com/photo-1513506003909-e935a059a569?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1513506003909-e935a059a569?w=800&h=800&fit=crop'],
  4.8, 31, 72, 18, false, true, false,
  'Kim loại sơn tĩnh điện, kính mờ', 'MOCA Living', 'Vàng đồng',
  'Ø 60 cm',
  'Đèn chùm 3 bóng LED warm white, phù hợp phòng khách và phòng ăn.',
  '{"Bóng":"3 x E27 LED","Ánh sáng":"3000K warm","Bảo hành":"12 tháng"}'::jsonb
),
(
  'Gương trang trí MOCA Arc bo tròn',
  'guong-trang-tri-moca-arc',
  5, 1890000, 2290000,
  'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=800&fit=crop'],
  4.6, 22, 145, 35, false, true, false,
  'Gương tráng bạc, khung gỗ', 'MOCA Living', 'Gỗ tự nhiên',
  '80 x 80 cm',
  'Gương tròn khung gỗ bo cong, treo phòng khách hoặc hành lang.',
  '{"Loại":"Treo tường","Khung":"Gỗ cao su"}'::jsonb
),
(
  'Bàn làm việc MOCA Studio gỗ óc chó',
  'ban-lam-viec-moca-studio',
  6, 7990000, 9490000,
  'https://images.unsplash.com/photo-1518455027357-f3f8164ba6bd?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1518455027357-f3f8164ba6bd?w=800&h=800&fit=crop'],
  4.7, 33, 64, 15, true, true, false,
  'Gỗ óc chó, chân thép', 'MOCA Living', 'Walnut',
  '140 x 70 x 75 cm',
  'Bàn làm việc mặt gỗ óc chó nguyên tấm, hộc kéo tích hợp, phong cách Japandi.',
  '{"Hộc kéo":"2 ngăn","Chân":"Thép sơn đen"}'::jsonb
),
(
  'Ghế văn phòng MOCA Ergo lưới thoáng',
  'ghe-van-phong-moca-ergo',
  6, 5490000, 6490000,
  'https://images.unsplash.com/photo-1580480057633-c0eb0dcd3751?w=600&h=600&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1580480057633-c0eb0dcd3751?w=800&h=800&fit=crop'],
  4.8, 41, 198, 22, false, true, false,
  'Lưới elastomer, nhựa PA, piston Class 4', 'MOCA Living', 'Đen',
  '65 x 65 x 110 cm',
  'Ghế công thái học tựa lưng lưới, tay vịn 3D, ngả 135°, bảo vệ cột sống.',
  '{"Ngả lưng":"135°","Tải trọng":"130 kg","Bảo hành":"24 tháng"}'::jsonb
);

-- ── Mã giảm giá ──
INSERT INTO coupons (code, discount_percent, min_order, is_active, expires_at) VALUES
  ('MOCA10',   10,  3000000,  true,  '2026-12-31'),
  ('FREESHIP',  5,  5000000,  true,  '2026-12-31'),
  ('WELCOME',  15, 10000000,  true,  '2026-06-30');

-- ── Đánh giá ──
INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES
  (1, 'Nguyễn Thu Hà',   5, 'Sofa đẹp, vải mềm, team MOCA lắp đặt rất cẩn thận. Phòng khách sang hẳn lên!'),
  (1, 'Trần Minh Đức',   4, 'Màu be kem đúng như hình, giao hàng đúng hẹn. Hơi chật nếu phòng nhỏ.'),
  (3, 'Lê Phương Anh',   5, 'Bộ bàn ăn gỗ rất đẹp, mùi gỗ tự nhiên. 6 ghế ngồi thoải mái cả gia đình.'),
  (5, 'Phạm Quốc Bảo',   5, 'Giường walnut chất lượng cao, đầu giường êm. Đáng từng đồng.'),
  (6, 'Hoàng Yến Nhi',   4, 'Nệm ngủ sâu, không nóng. Giao hàng cuộn vacuum tiện lắm.'),
  (9, 'Võ Đình Khang',   5, 'Đèn chùm ánh sáng ấm, treo phòng ăn rất hợp.'),
  (12, 'Bùi Thanh Tâm',  5, 'Ghế ergonomic ngồi cả ngày không mỏi lưng. Recommend!'),
  (8, 'Đặng Kim Ngân',   4, 'Kệ sách đẹp, lắp nhanh. Tầng dưới hơi thấp với sách lớn.');

-- ── Đơn hàng mẫu ──
INSERT INTO orders (customer_name, customer_phone, customer_address, customer_email, total_price, discount_amount, shipping_fee, coupon_code, status, payment_method, note)
VALUES
  ('Nguyễn Văn An',  '0901234567', '123 Nguyễn Huệ, Q.1, TP.HCM',     'an.nguyen@email.com',  25480000, 2548000, 0, 'MOCA10',   'delivered', 'cod', 'Giao giờ hành chính'),
  ('Trần Thị Bích',  '0919876543', '45 Lê Lợi, Q.3, TP.HCM',          'bich.tran@email.com',  18990000, 0,       0, NULL,       'shipping',  'cod', 'Gọi trước khi giao');

INSERT INTO order_items (order_id, product_id, product_name, price, qty) VALUES
  (1, 1,  'Sofa góc MOCA Helsinki 3 chỗ bọc vải', 18990000, 1),
  (1, 11, 'Bàn làm việc MOCA Studio gỗ óc chó',    7990000, 1),
  (2, 1,  'Sofa góc MOCA Helsinki 3 chỗ bọc vải', 18990000, 1);

-- ── Banner trang chủ ──
INSERT INTO banners (title, subtitle, price_label, badge, image, link, bg_gradient, sort_order) VALUES
  (
    'Sofa góc MOCA Helsinki',
    'Thiết kế Bắc Âu · Vải bouclé cao cấp · Lắp đặt miễn phí',
    'Từ 18.990.000₫', 'GIẢM 17%',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=480&h=480&fit=crop',
    '/san-pham/sofa-goc-moca-helsinki',
    'linear-gradient(135deg, #292524 0%, #44403c 60%, #78716c 100%)', 1
  ),
  (
    'Bộ bàn ăn gỗ sồi Nordic',
    'Gỗ sồi nguyên khối · 6 ghế bọc vải · Bảo hành 36 tháng',
    'Từ 24.990.000₫', 'BÁN CHẠY',
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=480&h=480&fit=crop',
    '/san-pham/ban-an-go-soi-moca-nordic',
    'linear-gradient(135deg, #1c1917 0%, #292524 60%, #57534e 100%)', 2
  ),
  (
    'Giường ngủ King gỗ óc chó',
    'Đầu giường bọc vải · Hộc kéo tiện lợi · Phong cách tối giản',
    'Từ 32.990.000₫', 'MỚI 2026',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=480&h=480&fit=crop',
    '/san-pham/giuong-ngu-moca-king',
    'linear-gradient(135deg, #292524 0%, #44403c 60%, #a8a29e 100%)', 3
  );

-- ── Tin tức mẫu ──
INSERT INTO posts (title, slug, excerpt, content, image, is_published) VALUES
  (
    '5 xu hướng nội thất phòng khách 2026',
    'xu-huong-noi-that-phong-khach-2026',
    'Tông đất, vật liệu tự nhiên và không gian mở đang dẫn đầu xu hướng nội thất năm nay.',
    'Phong cách Japandi và Scandinavian vẫn giữ vị trí hàng đầu...',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=500&fit=crop',
    true
  ),
  (
    'Cách chọn sofa phù hợp diện tích phòng',
    'cach-chon-sofa-phu-hop',
    'Sofa là tâm điểm phòng khách — chọn đúng kích thước và chất liệu giúp không gian thoáng hơn.',
    'Đo diện tích phòng trước, để lại lối đi 80cm...',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop',
    true
  );
