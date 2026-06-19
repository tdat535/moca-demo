import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const CartContext = createContext(null);

const GUEST_KEY = 'moca_cart_guest';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );
    case 'CLEAR':
      return [];
    case 'LOAD':
      return action.cart;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, []);
  const ready = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    ready.current = false;

    if (user) {
      supabase.from('carts').select('items').eq('user_id', user.id).maybeSingle()
        .then(({ data }) => {
          dispatch({ type: 'LOAD', cart: data?.items || [] });
          ready.current = true;
        });
    } else {
      try {
        dispatch({ type: 'LOAD', cart: JSON.parse(localStorage.getItem(GUEST_KEY)) || [] });
      } catch { dispatch({ type: 'LOAD', cart: [] }); }
      ready.current = true;
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (authLoading || !ready.current) return;

    if (user) {
      supabase.from('carts')
        .upsert({ user_id: user.id, items: cart }, { onConflict: 'user_id' })
        .then();
    } else {
      localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
    }
  }, [cart, user?.id, authLoading]);

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
