import { useState, useCallback } from 'react';

export default function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recently_viewed')) || []; }
    catch { return []; }
  });

  const addViewed = useCallback((slug) => {
    setRecentSlugs(prev => {
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentSlugs, addViewed };
}
