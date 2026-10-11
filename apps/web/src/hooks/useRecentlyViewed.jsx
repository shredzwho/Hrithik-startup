import { useCallback } from 'react';

const KEY = 'sb_recently_viewed';
const MAX = 8;

// Reads the list of recently viewed product ids (newest first).
export function getRecentlyViewedIds() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

// Hook to track a product as recently viewed.
export function useRecentlyViewed() {
  const track = useCallback((product) => {
    if (!product || !product.id) return;
    try {
      const raw = localStorage.getItem(KEY);
      let arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
      // De-duplicate by id, then prepend
      arr = arr.filter((p) => p.id !== product.id);
      arr.unshift({
        id: product.id,
        title: product.title,
        image: product.image || product.images?.[0]?.url || '',
        price_formatted:
          product.price_formatted ||
          product.variants?.[0]?.sale_price_formatted ||
          product.variants?.[0]?.price_formatted ||
          '',
      });
      arr = arr.slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(arr));
      // Notify other components on the same page
      window.dispatchEvent(new CustomEvent('sb-recently-viewed-change'));
    } catch (_) { /* ignore */ }
  }, []);

  return { track };
}

export default useRecentlyViewed;
