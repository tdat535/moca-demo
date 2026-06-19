import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const WishlistContext = createContext(null);

const GUEST_KEY = 'moca_wishlist_guest';

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const ready = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    ready.current = false;

    if (user) {
      supabase.from('wishlists').select('product_id').eq('user_id', user.id)
        .then(({ data }) => {
          setWishlist((data || []).map(w => w.product_id));
          ready.current = true;
        });
    } else {
      try { setWishlist(JSON.parse(localStorage.getItem(GUEST_KEY)) || []); }
      catch { setWishlist([]); }
      ready.current = true;
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (authLoading || !ready.current || user) return;
    localStorage.setItem(GUEST_KEY, JSON.stringify(wishlist));
  }, [wishlist, user?.id, authLoading]);

  const toggleWishlist = async (productId) => {
    const exists = wishlist.includes(productId);

    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      if (user) {
        await supabase.from('wishlists').delete()
          .eq('user_id', user.id).eq('product_id', productId);
      }
    } else {
      setWishlist(prev => [...prev, productId]);
      if (user) {
        await supabase.from('wishlists')
          .insert([{ user_id: user.id, product_id: productId }]);
      }
    }
  };

  const isWished = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWished, wishCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
