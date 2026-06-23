import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import SEO from '../components/SEO';

const sections = [
  {
    icon: '🛒',
    id: 'ordering',
    title: '2.1 Quy trình đặt hàng',
    lines: [
      'Bước 1: Khách hàng duyệt sản phẩm theo danh mục hoặc tìm kiếm trên website, sau đó thêm sản phẩm mong muốn vào giỏ hàng.',
      'Bước 2: Truy cập giỏ hàng, kiểm tra lại danh sách sản phẩm, số lượng và tổng tiền. Có thể nhập mã giảm giá nếu có.',
      'Bước 3: Điền đầy đủ thông tin người nhận hàng (họ tên, số điện thoại, địa chỉ giao hàng).',
      'Bước 4: Chọn phương thức thanh toán phù hợp (COD hoặc chuyển khoản ngân hàng) và xác nhận đơn hàng.',
      'Bước 5: MOCA Living liên hệ xác nhận đơn hàng qua điện thoại trong vòng 30 phút kể từ khi đặt hàng thành công.',
      'Bước 6: Tiến hành giao hàng và lắp đặt (nếu có) theo lịch hẹn. Khách hàng kiểm tra và nhận hàng.',
    ],
  },
  {
    icon: '💳',
    id: 'payment',
    title: '2.2 Phương thức thanh toán',
    lines: [
      '• Thanh toán tiền mặt khi nhận hàng (COD): Áp dụng toàn quốc, khách hàng thanh toán trực tiếp cho nhân viên giao hàng khi nhận được sản phẩm. Phù hợp với những đơn hàng có giá trị dưới 50 triệu đồng.',
      '• Chuyển khoản ngân hàng (VietQR): Khách hàng chuyển khoản qua số tài khoản ngân hàng hiển thị tại trang thanh toán. Hỗ trợ quét mã VietQR nhanh qua ứng dụng ngân hàng. Thời gian xử lý: 1–5 phút sau khi nhận được tiền.',
      '• Thanh toán qua ZaloPay / Momo: Vui lòng liên hệ tổng đài 0398 945 409 để được hỗ trợ tạo link thanh toán.',
      '• Trả góp qua thẻ tín dụng: Hỗ trợ trả góp 0% lãi suất qua thẻ VISA, Mastercard (kỳ hạn 3–12 tháng). Vui lòng liên hệ trực tiếp để được tư vấn.',
    ],
  },
  {
    icon: '🚚',
    id: 'shipping',
    title: '2.3 Chính sách giao hàng',
    lines: [
      'Thời gian giao hàng dự kiến:',
      '– Nội thành TP. Hồ Chí Minh: 1–2 ngày làm việc.',
      '– Các tỉnh lân cận (Bình Dương, Đồng Nai, Long An, Bà Rịa – Vũng Tàu): 2–3 ngày làm việc.',
      '– Các tỉnh thành khác trên toàn quốc: 3–7 ngày làm việc.',
      '– Khu vực miền núi, hải đảo: thời gian có thể kéo dài hơn 5–10 ngày làm việc.',
      '',
      'Khu vực giao hàng: Toàn quốc. Miễn phí giao hàng cho tất cả đơn hàng từ 500.000₫. Đơn hàng dưới 500.000₫: phí giao hàng 30.000₫ – 50.000₫ tùy khu vực.',
      '',
      'Trách nhiệm vận chuyển:',
      '– MOCA Living chịu trách nhiệm hoàn toàn trong quá trình vận chuyển đến tay khách hàng.',
      '– Nếu hàng hóa bị hư hỏng, trầy xước, biến dạng hoặc ướt do quá trình vận chuyển, khách hàng có quyền từ chối nhận hàng và yêu cầu giao lại hàng mới hoàn toàn miễn phí.',
      '– Trước khi ký nhận, vui lòng kiểm tra kỹ tình trạng sản phẩm, số lượng và phụ kiện đi kèm. Mọi thiếu sót hoặc hư hỏng cần được ghi nhận ngay trên biên bản giao hàng và thông báo đến hotline 0398 945 409.',
      '',
      'Lắp đặt: Miễn phí lắp đặt tại nhà cho nội thành TP. Hồ Chí Minh. Các khu vực khác sẽ có hướng dẫn tự lắp ráp chi tiết kèm video hướng dẫn hoặc nhân viên hỗ trợ qua video call.',
    ],
  },
  {
    icon: '🔄',
    id: 'returns',
    title: '2.4 Chính sách đổi trả',
    lines: [
      'Điều kiện đổi trả:',
      '– Sản phẩm còn nguyên vẹn, không trầy xước, không biến dạng, không có dấu hiệu đã qua sử dụng.',
      '– Còn đầy đủ hộp, tem nhãn, phiếu bảo hành và phụ kiện đi kèm (nếu có).',
      '– Sản phẩm chưa được lắp đặt hoặc tháo lắp bởi bên thứ ba.',
      '',
      'Thời hạn đổi trả: Trong vòng 30 ngày kể từ ngày nhận hàng (tính theo dấu bưu điện hoặc biên bản giao hàng). Áp dụng cả ngày cuối tuần và ngày lễ.',
      '',
      'Chi phí đổi trả:',
      '– Miễn phí đổi trả nếu sản phẩm sai mẫu, sai kích thước, sai màu sắc so với đơn đặt hàng, hoặc có lỗi kỹ thuật từ nhà sản xuất.',
      '– Đối với đổi trả do khách hàng thay đổi nhu cầu (không ưng ý, không hợp phong cách...): khách hàng chịu phí vận chuyển 50.000₫ – 200.000₫ tùy theo khu vực và kích thước sản phẩm.',
      '',
      'Các trường hợp không áp dụng đổi trả:',
      '– Sản phẩm đặt riêng theo yêu cầu (custom order).',
      '– Sản phẩm giảm giá trên 50% so với giá niêm yết.',
      '– Sản phẩm đã qua sử dụng, đã lắp đặt, hoặc tự ý tháo lắp, sửa chữa.',
      '– Sản phẩm hư hỏng do sử dụng không đúng hướng dẫn.',
      '',
      'Hoàn tiền: Sau khi nhận lại sản phẩm và kiểm tra đạt điều kiện, MOCA Living sẽ hoàn tiền trong vòng 5–7 ngày làm việc qua hình thức chuyển khoản ngân hàng hoặc tiền mặt tùy theo phương thức thanh toán ban đầu.',
    ],
  },
  {
    icon: '📞',
    id: 'complaints',
    title: '2.5 Tiếp nhận và giải quyết khiếu nại',
    lines: [
      'MOCA Living luôn sẵn sàng lắng nghe và giải quyết mọi thắc mắc, khiếu nại từ khách hàng qua các kênh sau:',
      '',
      'Số điện thoại hỗ trợ:',
      '– 0398 945 409 (8h00 – 21h00, tất cả các ngày trong tuần)',
      '– 0867 968 963 (8h00 – 17h30, thứ 2 – thứ 7)',
      '',
      'Email: lienhe@noithatmoca.com — Cam kết phản hồi trong vòng 4 giờ làm việc kể từ khi nhận được email.',
      '',
      'Zalo Official Account: Quét mã QR tại trang chủ noithatmoca.com hoặc tìm kiếm "MOCA Living" trên Zalo để nhắn tin trực tiếp.',
      '',
      'Thời gian phản hồi chuẩn:',
      '– Vấn đề thông thường (thắc mắc về sản phẩm, đơn hàng): trong vòng 2 giờ làm việc.',
      '– Vấn đề phức tạp (bảo hành, khiếu nại chất lượng, đổi trả): trong vòng 24 giờ làm việc.',
      '',
      'Quy trình xử lý khiếu nại:',
      'Bước 1 — Tiếp nhận: Ghi nhận thông tin khiếu nại qua điện thoại, email hoặc Zalo.',
      'Bước 2 — Phân loại: Đánh giá mức độ và phân loại vấn đề.',
      'Bước 3 — Xử lý: Điều phối bộ phận liên quan giải quyết.',
      'Bước 4 — Phản hồi: Thông báo kết quả xử lý cho khách hàng.',
      'Bước 5 — Xác nhận hoàn tất: Xác nhận khách hàng đã hài lòng với kết quả.',
    ],
  },
];

export default function ShoppingGuide() {
  usePageTitle('Hướng dẫn mua hàng');
  return (
    <div className="bg-surface min-h-screen">
      <SEO title="Hướng dẫn mua hàng" description="Quy trình đặt hàng, phương thức thanh toán, chính sách giao hàng, đổi trả và giải quyết khiếu nại tại MOCA Living." />
      <div className="max-w-[900px] mx-auto px-4 py-6">
        <nav className="text-xs mb-4 flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
          <Link to="/" className="font-medium no-underline hover:text-primary transition-colors" style={{ color: '#64748b' }}>Trang chủ</Link>
          <span>›</span>
          <span className="font-medium" style={{ color: '#0f172a' }}>Hướng dẫn mua hàng</span>
        </nav>

        <div className="rounded-2xl p-8 lg:p-10 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #1a2a2a, #2d3e3e)' }}>
          <h1 className="text-2xl lg:text-[28px] font-black mb-2">Hướng dẫn mua hàng</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>
            Tất cả thông tin về quy trình đặt hàng, thanh toán, giao hàng, đổi trả và giải quyết khiếu nại tại MOCA Living.
          </p>
        </div>

        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-warm-border, #e8e3dc)' }}>
          {sections.map((section, i) => (
            <details key={section.id} className="group" style={{ borderBottom: i < sections.length - 1 ? '1px solid #e8e3dc' : 'none' }}>
              <summary className="flex items-center gap-2.5 px-6 py-4 cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden hover:bg-[#f9f7f4] transition-colors">
                <span className="text-xl shrink-0">{section.icon}</span>
                <span className="text-[15px] font-bold" style={{ color: '#2d2a24' }}>{section.title}</span>
                <svg className="w-3.5 h-3.5 ml-auto shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: '#c4bfb8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div className="px-6 pb-5 space-y-1">
                {section.lines.map((line, j) => {
                  if (line === '') return <div key={j} className="h-2" />;
                  const isHeading = line.endsWith(':') && !line.startsWith('•') && !line.startsWith('–') && !line.startsWith('Bước');
                  return (
                    <p key={j} className={`text-sm leading-relaxed ${isHeading ? 'font-semibold mt-2' : ''}`} style={{ color: isHeading ? '#2d2a24' : '#475569' }}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
