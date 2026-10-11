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

      <div className="pt-32 pb-14 border-b border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-eyebrow">The arsenal</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mt-2 heading-balance">Shop all gear</h1>
          <p className="text-muted-foreground mt-3 max-w-xl">Every piece built to competition spec and tested by athletes on the platform.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass-panel rounded-2xl p-5 mb-10 grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search belts, wraps, chalk..."
              className="w-full rounded-xl border border-white/10 pl-10 pr-4 py-3 text-white"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl border-white/10 text-white h-[46px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white">
              <SelectItem value="all">All categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="rounded-xl border-white/10 text-white h-[46px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          {maxPrice > 0 && (
            <div className="md:col-span-4 flex items-center gap-4">
              <SlidersHorizontal className="h-4 w-4 text-brand-blue shrink-0" />
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={Math.max(1, Math.round(maxPrice / 50))}
                value={priceCap}
                onChange={e => setPriceCap(Number(e.target.value))}
                className="flex-1 accent-red-600 bg-transparent"
                aria-label="Maximum price"
              />
              <span className="text-sm text-muted-foreground w-28 text-right">Up to {priceCap}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-6">{visible.length} products</p>

        {loading ? <LoadingSpinner /> : visible.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visible.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground glass-panel rounded-2xl">
            <p className="text-lg">No products match these filters.</p>
            <button onClick={() => { setQuery(''); setCategory('all'); setPriceCap(maxPrice); }} className="mt-4 text-accent font-bold uppercase tracking-wider text-sm">Reset filters</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShopPage;
