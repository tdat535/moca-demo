import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import usePageTitle from '../hooks/usePageTitle';
import { categories as staticCats, formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 12;

const featureItems = [
  { Icon: TruckIcon, t: 'Giao hàng miễn phí', s: 'Toàn quốc từ 500K' },
  { Icon: ShieldCheckIcon, t: 'Bảo hành chính hãng', s: '12 – 24 tháng' },
  { Icon: CreditCardIcon, t: 'Thanh toán linh hoạt', s: 'Chuyển khoản, COD, trả góp' },
  { Icon: ArrowPathIcon, t: 'Đổi trả 30 ngày', s: 'Không cần lý do' },
];

function Banner() {
  const { banners } = useAdmin();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const images = banners.length ? banners.map(b => b.image_url) : [
    'https://placehold.co/1400x450/e2e8f0/94a3b8?text=Banner+1',
    'https://placehold.co/1400x450/e2e8f0/94a3b8?text=Banner+2',
    'https://placehold.co/1400x450/e2e8f0/94a3b8?text=Banner+3',
  ];

  const startTimer = () => {
    clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => setIdx(p => (p + 1) % images.length), 4500);
    }
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const go = (i) => { setIdx(i); startTimer(); };
  const prev = () => go((idx - 1 + images.length) % images.length);
  const next = () => go((idx + 1) % images.length);

  return (
    <div className="relative overflow-hidden">
      <img
        src={images[idx]}
        alt={`Banner ${idx + 1}`}
        className="w-full h-auto aspect-[1400/450] object-cover block"
      />

      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 border-none cursor-pointer flex items-center justify-center shadow-md hover:bg-white transition-colors">
            <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
          </button>
          <button onClick={next} className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 border-none cursor-pointer flex items-center justify-center shadow-md hover:bg-white transition-colors">
            <ChevronRightIcon className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
            i === idx ? 'w-7 bg-blue-600' : 'w-2 bg-white/60 hover:bg-white/80'
          }`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories: dbCats, loading: adminLoading } = useAdmin();
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');

  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const saleFilter = searchParams.get('sale');
  const categories = dbCats?.length ? dbCats : staticCats;
  const activeCat = categories.find(c => c.slug === selectedCategory);
  usePageTitle(searchQuery ? `Tìm: ${searchQuery}` : saleFilter ? 'Khuyến mãi' : activeCat ? activeCat.name : null);

  // Local search with debounce
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalSearch(searchQuery);
    setDebouncedSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedSearch(localSearch);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  // Server-side fetch with pagination
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (pageNum, append = false) => {
    const from = (pageNum - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (debouncedSearch) {
      query = query.ilike('name', `%${debouncedSearch}%`);
    }
    if (activeCat) {
      query = query.eq('category_id', activeCat.id);
    }
    if (saleFilter) {
      query = query.eq('is_sale', true);
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.includes('+')
        ? [parseInt(priceRange) * 1e6, 999999999]
        : priceRange.split('-').map(n => parseInt(n) * 1e6);
      query = query.gte('price', min);
      if (max !== 999999999) query = query.lte('price', max);
    }

    if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
    else if (sortBy === 'sold') query = query.order('sold', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (!error && data) {
      const normalized = data.map(p => ({
        ...p,
        categoryId: p.category_id,
        originalPrice: p.original_price,
        isNew: p.is_new,
        isSale: p.is_sale,
      }));
      if (append) {
        setProducts(prev => [...prev, ...normalized]);
      } else {
        setProducts(normalized);
      }
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchProducts(1).finally(() => setLoading(false));
  }, [debouncedSearch, activeCat?.id, saleFilter, priceRange, sortBy]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    setPage(nextPage);
    await fetchProducts(nextPage, true);
    setLoadingMore(false);
  };

  // Client-side sort for rating
  const filtered = useMemo(() => {
    if (sortBy === 'rating') {
      return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return products;
  }, [products, sortBy]);

  const isFiltered = !!(selectedCategory || debouncedSearch || saleFilter);
  const hasMore = products.length < totalCount;

  if (adminLoading) return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-3.5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen">
      {!isFiltered && <Banner />}

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Feature strip */}
          {!isFiltered && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
              {featureItems.map(({ Icon, t, s }) => (
                <div key={t} className="bg-white px-4 py-3.5 flex items-center gap-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-warm-text">{t}</div>
                    <div className="text-xs text-warm-muted mt-px">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Categories */}
        {!isFiltered && (
          <section className="mb-7">
            <SectionTitle>Danh Mục Sản Phẩm</SectionTitle>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {categories.map(cat => (
                <Link key={cat.id} to={`/?category=${cat.slug}`}
                  className="bg-white border-[1.5px] border-warm-border rounded-xl py-5 px-2 flex flex-col items-center gap-2 no-underline hover:border-primary hover:shadow-[0_4px_16px_rgba(30,45,45,0.12)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-sm text-gray-700 font-semibold text-center">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Product grid */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <SectionTitle>
              {debouncedSearch ? `Kết quả: "${debouncedSearch}"` : saleFilter ? 'Sản Phẩm Khuyến Mãi' : activeCat ? activeCat.name : 'Tất Cả Sản Phẩm'}
              <span className="font-medium text-sm text-slate-400 ml-2">({totalCount} sản phẩm)</span>
            </SectionTitle>
            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
              <div className="relative">
                <input
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="border-[1.5px] border-warm-border py-1.5 pl-8 pr-3 text-sm rounded-lg outline-none bg-white text-gray-700 font-medium focus:border-primary transition-colors w-[180px]"
                />
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                {isSearching && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                Giá:
                <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
                  className="border-[1.5px] border-warm-border py-1.5 px-3 text-sm rounded-lg outline-none bg-white cursor-pointer text-gray-700 font-medium focus:border-primary transition-colors">
                  <option value="all">Tất cả</option>
                  <option value="0-5">Dưới 5 triệu</option>
                  <option value="5-15">5 – 15 triệu</option>
                  <option value="15-30">15 – 30 triệu</option>
                  <option value="30+">Trên 30 triệu</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                Sắp xếp:
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="border-[1.5px] border-warm-border py-1.5 px-3 text-sm rounded-lg outline-none bg-white cursor-pointer text-gray-700 font-medium focus:border-primary transition-colors">
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="sold">Bán chạy nhất</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-3.5">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white py-16 px-5 text-center border border-warm-border rounded-2xl">
              <div className="text-5xl mb-3 opacity-40">
                <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <p className="text-slate-400 text-[15px]">Không tìm thấy sản phẩm phù hợp</p>
              <Link to="/" className="text-blue-600 no-underline mt-3 inline-block font-semibold hover:underline">← Về trang chủ</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-3.5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={loadMore} disabled={loadingMore}
                    className="bg-white border-2 border-accent text-accent hover:bg-accent-light font-bold px-8 py-3 rounded-xl cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingMore ? 'Đang tải...' : `Xem thêm (${totalCount - products.length} sản phẩm)`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Flash sale banner */}
        {!isFiltered && (
          <div className="mt-8 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600 p-7 lg:px-9 flex items-center justify-between rounded-2xl flex-wrap gap-4 shadow-xl">
            <div className="text-white">
              <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Ưu đãi hôm nay</div>
              <div className="text-xl lg:text-[28px] font-black flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Flash Sale – Giảm thêm 10%
              </div>
              <div className="opacity-80 text-[15px] mt-1">Khi mua từ 2 sản phẩm trở lên • Áp dụng đến hết ngày</div>
            </div>
            <Link to="/" className="bg-white text-accent font-extrabold py-3.5 px-8 no-underline text-[15px] rounded-xl whitespace-nowrap hover:bg-accent-light transition-colors shadow-md">
              Mua ngay →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-extrabold text-warm-text mb-3.5 flex items-center gap-2.5">
      <span className="w-1 h-5 bg-primary rounded-sm shrink-0 inline-block" />
      {children}
    </h2>
  );
}
