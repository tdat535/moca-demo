import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem('promo_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, maxWidth: 420, width: '100%',
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        animation: 'popIn .3s ease',
      }}>
        <style>{`@keyframes popIn { from { opacity: 0; transform: scale(.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)', padding: '32px 28px', textAlign: 'center', color: '#fff', position: 'relative' }}>
          <button onClick={close} style={{
            position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Chào mừng bạn!</div>
          <div style={{ fontSize: 14, opacity: .8 }}>Ưu đãi đặc biệt dành cho bạn</div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', textAlign: 'center' }}>
          <div style={{ background: '#eff6ff', border: '2px dashed #2563eb', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Giảm ngay</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#2563eb' }}>10%</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>cho đơn hàng đầu tiên</div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Mã giảm giá:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: 1, background: '#fff', padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>WELCOME</span>
          </div>

          <Link to="/" onClick={close} style={{
            display: 'block', background: '#2563eb', color: '#fff', textDecoration: 'none',
            padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, marginBottom: 8,
          }}>Mua sắm ngay →</Link>

          <button onClick={close} style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
