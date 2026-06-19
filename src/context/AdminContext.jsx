import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext(null);

const DEFAULT_SETTINGS = {
  store_name: 'MOCA Living',
  phone1: '', phone2: '', address: '', working_hours: 'T2 – CN: 8h00 – 21h00',
  zalo_phone: '', facebook_url: '', tiktok_url: '',
  bank_id: '', bank_account_no: '', bank_account_name: '',
};

export function AdminProvider({ children }) {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [adminLoaded, setAdminLoaded] = useState(false);

  useEffect(() => { fetchPublic(); }, []);

  const fetchPublic = async () => {
    setLoading(true);
    const [
      { data: prods },
      { data: cats },
      { data: bannerData },
      { data: reviewData },
      { data: settingsData },
    ] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('id'),
      supabase.from('banners').select('*').order('sort_order'),
      supabase.from('reviews').select('*, products(name, images)').order('created_at', { ascending: false }),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    setProductList(prods || []);
    setCategories(cats || []);
    setBanners(bannerData || []);
    setReviews(reviewData || []);
    if (settingsData) setSettings(settingsData);
    setLoading(false);
  };

  const fetchAdminData = useCallback(async () => {
    if (adminLoaded) return;
    const [
      { data: couponData },
      { data: orderData },
    ] = await Promise.all([
      supabase.from('coupons').select('*').order('id'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    setCoupons(couponData || []);
    setOrders(orderData || []);
    setAdminLoaded(true);
  }, [adminLoaded]);

  // ── Settings ──
  const updateSettings = async (data) => {
    const { error } = await supabase.from('settings').update(data).eq('id', 1);
    if (!error) setSettings(prev => ({ ...prev, ...data }));
    return { error };
  };

  // ── Products ──
  const addProduct = async (data) => {
    const { data: inserted, error } = await supabase
      .from('products')
      .insert([{
        name: data.name, slug: data.slug, category_id: data.categoryId,
        price: data.price, original_price: data.originalPrice,
        images: data.images || [],
        stock: 0, rating: 0, reviews: 0, sold: 0,
        is_new: data.isNew || false, is_sale: data.isSale || false,
        description: data.description || '', content: data.content || [], specs: data.specs || {},
      }])
      .select().single();
    if (!error && inserted) setProductList(prev => [inserted, ...prev]);
    return { error };
  };

  const updateProduct = async (id, data) => {
    const { error } = await supabase.from('products').update({
      name: data.name, slug: data.slug, category_id: data.categoryId,
      price: data.price, original_price: data.originalPrice,
      images: data.images || [], rating: data.rating,
      is_new: data.isNew || false, is_sale: data.isSale || false,
      description: data.description || '', content: data.content || [],
      specs: data.specs || {},
    }).eq('id', id);
    if (!error) setProductList(prev => prev.map(p => p.id === id ? { ...p, ...data, category_id: data.categoryId } : p));
    return { error };
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProductList(prev => prev.filter(p => p.id !== id));
    return { error };
  };

  // ── Categories ──
  const addCategory = async (data) => {
    const { data: inserted, error } = await supabase.from('categories').insert([data]).select().single();
    if (!error && inserted) setCategories(prev => [...prev, inserted]);
    return { error };
  };

  const updateCategory = async (id, data) => {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (!error) setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    return { error };
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => c.id !== id));
    return { error };
  };

  // ── Coupons ──
  const addCoupon = async (data) => {
    const { data: inserted, error } = await supabase.from('coupons').insert([data]).select().single();
    if (!error && inserted) setCoupons(prev => [inserted, ...prev]);
    return { error };
  };

  const updateCoupon = async (id, data) => {
    const { error } = await supabase.from('coupons').update(data).eq('id', id);
    if (!error) setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    return { error };
  };

  const deleteCoupon = async (id) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (!error) setCoupons(prev => prev.filter(c => c.id !== id));
    return { error };
  };

  // ── Reviews ──
  const addReview = async (data) => {
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert([{ product_id: data.product_id, customer_name: data.customer_name, rating: data.rating, comment: data.comment }])
      .select('*, products(name, images)')
      .single();
    if (!error && inserted) setReviews(prev => [inserted, ...prev]);
    return { error };
  };

  const deleteReview = async (id) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) setReviews(prev => prev.filter(r => r.id !== id));
    return { error };
  };

  // ── Orders ──
  const updateOrder = async (id, data) => {
    const { error } = await supabase.from('orders').update(data).eq('id', id);
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    return { error };
  };

  // ── Banners ──
  const addBanner = async (data) => {
    const { data: inserted, error } = await supabase.from('banners').insert([data]).select().single();
    if (!error && inserted) setBanners(prev => [...prev, inserted]);
    return { error };
  };

  const deleteBanner = async (id) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) setBanners(prev => prev.filter(b => b.id !== id));
    return { error };
  };

  const normalized = useMemo(() => productList.map(p => ({
    ...p,
    categoryId: p.category_id,
    originalPrice: p.original_price,
    isNew: p.is_new,
    isSale: p.is_sale,
  })), [productList]);

  return (
    <AdminContext.Provider value={{
      productList: normalized, categories, coupons, reviews, banners, orders, settings, loading,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addCoupon, updateCoupon, deleteCoupon,
      addReview, deleteReview,
      addBanner, deleteBanner,
      updateOrder, updateSettings,
      fetchAdminData,
      refetch: fetchPublic,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
