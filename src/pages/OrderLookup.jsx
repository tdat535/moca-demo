import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { formatPrice } from '../data/products';
import { supabase } from '../lib/supabase';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', cls: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', cls: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
};

export default function OrderLookup() {
  usePageTitle('Tra cứu đơn hàng');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const p = phone.trim();
    if (!p) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', p)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-[640px] mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
          <h1 className="text-xl font-extrabold text-slate-900 mb-1">Tra cứu đơn hàng</h1>
          <p className="text-sm text-slate-400 mb-5">Nhập số điện thoại đã dùng khi đặt hàng để tra cứu.</p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="flex-1 border-[1.5px] border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer flex items-center gap-2 disabled:opacity-60 transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {loading ? 'Đang tra...' : 'Tra cứu'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400 mt-3">Đang tra cứu...</p>
          </div>
        )}

        {!loading && searched && orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">Không tìm thấy đơn hàng nào</p>
            <p className="text-xs text-slate-400 mt-1">Vui lòng kiểm tra lại số điện thoại hoặc liên hệ hotline để được hỗ trợ.</p>
          </div>
        )}

        {!loading && orders?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900">
                Tìm thấy {orders.length} đơn hàng
              </span>
            </div>

            {orders.map((o, i) => {
              const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
              const isExpanded = expandedOrder === o.id;
              const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
              return (
                <div key={o.id} className={i < orders.length - 1 ? 'border-b border-slate-200' : ''}>
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                    className="w-full text-left bg-transparent border-none cursor-pointer px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-blue-600">#{o.id}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(o.created_at).toLocaleDateString('vi-VN')} • {items.length} sản phẩm • {o.customer_name}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900">{formatPrice(o.total_price || o.total || 0)}</div>
                      <div className="text-[11px] text-slate-400">{o.payment_method === 'bank' ? 'Chuyển khoản' : 'COD'}</div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        {items.map((item, j) => (
                          <div key={j} className={`flex items-center gap-3 py-2 ${j < items.length - 1 ? 'border-b border-slate-200' : ''}`}>
                            {item.image && (
                              <img src={item.image} alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-200 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-slate-900 font-medium truncate">{item.name}</div>
                              <div className="text-xs text-slate-400">x{item.qty}</div>
                            </div>
                            <div className="text-[13px] font-bold text-blue-600 shrink-0">{formatPrice(item.price * item.qty)}</div>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1 text-xs text-slate-400">
                          <span>Giao đến: {o.customer_address || '—'}</span>
                          <span>Hình thức: {o.payment_method === 'bank' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng (COD)'}</span>
                          {o.note && <span>Ghi chú: {o.note}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
