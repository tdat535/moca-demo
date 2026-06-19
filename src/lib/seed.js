/**
 * Seed dữ liệu mẫu MOCA Living (nội thất) lên Supabase:
 *   node src/lib/seed.js
 *
 * Cần VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong .env
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import ws from 'ws';
dotenv.config();

const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Đang dùng anon key — nếu bị RLS chặn, thêm SUPABASE_SERVICE_ROLE_KEY vào .env');
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  key,
  { realtime: { transport: ws } }
);

const CATEGORIES = [
  { name: 'Sofa & Ghế', slug: 'sofa-ghe', description: 'Sofa, ghế bành, ghế đơn phòng khách', sort_order: 1 },
  { name: 'Bàn ăn', slug: 'ban-an', description: 'Bàn ăn, ghế ăn, bộ bàn ghế cao cấp', sort_order: 2 },
  { name: 'Phòng ngủ', slug: 'phong-ngu', description: 'Giường, nệm, tủ quần áo', sort_order: 3 },
  { name: 'Tủ & Kệ', slug: 'tu-ke', description: 'Tủ quần áo, kệ sách, tủ giày', sort_order: 4 },
  { name: 'Đèn & Trang trí', slug: 'den-trang-tri', description: 'Đèn chùm, gương, tranh trang trí', sort_order: 5 },
  { name: 'Phòng làm việc', slug: 'phong-lam-viec', description: 'Bàn làm việc, ghế văn phòng', sort_order: 6 },
];

const PRODUCTS = [
  {
    name: 'Sofa góc MOCA Helsinki 3 chỗ bọc vải', slug: 'sofa-goc-moca-helsinki', category_id: 1,
    price: 18990000, original_price: 22990000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1493663284031-f7ada3c80191?w=800&h=800&fit=crop'],
    rating: 4.8, reviews: 42, sold: 86, stock: 12, is_new: true, is_sale: true, is_featured: true,
    material: 'Vải bouclé, khung gỗ tần bì', brand: 'MOCA Living', color: 'Be kem', dimensions: '280 x 180 x 85 cm',
    description: 'Sofa góc thiết kế Bắc Âu, đệm mousse cao su non êm ái, phù hợp phòng khách hiện đại.',
    specs: { Khung: 'Gỗ tần bì FSC', 'Đệm': 'Mousse HR 35kg/m³', 'Bảo hành': '24 tháng' },
  },
  {
    name: 'Ghế bành MOCA Lounge bọc da PU', slug: 'ghe-banh-moca-lounge', category_id: 1,
    price: 6490000, original_price: 7990000,
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop'],
    rating: 4.7, reviews: 28, sold: 134, stock: 20, is_new: false, is_sale: true,
    material: 'Da PU, chân thép', brand: 'MOCA Living', color: 'Nâu cognac', dimensions: '78 x 82 x 90 cm',
    description: 'Ghế bành đọc sách phong cách mid-century.',
    specs: { 'Tải trọng': '120 kg', 'Bảo hành': '12 tháng' },
  },
  {
    name: 'Bộ bàn ăn gỗ sồi MOCA Nordic 6 ghế', slug: 'ban-an-go-soi-moca-nordic', category_id: 2,
    price: 24990000, original_price: 28990000,
    images: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop',
    ],
    rating: 4.9, reviews: 56, sold: 45, stock: 8, is_new: true, is_sale: true, is_featured: true,
    material: 'Gỗ sồi tự nhiên', brand: 'MOCA Living', color: 'Gỗ tự nhiên', dimensions: 'Bàn 200 x 90 x 75 cm',
    description: 'Bộ bàn ăn 6 ghế gỗ sồi nguyên khối phong cách Scandinavian — thiết kế tối giản, đường nét mềm mại, phù hợp mọi không gian bếp hiện đại.',
    specs: {
      'Chất liệu mặt bàn': 'Gỗ sồi (Oak) nguyên khối dày 40mm',
      'Chất liệu chân': 'Gỗ sồi nguyên thanh, bo tròn',
      'Kích thước bàn': '200 x 90 x 75 cm (D x R x C)',
      'Kích thước ghế': '48 x 54 x 86 cm',
      'Số ghế kèm theo': '6 ghế',
      'Màu sắc': 'Gỗ sồi tự nhiên (Natural Oak)',
      'Hoàn thiện bề mặt': 'Sơn PU 3 lớp chống trầy, chống nước',
      'Tải trọng bàn': '200 kg',
      'Tải trọng ghế': '120 kg / ghế',
      'Xuất xứ gỗ': 'Gỗ sồi nhập khẩu Bắc Mỹ (FSC certified)',
      'Bảo hành': '36 tháng (khung gỗ) — 12 tháng (bề mặt sơn)',
      'Lắp đặt': 'Miễn phí lắp đặt tận nhà nội thành',
    },
    content: [
      { type: 'heading', value: 'Thiết kế Scandinavian — Đơn giản mà sang trọng' },
      { type: 'text', value: 'Bộ bàn ăn MOCA Nordic lấy cảm hứng từ phong cách nội thất Bắc Âu, nơi sự tối giản được đề cao nhưng vẫn toát lên vẻ ấm cúng, gần gũi. Mỗi đường nét trên bàn và ghế đều được bo tròn mềm mại, loại bỏ hoàn toàn các góc cạnh sắc nhọn — an toàn cho gia đình có trẻ nhỏ.\n\nMặt bàn rộng 200 x 90 cm thoải mái cho 6 người dùng bữa cùng lúc. Bề mặt gỗ sồi để lộ vân gỗ tự nhiên, tạo điểm nhấn thẩm mỹ mà không cần trang trí thêm.' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop' },
      { type: 'heading', value: 'Gỗ sồi Bắc Mỹ — Bền bỉ qua năm tháng' },
      { type: 'text', value: 'Toàn bộ bộ bàn ghế được chế tác từ gỗ sồi (White Oak) nhập khẩu Bắc Mỹ, đạt chứng nhận FSC về khai thác rừng bền vững. Gỗ sồi nổi tiếng với độ cứng cao, khả năng chống cong vênh và mối mọt tự nhiên, phù hợp với khí hậu nóng ẩm tại Việt Nam.\n\nMặt bàn dày 40mm nguyên khối, không ghép tấm — đảm bảo độ chắc chắn và thẩm mỹ vượt trội. Bề mặt được phủ 3 lớp sơn PU cao cấp: chống trầy xước, chống thấm nước, dễ dàng vệ sinh chỉ bằng khăn ẩm.' },
      { type: 'heading', value: 'Ghế ăn MOCA Curve — Ngồi thoải mái hàng giờ' },
      { type: 'text', value: '6 ghế ăn đi kèm được thiết kế theo kiểu dáng Curve đặc trưng của MOCA Living: lưng ghế cong ôm sát lưng người ngồi, tạo cảm giác thoải mái ngay cả khi ngồi lâu. Mặt ghế rộng 48cm, đệm gỗ bo cong theo công thái học.\n\nMỗi ghế chịu tải trọng lên đến 120kg, chân ghế có đệm cao su chống trượt và chống trầy sàn nhà — phù hợp cho cả sàn gạch, sàn gỗ và sàn đá.' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&h=800&fit=crop' },
      { type: 'heading', value: 'Quy trình sản xuất & Kiểm soát chất lượng' },
      { type: 'text', value: 'Mỗi bộ bàn ăn MOCA Nordic đều trải qua quy trình sản xuất nghiêm ngặt:\n\n• Gỗ sồi nhập khẩu được sấy công nghiệp đến độ ẩm 8–12%, đảm bảo không cong vênh, nứt nẻ trong quá trình sử dụng\n• Mộng ghép truyền thống kết hợp keo PU chịu nước — liên kết chắc chắn hơn vis thông thường\n• Chà nhám thủ công 3 lần (P120 → P240 → P400) để bề mặt mịn như lụa\n• Sơn PU 3 lớp: lớp lót chống ẩm + 2 lớp phủ bóng mờ tự nhiên\n• Kiểm tra tải trọng và độ ổn định trước khi xuất xưởng' },
      { type: 'heading', value: 'Hướng dẫn bảo quản' },
      { type: 'text', value: '• Lau bề mặt bằng khăn mềm hơi ẩm, tránh dùng hóa chất tẩy rửa mạnh\n• Sử dụng lót ly / lót đĩa khi đặt đồ nóng trực tiếp lên mặt bàn\n• Tránh đặt bàn ở nơi tiếp xúc trực tiếp với ánh nắng hoặc nguồn nhiệt cao\n• Dùng miếng dán nỉ dưới chân bàn/ghế nếu sàn nhà dễ trầy\n• Kiểm tra và siết lại ốc vít 6 tháng/lần để đảm bảo độ chắc chắn' },
      { type: 'heading', value: 'Chính sách giao hàng & Bảo hành' },
      { type: 'text', value: '• Miễn phí giao hàng và lắp đặt tận nhà trong nội thành TP.HCM, Hà Nội, Đà Nẵng\n• Các tỉnh thành khác: phí vận chuyển tính theo khoảng cách, báo giá trước khi giao\n• Bảo hành 36 tháng khung gỗ, 12 tháng bề mặt sơn\n• Đổi trả miễn phí trong 30 ngày nếu sản phẩm bị lỗi do nhà sản xuất\n• Hỗ trợ bảo trì, đánh bóng lại bề mặt sau thời gian sử dụng (phí ưu đãi cho khách hàng cũ)' },
    ],
  },
  {
    name: 'Ghế ăn MOCA Curve gỗ sồi (cái)', slug: 'ghe-an-moca-curve', category_id: 2,
    price: 2890000, original_price: 3290000,
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop'],
    rating: 4.6, reviews: 19, sold: 210, stock: 40, is_new: false, is_sale: true,
    material: 'Gỗ sồi', brand: 'MOCA Living', color: 'Gỗ + xám', dimensions: '48 x 54 x 86 cm',
    description: 'Ghế ăn lưng cong, mua lẻ hoặc theo bộ.',
    specs: { 'Tải trọng': '100 kg' },
  },
  {
    name: 'Giường ngủ MOCA King gỗ óc chó', slug: 'giuong-ngu-moca-king', category_id: 3,
    price: 32990000, original_price: 36990000,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop'],
    rating: 4.9, reviews: 38, sold: 32, stock: 6, is_new: true, is_sale: true, is_featured: true,
    material: 'Gỗ óc chó', brand: 'MOCA Living', color: 'Walnut', dimensions: 'King 180 x 200 cm',
    description: 'Giường cao cấp đầu giường bọc vải, hộc kéo tiện lợi.',
    specs: { 'Bảo hành': '36 tháng' },
  },
  {
    name: 'Nệm MOCA Cloud 25cm cao su non', slug: 'nem-moca-cloud-25cm', category_id: 3,
    price: 8990000, original_price: 10990000,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop'],
    rating: 4.8, reviews: 67, sold: 156, stock: 25, is_new: false, is_sale: true,
    material: 'Cao su non', brand: 'MOCA Living', color: 'Trắng', dimensions: '180 x 200 x 25 cm',
    description: 'Nệm 7 vùng nâng đỡ cột sống.',
    specs: { 'Bảo hành': '10 năm' },
  },
  {
    name: 'Tủ quần áo MOCA Wardrobe 4 cánh', slug: 'tu-quan-ao-moca-4-canh', category_id: 4,
    price: 21990000, original_price: 25990000,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee5840eae?w=800&h=800&fit=crop'],
    rating: 4.7, reviews: 24, sold: 58, stock: 10, is_new: false, is_sale: true,
    material: 'MDF phủ melamine', brand: 'MOCA Living', color: 'Trắng + gỗ', dimensions: '240 x 60 x 220 cm',
    description: 'Tủ 4 cánh có gương và ngăn kéo.',
    specs: { 'Bảo hành': '24 tháng' },
  },
  {
    name: 'Kệ sách treo tường MOCA Float', slug: 'ke-sach-treo-tuong-moca-float', category_id: 4,
    price: 3290000, original_price: 3890000,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop'],
    rating: 4.5, reviews: 15, sold: 89, stock: 30, is_new: true, is_sale: false,
    material: 'MDF veneer sồi', brand: 'MOCA Living', color: 'Sồi nhạt', dimensions: '120 x 25 x 180 cm',
    description: 'Kệ sách treo tường 5 tầng floating.',
    specs: { 'Tải trọng/tầng': '15 kg' },
  },
  {
    name: 'Đèn chùm MOCA Aurora phòng khách', slug: 'den-chum-moca-aurora', category_id: 5,
    price: 4590000, original_price: 5490000,
    images: ['https://images.unsplash.com/photo-1513506003909-e935a059a569?w=800&h=800&fit=crop'],
    rating: 4.8, reviews: 31, sold: 72, stock: 18, is_new: false, is_sale: true,
    material: 'Kim loại, kính mờ', brand: 'MOCA Living', color: 'Vàng đồng', dimensions: 'Ø 60 cm',
    description: 'Đèn chùm 3 bóng LED warm white.',
    specs: { 'Bảo hành': '12 tháng' },
  },
  {
    name: 'Gương trang trí MOCA Arc bo tròn', slug: 'guong-trang-tri-moca-arc', category_id: 5,
    price: 1890000, original_price: 2290000,
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=800&fit=crop'],
    rating: 4.6, reviews: 22, sold: 145, stock: 35, is_new: false, is_sale: true,
    material: 'Gương tráng bạc, khung gỗ', brand: 'MOCA Living', color: 'Gỗ tự nhiên', dimensions: '80 x 80 cm',
    description: 'Gương tròn khung gỗ bo cong.',
    specs: { Loại: 'Treo tường' },
  },
  {
    name: 'Bàn làm việc MOCA Studio gỗ óc chó', slug: 'ban-lam-viec-moca-studio', category_id: 6,
    price: 7990000, original_price: 9490000,
    images: ['https://images.unsplash.com/photo-1518455027357-f3f8164ba6bd?w=800&h=800&fit=crop'],
    rating: 4.7, reviews: 33, sold: 64, stock: 15, is_new: true, is_sale: true,
    material: 'Gỗ óc chó', brand: 'MOCA Living', color: 'Walnut', dimensions: '140 x 70 x 75 cm',
    description: 'Bàn làm việc phong cách Japandi.',
    specs: { 'Hộc kéo': '2 ngăn' },
  },
  {
    name: 'Ghế văn phòng MOCA Ergo lưới thoáng', slug: 'ghe-van-phong-moca-ergo', category_id: 6,
    price: 5490000, original_price: 6490000,
    images: ['https://images.unsplash.com/photo-1580480057633-c0eb0dcd3751?w=800&h=800&fit=crop'],
    rating: 4.8, reviews: 41, sold: 198, stock: 22, is_new: false, is_sale: true,
    material: 'Lưới elastomer', brand: 'MOCA Living', color: 'Đen', dimensions: '65 x 65 x 110 cm',
    description: 'Ghế công thái học tựa lưng lưới.',
    specs: { 'Bảo hành': '24 tháng' },
  },
];

const COUPONS = [
  { code: 'MOCA10', discount_percent: 10, min_order: 3000000, is_active: true, expires_at: '2026-12-31' },
  { code: 'FREESHIP', discount_percent: 5, min_order: 5000000, is_active: true, expires_at: '2026-12-31' },
  { code: 'WELCOME', discount_percent: 15, min_order: 10000000, is_active: true, expires_at: '2026-06-30' },
];

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().gte('id', 0);
  if (error) console.warn(`  ⚠ clear ${table}:`, error.message);
}

async function seed() {
  console.log('🗑️  Xóa dữ liệu cũ...');
  for (const t of ['reviews', 'products', 'coupons', 'categories', 'orders', 'banners']) {
    await clearTable(t);
  }

  console.log('📁 Seed categories...');
  const { data: cats, error: catErr } = await supabase.from('categories').insert(CATEGORIES).select();
  if (catErr) { console.error('Categories error:', catErr.message); return; }

  console.log('📦 Seed products...');
  const { data: prods, error: prodErr } = await supabase.from('products').insert(PRODUCTS).select('id, name');
  if (prodErr) { console.error('Products error:', prodErr.message); return; }

  console.log('🎟️  Seed coupons...');
  const { error: couponErr } = await supabase.from('coupons').insert(COUPONS);
  if (couponErr) console.error('Coupons error:', couponErr.message);

  const reviews = [
    { product_id: prods[0].id, customer_name: 'Nguyễn Thu Hà', rating: 5, comment: 'Sofa đẹp, team lắp đặt cẩn thận!' },
    { product_id: prods[2].id, customer_name: 'Lê Phương Anh', rating: 5, comment: 'Bộ bàn ăn gỗ rất đẹp.' },
    { product_id: prods[4].id, customer_name: 'Phạm Quốc Bảo', rating: 5, comment: 'Giường walnut chất lượng cao.' },
    { product_id: prods[11].id, customer_name: 'Bùi Thanh Tâm', rating: 5, comment: 'Ghế ergonomic ngồi cả ngày không mỏi.' },
  ];
  console.log('⭐ Seed reviews...');
  const { error: revErr } = await supabase.from('reviews').insert(reviews);
  if (revErr) console.error('Reviews error:', revErr.message);

  console.log('📋 Seed sample order...');
  await supabase.from('orders').insert([{
    customer_name: 'Nguyễn Văn An',
    customer_phone: '0901234567',
    customer_address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    customer_email: 'an@email.com',
    payment_method: 'cod',
    items: [{ product_id: prods[0].id, name: prods[0].name, price: 18990000, qty: 1, image: PRODUCTS[0].images[0] }],
    total_price: 18990000,
    discount_amount: 1899000,
    coupon_code: 'MOCA10',
    status: 'delivered',
  }]);

  console.log(`\n✅ Done! ${cats.length} categories, ${prods.length} products, ${COUPONS.length} coupons`);
}

seed();
