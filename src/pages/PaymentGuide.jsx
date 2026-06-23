import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import SEO from '../components/SEO';

export default function PaymentGuide() {
  usePageTitle('Hướng dẫn thanh toán');
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <SEO title="Hướng dẫn thanh toán" description="MOCA Living hỗ trợ nhiều phương thức thanh toán linh hoạt — COD và chuyển khoản ngân hàng." />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <nav style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>Hướng dẫn thanh toán</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: '40px 36px', marginBottom: 24, color: '#fff' }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Hướng dẫn thanh toán</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>
            MOCA Living hỗ trợ nhiều phương thức thanh toán linh hoạt cho quý khách.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💵</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Thanh toán khi nhận hàng (COD)</h3>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
              Khách hàng thanh toán trực tiếp bằng tiền mặt hoặc chuyển khoản khi nhận hàng. Phương thức này áp dụng cho tất cả đơn hàng giao hàng toàn quốc.
            </p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏦</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Chuyển khoản ngân hàng</h3>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
              Khách hàng chuyển khoản qua ngân hàng theo thông tin tài khoản được cung cấp tại trang thanh toán. Hỗ trợ quét mã QR qua ứng dụng ngân hàng.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 32 }}>
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              Quy trình thanh toán chuyển khoản
            </h2>
            <ol style={{ fontSize: 14, color: '#475569', lineHeight: 2, paddingLeft: 20 }}>
              <li>Chọn phương thức "Chuyển khoản ngân hàng" tại trang đặt hàng.</li>
              <li>Hệ thống hiển thị thông tin tài khoản và mã QR thanh toán.</li>
              <li>Thực hiện chuyển khoản với nội dung theo mã đơn hàng.</li>
              <li>Hệ thống tự động xác nhận sau khi nhận được tiền.</li>
              <li>Đơn hàng được xử lý và giao trong thời gian 2–5 ngày.</li>
            </ol>
          </section>

          <section>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              Lưu ý khi thanh toán
            </h2>
            <ul style={{ fontSize: 14, color: '#475569', lineHeight: 2, paddingLeft: 20 }}>
              <li>Nội dung chuyển khoản phải ghi rõ mã đơn hàng để đối soát nhanh chóng.</li>
              <li>Thời gian xử lý chuyển khoản: 5–15 phút trong giờ hành chính.</li>
              <li>Nếu cần hỗ trợ, liên hệ hotline: <strong>0398.945.409</strong></li>
              <li>MOCA Living không lưu trữ thông tin tài khoản ngân hàng của khách hàng.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
