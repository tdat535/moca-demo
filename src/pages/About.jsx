import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import SEO from '../components/SEO';

export default function About() {
  usePageTitle('Về cửa hàng');
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <SEO title="Về cửa hàng" description="MOCA Living là thương hiệu nội thất chuyên cung cấp sofa, bàn ghế, tủ kệ, đèn trang trí và phụ kiện nội thất thiết kế hiện đại, chất lượng cao." />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <nav style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>Về cửa hàng</span>
        </nav>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: '48px 40px', marginBottom: 24, color: '#fff', textAlign: 'center' }}>
          <img src="/logoo2.png" alt="Logo" style={{ height: 56, marginBottom: 16 }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>MOCA Living</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Nội thất hiện đại, chất lượng cao — mang đến không gian sống tinh tế cho mọi gia đình Việt.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: '🏠', title: 'Về chúng tôi', desc: 'MOCA Living là thương hiệu nội thất chuyên cung cấp các sản phẩm sofa, bàn ghế, tủ kệ, đèn trang trí và phụ kiện nội thất với thiết kế hiện đại, phù hợp mọi không gian sống.' },
            { icon: '🎯', title: 'Sứ mệnh', desc: 'Mang đến cho khách hàng những sản phẩm nội thất chất lượng cao với giá cả hợp lý, dịch vụ tận tâm và trải nghiệm mua sắm thuận tiện nhất.' },
            { icon: '✨', title: 'Cam kết chất lượng', desc: 'Tất cả sản phẩm đều được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng. Bảo hành chính hãng từ 12–36 tháng tùy sản phẩm.' },
            { icon: '🚚', title: 'Giao hàng & Lắp đặt', desc: 'Miễn phí giao hàng và lắp đặt tận nơi trong nội thành. Đội ngũ nhân viên chuyên nghiệp, hỗ trợ khách hàng tận tình.' },
          ].map(item => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 20, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Địa chỉ</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>158 Nguyễn Ảnh Thủ,<br />Thới Tam Thôn, Hóc Môn</p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Hotline</div>
              <a href="tel:0398945409" style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>0398.945.409</a>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>0867.968.963</p>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>T2 – CN: 8h00 – 21h00</p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Mạng xã hội</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href="https://zalo.me/0398945409" target="_blank" rel="noopener noreferrer"
                  style={{ background: '#0068ff', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Zalo
                </a>
                <a href="https://www.facebook.com/share/1CG1KUriyG/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ background: '#1877f2', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Facebook
                </a>
                <a href="https://www.tiktok.com/@mocaliving" target="_blank" rel="noopener noreferrer" style={{ background: '#010101', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
