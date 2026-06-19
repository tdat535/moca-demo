import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, PhoneIcon } from '@heroicons/react/24/outline';

const features = [
  { Icon: TruckIcon, t: 'Giao Hàng Nhanh', s: 'Toàn quốc 2–5 ngày' },
  { Icon: ShieldCheckIcon, t: 'Hàng Chính Hãng', s: 'Bảo hành 12–24 tháng' },
  { Icon: CreditCardIcon, t: 'Thanh Toán Linh Hoạt', s: 'Chuyển khoản, COD, trả góp' },
  { Icon: PhoneIcon, t: 'Tư Vấn 24/7', s: '0934.638.622' },
];

const policies = ['Chính sách bảo mật', 'Chính sách đổi trả', 'Chính sách bảo hành', 'Hướng dẫn mua hàng', 'Phương thức thanh toán'];

export default function Footer() {
  const { categories } = useAdmin();
  const parentCats = categories.filter(c => !c.parent_id);

  return (
    <footer>
      {/* Feature bar */}
      <div className="bg-slate-800 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-blue-600/25 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">{t}</div>
                <div className="text-white/45 text-[13px] mt-px">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-900 text-white/55">
        <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8 lg:gap-10">
          {/* Brand */}
          <div>
            <img src="/logoo2.png" alt="Logo" className="h-10 w-auto object-contain mb-3" />
            <p className="text-sm leading-relaxed mb-4">
              Cửa hàng nội thất uy tín – sản phẩm chất lượng cao, thiết kế hiện đại, giao hàng & lắp đặt toàn quốc.
            </p>
            <div className="text-sm flex flex-col gap-1.5">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
                123 Đường Nguyễn Huệ, Q.1, TP.HCM
              </span>
              <span className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-white/40 shrink-0" />
                <a href="tel:0934638622" className="text-blue-400 font-extrabold no-underline hover:text-blue-300 transition-colors">0934.638.622</a>
              </span>
              <span className="text-xs text-white/30 ml-6">T2 – CN: 8h00 – 21h00</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Danh mục</h4>
            <ul className="list-none flex flex-col gap-2.5">
              {parentCats.map(c => (
                <li key={c.id}>
                  <Link to={`/?category=${c.slug}`} className="text-white/50 no-underline text-sm hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Chính sách</h4>
            <ul className="list-none flex flex-col gap-2.5">
              {policies.map(t => (
                <li key={t}>
                  <a href="#" className="text-white/50 no-underline text-sm hover:text-white transition-colors">{t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Nhận ưu đãi</h4>
            <p className="text-sm mb-3 leading-relaxed">Đăng ký để nhận thông tin khuyến mãi mới nhất.</p>
            <div className="flex mb-4">
              <input placeholder="Email của bạn" className="flex-1 bg-white/[.07] border border-white/[.12] text-white px-3 py-2.5 text-sm outline-none rounded-l-lg placeholder:text-white/30 focus:border-blue-500 transition-colors" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white border-none px-4 text-sm font-bold cursor-pointer rounded-r-lg transition-colors">
                Đăng ký
              </button>
            </div>
            <div className="flex gap-2">
              {[
                { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { name: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
              ].map(s => (
                <a key={s.name} href="#" className="bg-white/[.07] text-white/60 px-3 py-1.5 rounded-lg text-xs no-underline border border-white/[.08] hover:bg-blue-600/30 hover:text-white transition-all flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={s.icon} /></svg>
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[.06] py-4 text-center text-[13px] text-white/25">
          © 2026 Moca Living. MST: 0317223735
        </div>
      </div>
    </footer>
  );
}
