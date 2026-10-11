import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewedIds } from '@/hooks/useRecentlyViewed.jsx';

// Renders a "Recently Viewed" rail. Pass the current product id to exclude it.
const RecentlyViewed = ({ excludeId, title = 'Recently Viewed' }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = () => {
      const all = getRecentlyViewedIds();
      setItems(excludeId ? all.filter((p) => p.id !== excludeId) : all);
    };
    load();
    const onChange = () => load();
    window.addEventListener('sb-recently-viewed-change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('sb-recently-viewed-change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="snap-start shrink-0 w-40 md:w-48 luxury-card rounded-lg overflow-hidden group"
            >
              <div className="aspect-square bg-secondary overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-white truncate uppercase tracking-wider">{p.title}</p>
                {p.price_formatted && (
                  <p className="text-sm text-accent font-bold mt-1">{p.price_formatted}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
