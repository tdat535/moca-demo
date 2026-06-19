import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../data/products';
import { uploadImage } from '../lib/uploadImage';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

const C = {
  primary: '#2563eb', primaryBg: '#eff6ff', primaryHover: '#1d4ed8',
  bg: '#f8fafc', card: '#ffffff', border: '#e2e8f0',
  text: '#0f172a', muted: '#64748b', light: '#94a3b8',
};

const SIDEBAR = [
  { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
  { id: 'orders', label: 'Đơn hàng', icon: '📋' },
  { id: 'banners', label: 'Banner', icon: '🖼️' },
  { id: 'products', label: 'Sản phẩm', icon: '📦' },
  { id: 'categories', label: 'Danh mục', icon: '🏷️' },
  { id: 'coupons', label: 'Mã giảm giá', icon: '🎟️' },
  { id: 'reviews', label: 'Đánh giá', icon: '⭐' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙️' },
];

const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', bg: '#fef3c7', color: '#b45309' },
  confirmed: { label: 'Đã xác nhận', bg: '#dbeafe', color: '#1d4ed8' },
  shipping: { label: 'Đang giao', bg: '#e0e7ff', color: '#4338ca' },
  delivered: { label: 'Đã giao', bg: '#dcfce7', color: '#15803d' },
  cancelled: { label: 'Đã hủy', bg: '#fee2e2', color: '#b91c1c' },
};

const EMPTY_PRODUCT = {
  name: '', slug: '', categoryId: '', price: '', originalPrice: '',
  images: [], description: '', content: [], specs: [], isNew: false, isSale: false,
};
const EMPTY_CAT = { name: '', slug: '', parent_id: '' };
const EMPTY_COUPON = { code: '', discount_percent: '', min_order: '', expires_at: '', is_active: true };

// ── Reusable input components ──
function Field({ label, children }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{label}</label>}
      {children}
    </div>
  );
}

function FInput({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', border: `1.5px solid ${f ? C.primary : C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', color: C.text, background: '#fff', transition: 'border .15s', fontFamily: 'inherit', ...props.style }} />
    </Field>
  );
}

function FSelect({ label, children, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', border: `1.5px solid ${f ? C.primary : C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', color: C.text, background: '#fff', transition: 'border .15s', cursor: 'pointer' }}>
        {children}
      </select>
    </Field>
  );
}

function FTextarea({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <textarea {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', border: `1.5px solid ${f ? C.primary : C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', color: C.text, background: '#fff', resize: 'vertical', fontFamily: 'inherit', transition: 'border .15s', ...props.style }} />
    </Field>
  );
}

function Btn({ variant = 'primary', children, ...props }) {
  const [h, setH] = useState(false);
  const styles = {
    primary: { background: h ? C.primaryHover : C.primary, color: '#fff', border: 'none' },
    ghost: { background: h ? C.bg : 'transparent', color: C.muted, border: `1.5px solid ${C.border}` },
    danger: { background: h ? '#be123c' : '#e11d48', color: '#fff', border: 'none' },
    soft: { background: h ? C.primaryBg : '#f1f5f9', color: h ? C.primary : C.muted, border: 'none' },
  };
  return (
    <button {...props} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', display: 'inline-flex', alignItems: 'center', gap: 6, ...styles[variant], ...props.style }}>
      {children}
    </button>
  );
}

function Stars({ n }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#f59e0b' : '#e2e8f0', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: 3, height: 18, background: C.primary, borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />{children}
  </h2>;
}

// ── Main component ──
export default function Admin() {
  const {
    productList, categories, coupons, reviews, banners, orders, settings, loading,
    addProduct, updateProduct, deleteProduct,
    addCategory, updateCategory, deleteCategory,
    addCoupon, updateCoupon, deleteCoupon,
    deleteReview,
    addBanner, deleteBanner,
    updateOrder, updateSettings,
    fetchAdminData,
  } = useAdmin();

  useEffect(() => { fetchAdminData(); }, [fetchAdminData]);
  useEffect(() => { setSettingsForm({ ...settings }); }, [settings]);

  const [uploading, setUploading] = useState(false);
  const [csvImporting, setCsvImporting] = useState(false);
  const productFileRef = useRef(null);
  const bannerFileRef = useRef(null);
  const csvFileRef = useRef(null);

  const [tab, setTab] = useState('dashboard');
  const [toast, setToast] = useState('');
  const [delConfirm, setDelConfirm] = useState(null); // { type, id }

  // Product form
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editProductId, setEditProductId] = useState(null);
  const [productSearch, setProductSearch] = useState('');

  // Category form
  const [catForm, setCatForm] = useState(EMPTY_CAT);
  const [editCatId, setEditCatId] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);

  // Coupon form
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);
  const [editCouponId, setEditCouponId] = useState(null);
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Orders
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const totalRevenue = productList.reduce((s, p) => s + p.price * (p.sold || 0), 0);
  const totalSold = productList.reduce((s, p) => s + (p.sold || 0), 0);

  const goTab = (id) => {
    setTab(id);
    setEditProductId(null); setProductForm(EMPTY_PRODUCT);
    setEditCatId(null); setCatForm(EMPTY_CAT); setShowCatForm(false);
    setEditCouponId(null); setCouponForm(EMPTY_COUPON); setShowCouponForm(false);
  };

  const activeNav = tab === 'product-form' ? 'products' : tab;

  // ── Delete handler ──
  const confirmDelete = async () => {
    if (!delConfirm) return;
    const { type, id } = delConfirm;
    if (type === 'product') await deleteProduct(id);
    else if (type === 'category') await deleteCategory(id);
    else if (type === 'coupon') await deleteCoupon(id);
    else if (type === 'review') await deleteReview(id);
    else if (type === 'banner') await deleteBanner(id);
    setDelConfirm(null);
    showToast('Đã xóa thành công!');
  };

  // ── Product form submit ──
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const specsObj = {};
    (productForm.specs || []).forEach(s => { if (s.key.trim()) specsObj[s.key.trim()] = s.value.trim(); });
    const data = {
      ...productForm,
      categoryId: parseInt(productForm.categoryId),
      price: parseInt(productForm.price),
      originalPrice: parseInt(productForm.originalPrice || productForm.price),
      rating: 0,
      images: productForm.images || [],
      content: productForm.content || [],
      specs: specsObj,
    };
    if (editProductId) {
      await updateProduct(editProductId, data);
      showToast('Cập nhật sản phẩm thành công!');
    } else {
      await addProduct(data);
      showToast('Thêm sản phẩm thành công!');
    }
    setEditProductId(null); setProductForm(EMPTY_PRODUCT); setTab('products');
  };

  // ── Category form submit ──
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const data = { name: catForm.name, slug: catForm.slug, parent_id: catForm.parent_id ? parseInt(catForm.parent_id) : null };
    if (editCatId) {
      await updateCategory(editCatId, data);
      showToast('Cập nhật danh mục thành công!');
      setEditCatId(null);
    } else {
      await addCategory(data);
      showToast('Thêm danh mục thành công!');
    }
    setCatForm(EMPTY_CAT); setShowCatForm(false);
  };

  // ── Coupon form submit ──
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...couponForm,
      discount_percent: parseInt(couponForm.discount_percent),
      min_order: parseInt(couponForm.min_order || 0),
      expires_at: couponForm.expires_at || null,
    };
    if (editCouponId) {
      await updateCoupon(editCouponId, data);
      showToast('Cập nhật mã giảm giá thành công!');
      setEditCouponId(null);
    } else {
      await addCoupon(data);
      showToast('Thêm mã giảm giá thành công!');
    }
    setCouponForm(EMPTY_COUPON); setShowCouponForm(false);
  };

  const filteredProducts = productList.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  const downloadExcelTemplate = () => {
    const data = [
      { 'Tên sản phẩm': 'Sofa MOCA Helsinki', 'Giá bán': 18990000, 'Giá gốc': 22990000, 'Danh mục': 'Sofa & Ghế', 'Mô tả': 'Sofa góc thiết kế Bắc Âu', 'Chất liệu': 'Vải bouclé', 'Thương hiệu': 'MOCA Living', 'Màu sắc': 'Be kem', 'Kích thước': '280x180x85cm', 'Mới': 'x', 'Sale': 'x', 'Tồn kho': 10 },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 5 }, { wch: 5 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');
    XLSX.writeFile(wb, 'mau-san-pham.xlsx');
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCsvImporting(true);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    let added = 0;
    for (const row of rows) {
      const name = row['Tên sản phẩm'] || row['name'] || '';
      if (!name) continue;
      const catName = row['Danh mục'] || row['category'] || '';
      const catMatch = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
      const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const product = {
        name, slug, category_id: catMatch?.id || null,
        price: parseInt(row['Giá bán'] || row['price']) || 0,
        original_price: parseInt(row['Giá gốc'] || row['original_price']) || 0,
        images: ['https://placehold.co/600x600/f1f5f9/94a3b8?text=Ch%C6%B0a+c%C3%B3+%E1%BA%A3nh'],
        description: row['Mô tả'] || row['description'] || '',
        material: row['Chất liệu'] || row['material'] || '',
        brand: row['Thương hiệu'] || row['brand'] || '',
        color: row['Màu sắc'] || row['color'] || '',
        dimensions: row['Kích thước'] || row['dimensions'] || '',
        is_new: !!(row['Mới'] || row['is_new']),
        is_sale: !!(row['Sale'] || row['is_sale']),
        stock: parseInt(row['Tồn kho'] || row['stock']) || 0,
        rating: 0, reviews: 0, sold: 0, specs: {}, content: [],
      };
      const { error } = await supabase.from('products').insert([product]);
      if (!error) added++;
    }
    setCsvImporting(false);
    e.target.value = '';
    showToast(`Đã import ${added}/${rows.length} sản phẩm!`);
    if (added > 0) window.location.reload();
  };

  // ── Shared table/card styles ──
  const tableCard = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' };
  const th = { padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: C.light, fontSize: 13 }}>Đang tải dữ liệu...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'Inter, Segoe UI, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#4ade80' }}>✓</span> {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: 220, background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logoo2.png" alt="Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
            <div style={{ fontSize: 11, color: C.light }}>Admin Dashboard</div>
          </Link>
        </div>

        <nav style={{ padding: '12px 10px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.light, textTransform: 'uppercase', letterSpacing: '.06em', padding: '0 10px', marginBottom: 6 }}>Menu</div>
          {SIDEBAR.map(t => {
            const isActive = activeNav === t.id;
            return (
              <button key={t.id} onClick={() => goTab(t.id)}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, transition: 'all .15s', background: isActive ? C.primaryBg : 'transparent', color: isActive ? C.primary : C.muted, fontWeight: isActive ? 700 : 500, fontSize: 13 }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16, opacity: isActive ? 1 : .7 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}` }}>
          <Link to="/" style={{ textDecoration: 'none', color: C.muted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            {tab === 'product-form' ? (editProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm') : SIDEBAR.find(s => s.id === activeNav)?.label}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: C.primaryBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Admin</span>
          </div>
        </div>

        <div style={{ padding: 28, flex: 1, overflowY: 'auto' }}>

          {/* ═══════════ DASHBOARD ═══════════ */}
          {tab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Đơn hàng', val: orders.length, icon: '📋', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Đơn mới', val: orders.filter(o => o.status === 'pending').length, icon: '🔔', color: '#ea580c', bg: '#fff7ed' },
                  { label: 'Doanh thu', val: (totalRevenue / 1e9).toFixed(1) + ' tỷ', icon: '💰', color: '#7c3aed', bg: '#f5f3ff' },
                  { label: 'Sản phẩm', val: productList.length, icon: '📦', color: '#059669', bg: '#ecfdf5' },
                ].map(s => (
                  <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={tableCard}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏆</span><span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Top 5 bán chạy</span>
                </div>
                {[...productList].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: i < 3 ? '#fff' : C.muted, background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : '#f1f5f9' }}>{i + 1}</span>
                    <img src={p.images?.[0] || p.image} alt="" style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.border}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: C.light }}>{formatPrice(p.price)}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', flexShrink: 0 }}>{(p.sold || 0).toLocaleString()} đã bán</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ ORDERS ═══════════ */}
          {tab === 'orders' && (() => {
            const filtered = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);
            return (
            <div>
              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                {[
                  { v: 'all', l: `Tất cả (${orders.length})` },
                  { v: 'pending', l: `Chờ xác nhận (${orders.filter(o => o.status === 'pending').length})` },
                  { v: 'confirmed', l: `Đã xác nhận (${orders.filter(o => o.status === 'confirmed').length})` },
                  { v: 'shipping', l: `Đang giao (${orders.filter(o => o.status === 'shipping').length})` },
                  { v: 'delivered', l: `Đã giao (${orders.filter(o => o.status === 'delivered').length})` },
                  { v: 'cancelled', l: `Đã hủy (${orders.filter(o => o.status === 'cancelled').length})` },
                ].map(f => (
                  <button key={f.v} onClick={() => setOrderFilter(f.v)}
                    style={{
                      border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s',
                      background: orderFilter === f.v ? C.primary : C.bg,
                      color: orderFilter === f.v ? '#fff' : C.muted,
                    }}>{f.l}</button>
                ))}
              </div>

              <div style={tableCard}>
                {filtered.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: C.light }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
                    <p style={{ fontSize: 14 }}>Chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <th style={th}>Mã đơn</th>
                        <th style={th}>Khách hàng</th>
                        <th style={{ ...th, textAlign: 'right' }}>Tổng tiền</th>
                        <th style={{ ...th, textAlign: 'center' }}>Thanh toán</th>
                        <th style={{ ...th, textAlign: 'center' }}>Trạng thái</th>
                        <th style={{ ...th, textAlign: 'center' }}>Ngày</th>
                        <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, i) => {
                        const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
                        const isExpanded = expandedOrder === o.id;
                        const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
                        return [
                          <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .1s', cursor: 'pointer' }}
                            onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                            onMouseEnter={e => e.currentTarget.style.background = C.bg}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 700, color: C.primary }}>#{o.id}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 600, color: C.text }}>{o.customer_name}</div>
                              <div style={{ fontSize: 12, color: C.light }}>{o.customer_phone || o.phone}</div>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <span style={{ fontWeight: 700, color: C.text }}>{formatPrice(o.total_price || o.total || 0)}</span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>
                                {o.payment_method === 'bank' ? '🏦 CK' : '💵 COD'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>
                                {st.label}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center', color: C.light, fontSize: 12, whiteSpace: 'nowrap' }}>
                              {new Date(o.created_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                              <select value={o.status} onChange={async (e) => {
                                await updateOrder(o.id, { status: e.target.value });
                                showToast('Đã cập nhật trạng thái!');
                              }}
                                style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', fontSize: 11, outline: 'none', cursor: 'pointer', color: C.text, background: '#fff' }}>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Xác nhận</option>
                                <option value="shipping">Đang giao</option>
                                <option value="delivered">Đã giao</option>
                                <option value="cancelled">Hủy đơn</option>
                              </select>
                            </td>
                          </tr>,
                          isExpanded && (
                            <tr key={`${o.id}-detail`}>
                              <td colSpan={7} style={{ padding: 0, background: '#fafbfc', borderBottom: `1px solid ${C.border}` }}>
                                <div style={{ padding: '16px 24px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 14 }}>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: C.light, textTransform: 'uppercase', marginBottom: 4 }}>Địa chỉ</div>
                                      <div style={{ fontSize: 13, color: C.text }}>{o.customer_address || o.address || '—'}</div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: C.light, textTransform: 'uppercase', marginBottom: 4 }}>Ghi chú</div>
                                      <div style={{ fontSize: 13, color: C.text }}>{o.note || '—'}</div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: C.light, textTransform: 'uppercase', marginBottom: 4 }}>Ngày giờ</div>
                                      <div style={{ fontSize: 13, color: C.text }}>{new Date(o.created_at).toLocaleString('vi-VN')}</div>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: C.light, textTransform: 'uppercase', marginBottom: 8 }}>Sản phẩm ({items.length})</div>
                                  {items.map((item, j) => (
                                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: j < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                      {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, border: `1px solid ${C.border}` }} />}
                                      <div style={{ flex: 1, fontSize: 13, color: C.text }}>{item.name}</div>
                                      <div style={{ fontSize: 12, color: C.muted }}>x{item.qty}</div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{formatPrice(item.price * item.qty)}</div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ),
                        ];
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            );
          })()}

          {/* ═══════════ PRODUCTS ═══════════ */}
          {tab === 'products' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Tìm sản phẩm..."
                    style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 12px 8px 32px', fontSize: 13, outline: 'none', color: C.text, background: C.card, width: 260 }}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="ghost" onClick={downloadExcelTemplate}>📄 Tải mẫu Excel</Btn>
                  <input ref={csvFileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleExcelImport} />
                  <Btn variant="soft" disabled={csvImporting} onClick={() => csvFileRef.current.click()}>
                    {csvImporting ? '⏳ Đang import...' : '📥 Import Excel'}
                  </Btn>
                  <Btn onClick={() => { setEditProductId(null); setProductForm(EMPTY_PRODUCT); setTab('product-form'); }}>
                    + Thêm sản phẩm
                  </Btn>
                </div>
              </div>

              <div style={tableCard}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <th style={th}>Sản phẩm</th>
                      <th style={th}>Danh mục</th>
                      <th style={{ ...th, textAlign: 'right' }}>Giá bán</th>
                      <th style={{ ...th, textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, i) => {
                      const cat = categories.find(c => c.id === p.categoryId);
                      return (
                        <tr key={p.id} style={{ borderBottom: i < filteredProducts.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={p.images?.[0] || p.image} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                              <span style={{ fontWeight: 600, color: C.text, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 12, color: C.muted }}>{cat?.icon} {cat?.name}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 700, color: C.primary }}>{formatPrice(p.price)}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                              {p.isNew && <span style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Mới</span>}
                              {p.isSale && <span style={{ fontSize: 11, background: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Sale</span>}
                              {!p.isNew && !p.isSale && <span style={{ fontSize: 11, color: C.light }}>—</span>}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button onClick={() => { setEditProductId(p.id); setProductForm({ name: p.name, slug: p.slug, categoryId: p.categoryId, price: p.price, originalPrice: p.originalPrice || p.price, images: p.images || [], description: p.description || '', content: p.content || [], specs: Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })), isNew: p.isNew || false, isSale: p.isSale || false }); setTab('product-form'); }}
                                style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: C.primary, cursor: 'pointer', transition: 'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.borderColor = C.primary; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; }}>Sửa</button>
                              <button onClick={() => setDelConfirm({ type: 'product', id: p.id })}
                                style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid #fecdd3', background: 'transparent', color: '#e11d48', cursor: 'pointer', transition: 'all .15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Xóa</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════ PRODUCT FORM ═══════════ */}
          {tab === 'product-form' && (
            <div>
              <button onClick={() => setTab('products')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 500, padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Quay lại danh sách
              </button>
              <form onSubmit={handleProductSubmit} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FInput label="Tên sản phẩm *" required value={productForm.name}
                      onChange={e => setProductForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
                      placeholder="VD: Sofa góc MOCA Nordic 3 chỗ" />
                  </div>
                  <FSelect label="Danh mục *" required value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.parent_id ? '  └ ' : ''}{c.name}</option>)}
                  </FSelect>
                  <FInput label="Giá bán (VND) *" required type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="34990000" />
                  <FInput label="Giá gốc (VND)" type="number" value={productForm.originalPrice} onChange={e => setProductForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="37990000" />
                  <div style={{ gridColumn: '1/-1' }}>
                    <Field label="Hình ảnh sản phẩm *">
                      <input ref={productFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        setUploading(true);
                        for (const file of files) {
                          try {
                            const url = await uploadImage(file, 'products');
                            setProductForm(f => ({ ...f, images: [...(f.images || []), url] }));
                          } catch (err) { alert('Upload lỗi: ' + err.message); }
                        }
                        setUploading(false);
                        e.target.value = '';
                      }} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        {(productForm.images || []).map((img, i) => (
                          <div key={i} style={{ position: 'relative', width: 72, height: 72, border: `1px solid ${i === 0 ? C.primary : C.border}`, borderRadius: 8, overflow: 'hidden' }}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.primary, color: '#fff', fontSize: 9, fontWeight: 700, textAlign: 'center', padding: '1px 0' }}>Chính</span>}
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                              style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                          </div>
                        ))}
                        <button type="button" disabled={uploading} onClick={() => productFileRef.current.click()} style={{
                          width: 72, height: 72, border: `1.5px dashed ${C.border}`, borderRadius: 8,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                          fontSize: 11, fontWeight: 600, cursor: 'pointer', background: '#fff',
                          color: uploading ? C.light : C.primary, transition: 'all .15s',
                        }}>
                          {uploading ? '...' : <>
                            <span style={{ fontSize: 20 }}>+</span>
                            Thêm
                          </>}
                        </button>
                      </div>
                    </Field>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FInput label="Mô tả ngắn" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="1-2 câu giới thiệu sản phẩm..." />
                  </div>

                  {/* Specs editor */}
                  <div style={{ gridColumn: '1/-1' }}>
                    <Field label="Thông tin sản phẩm">
                      <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                        {(productForm.specs || []).length === 0 && (
                          <div style={{ padding: '20px 16px', textAlign: 'center', color: C.light, fontSize: 13 }}>
                            Chưa có thông tin. Bấm nút bên dưới để thêm.
                          </div>
                        )}
                        {(productForm.specs || []).map((spec, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.border}`, alignItems: 'center', background: i % 2 === 0 ? '#fff' : C.bg }}>
                            <input value={spec.key} placeholder="VD: Chất liệu, Kích thước, Màu sắc"
                              onChange={e => { const s = [...productForm.specs]; s[i] = { ...spec, key: e.target.value }; setProductForm(f => ({ ...f, specs: s })); }}
                              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: C.text, outline: 'none', padding: '6px 0' }} />
                            <input value={spec.value} placeholder="VD: Gỗ sồi tự nhiên"
                              onChange={e => { const s = [...productForm.specs]; s[i] = { ...spec, value: e.target.value }; setProductForm(f => ({ ...f, specs: s })); }}
                              style={{ flex: 1.5, border: 'none', background: 'transparent', fontSize: 13, color: C.muted, outline: 'none', padding: '6px 0' }} />
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, specs: f.specs.filter((_, j) => j !== i) }))}
                              style={{ border: 'none', background: '#fee2e2', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 10, color: '#e11d48', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                          </div>
                        ))}
                        <div style={{ padding: '8px 12px', background: C.bg, borderTop: (productForm.specs || []).length ? 'none' : `1px solid ${C.border}` }}>
                          <button type="button" onClick={() => setProductForm(f => ({ ...f, specs: [...(f.specs || []), { key: '', value: '' }] }))}
                            style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff', color: C.text, transition: 'all .15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                            + Thêm thông tin
                          </button>
                        </div>
                      </div>
                    </Field>
                  </div>

                  {/* Block editor */}
                  <div style={{ gridColumn: '1/-1' }}>
                    <Field label="Nội dung chi tiết">
                      <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                        {(productForm.content || []).length === 0 && (
                          <div style={{ padding: '24px 16px', textAlign: 'center', color: C.light, fontSize: 13 }}>
                            Chưa có nội dung. Bấm nút bên dưới để thêm.
                          </div>
                        )}
                        {(productForm.content || []).map((block, i) => (
                          <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', background: i % 2 === 0 ? '#fff' : C.bg }}>
                            <div style={{ flex: 1 }}>
                              {block.type === 'heading' && (
                                <input value={block.value} placeholder="Tiêu đề..."
                                  onChange={e => { const c = [...productForm.content]; c[i] = { ...block, value: e.target.value }; setProductForm(f => ({ ...f, content: c })); }}
                                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontWeight: 700, color: C.text, outline: 'none', padding: '4px 0' }} />
                              )}
                              {block.type === 'text' && (
                                <textarea value={block.value} placeholder="Nhập nội dung đoạn văn..." rows={3}
                                  onChange={e => { const c = [...productForm.content]; c[i] = { ...block, value: e.target.value }; setProductForm(f => ({ ...f, content: c })); }}
                                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 14, color: C.text, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7, padding: '4px 0' }} />
                              )}
                              {block.type === 'image' && (
                                <div>
                                  {block.url && <img src={block.url} alt="" style={{ height: 80, borderRadius: 6, objectFit: 'cover', marginBottom: 8 }} />}
                                  {(productForm.images || []).length > 0 && !block.url && (
                                    <div style={{ marginBottom: 8 }}>
                                      <div style={{ fontSize: 11, color: C.light, marginBottom: 6, fontWeight: 600 }}>Chọn từ hình sản phẩm:</div>
                                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {(productForm.images || []).map((img, j) => (
                                          <button key={j} type="button" onClick={() => { const c = [...productForm.content]; c[i] = { ...block, url: img }; setProductForm(f => ({ ...f, content: c })); }}
                                            style={{ width: 52, height: 52, border: `2px solid ${block.url === img ? C.primary : C.border}`, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none' }}>
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <button type="button" onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file'; input.accept = 'image/*';
                                      input.onchange = async (e) => {
                                        const file = e.target.files[0]; if (!file) return;
                                        setUploading(true);
                                        try {
                                          const url = await uploadImage(file, 'content');
                                          const c = [...productForm.content]; c[i] = { ...block, url }; setProductForm(f => ({ ...f, content: c }));
                                        } catch (err) { alert('Upload lỗi: ' + err.message); }
                                        setUploading(false);
                                      };
                                      input.click();
                                    }} style={{ border: `1.5px dashed ${C.border}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff', color: C.primary }}>
                                      {uploading ? 'Đang tải...' : block.url ? 'Đổi hình' : 'Upload hình mới'}
                                    </button>
                                    {block.url && (
                                      <button type="button" onClick={() => { const c = [...productForm.content]; c[i] = { ...block, url: '' }; setProductForm(f => ({ ...f, content: c })); }}
                                        style={{ border: 'none', background: 'none', color: C.light, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Chọn lại</button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
                              <span style={{ fontSize: 9, color: C.light, textAlign: 'center', fontWeight: 700, textTransform: 'uppercase' }}>
                                {block.type === 'heading' ? 'H' : block.type === 'text' ? 'T' : 'IMG'}
                              </span>
                              {i > 0 && <button type="button" onClick={() => { const c = [...productForm.content]; [c[i-1], c[i]] = [c[i], c[i-1]]; setProductForm(f => ({ ...f, content: c })); }}
                                style={{ border: 'none', background: C.bg, borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 10, color: C.muted }}>▲</button>}
                              {i < (productForm.content || []).length - 1 && <button type="button" onClick={() => { const c = [...productForm.content]; [c[i], c[i+1]] = [c[i+1], c[i]]; setProductForm(f => ({ ...f, content: c })); }}
                                style={{ border: 'none', background: C.bg, borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 10, color: C.muted }}>▼</button>}
                              <button type="button" onClick={() => { const c = productForm.content.filter((_, j) => j !== i); setProductForm(f => ({ ...f, content: c })); }}
                                style={{ border: 'none', background: '#fee2e2', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 10, color: '#e11d48' }}>✕</button>
                            </div>
                          </div>
                        ))}
                        <div style={{ padding: '10px 12px', display: 'flex', gap: 8, background: C.bg, borderTop: (productForm.content || []).length ? `1px solid ${C.border}` : 'none' }}>
                          {[
                            { type: 'heading', label: '+ Tiêu đề', init: { type: 'heading', value: '' } },
                            { type: 'text', label: '+ Đoạn văn', init: { type: 'text', value: '' } },
                            { type: 'image', label: '+ Hình ảnh', init: { type: 'image', url: '' } },
                          ].map(b => (
                            <button key={b.type} type="button" onClick={() => setProductForm(f => ({ ...f, content: [...(f.content || []), b.init] }))}
                              style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff', color: C.text, transition: 'all .15s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Field>
                  </div>

                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: 20 }}>
                    {[{ key: 'isNew', label: 'Sản phẩm mới' }, { key: 'isSale', label: 'Đang sale' }].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: C.muted, userSelect: 'none' }}>
                        <input type="checkbox" checked={productForm[key]} onChange={e => setProductForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: C.primary, width: 15, height: 15 }} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 22, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                  <Btn type="submit" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>{editProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</Btn>
                  <Btn variant="ghost" type="button" onClick={() => setTab('products')} style={{ padding: '11px 20px' }}>Hủy</Btn>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════ CATEGORIES ═══════════ */}
          {tab === 'categories' && (() => {
            const roots = categories.filter(c => !c.parent_id);
            const children = (pid) => categories.filter(c => c.parent_id === pid);
            const catCount = (id) => productList.filter(p => p.categoryId === id).length;

            const CatRow = ({ cat, indent }) => (
              <tr key={cat.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', paddingLeft: indent ? 44 : 16 }}>
                  <span style={{ fontWeight: indent ? 500 : 700, color: indent ? C.muted : C.text, fontSize: 13 }}>
                    {indent && <span style={{ color: C.light, marginRight: 6 }}>└</span>}
                    {cat.name}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, color: C.light, background: C.bg, padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace' }}>{cat.slug}</span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{catCount(cat.id)}</span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    {!indent && (
                      <button onClick={() => { setShowCatForm(true); setEditCatId(null); setCatForm({ name: '', slug: '', parent_id: cat.id }); }}
                        style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: '#059669', cursor: 'pointer', transition: 'all .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#059669'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; }}>+ Con</button>
                    )}
                    <button onClick={() => { setEditCatId(cat.id); setCatForm({ name: cat.name, slug: cat.slug, parent_id: cat.parent_id || '' }); setShowCatForm(true); }}
                      style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: C.primary, cursor: 'pointer', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.borderColor = C.primary; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; }}>Sửa</button>
                    <button onClick={() => setDelConfirm({ type: 'category', id: cat.id })}
                      style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid #fecdd3', background: 'transparent', color: '#e11d48', cursor: 'pointer', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Xóa</button>
                  </div>
                </td>
              </tr>
            );

            return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <SectionTitle>Danh mục ({categories.length})</SectionTitle>
                {!showCatForm && (
                  <Btn onClick={() => { setShowCatForm(true); setEditCatId(null); setCatForm({ name: '', slug: '', parent_id: '' }); }}>+ Thêm danh mục cha</Btn>
                )}
              </div>

              {showCatForm && (
                <form onSubmit={handleCatSubmit} style={{ background: C.card, border: `1.5px solid ${C.primary}`, borderRadius: 12, padding: 20, marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 14 }}>
                    {editCatId ? 'Chỉnh sửa danh mục' : catForm.parent_id ? `Thêm danh mục con vào "${categories.find(c => c.id === parseInt(catForm.parent_id))?.name || ''}"` : 'Thêm danh mục cha mới'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <FInput label="Tên danh mục *" required value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} placeholder="VD: Sofa góc" />
                    <FInput label="Slug *" required value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))} placeholder="sofa-goc" />
                    <FSelect label="Thuộc danh mục" value={catForm.parent_id} onChange={e => setCatForm(f => ({ ...f, parent_id: e.target.value }))}>
                      <option value="">Danh mục cha (gốc)</option>
                      {roots.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </FSelect>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn type="submit">{editCatId ? 'Cập nhật' : 'Thêm danh mục'}</Btn>
                    <Btn variant="ghost" type="button" onClick={() => { setShowCatForm(false); setEditCatId(null); setCatForm(EMPTY_CAT); }}>Hủy</Btn>
                  </div>
                </form>
              )}

              <div style={tableCard}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <th style={th}>Tên danh mục</th>
                      <th style={th}>Slug</th>
                      <th style={{ ...th, textAlign: 'center' }}>Sản phẩm</th>
                      <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roots.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: C.light }}>Chưa có danh mục nào</td></tr>
                    ) : roots.map(parent => (
                      [<CatRow key={parent.id} cat={parent} indent={false} />,
                       ...children(parent.id).map(child => <CatRow key={child.id} cat={child} indent={true} />)]
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            );
          })()}

          {/* ═══════════ COUPONS ═══════════ */}
          {tab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <SectionTitle>Mã giảm giá ({coupons.length})</SectionTitle>
                {!showCouponForm && (
                  <Btn onClick={() => { setShowCouponForm(true); setEditCouponId(null); setCouponForm(EMPTY_COUPON); }}>+ Thêm mã mới</Btn>
                )}
              </div>

              {showCouponForm && (
                <form onSubmit={handleCouponSubmit} style={{ background: C.card, border: `1.5px solid ${C.primary}`, borderRadius: 12, padding: 20, marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 14 }}>
                    {editCouponId ? '✏️ Chỉnh sửa mã giảm giá' : '➕ Thêm mã giảm giá mới'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <FInput label="Mã code *" required value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" style={{ fontFamily: 'monospace', textTransform: 'uppercase' }} />
                    <FInput label="Giảm (%)" required type="number" min="1" max="100" value={couponForm.discount_percent} onChange={e => setCouponForm(f => ({ ...f, discount_percent: e.target.value }))} placeholder="20" />
                    <FInput label="Đơn tối thiểu (₫)" type="number" value={couponForm.min_order} onChange={e => setCouponForm(f => ({ ...f, min_order: e.target.value }))} placeholder="500000" />
                    <FInput label="Hạn sử dụng" type="date" value={couponForm.expires_at} onChange={e => setCouponForm(f => ({ ...f, expires_at: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn type="submit">{editCouponId ? 'Cập nhật' : 'Thêm mã'}</Btn>
                    <Btn variant="ghost" type="button" onClick={() => { setShowCouponForm(false); setEditCouponId(null); setCouponForm(EMPTY_COUPON); }}>Hủy</Btn>
                  </div>
                </form>
              )}

              <div style={tableCard}>
                {coupons.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: C.light }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🎟️</div>
                    <p style={{ fontSize: 14 }}>Chưa có mã giảm giá nào</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <th style={th}>Mã code</th>
                        <th style={{ ...th, textAlign: 'center' }}>Giảm</th>
                        <th style={{ ...th, textAlign: 'right' }}>Đơn tối thiểu</th>
                        <th style={{ ...th, textAlign: 'center' }}>Hạn dùng</th>
                        <th style={{ ...th, textAlign: 'center' }}>Trạng thái</th>
                        <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c, i) => (
                        <tr key={c.id} style={{ borderBottom: i < coupons.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, background: C.primaryBg, color: C.primary, padding: '4px 10px', borderRadius: 6, letterSpacing: .5 }}>{c.code}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 800, color: '#e11d48', fontSize: 15 }}>-{c.discount_percent}%</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', color: C.muted }}>
                            {c.min_order > 0 ? formatPrice(c.min_order) : '—'}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', color: C.muted, fontSize: 12 }}>
                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString('vi-VN') : '—'}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button onClick={async () => { await updateCoupon(c.id, { is_active: !c.is_active }); showToast('Đã cập nhật trạng thái!'); }}
                              style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', background: c.is_active ? '#ecfdf5' : '#f1f5f9', color: c.is_active ? '#059669' : C.light, transition: 'all .15s' }}>
                              {c.is_active ? '● Kích hoạt' : '○ Tắt'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button onClick={() => { setEditCouponId(c.id); setCouponForm({ code: c.code, discount_percent: c.discount_percent, min_order: c.min_order || '', expires_at: c.expires_at || '', is_active: c.is_active }); setShowCouponForm(true); }}
                                style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: C.primary, cursor: 'pointer', transition: 'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = C.primaryBg; e.currentTarget.style.borderColor = C.primary; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; }}>Sửa</button>
                              <button onClick={() => setDelConfirm({ type: 'coupon', id: c.id })}
                                style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid #fecdd3', background: 'transparent', color: '#e11d48', cursor: 'pointer', transition: 'background .15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Xóa</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ BANNERS ═══════════ */}
          {tab === 'banners' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <SectionTitle>Banner ({banners.length})</SectionTitle>
                <div>
                  <input ref={bannerFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    setUploading(true);
                    for (const file of files) {
                      try {
                        const url = await uploadImage(file, 'banners');
                        const { error } = await addBanner({ image_url: url, sort_order: banners.length });
                        if (error) { alert('Lỗi lưu vào database: ' + error.message); continue; }
                      } catch (err) { alert('Upload lỗi: ' + err.message); }
                    }
                    setUploading(false);
                    e.target.value = '';
                    showToast('Thêm banner thành công!');
                  }} />
                  <Btn disabled={uploading} onClick={() => bannerFileRef.current.click()}>
                    {uploading ? 'Đang tải...' : '📁 Tải banner từ máy tính'}
                  </Btn>
                </div>
              </div>

              {banners.length === 0 ? (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '50px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                  <p style={{ color: C.light, fontSize: 14, marginBottom: 16 }}>Chưa có banner nào</p>
                  <Btn onClick={() => bannerFileRef.current.click()}>📁 Tải banner đầu tiên</Btn>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                  {banners.map((b, i) => (
                    <div key={b.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                      <img src={b.image_url} alt={`Banner ${i + 1}`} style={{ width: '100%', height: 'auto', aspectRatio: '1400/450', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>Banner {i + 1}</span>
                        <button onClick={() => setDelConfirm({ type: 'banner', id: b.id })}
                          style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid #fecdd3', background: 'transparent', color: '#e11d48', cursor: 'pointer', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ REVIEWS ═══════════ */}
          {tab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <SectionTitle>Đánh giá sản phẩm ({reviews.length})</SectionTitle>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} style={{ fontSize: 13, color: C.muted }}>
                      {reviews.filter(r => r.rating === n).length} × {'★'.repeat(n)}
                    </span>
                  ))}
                </div>
              </div>

              <div style={tableCard}>
                {reviews.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: C.light }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
                    <p style={{ fontSize: 14 }}>Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <th style={th}>Sản phẩm</th>
                        <th style={th}>Khách hàng</th>
                        <th style={{ ...th, textAlign: 'center' }}>Điểm</th>
                        <th style={th}>Nội dung</th>
                        <th style={{ ...th, textAlign: 'center' }}>Ngày</th>
                        <th style={{ ...th, textAlign: 'center' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((r, i) => (
                        <tr key={r.id} style={{ borderBottom: i < reviews.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {r.products?.images?.[0] && <img src={r.products.images[0]} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, border: `1px solid ${C.border}` }} />}
                              <span style={{ fontWeight: 600, color: C.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{r.products?.name || '—'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: C.text }}>{r.customer_name}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}><Stars n={r.rating} /></td>
                          <td style={{ padding: '12px 16px', color: C.muted, maxWidth: 260 }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment || '—'}</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', color: C.light, fontSize: 12, whiteSpace: 'nowrap' }}>
                            {new Date(r.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button onClick={() => setDelConfirm({ type: 'review', id: r.id })}
                              style={{ width: 28, height: 28, border: 'none', background: '#f1f5f9', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: C.light, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#e11d48'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = C.light; }}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ SETTINGS ═══════════ */}
          {tab === 'settings' && (() => {
            const [sf, setSf] = [settingsForm, setSettingsForm];
            return (
            <div>
              <SectionTitle>Cài đặt cửa hàng</SectionTitle>

              <div style={{ display: 'grid', gap: 18 }}>
                {/* Thông tin cửa hàng */}
                <div style={{ ...tableCard, padding: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 3, height: 16, background: C.primary, borderRadius: 2, display: 'inline-block' }} />
                    Thông tin cửa hàng
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <FInput label="Tên cửa hàng" value={sf.store_name} onChange={e => setSf(f => ({ ...f, store_name: e.target.value }))} />
                    </div>
                    <FInput label="Số điện thoại 1" value={sf.phone1} onChange={e => setSf(f => ({ ...f, phone1: e.target.value }))} placeholder="0398 945 409" />
                    <FInput label="Số điện thoại 2" value={sf.phone2} onChange={e => setSf(f => ({ ...f, phone2: e.target.value }))} placeholder="0867 968 963" />
                    <div style={{ gridColumn: '1/-1' }}>
                      <FInput label="Địa chỉ" value={sf.address} onChange={e => setSf(f => ({ ...f, address: e.target.value }))} placeholder="158 Nguyễn Ảnh Thủ..." />
                    </div>
                    <FInput label="Giờ làm việc" value={sf.working_hours} onChange={e => setSf(f => ({ ...f, working_hours: e.target.value }))} placeholder="T2 – CN: 8h00 – 21h00" />
                  </div>
                </div>

                {/* Mạng xã hội */}
                <div style={{ ...tableCard, padding: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 3, height: 16, background: C.primary, borderRadius: 2, display: 'inline-block' }} />
                    Mạng xã hội
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FInput label="SĐT Zalo" value={sf.zalo_phone} onChange={e => setSf(f => ({ ...f, zalo_phone: e.target.value }))} placeholder="0398945409" />
                    <FInput label="Link Facebook" value={sf.facebook_url} onChange={e => setSf(f => ({ ...f, facebook_url: e.target.value }))} placeholder="https://facebook.com/..." />
                    <FInput label="Link TikTok" value={sf.tiktok_url} onChange={e => setSf(f => ({ ...f, tiktok_url: e.target.value }))} placeholder="https://tiktok.com/@..." />
                  </div>
                </div>

                {/* Ngân hàng */}
                <div style={{ ...tableCard, padding: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 3, height: 16, background: C.primary, borderRadius: 2, display: 'inline-block' }} />
                    Thông tin ngân hàng (QR thanh toán)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <FInput label="Mã ngân hàng" value={sf.bank_id} onChange={e => setSf(f => ({ ...f, bank_id: e.target.value }))} placeholder="BIDV, VCB, TCB, MB..." />
                    <FInput label="Số tài khoản" value={sf.bank_account_no} onChange={e => setSf(f => ({ ...f, bank_account_no: e.target.value }))} placeholder="0123456789" />
                    <FInput label="Chủ tài khoản" value={sf.bank_account_name} onChange={e => setSf(f => ({ ...f, bank_account_name: e.target.value }))} placeholder="NGUYEN VAN A" />
                  </div>
                  {sf.bank_id && sf.bank_account_no && (
                    <div style={{ marginTop: 16, padding: 16, background: C.bg, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: C.light, marginBottom: 8, fontWeight: 600 }}>Xem trước mã QR</div>
                      <img
                        src={`https://img.vietqr.io/image/${sf.bank_id}-${sf.bank_account_no}-compact2.png?amount=100000&addInfo=DEMO&accountName=${encodeURIComponent(sf.bank_account_name || '')}`}
                        alt="QR preview" style={{ height: 160, borderRadius: 8 }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn onClick={async () => {
                    const { error } = await updateSettings(sf);
                    if (error) alert('Lỗi: ' + error.message);
                    else showToast('Đã lưu cài đặt!');
                  }} style={{ padding: '12px 28px' }}>💾 Lưu cài đặt</Btn>
                  <Btn variant="ghost" onClick={() => setSf({ ...settings })} style={{ padding: '12px 20px' }}>Hoàn tác</Btn>
                </div>
              </div>
            </div>
            );
          })()}

        </div>
      </div>

      {/* Delete modal */}
      {delConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
          <div style={{ background: C.card, borderRadius: 16, padding: 28, maxWidth: 340, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ width: 48, height: 48, background: '#fff1f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>🗑️</div>
            <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 8 }}>Xác nhận xóa</h3>
            <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginBottom: 20 }}>Thao tác này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="danger" onClick={confirmDelete} style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>Xóa</Btn>
              <Btn variant="ghost" onClick={() => setDelConfirm(null)} style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>Hủy</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
