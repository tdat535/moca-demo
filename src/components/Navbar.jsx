import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightStartOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { totalItems } = useCart();
  const { wishCount } = useWishlist();
  const { categories, settings } = useAdmin();
  const { user, profile, isAdmin, login, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const megaRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  const parentCats = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
  const getChildren = (parentId) => categories.filter(c => c.parent_id === parentId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const { error } = await login(loginEmail, loginPass);
    setLoginLoading(false);
    if (error) setLoginError('Email hoặc mật khẩu không đúng');
    else { setAccountOpen(false); setLoginEmail(''); setLoginPass(''); }
  };

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main header */}
      <div className="border-b border-slate-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-3 flex items-center flex-wrap gap-3 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src="/logoo2.png" alt="MOCA Living" className="h-10 lg:h-[60px] w-auto object-contain block" />
          </Link>

          {/* Search — desktop inline */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-[560px]">
            <div className="flex w-full border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600 transition-colors">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Bạn đang tìm sản phẩm gì..."
                className="flex-1 border-none bg-transparent px-4 py-2.5 lg:py-3 text-sm lg:text-[15px] outline-none text-gray-900 placeholder:text-slate-400"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-5 flex items-center transition-colors cursor-pointer border-none">
                <MagnifyingGlassIcon className="w-[18px] h-[18px]" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3 lg:gap-5">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Bars3Icon className="w-[22px] h-[22px] text-slate-500" />
              <span className="text-xs text-slate-500 font-semibold hidden lg:block">Menu</span>
            </button>

            {/* Account */}
            <div ref={accountRef} className="relative">
              <button onClick={() => setAccountOpen(o => !o)} className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-extrabold text-blue-600">
                    {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <UserIcon className="w-[22px] h-[22px] text-slate-500" />
                )}
                <span className="text-xs text-slate-500 font-semibold hidden lg:block">
                  {user ? (profile?.full_name?.split(' ').pop() || 'Tài khoản') : 'Đăng nhập'}
                </span>
              </button>

              {accountOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl w-80 shadow-2xl border border-slate-200 z-[300] overflow-hidden">
                  {user ? (
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-base font-extrabold text-blue-600 shrink-0">
                          {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{profile?.full_name || 'Người dùng'}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link to="/tai-khoan" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 no-underline transition-colors">
                          <UserIcon className="w-4 h-4" />
                          Thông tin tài khoản
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 no-underline transition-colors">
                            <Squares2X2Icon className="w-4 h-4" />
                            Quản trị Admin
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 bg-transparent border-none cursor-pointer text-left w-full transition-colors">
                          <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="text-base font-extrabold text-slate-900 mb-1 text-center">ĐĂNG NHẬP TÀI KHOẢN</h3>
                      <p className="text-sm text-slate-400 mb-5 text-center">Nhập email và mật khẩu của bạn</p>

                      {loginError && (
                        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs mb-3">{loginError}</div>
                      )}

                      <form onSubmit={handleLogin} className="flex flex-col gap-2.5">
                        <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="Nhập email"
                          className="w-full border-[1.5px] border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
                        <input type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                          placeholder="Mật khẩu"
                          className="w-full border-[1.5px] border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none text-slate-900 focus:border-blue-600 transition-colors" />
                        <button type="submit" disabled={loginLoading}
                          className="bg-slate-900 hover:bg-slate-800 text-white border-none rounded-lg py-2.5 text-sm font-bold cursor-pointer tracking-wide mt-1 disabled:opacity-70 transition-colors">
                          {loginLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                        </button>
                      </form>

                      <div className="mt-4 text-center text-sm text-slate-400">
                        Khách hàng mới? <Link to="/dang-ky" onClick={() => setAccountOpen(false)} className="text-blue-600 no-underline font-semibold hover:underline">Tạo tài khoản</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/yeu-thich" className="flex flex-col items-center gap-1 no-underline relative p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="relative">
                <HeartIcon className="w-[22px] h-[22px] text-slate-500" />
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white rounded-full text-[10px] font-extrabold w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                    {wishCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-semibold hidden lg:block">Yêu thích</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center gap-1 no-underline relative p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="relative">
                <ShoppingBagIcon className="w-[22px] h-[22px] text-slate-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white rounded-full text-[10px] font-extrabold w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-semibold hidden lg:block">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="sm:hidden border-b border-slate-100 px-4 pb-3">
        <form onSubmit={handleSearch} className="flex">
          <div className="flex w-full border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600 transition-colors">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="flex-1 border-none bg-transparent px-3 py-2 text-sm outline-none text-gray-900 placeholder:text-slate-400"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center transition-colors cursor-pointer border-none">
              <MagnifyingGlassIcon className="w-[16px] h-[16px]" />
            </button>
          </div>
        </form>
      </div>

      {/* Nav row */}
      <div className="bg-white border-b border-slate-100 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center">
          <div ref={megaRef} className="relative">
            <button
              onClick={() => setMegaOpen(o => !o)}
              className={`flex items-center gap-2 border-none cursor-pointer text-[15px] font-bold py-2.5 px-4 rounded-lg my-1.5 transition-all ${
                megaOpen ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Bars3Icon className="w-4 h-4" />
              Danh mục sản phẩm
              <ChevronDownIcon className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && parentCats.length > 0 && (
              <div className="absolute top-full left-0 bg-white rounded-b-xl shadow-2xl w-[640px] z-[200] flex border border-gray-100 border-t-0">
                <div className="w-[200px] border-r border-gray-100 bg-gray-50/80 py-2 rounded-bl-xl">
                  {parentCats.map((cat, i) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategory(i)}
                      onClick={() => { navigate(`/?category=${cat.slug}`); setMegaOpen(false); }}
                      className={`w-full text-left border-none py-2.5 px-4 cursor-pointer flex items-center justify-between text-sm transition-all ${
                        i === activeCategory
                          ? 'bg-white border-l-[3px] border-l-blue-600 font-bold text-blue-600'
                          : 'border-l-[3px] border-l-transparent font-medium text-gray-600 hover:bg-white/60'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {getChildren(cat.id).length > 0 && <ChevronRightIcon className="w-2.5 h-2.5 text-gray-300" />}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-5">
                  {parentCats[activeCategory] && (
                    <>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-3.5 font-bold">
                        {parentCats[activeCategory].name}
                      </div>
                      {getChildren(parentCats[activeCategory].id).length > 0 ? (
                        <div className="grid grid-cols-2 gap-0.5">
                          {getChildren(parentCats[activeCategory].id).map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => { navigate(`/?category=${sub.slug}`); setMegaOpen(false); }}
                              className="bg-transparent border-none text-left py-2 px-2.5 cursor-pointer rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                            >
                              <ChevronRightIcon className="w-2 h-2 text-gray-300" />
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Chưa có danh mục con</p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => { navigate(`/?category=${parentCats[activeCategory].slug}`); setMegaOpen(false); }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-4 rounded-lg text-[13px] font-bold cursor-pointer transition-colors"
                        >
                          Xem tất cả {parentCats[activeCategory].name} →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/?sale=true" className="no-underline text-slate-600 text-[15px] font-semibold py-3 px-4 hover:text-blue-600 transition-colors whitespace-nowrap">Khuyến mãi</Link>
          <Link to="/tin-tuc" className="no-underline text-slate-600 text-[15px] font-semibold py-3 px-4 hover:text-blue-600 transition-colors whitespace-nowrap">Tin tức</Link>
          <Link to="/ve-cua-hang" className="no-underline text-slate-600 text-[15px] font-semibold py-3 px-4 hover:text-blue-600 transition-colors whitespace-nowrap">Về cửa hàng</Link>
        </div>
      </div>
      {/* Mobile slide menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[500] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-[slideIn_.2s_ease]">
            <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src="/logoo2.png" alt="MOCA Living" className="h-9 w-auto object-contain" />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 border-none cursor-pointer flex items-center justify-center">
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
              {/* Categories */}
              <div className="px-4 mb-1">
                <button
                  onClick={() => setMobileCatOpen(o => !o)}
                  className="w-full flex items-center justify-between py-3 px-2 text-[15px] font-bold text-slate-900 bg-transparent border-none cursor-pointer"
                >
                  Danh mục sản phẩm
                  <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCatOpen && (
                  <div className="pb-2">
                    {parentCats.map(cat => (
                      <div key={cat.id}>
                        <Link
                          to={`/?category=${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2.5 px-3 text-sm font-semibold text-slate-700 no-underline hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {getChildren(cat.id).map(sub => (
                          <Link
                            key={sub.id}
                            to={`/?category=${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 pl-7 pr-3 text-sm text-slate-500 no-underline hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100 mx-4 my-1" />

              {/* Links */}
              <div className="px-4">
                <Link to="/?sale=true" onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-2 text-[15px] font-semibold text-slate-700 no-underline hover:text-blue-600 transition-colors">
                  Khuyến mãi
                </Link>
                <Link to="/tin-tuc" onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-2 text-[15px] font-semibold text-slate-700 no-underline hover:text-blue-600 transition-colors">
                  Tin tức
                </Link>
                <Link to="/ve-cua-hang" onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-2 text-[15px] font-semibold text-slate-700 no-underline hover:text-blue-600 transition-colors">
                  Về cửa hàng
                </Link>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-slate-100 px-5 py-4">
              <a href={`tel:${(settings.phone1 || '0398945409').replace(/\D/g,'')}`} className="flex items-center gap-2 text-sm text-blue-600 font-bold no-underline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                Hotline: {settings.phone1 || '0398.945.409'}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
