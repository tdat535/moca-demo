import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { supabase } from '../lib/supabase';

// ── Thông tin ngân hàng (thay bằng thông tin thật) ──
const BANK_INFO = {
  bankId: 'BIDV',
  accountNo: '0123456789',
  accountName: 'NGUYEN VAN A',
};

const STATUS_LABELS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };

function StepBar({ step }) {
  const steps = ['Giỏ hàng', 'Thông tin', 'Hoàn tất'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, transition: 'all .2s',
              background: i <= step ? '#2563eb' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8',
            }}>{i < step ? '✓' : i + 1}</div>
            <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i <= step ? '#0f172a' : '#94a3b8' }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 64, height: 2, background: i < step ? '#2563eb' : '#e2e8f0', margin: '0 8px', marginBottom: 20, borderRadius: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const { cart, dispatch, totalItems, totalPrice } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    note: '',
    payment: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // { id, payment }

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount_percent }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const discountAmount = appliedCoupon ? Math.round(totalPrice * appliedCoupon.discount_percent / 100) : 0;
  const finalPrice = totalPrice - discountAmount;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponError('');
    setCouponLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').eq('code', code).eq('is_active', true).single();
    setCouponLoading(false);
    if (error || !data) { setCouponError('Mã giảm giá không hợp lệ'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { setCouponError('Mã giảm giá đã hết hạn'); return; }
    if (data.min_order && totalPrice < data.min_order) { setCouponError(`Đơn hàng tối thiểu ${formatPrice(data.min_order)}`); return; }
    setAppliedCoupon({ code: data.code, discount_percent: data.discount_percent });
    setCouponCode('');
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: form.address,
      note: form.note || null,
      payment_method: form.payment,
      items: cart.map(i => ({
        product_id: i.id, name: i.name, price: i.price, qty: i.qty,
        image: i.images?.[0] || i.image,
      })),
      total_price: finalPrice,
      coupon_code: appliedCoupon?.code || null,
      discount_amount: discountAmount,
      status: 'pending',
      user_id: user?.id || null,
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    setSubmitting(false);

    if (error) { alert('Đặt hàng thất bại: ' + error.message); return; }

    setOrderResult({ id: data?.id, payment: form.payment, total: finalPrice });
    dispatch({ type: 'CLEAR' });
  };

  if (cart.length === 0 && !orderResult) { navigate('/cart'); return null; }

  // ── QR Bank Transfer page ──
  if (orderResult?.payment === 'bank') {
    const qrContent = `DH${orderResult.id}`;
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-compact2.png?amount=${orderResult.total}&addInfo=${encodeURIComponent(qrContent)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

    return (
      <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar step={2} />
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: '#0f172a', padding: '24px 28px', textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>Đơn hàng #{orderResult.id}</div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{formatPrice(orderResult.total)}</div>
            </div>

            {/* QR */}
            <div style={{ padding: '28px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Quét mã QR bằng app ngân hàng để thanh toán</p>
              <div style={{ background: '#fff', border: '2px solid #e2e8f0', borderRadius: 16, display: 'inline-block', padding: 12 }}>
                <img src={qrUrl} alt="QR thanh toán" style={{ width: 240, height: 240, display: 'block' }} />
              </div>

              {/* Bank info */}
              <div style={{ marginTop: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Thông tin chuyển khoản</div>
                {[
                  { l: 'Ngân hàng', v: BANK_INFO.bankId },
                  { l: 'Số tài khoản', v: BANK_INFO.accountNo },
                  { l: 'Chủ tài khoản', v: BANK_INFO.accountName },
                  { l: 'Số tiền', v: formatPrice(orderResult.total) },
                  { l: 'Nội dung CK', v: qrContent },
                ].map(row => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{row.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{row.v}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.6 }}>
                Sau khi chuyển khoản, chúng tôi sẽ xác nhận đơn hàng trong vòng 5–15 phút.
                <br />Nếu cần hỗ trợ, liên hệ Zalo: <strong>0934.638.622</strong>
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
                <button onClick={() => setOrderResult(r => ({ ...r, payment: 'done' }))} style={{
                  background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
                  padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Tôi đã chuyển khoản</button>
                <a href="https://zalo.me/0934638622" target="_blank" rel="noopener noreferrer" style={{
                  border: '1.5px solid #e2e8f0', color: '#0068ff', textDecoration: 'none',
                  borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 700,
                }}>Chat Zalo</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Success page (COD or after bank confirm) ──
  if (orderResult) {
    return (
      <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar step={2} />
          <div style={{ textAlign: 'center', padding: '48px 28px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ width: 64, height: 64, background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Đặt hàng thành công!</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 6 }}>Cảm ơn bạn đã tin tưởng MOCA Living.</p>
            {orderResult.id && <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Mã đơn hàng: <strong style={{ color: '#2563eb' }}>#{orderResult.id}</strong></p>}
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
              Chúng tôi sẽ liên hệ xác nhận đơn hàng qua số điện thoại của bạn.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link to="/" style={{ background: '#2563eb', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Tiếp tục mua sắm</Link>
              {user && <Link to="/tai-khoan" style={{ border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Xem đơn hàng</Link>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout form ──
  const inputStyle = {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10,
    padding: '11px 14px', fontSize: 14, outline: 'none', color: '#0f172a',
    transition: 'border .15s', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <StepBar step={1} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
            {/* Left: form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Customer info */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Thông tin người nhận
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Họ và tên *</label>
                    <input required value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Số điện thoại *</label>
                    <input required value={form.phone} onChange={set('phone')} placeholder="0901234567" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Địa chỉ giao hàng *</label>
                  <input required value={form.address} onChange={set('address')} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Ghi chú</label>
                  <textarea value={form.note} onChange={set('note')} placeholder="VD: Giao buổi chiều, gọi trước 30 phút..." rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  Phương thức thanh toán
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: '💵' },
                    { value: 'bank', label: 'Chuyển khoản ngân hàng (QR)', desc: 'Quét mã QR để chuyển khoản, xác nhận tự động', icon: '🏦' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                      border: `1.5px solid ${form.payment === opt.value ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
                      background: form.payment === opt.value ? '#eff6ff' : '#fff',
                    }}>
                      <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value}
                        onChange={set('payment')} style={{ accentColor: '#2563eb', marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{opt.icon} {opt.label}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: summary */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, position: 'sticky', top: 88 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
                Đơn hàng ({totalItems} sản phẩm)
              </h3>

              <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 14 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={item.images?.[0] || item.image} alt="" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8, border: '1px solid #e2e8f0', padding: 2 }} />
                      <span style={{ position: 'absolute', top: -6, right: -6, background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{item.qty}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginTop: 2 }}>{formatPrice(item.price * item.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                  <span>Tạm tính</span>
                  <span style={{ color: '#0f172a', fontWeight: 500 }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>Giảm giá ({appliedCoupon.discount_percent}%)</span>
                    <span style={{ color: '#dc2626', fontWeight: 600 }}>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginBottom: 14 }}>
                {appliedCoupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '8px 12px' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>✓ {appliedCoupon.code}</span>
                      <span style={{ fontSize: 12, color: '#64748b', marginLeft: 6 }}>(-{appliedCoupon.discount_percent}%)</span>
                    </div>
                    <button type="button" onClick={() => setAppliedCoupon(null)}
                      style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Xóa</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Nhập mã giảm giá"
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                        style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '.5px' }} />
                      <button type="button" onClick={applyCoupon} disabled={couponLoading}
                        style={{ border: '1.5px solid #2563eb', background: '#fff', color: '#2563eb', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', opacity: couponLoading ? .6 : 1 }}>
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{couponError}</p>}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Tổng cộng</span>
                  <span style={{ fontWeight: 900, fontSize: 20, color: '#2563eb' }}>{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} style={{
                width: '100%', background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', opacity: submitting ? .7 : 1, transition: 'background .15s',
              }}
                onMouseEnter={e => !submitting && (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
                {submitting ? 'Đang xử lý...' : form.payment === 'bank' ? 'Đặt hàng & Thanh toán' : 'Xác Nhận Đặt Hàng'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 12, lineHeight: 1.5 }}>
                Bằng việc đặt hàng, bạn đồng ý với chính sách mua hàng của chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
