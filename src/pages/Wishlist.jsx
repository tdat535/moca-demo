import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { productList } = useAdmin();

  const wishedProducts = productList.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
          <Link to="/" className="text-slate-500 no-underline font-medium hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>›</span>
          <span className="text-slate-900 font-medium">Yêu thích</span>
        </nav>

        <h1 className="text-xl font-extrabold text-slate-900 mb-5 flex items-center gap-2.5">
          <span className="w-1 h-[22px] bg-blue-600 rounded-sm inline-block" />
          Sản Phẩm Yêu Thích
          <span className="text-sm font-medium text-slate-500">({wishedProducts.length})</span>
        </h1>

        {wishedProducts.length === 0 ? (
          <div className="bg-white py-20 px-5 text-center border border-gray-200 rounded-2xl">
            <HeartIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-lg font-bold text-slate-900 mb-2">Chưa có sản phẩm yêu thích</h2>
            <p className="text-slate-400 text-sm mb-6">Bấm vào biểu tượng trái tim trên sản phẩm để thêm vào danh sách yêu thích.</p>
            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white no-underline py-3 px-7 rounded-xl font-bold text-sm transition-colors">
              Khám phá sản phẩm →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-3.5">
            {wishedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
