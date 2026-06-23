import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import SEO from '../components/SEO';

export default function GeneralPolicy() {
  usePageTitle('Chính sách và quy định chung');
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <SEO title="Chính sách và quy định chung" description="Các điều khoản và điều kiện khi mua hàng tại MOCA Living — chính sách giao dịch, bảo mật và giải quyết tranh chấp." />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <nav style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>Chính sách và quy định chung</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 20, padding: '40px 36px', marginBottom: 24, color: '#fff' }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Chính sách và quy định chung</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>
            Các điều khoản và điều kiện khi mua hàng tại MOCA Living.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 32 }}>
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              1. Điều khoản sử dụng website
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              Khi truy cập và sử dụng website noithatmoca.com, khách hàng đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website ngay lập tức.
            </p>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
              Chúng tôi có quyền điều chỉnh, bổ sung nội dung các điều khoản này bất cứ lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng website sau khi thay đổi đồng nghĩa với việc bạn chấp nhận các điều chỉnh đó.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              2. Điều kiện giao dịch chung
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              Khách hàng có trách nhiệm cung cấp thông tin cá nhân chính xác, trung thực khi đặt hàng trên website. MOCA Living có quyền từ chối đơn hàng nếu phát hiện thông tin sai lệch hoặc có dấu hiệu gian lận.
            </p>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
              Giá niêm yết trên website chưa bao gồm thuế GTGT (VAT) trừ khi có thông báo khác. Chúng tôi cam kết minh bạch về giá cả và các khoản phí liên quan.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              3. Quyền sở hữu trí tuệ
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              Toàn bộ nội dung trên website (bao gồm hình ảnh, văn bản, logo, thiết kế) thuộc quyền sở hữu của MOCA Living. Nghiêm cấm mọi hành vi sao chép, phân phối hoặc sử dụng trái phép.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              4. Giải quyết tranh chấp
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              Mọi tranh chấp phát sinh từ giao dịch trên website sẽ được giải quyết bằng thương lượng trên tinh thần hợp tác. Trong trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
              5. Thông tin người chịu trách nhiệm
            </h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 8 }}>
              Người chịu trách nhiệm quản lý và vận hành website noithatmoca.com:
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 20px', marginTop: 8 }}>
              <table style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  <tr><td style={{ fontWeight: 600, paddingRight: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Tên tổ chức:</td><td>Hộ kinh doanh MOCA Living</td></tr>
                  <tr><td style={{ fontWeight: 600, paddingRight: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Người đại diện:</td><td>Nguyễn Thành Đạt</td></tr>
                  <tr><td style={{ fontWeight: 600, paddingRight: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Địa chỉ:</td><td>158 Nguyễn Ảnh Thủ, Thới Tam Thôn, Hóc Môn, TP. Hồ Chí Minh</td></tr>
                  <tr><td style={{ fontWeight: 600, paddingRight: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Điện thoại:</td><td>0934.638.622</td></tr>
                  <tr><td style={{ fontWeight: 600, paddingRight: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}>Email:</td><td>info@noithatmoca.com</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
