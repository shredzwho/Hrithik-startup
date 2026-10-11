import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getProduct, getProducts } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button';
import { TrustBadges, LoadingSpinner, ProductCard } from '@/components/SharedComponents.jsx';
import SizingChart from '@/components/SizingChart.jsx';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed.jsx';
import { toast } from 'sonner';
import { Star, Loader2, Send } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const { track: trackRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((res) => {
        setProduct(res);
        setActiveImage(null);
        trackRecentlyViewed(res);
        // Initialise option selections with the first value of each option
        const init = {};
        (res.options || []).forEach((opt) => {
          if (opt.values[0]) init[opt.id] = opt.values[0].value;
        });
        setSelectedOptions(init);
        return getProducts({ limit: 8 });
      })
      .then((res) => setRelated(res.products.filter((p) => p.id !== id).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Load reviews linked to this Online Store product
    pb.collection('reviews').getFullList({
      filter: pb.filter('product_external_id = {:id}', { id }),
      sort: '-created',
      $autoCancel: false,
    }).then(setReviews).catch(() => {});
  }, [id]);

  // Resolve the variant matching the selected option values
  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants || [];
    if (!product.options || product.options.length === 0) return variants[0] || null;
    return variants.find((v) => {
      return (v.options || []).every((vo) => selectedOptions[vo.option_id] === vo.value);
    }) || variants[0] || null;
  }, [product, selectedOptions]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-32 text-white">Product not found</div>;

  const currentDisplayImage = activeImage || selectedVariant?.image_url || product.image;
  const isOutOfStock = selectedVariant?.manage_inventory && selectedVariant?.inventory_quantity === 0;
  const isLowStock = selectedVariant?.manage_inventory && selectedVariant?.inventory_quantity > 0 && selectedVariant?.inventory_quantity <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity, selectedVariant?.inventory_quantity)
      .then(() => toast.success('Added to cart'))
      .catch((err) => toast.error(err.message));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      return;
    }
    setReviewLoading(true);
    try {
      const rec = await pb.collection('reviews').create({
        product_external_id: product.id,
        user_id: currentUser.id,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        comment: reviewForm.comment,
        verified_purchase: false,
      }, { $autoCancel: false });
      setReviews((prev) => [rec, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review posted');
    } catch (err) {
      toast.error('Could not post your review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Combine PocketBase reviews with the store's aggregated review analytics
  const storeRating = product.reviews_analytics;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : (storeRating && storeRating.total_reviews > 0 ? Number(storeRating.average_rating).toFixed(1) : null);
  const totalReviews = reviews.length || (storeRating ? storeRating.total_reviews : 0);

  // Frequently Bought Together: prefer product.related_products, else fallback to related
  const fbt = (product.related_products && product.related_products.length)
    ? related.filter((p) => product.related_products.some((rp) => rp.related_id === p.id)).slice(0, 3)
    : related.slice(0, 3);

  // Specs / size guide from additional_info when available
  const additionalInfo = product.additional_info || [];

  return (
    <>
      <Helmet>
        <title>{product.title} – Premium Powerlifting Gear | STRONGBUILD India</title>
        <meta name="description" content={product.subtitle || `Buy the ${product.title} from STRONGBUILD — competition-grade powerlifting lever belts, wrist wraps and gear built in India. Free shipping over ₹1,499, 30-day returns.`} />
        <meta name="keywords" content={`powerlifting lever belt, adjustable lever belt for squats, ${product.title}, powerlifting gear India, STRONGBUILD`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32 pb-24 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">

          {/* Images */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square bg-secondary rounded-xl overflow-hidden border border-border/80 relative shadow-lg">
              <img src={currentDisplayImage} alt={product.title} className="w-full h-full object-cover transition-all duration-300" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveImage(product.image)}
                  className={`aspect-square w-16 sm:w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    currentDisplayImage === product.image ? 'border-accent shadow-md scale-95' : 'border-border/60 hover:border-white/40'
                  }`}
                >
                  <img src={product.image} alt={`${product.title} main view`} className="w-full h-full object-cover" />
                </button>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square w-16 sm:w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      currentDisplayImage === img.url ? 'border-accent shadow-md scale-95' : 'border-border/60 hover:border-white/40'
                    }`}
                  >
                    <img src={img.url} alt={`${product.title} — view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white mb-2">{product.title}</h1>
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-current text-accent' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{avgRating} · {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
              </div>
            )}
            <p className="text-xl text-primary mb-6">{selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted}</p>

            <div className="prose prose-invert max-w-none mb-8 text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Functional variant selector */}
            {product.options?.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.options.map((opt) => (
                  <div key={opt.id}>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-2">{opt.title}</label>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {opt.values.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.id]: v.value }))}
                          className={`min-h-[42px] min-w-[46px] px-3.5 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
                            selectedOptions[opt.id] === v.value
                              ? 'bg-accent border-accent text-white shadow-md shadow-accent/20'
                              : 'bg-secondary/70 border-border text-muted-foreground hover:text-white hover:border-white/40'
                          }`}
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-5"><SizingChart /></div>

            {isLowStock && <p className="text-orange-500 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" /> Only {selectedVariant.inventory_quantity} left in stock — order soon</p>}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-sm bg-secondary h-12">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-white hover:text-accent">-</button>
                <span className="px-4 text-white font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-white hover:text-accent">+</button>
              </div>

              <Button onClick={handleAddToCart} disabled={isOutOfStock} className={`flex-1 h-12 font-bold tracking-widest uppercase rounded-sm text-lg ${isOutOfStock ? 'bg-secondary text-muted-foreground' : 'bg-accent hover:bg-accent/90 text-white'}`}>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground border-t border-border/50 pt-6 space-y-2">
              <p>Estimated Delivery: 2-5 Business Days (IST dispatch)</p>
              <p>30-Day Returns &amp; Exchanges</p>
              <p>2-Year Hardware &amp; Stitching Warranty</p>
              <p>Secure payments via Razorpay, UPI and cards</p>
            </div>

            {/* Specs / size guide from additional_info, with sensible fallbacks */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-bold uppercase tracking-wider text-white text-sm mb-3">Specifications</h3>
                {additionalInfo.find((i) => /spec/i.test(i.title)) ? (
                  <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: additionalInfo.find((i) => /spec/i.test(i.title)).description }} />
                ) : (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Competition-spec 10cm width</li>
                    <li>Full-grain leather / reinforced nylon</li>
                    <li>Steel hardware, powder coated</li>
                    <li>Made in India</li>
                  </ul>
                )}
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-bold uppercase tracking-wider text-white text-sm mb-3">Size guide</h3>
                {additionalInfo.find((i) => /size|guide|fit/i.test(i.title)) ? (
                  <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: additionalInfo.find((i) => /size|guide|fit/i.test(i.title)).description }} />
                ) : (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>S — 65-80cm waist</li>
                    <li>M — 80-95cm waist</li>
                    <li>L — 95-110cm waist</li>
                    <li>XL — 110-125cm waist</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <TrustBadges />

        {/* Frequently bought together */}
        {fbt.length > 0 && (
          <div className="py-16">
            <h2 className="text-2xl font-black uppercase text-white mb-2 tracking-tight">Frequently Bought Together</h2>
            <p className="text-muted-foreground mb-6 text-sm">Add the full kit and save up to 15% at checkout.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fbt.map((p) => <ProductCard key={`fbt-${p.id}`} product={p} />)}
            </div>
          </div>
        )}

        {/* Reviews + FAQ */}
        <div className="grid md:grid-cols-2 gap-8 py-12 border-t border-border/50">
          <div>
            <h2 className="text-2xl font-black uppercase text-white mb-6 tracking-tight">Customer reviews</h2>

            {/* Write a review */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="glass-panel rounded-2xl p-5 mb-6 space-y-3">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Write a review</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                      <Star className={`h-6 w-6 ${n <= reviewForm.rating ? 'fill-current text-accent' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Review title" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} className="w-full p-3 rounded-sm bg-secondary border border-border text-white text-sm" />
                <textarea rows="3" placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} className="w-full p-3 rounded-sm bg-secondary border border-border text-white text-sm" />
                <Button type="submit" disabled={reviewLoading} className="bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider rounded-sm flex items-center gap-2">
                  {reviewLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</> : <><Send className="h-4 w-4" /> Post Review</>}
                </Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground mb-6 glass-panel rounded-2xl p-5">
                <Link to="/login" className="text-accent font-bold uppercase tracking-wider">Log in</Link> to leave a review.
              </p>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((r) => (
                <div key={r.id} className="glass-panel rounded-2xl p-5">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < (r.rating || 0) ? 'fill-current text-accent' : 'text-muted-foreground'}`} />)}
                  </div>
                  {r.title && <p className="font-bold text-white mb-1">{r.title}</p>}
                  <p className="text-white/80 mb-2">{r.comment}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{new Date(r.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{r.verified_purchase ? ' — Verified buyer' : ''}</p>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm">No reviews yet. Be the first to share your experience.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase text-white mb-6 tracking-tight">Product FAQs</h2>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[{ q: 'How do I pick my size?', a: 'Measure at the navel over your usual training gear and match the size guide above.' }, { q: 'Is COD available?', a: 'Cash on delivery is available on eligible pin codes; prepaid orders ship first.' }, { q: 'What is covered by warranty?', a: 'Stitching and hardware defects for 2 years from delivery.' }].map((f) => (
                <div key={f.q} className="py-4">
                  <p className="font-semibold text-white mb-1">{f.q}</p>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <div className="py-24 border-t border-border/50">
            <h2 className="text-2xl font-black uppercase text-white mb-8 tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* Sticky mobile CTA anchored above MobileBottomNav */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-black/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={currentDisplayImage} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground truncate max-w-[130px] sm:max-w-[180px]">{product.title}</p>
            <p className="font-black text-sm text-accent">{selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted}</p>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 max-w-[180px] h-10 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-accent/20 active:scale-95 transition-all"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </>
  );
};

export default ProductDetailPage;
