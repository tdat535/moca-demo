# MOCA Living — Work Log

## 1. Fix stock & sold triggers
**File:** `supabase_schema.sql` (section 13)

- Xoá trigger `trg_decrease_stock` (không còn trừ stock khi đặt hàng)
- Sửa `handle_order_status_stock`: chỉ trừ stock + cộng sold khi chuyển sang `delivered`
- Khi chuyển từ `delivered` sang `cancelled`: hoàn stock + giảm sold
- Khi chuyển từ `cancelled` sang `delivered`: stock--, sold++
- Giải quyết bug chuyển trạng thái qua lại làm sold tăng vô hạn

## 2. Fix favicon
**Files:** `index.html`, `public/`

- Từ `type="image/svg+xml" href="/logoo.jpg"` (sai) → `type="image/png" href="/logoo2.png"`
- Thêm `apple-touch-icon` = `/logoo2.png`

## 3. Fix Google Search Console / SEO
**Files:** `public/robots.txt`, `public/sitemap.xml`, `vercel.json`

- Sitemap URL từ `noithatmoca.com` → `www.noithatmoca.com`
- `robots.txt` sitemap URL đã fix
- Gỡ package `@agentmemory/agentmemory` (không dùng trong code, khả nghi malware)
- `vercel.json` thêm `cleanUrls` + `trailingSlash`

## 4. Trang Tra cứu đơn hàng
**File:** `src/pages/OrderLookup.jsx`

- Route `/tra-cuu-don-hang`
- Tra cứu bằng số điện thoại (query `orders.customer_phone`)
- Guest không cần login vẫn tra cứu được
- UI giống `Profile.jsx`: expandable order list, trạng thái, sản phẩm
- Thêm link trong Navbar (desktop + mobile) và Checkout success page

## 5. Fix coupon abuse
**Files:** `src/pages/Checkout.jsx`, `src/App.jsx`

- Guest check coupon by phone number (`orders.customer_phone` + `coupon_code`)
- Đã login check bằng `user_id` (giữ nguyên)
- Xoá `PromoPopup` component (khỏi `App.jsx`)

## 6. Fix payment flow
**Files:** `src/pages/Checkout.jsx`, `src/pages/Admin.jsx`

- Bỏ auto-confirm khi guest bấm "Tôi đã chuyển khoản"
- Guest click chỉ set `confirmed_at` (ghi nhận), status vẫn `pending`
- Admin dashboard: phân biệt "Chờ thanh toán" (xám) / "Khách báo đã chuyển" (cam) / "Đã nhận" (xanh)
- Chỉ admin mới confirm được ở tab Payments

---

## Relevant Files
| File | Purpose |
|------|---------|
| `supabase_schema.sql` (lines 472–508) | Stock/sold triggers (updated) |
| `index.html` | Favicon config (updated) |
| `public/robots.txt` | Sitemap URL (updated) |
| `public/sitemap.xml` | All URLs changed to www (updated) |
| `src/pages/Checkout.jsx` | Order creation, coupon check, bank transfer flow |
| `src/pages/OrderLookup.jsx` | Guest order tracking page |
| `src/pages/Admin.jsx` (L1315–1340) | Payment transaction badges/actions |
| `src/components/Navbar.jsx` | Navbar links (desktop + mobile) |
| `src/App.jsx` | Routes, PromoPopup removed |
| `package.json` | Dependencies (removed `@agentmemory/agentmemory`) |

## Domain Info
- **Domain:** `noithatmoca.com` (redirects www → root via Vercel)
- **DNS:** `ns-a1.tenten.vn` / `ns-a2.tenten.vn` / `ns-a3.tenten.vn`
- **GSC:** Domain property (`noithatmoca.com`) + URL-prefix (`https://www.noithatmoca.com/`)
- **Last crawl before fixes:** June 19
- **First successful live test:** June 24, 14:51
