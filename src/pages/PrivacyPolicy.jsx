import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  usePageTitle('Chính sách bảo mật thông tin');
  return (
    <div className="bg-surface min-h-screen">
      <SEO title="Chính sách bảo mật thông tin" description="Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm tại MOCA Living." />
      <div className="max-w-[900px] mx-auto px-4 py-6">
        <nav className="text-xs mb-4 flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
          <Link to="/" className="font-medium no-underline hover:text-primary transition-colors" style={{ color: '#64748b' }}>Trang chủ</Link>
          <span>›</span>
          <span className="font-medium" style={{ color: '#0f172a' }}>Chính sách bảo mật thông tin</span>
        </nav>

        <div className="rounded-2xl p-8 lg:p-10 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #1a2a2a, #2d3e3e)' }}>
          <h1 className="text-2xl lg:text-[28px] font-black mb-2">Chính sách bảo mật thông tin</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>
            Cam kết bảo vệ thông tin cá nhân của khách hàng khi mua sắm tại MOCA Living.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 lg:p-8 space-y-7" style={{ border: '1px solid #e8e3dc' }}>
          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              1. Mục đích thu thập thông tin
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#475569' }}>
              Chúng tôi thu thập thông tin cá nhân của khách hàng (họ tên, số điện thoại, địa chỉ, email) nhằm các mục đích sau:
            </p>
            <ul className="text-sm leading-relaxed pl-5 space-y-1" style={{ color: '#475569' }}>
              <li>Xử lý và giao nhận đơn hàng</li>
              <li>Liên hệ xác nhận thông tin đơn hàng</li>
              <li>Hỗ trợ khách hàng và giải quyết khiếu nại</li>
              <li>Gửi thông tin khuyến mãi (khi khách hàng đồng ý)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              2. Phạm vi sử dụng thông tin
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#475569' }}>
              Thông tin khách hàng chỉ được sử dụng nội bộ trong phạm vi MOCA Living. Chúng tôi cam kết không chia sẻ, bán hoặc tiết lộ thông tin cá nhân cho bên thứ ba, trừ trường hợp:
            </p>
            <ul className="text-sm leading-relaxed pl-5 space-y-1" style={{ color: '#475569' }}>
              <li>Có yêu cầu từ cơ quan pháp luật có thẩm quyền</li>
              <li>Cần thiết cho việc cung cấp dịch vụ (đối tác vận chuyển)</li>
              <li>Được khách hàng đồng ý</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              3. Thời gian lưu trữ
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Thông tin cá nhân của khách hàng được lưu trữ cho đến khi khách hàng yêu cầu hủy bỏ hoặc khi không còn cần thiết cho mục đích thu thập ban đầu.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              4. Quyền của khách hàng
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào bằng cách liên hệ với chúng tôi qua số hotline 0398.945.409 hoặc email info@noithatmoca.com.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              5. Bảo mật thông tin thanh toán
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Mọi giao dịch thanh toán được bảo vệ bằng mã hóa SSL. Chúng tôi không lưu trữ thông tin thẻ tín dụng hoặc thông tin tài khoản ngân hàng của khách hàng trên hệ thống.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              6. Đơn vị thu thập và quản lý thông tin
            </h2>
            <div className="text-sm leading-relaxed space-y-1" style={{ color: '#475569' }}>
              <p>Đơn vị chịu trách nhiệm thu thập, quản lý và bảo vệ thông tin cá nhân của khách hàng:</p>
              <div className="bg-[#f9f7f4] rounded-xl p-4 mt-3 space-y-1" style={{ border: '1px solid #e8e3dc' }}>
                <p><span className="font-semibold" style={{ color: '#2d2a24' }}>Hộ kinh doanh MOCA Living</span></p>
                <p><span className="font-medium">Địa chỉ:</span> 158 Nguyễn Ảnh Thủ, Thới Tam Thôn, Hóc Môn, TP. Hồ Chí Minh</p>
                <p><span className="font-medium">Điện thoại:</span> 0934.638.622</p>
                <p><span className="font-medium">Email:</span> info@noithatmoca.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[17px] font-extrabold mb-3 flex items-center gap-2" style={{ color: '#2d2a24' }}>
              <span className="w-1 h-[18px] rounded-sm shrink-0 inline-block" style={{ background: '#1e2d2d' }} />
              7. Cơ chế tiếp nhận và giải quyết khiếu nại liên quan đến thông tin cá nhân
            </h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: '#475569' }}>
              <p>Khi phát hiện thông tin cá nhân bị sử dụng sai mục đích hoặc vượt phạm vi đã thông báo, khách hàng có quyền gửi khiếu nại đến MOCA Living qua:</p>
              <div className="bg-[#f9f7f4] rounded-xl p-4 mt-3 space-y-1" style={{ border: '1px solid #e8e3dc' }}>
                <p><span className="font-medium">Hotline:</span> 0398.945.409</p>
                <p><span className="font-medium">Email:</span> info@noithatmoca.com</p>
              </div>
              <p>Chúng tôi cam kết phản hồi trong vòng 48 giờ làm việc kể từ khi tiếp nhận khiếu nại và phối hợp xử lý để bảo vệ quyền lợi của khách hàng.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
