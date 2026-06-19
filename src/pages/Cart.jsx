import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import usePageTitle from '../hooks/usePageTitle';
import { formatPrice } from '../data/products';
import { ShieldCheckIcon, ArrowPathIcon, PhoneIcon, XMarkIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const trustBadgesDef = [
  { Icon: ShieldCheckIcon, text: 'Thanh toán bảo mật 100%' },
  { Icon: ArrowPathIcon, text: 'Đổi trả miễn phí 30 ngày' },
];

export default function Cart() {
  const { cart, dispatch, totalItems, totalPrice } = useCart();
  const { settings } = useAdmin();
  const navigate = useNavigate();
  usePageTitle('Giỏ hàng');

  if (cart.length === 0) {
    return (
      <div className="bg-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center px-5 py-10">
          <ShoppingCartIcon className="w-20 h-20 mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Giỏ hàng đang trống</h2>
          <p className="text-slate-500 text-sm mb-6">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white no-underline py-3 px-7 rounded-xl font-bold text-sm transition-colors">
            Tiếp tục mua sắm →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
          <Link to="/" className="text-slate-500 no-underline font-medium hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>›</span>
          <span className="text-slate-900 font-medium">Giỏ hàng</span>
        </nav>

        <h1 className="text-xl font-extrabold text-slate-900 mb-5 flex items-center gap-2.5">
          <span className="w-1 h-[22px] bg-blue-600 rounded-sm inline-block" />
          Giỏ Hàng
          <span className="text-sm font-medium text-slate-500">({totalItems} sản phẩm)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* Items */}
          <div className="flex flex-col gap-2.5">
            {cart.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3.5 items-start hover:shadow-md transition-shadow">
                {/* Image */}
                <Link to={`/san-pham/${item.slug}`} className="shrink-0">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/san-pham/${item.slug}`} className="no-underline">
                    <div className="text-sm font-semibold text-slate-900 leading-snug mb-1.5 hover:text-blue-600 transition-colors">
                      {item.name}
                    </div>
                  </Link>
                  <div className="text-blue-600 font-extrabold text-[15px] mb-2.5">
                    {formatPrice(item.price)}
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center border-[1.5px] border-slate-200 rounded-lg w-fit overflow-hidden">
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: Math.max(1, item.qty - 1) })}
                      className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold text-slate-900 border-x border-slate-200">{item.qty}</span>
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                      className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end justify-between min-h-[80px] gap-2">
                  <button
                    onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                    className="w-7 h-7 border-none bg-slate-100 rounded-md cursor-pointer flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-600 transition-all">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <div className="font-extrabold text-slate-900 text-[15px]">
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom row */}
            <div className="flex justify-between items-center pt-1">
              <Link to="/" className="text-blue-600 no-underline text-sm font-semibold flex items-center gap-1 hover:underline">
                ← Tiếp tục mua sắm
              </Link>
              <button
                onClick={() => dispatch({ type: 'CLEAR' })}
                className="border-none bg-transparent text-slate-400 text-[13px] cursor-pointer font-medium hover:text-red-600 transition-colors">
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-[88px]">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3.5 border-b border-slate-200">
              Tóm tắt đơn hàng
            </h3>

            <div className="flex flex-col gap-2.5 mb-3.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tạm tính ({totalItems} sp)</span>
                <span className="text-slate-900 font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-600 font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Giảm giá</span>
                <span>—</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3.5 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[15px] text-slate-900">Tổng cộng</span>
                <span className="font-black text-xl text-blue-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dat-hang')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl py-3.5 text-[15px] font-bold cursor-pointer transition-colors shadow-lg">
              Đặt Hàng Ngay →
            </button>

            {/* Trust badges */}
            <div className="mt-4 flex flex-col gap-2">
              {[...trustBadgesDef, { Icon: PhoneIcon, text: `${settings.phone1 || '0398.945.409'} hỗ trợ 24/7` }].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
