import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    setLoading(true);
    const { error } = await register(form.email, form.password, form.fullName, form.phone);
    setLoading(false);
    if (error) setError(error.message);
    else navigate('/');
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-7 text-center">
          <Link to="/"><img src="/logoo2.png" alt="Logo" className="h-12 brightness-[10] mb-3" /></Link>
          <h1 className="text-xl font-extrabold text-white m-0">TẠO TÀI KHOẢN MỚI</h1>
          <p className="text-[13px] text-white/50 mt-1">Đăng ký để mua sắm dễ dàng hơn</p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-xl text-[13px] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Họ và tên *</label>
                <input required value={form.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A"
                  className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Số điện thoại</label>
                <input value={form.phone} onChange={set('phone')} placeholder="0901234567"
                  className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="email@example.com"
                className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mật khẩu *</label>
                <input type="password" required value={form.password} onChange={set('password')} placeholder="Ít nhất 6 ký tự"
                  className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Xác nhận *</label>
                <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder="Nhập lại mật khẩu"
                  className="w-full border-[1.5px] border-slate-200 rounded-xl px-3.5 py-3 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white border-none rounded-xl py-3.5 text-sm font-bold cursor-pointer mt-1.5 tracking-wide disabled:opacity-70 transition-colors">
              {loading ? 'ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ'}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400 mt-5">
            Đã có tài khoản? <Link to="/" className="text-blue-600 no-underline font-semibold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
