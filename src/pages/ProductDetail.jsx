import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import { formatPrice, getDiscountPercent } from '../data/products';
import ProductCard from '../components/ProductCard';
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon, CreditCardIcon, MinusIcon, PlusIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const policyItems = [
  { Icon: TruckIcon, text: 'Giao hàng miễn phí' },
  { Icon: ArrowPathIcon, text: 'Đổi trả 30 ngày' },
  { Icon: ShieldCheckIcon, text: 'Bảo hành 12 tháng' },
  { Icon: CreditCardIcon, text: 'Thanh toán linh hoạt' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { productList, categories, reviews: allReviews, addReview } = useAdmin();
  const { dispatch } = useCart();
  const { user, profile } = useAuth();
  const { toggleWishlist, isWished } = useWishlist();
  const { recentSlugs, addViewed } = useRecentlyViewed();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, name: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const product = productList.find(p => p.slug === slug);

  useEffect(() => { if (product) addViewed(product.slug); }, [product?.slug]);

  if (!product) return (
    <div className="text-center py-24 px-5 bg-slate-100 min-h-screen">
      <div className="text-6xl mb-4 opacity-40">
        <svg className="w-14 h-14 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/></svg>
      </div>
      <p className="text-slate-500 text-base mb-5">Không tìm thấy sản phẩm</p>
      <Link to="/" className="text-blue-600 no-underline font-semibold hover:underline">← Về trang chủ</Link>
    </div>
  );

  const cat = categories.find(c => c.id === product.categoryId);
  const related = productList.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const images = product.images?.length ? product.images : [];
  const discount = product.originalPrice > product.price ? getDiscountPercent(product.price, product.originalPrice) : 0;
  const productReviews = allReviews?.filter(r => r.product_id === product.id) || [];
  const avgRating = productReviews.length ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1) : product.rating;

  const doAdd = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD', product });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">

        {/* Breadcrumb */}
        <nav className="text-[13px] text-slate-400 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="text-slate-500 no-underline font-medium hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>›</span>
          {cat && <>
            <Link to={`/?category=${cat.slug}`} className="text-slate-500 no-underline font-medium hover:text-blue-600 transition-colors">{cat.name}</Link>
            <span>›</span>
          </>}
          <span className="text-slate-900">{product.name}</span>
        </nav>

        {/* Main card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-7 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Images */}
            <div>
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-2.5 bg-slate-50 aspect-square flex items-center justify-center">
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-3" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 p-1 rounded-lg overflow-hidden cursor-pointer bg-slate-50 transition-all border-2 ${
                      i === activeImg ? 'border-blue-600' : 'border-slate-200 hover:border-slate-400'
                    }`}>
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex gap-1.5 mb-3.5 flex-wrap">
                {product.isNew && <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full">MỚI</span>}
                {discount > 0 && <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">GIẢM {discount}%</span>}
                <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Còn hàng
                </span>
              </div>

              <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-3.5 leading-snug">{product.name}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-2.5 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                <span className="text-amber-500 tracking-tighter text-base">{'★'.repeat(Math.round(Number(avgRating)))}</span>
                <span className="font-bold text-slate-900">{avgRating}</span>
                <span className="text-slate-200">|</span>
                <span>{product.reviews} đánh giá</span>
                <span className="text-slate-200">|</span>
                <span>Đã bán <strong className="text-slate-900">{product.sold?.toLocaleString()}</strong></span>
              </div>

              {/* Price box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-4">
                <div className="text-blue-600 font-black text-3xl lg:text-[34px] leading-none">{formatPrice(product.price)}</div>
                {discount > 0 && (
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="text-slate-400 line-through text-[15px]">{formatPrice(product.originalPrice)}</span>
                    <span className="bg-blue-200 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-md">
                      Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>

              {product.description && (
                <p className="text-slate-500 text-[15px] leading-relaxed mb-5">{product.description}</p>
              )}

              {/* Qty */}
              <div className="flex items-center gap-3.5 mb-5">
                <span className="text-sm text-slate-500 font-semibold">Số lượng:</span>
                <div className="inline-flex border-[1.5px] border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-11 flex items-center justify-center font-bold text-sm text-slate-900 border-x border-slate-200">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mb-5">
                <button onClick={doAdd} className={`flex-1 border-2 font-bold text-[15px] py-3.5 rounded-xl cursor-pointer transition-all ${
                  added ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-50'
                }`}>
                  {added ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                </button>
                <button onClick={() => { doAdd(); navigate('/cart'); }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold text-[15px] py-3.5 rounded-xl cursor-pointer transition-colors shadow-lg">
                  Mua ngay →
                </button>
                <button onClick={() => toggleWishlist(product.id)}
                  className={`w-[52px] shrink-0 border-2 rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                    isWished(product.id) ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-red-300 hover:bg-red-50'
                  }`}>
                  {isWished(product.id)
                    ? <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    : <HeartIcon className="w-5 h-5 text-slate-400" />
                  }
                </button>
              </div>

              {/* Policy grid */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 grid grid-cols-2 gap-2">
                {policyItems.map(({ Icon, text }) => (
                  <div key={text} className="text-[13px] text-slate-500 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content blocks */}
        {product.content?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-200 font-bold text-[15px] text-slate-900 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-blue-600 rounded-sm inline-block" />
              Mô tả chi tiết
            </div>
            <div className="p-6">
              {product.content.map((block, i) => {
                if (block.type === 'heading') return (
                  <h3 key={i} className={`text-xl font-extrabold text-slate-900 leading-snug ${i === 0 ? 'mb-3' : 'mt-7 mb-3'}`}>{block.value}</h3>
                );
                if (block.type === 'text') return (
                  <p key={i} className="text-base text-slate-500 leading-relaxed mb-4 whitespace-pre-line">{block.value}</p>
                );
                if (block.type === 'image') return (
                  <div key={i} className="my-4 rounded-xl overflow-hidden">
                    <img src={block.url} alt="" className="w-full block rounded-xl" />
                  </div>
                );
                return null;
              })}
            </div>
          </div>
        )}

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-200 font-bold text-[15px] text-slate-900 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-blue-600 rounded-sm inline-block" />
              Thông tin sản phẩm
            </div>
            {Object.entries(product.specs).map(([k, v], i) => (
              <div key={k} className={`flex px-6 py-2.5 border-b border-slate-100 text-sm ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                <span className="w-[200px] text-slate-500 shrink-0">{k}</span>
                <span className="text-slate-900 font-semibold">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white border border-slate-200 rounded-2xl mb-6 overflow-hidden">
          <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-blue-600 rounded-sm inline-block" />
              Đánh giá từ khách hàng
            </div>
            {productReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-black text-slate-900">{avgRating}</span>
                <div>
                  <div className="text-amber-500 tracking-tighter">{'★'.repeat(Math.round(Number(avgRating)))}</div>
                  <div className="text-xs text-slate-400">{productReviews.length} đánh giá</div>
                </div>
              </div>
            )}
          </div>

          {/* Review form */}
          <div className="px-6 py-5 border-b border-slate-200" style={{ background: '#fafbfc' }}>
            {reviewSuccess ? (
              <div className="text-center py-4">
                <div className="text-emerald-600 font-bold text-sm mb-1">Cảm ơn bạn đã đánh giá!</div>
                <p className="text-slate-400 text-xs">Đánh giá của bạn đã được ghi nhận.</p>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (reviewForm.rating === 0) return;
                setReviewSubmitting(true);
                const name = reviewForm.name.trim() || profile?.full_name || 'Khách hàng';
                await addReview({ product_id: product.id, customer_name: name, rating: reviewForm.rating, comment: reviewForm.comment.trim() });
                setReviewSubmitting(false);
                setReviewSuccess(true);
                setReviewForm({ rating: 0, name: '', comment: '' });
                setTimeout(() => setReviewSuccess(false), 4000);
              }}>
                <div className="text-sm font-bold text-slate-900 mb-3">Viết đánh giá của bạn</div>

                {/* Star picker */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                      className="bg-transparent border-none cursor-pointer p-0.5">
                      {star <= reviewForm.rating
                        ? <StarSolidIcon className="w-7 h-7 text-amber-400" />
                        : <StarIcon className="w-7 h-7 text-slate-300 hover:text-amber-300 transition-colors" />
                      }
                    </button>
                  ))}
                  {reviewForm.rating > 0 && (
                    <span className="text-sm text-slate-500 ml-2">
                      {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'][reviewForm.rating]}
                    </span>
                  )}
                </div>

                {/* Name (if not logged in) */}
                {!user && (
                  <input
                    value={reviewForm.name}
                    onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Tên của bạn"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-900 mb-2 focus:border-blue-600 transition-colors"
                  />
                )}

                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-900 resize-none mb-3 focus:border-blue-600 transition-colors"
                />

                <button type="submit" disabled={reviewForm.rating === 0 || reviewSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg px-5 py-2 text-sm font-bold cursor-pointer disabled:opacity-50 transition-colors">
                  {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            )}
          </div>

          {/* Review list */}
          {productReviews.length === 0 ? (
            <div className="py-9 px-6 text-center text-slate-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-amber-300 opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <p className="text-sm">Chưa có đánh giá nào — hãy là người đầu tiên!</p>
            </div>
          ) : (
            <div>
              {productReviews.map((r, i) => (
                <div key={r.id} className={`px-6 py-4 ${i < productReviews.length - 1 ? 'border-b border-slate-200' : ''}`}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-sm font-extrabold text-blue-600 shrink-0">
                        {r.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{r.customer_name}</div>
                        <div className="text-amber-500 text-sm tracking-tighter mt-px">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {r.comment && <p className="text-[15px] text-slate-500 leading-relaxed mt-2 ml-[46px]">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-sm inline-block" />
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {(() => {
          const recentProducts = recentSlugs
            .filter(s => s !== slug)
            .map(s => productList.find(p => p.slug === s))
            .filter(Boolean)
            .slice(0, 4);
          if (recentProducts.length === 0) return null;
          return (
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-sm inline-block" />
                Sản phẩm đã xem gần đây
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
