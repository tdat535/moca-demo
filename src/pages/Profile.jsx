import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../data/products';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const ORDER_STATUS = {
  pending: { label: 'Chờ xác nhận', cls: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', cls: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
};

export default function Profile() {
  const { user, profile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Tài khoản');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Orders
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setMyOrders(data || []); setOrdersLoading(false); });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (error) { console.error('Update profile error:', error); showToast('Lỗi: ' + (error.message || JSON.stringify(error)), 'error'); }
    else { setEditing(false); setToast('Cập nhật thành công!'); setTimeout(() => setToast(''), 2500); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl text-[13px] font-medium shadow-xl flex items-center gap-2">
          <CheckIcon className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}

      <div className="max-w-[640px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-4 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[26px] font-extrabold text-blue-600 shrink-0">
            {(profile?.full_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-slate-900 m-0">{profile?.full_name || 'Người dùng'}</h1>
            <p className="text-[13px] text-slate-400 mt-1">{user?.email}</p>
            {profile?.role === 'admin' && (
              <span className="inline-block mt-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full">Admin</span>
            )}
          </div>
          <button onClick={handleLogout}
            className="border-[1.5px] border-red-200 bg-transparent text-red-600 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-red-50 transition-colors">
            Đăng xuất
          </button>
        </div>

        {/* Info */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-4">
          <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-blue-600 rounded-sm inline-block" />
              Thông tin cá nhân
            </div>
            {!editing ? (
              <button onClick={() => { setForm({ full_name: profile?.full_name || '', phone: profile?.phone || '', address: profile?.address || '' }); setEditing(true); }}
                className="border border-slate-200 bg-transparent text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-50 hover:border-blue-600 transition-all">
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-70 transition-colors">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button onClick={() => setEditing(false)}
                  className="border border-slate-200 bg-transparent text-slate-500 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Họ và tên</label>
              <input value={editing ? form.full_name : (profile?.full_name || '')} readOnly={!editing}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className={`w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-900 transition-colors ${
                  editing ? 'bg-white focus:border-blue-600' : 'bg-slate-100'
                }`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
              <input value={user?.email || ''} readOnly className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-400 bg-slate-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Số điện thoại</label>
              <input value={editing ? form.phone : (profile?.phone || '')} readOnly={!editing}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder={editing ? 'Nhập số điện thoại' : 'Chưa cập nhật'}
                className={`w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-900 transition-colors ${
                  editing ? 'bg-white focus:border-blue-600' : 'bg-slate-100'
                }`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Địa chỉ</label>
              <input value={editing ? form.address : (profile?.address || '')} readOnly={!editing}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder={editing ? 'Nhập địa chỉ giao hàng' : 'Chưa cập nhật'}
                className={`w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-900 transition-colors ${
                  editing ? 'bg-white focus:border-blue-600' : 'bg-slate-100'
                }`} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <span className="w-0.5 h-4 bg-blue-600 rounded-sm inline-block" />
            <span className="font-bold text-sm text-slate-900">Đơn hàng của tôi</span>
            <span className="text-xs text-slate-400 font-medium ml-1">({myOrders.length})</span>
          </div>

          {ordersLoading ? (
            <div className="py-10 text-center text-slate-400 text-sm">Đang tải...</div>
          ) : myOrders.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
              <p className="text-sm">Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div>
              {myOrders.map((o, i) => {
                const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
                const isExpanded = expandedOrder === o.id;
                const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
                return (
                  <div key={o.id} className={i < myOrders.length - 1 ? 'border-b border-slate-200' : ''}>
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
                          {new Date(o.created_at).toLocaleDateString('vi-VN')} • {items.length} sản phẩm
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
                          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-400">
                            <span>Giao đến: {o.customer_address || o.address || '—'}</span>
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
    </div>
  );
}
