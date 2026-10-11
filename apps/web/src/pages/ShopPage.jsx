import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard, LoadingSpinner } from '@/components/SharedComponents.jsx';
import { getProducts, getCategories } from '@/api/EcommerceApi.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const priceOf = (p) => {
  const v = p.variants?.[0];
  return v?.sale_price ?? v?.price ?? 0;
};

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceCap, setPriceCap] = useState(0);

  useEffect(() => {
    getCategories().then(res => setCategories(res.categories || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ limit: 50 })
      .then(res => {
        const list = res.products || [];
        setProducts(list);
        const max = Math.ceil(Math.max(0, ...list.map(priceOf)) / 100) * 100 || 100;
        setMaxPrice(max);
        setPriceCap(max);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter(p => (p.collections || []).some(c => c.collection_id === category));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => `${p.title} ${p.subtitle || ''}`.toLowerCase().includes(q));
    }
    if (priceCap) list = list.filter(p => priceOf(p) <= priceCap);
    if (sort === 'price-asc') list.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'price-desc') list.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, category, query, priceCap, sort]);

  return (
    <>
      <Helmet>
        <title>Shop Powerlifting Gear | STRONGBUILD</title>
        <meta name="description" content="Browse STRONGBUILD lever belts, wrist wraps, figure-8 straps, chalk, singlets and bundles. Filter by category, price and popularity." />
      </Helmet>

      <div className="pt-24 sm:pt-32 pb-6 sm:pb-12 border-b border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-eyebrow">The arsenal</span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight mt-1 heading-balance">Shop all gear</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 max-w-xl">Every piece built to competition spec and tested by athletes on the platform.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Horizontal Category Pills Carousel (Mobile-friendly thumb navigation) */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shrink-0 ${
              category === 'all'
                ? 'bg-accent text-white shadow-lg shadow-accent/20 border border-accent'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            All Gear ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shrink-0 ${
                category === cat.id
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 border border-accent'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-6 sm:mb-10 grid gap-3 sm:gap-4 md:grid-cols-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search belts, wraps, chalk..."
              className="w-full rounded-lg sm:rounded-xl border border-white/10 bg-black/40 pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-2 sm:gap-3">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="rounded-lg sm:rounded-xl border-white/10 bg-black/40 text-white text-xs sm:text-sm h-10 sm:h-[46px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {maxPrice > 0 && (
              <div className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 rounded-lg sm:rounded-xl h-10 sm:h-[46px]">
                <SlidersHorizontal className="h-3.5 w-3.5 text-accent shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={Math.max(1, Math.round(maxPrice / 50))}
                  value={priceCap}
                  onChange={e => setPriceCap(Number(e.target.value))}
                  className="w-full accent-accent bg-transparent cursor-pointer"
                  aria-label="Maximum price"
                />
                <span className="text-[10px] sm:text-xs text-white/70 shrink-0 font-medium">₹{priceCap}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-muted-foreground">Showing <span className="font-bold text-white">{visible.length}</span> items</p>
          {(category !== 'all' || query || (priceCap && priceCap < maxPrice)) && (
            <button
              onClick={() => { setQuery(''); setCategory('all'); setPriceCap(maxPrice); }}
              className="text-xs text-accent hover:underline font-bold uppercase tracking-wider"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? <LoadingSpinner /> : visible.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {visible.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground glass-panel rounded-2xl p-6">
            <p className="text-base sm:text-lg text-white">No products match these filters.</p>
            <button onClick={() => { setQuery(''); setCategory('all'); setPriceCap(maxPrice); }} className="mt-4 bg-accent text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs">Reset filters</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShopPage;
