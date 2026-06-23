import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getDiscountPercent } from '../data/products';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const wished = isWished(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD', product });
  };

  const discount = product.originalPrice > product.price
    ? getDiscountPercent(product.price, product.originalPrice) : 0;

  return (
    <Link
      to={`/san-pham/${product.slug}`}
      className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden no-underline"
    >
      {/* Image */}
      <div className="relative bg-surface-alt aspect-square overflow-hidden">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${product.images?.length > 1 ? 'group-hover:opacity-0' : ''}`}
          loading="lazy"
        />
        {product.images?.length > 1 && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">MỚI</span>
          )}
          {discount > 0 && (
            <span className="bg-accent text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">-{discount}%</span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all ${
            wished ? 'bg-red-50' : 'bg-white/80 opacity-0 group-hover:opacity-100'
          }`}
        >
          {wished
            ? <HeartSolidIcon className="w-4.5 h-4.5 text-red-500" />
            : <HeartIcon className="w-4.5 h-4.5 text-warm-muted" />
          }
        </button>
        <button
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-accent text-white border-none py-3 text-[13px] font-bold cursor-pointer translate-y-full group-hover:translate-y-0 transition-transform duration-250 tracking-wide flex items-center justify-center gap-1.5 hover:bg-accent-dark"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          THÊM VÀO GIỎ
        </button>
      </div>

      {/* Info */}
      <div className="p-3 lg:p-4 flex-1 flex flex-col">
        <div className="text-sm lg:text-[15px] text-warm-text leading-snug mb-2.5 flex-1 font-medium line-clamp-2">
          {product.name}
        </div>

        <div className="mb-2">
          <div className="text-primary font-extrabold text-base lg:text-lg tracking-tight">
            {formatPrice(product.price)}
          </div>
          {discount > 0 && (
            <div className="text-warm-muted text-[13px] line-through mt-0.5">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-warm-muted border-t border-warm-border/60 pt-2">
          <span className="text-amber-500 tracking-tighter">{'★'.repeat(Math.round(product.rating))}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto font-medium">Đã bán {product.sold?.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
