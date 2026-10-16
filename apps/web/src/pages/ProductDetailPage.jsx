import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getProduct, getProducts, initializeCheckout } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button';
import { TrustBadges, LoadingSpinner, ProductCard } from '@/components/SharedComponents.jsx';
import SizingChart from '@/components/SizingChart.jsx';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed.jsx';
import { trackViewContent, trackAddToCart, trackInitiateCheckout } from '@/lib/metaPixel.js';
import { toast } from 'sonner';
import { 
  Star, Loader2, Send, ShieldCheck, Truck, RotateCcw, 
  Award, CheckCircle2, Zap, Flame, MapPin, ChevronRight, ShoppingCart, Lock
} from 'lucide-react';
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
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

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

  // Track Meta Pixel ViewContent event
  useEffect(() => {
    if (product && selectedVariant) {
      trackViewContent({ product, variant: selectedVariant });
    }
  }, [product?.id, selectedVariant?.id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-32 text-white font-steelfish text-3xl">GEAR NOT FOUND IN ARSENAL</div>;

  const currentDisplayImage = activeImage || selectedVariant?.image_url || product.image;
  const isOutOfStock = selectedVariant?.manage_inventory && selectedVariant?.inventory_quantity === 0;
  const isLowStock = selectedVariant?.manage_inventory && selectedVariant?.inventory_quantity > 0 && selectedVariant?.inventory_quantity <= 5;

  // Pricing calculations
  const priceInCents = selectedVariant?.price_in_cents || 0;
  const salePriceInCents = selectedVariant?.sale_price_in_cents || null;
  const currentPriceFormatted = selectedVariant?.sale_price_formatted || selectedVariant?.price_formatted || '';
  const originalPriceFormatted = salePriceInCents ? selectedVariant?.price_formatted : null;
  const savingsInCents = salePriceInCents && priceInCents > salePriceInCents ? priceInCents - salePriceInCents : 0;
  const discountPercent = savingsInCents > 0 ? Math.round((savingsInCents / priceInCents) * 100) : 0;

  // Add to Cart handler
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity, selectedVariant?.inventory_quantity)
      .then(() => {
        toast.success(`Added ${product.title} to your cart`);
        trackAddToCart({ product, variant: selectedVariant, quantity });
      })
      .catch((err) => toast.error(err.message));
  };

  // Instant 1-Click Buy Now (Essential for Meta Ads conversions)
  const handleDirectBuyNow = async () => {
    if (isOutOfStock) return;
    setBuyNowLoading(true);

    try {
      const items = [{
        variant_id: selectedVariant.id,
        quantity: quantity,
      }];

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const customer = currentUser?.id && currentUser?.email ? {
        external_id: currentUser.id,
        email: currentUser.email,
      } : undefined;

      const effectivePrice = salePriceInCents || priceInCents;
      trackInitiateCheckout({
        items: [{ variant: selectedVariant, product, quantity }],
        totalValue: (effectivePrice / 100) * quantity,
        currency: selectedVariant.currency || 'INR',
      });

      const { url } = await initializeCheckout({
        items,
        successUrl,
        cancelUrl,
        customer,
      });

      window.location.href = url;
    } catch (err) {
      toast.error('Could not initialize direct checkout. Opening shopping cart...');
      handleAddToCart();
    } finally {
      setBuyNowLoading(false);
    }
  };

  // Pincode Delivery Estimator
  const checkPincodeDelivery = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const metroPrefixes = ['11', '12', '40', '41', '50', '56', '60', '70'];
    const isMetro = metroPrefixes.some(p => pincode.startsWith(p));

    const today = new Date();
    const minDays = isMetro ? 2 : 3;
    const maxDays = isMetro ? 3 : 5;
    
    const deliveryDateMin = new Date(today);
    deliveryDateMin.setDate(today.getDate() + minDays);
    const deliveryDateMax = new Date(today);
    deliveryDateMax.setDate(today.getDate() + maxDays);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryEstimate({
      pincode: pincode.trim(),
      minDate: deliveryDateMin.toLocaleDateString('en-IN', options),
      maxDate: deliveryDateMax.toLocaleDateString('en-IN', options),
      isMetro,
    });
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
      toast.success('Review posted successfully');
    } catch (err) {
      toast.error('Could not post your review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const storeRating = product.reviews_analytics;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : (storeRating && storeRating.total_reviews > 0 ? Number(storeRating.average_rating).toFixed(1) : '4.9');
  const totalReviews = reviews.length || (storeRating?.total_reviews || 128);

  const fbt = (product.related_products && product.related_products.length)
    ? related.filter((p) => product.related_products.some((rp) => rp.related_id === p.id)).slice(0, 3)
    : related.slice(0, 3);

  const additionalInfo = product.additional_info || [];

  return (
    <>
      <Helmet>
        <title>{product.title} | STRONGBUILD Competition Gear</title>
        <meta 
          name="description" 
          content={product.subtitle || `Buy ${product.title} from STRONGBUILD India. 100% full-grain leather, stainless steel lever buckles, IPF spec, 2-year warranty.`} 
        />
        <meta property="og:title" content={`${product.title} | STRONGBUILD`} />
        <meta property="og:description" content={product.subtitle || 'Competition-grade powerlifting gear built for the platform.'} />
        <meta property="og:image" content={currentDisplayImage} />
      </Helmet>

      {/* Floating Meta Ad Offer Ribbon on PDP */}
      <div className="bg-[#121212] border-b border-white/10 pt-28 sm:pt-32 pb-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-steelfish uppercase tracking-wider text-white">
          <Zap className="h-4 w-4 text-accent fill-accent" />
          <span>OFFICIAL META AD PROMO: USE CODE <strong className="text-accent underline font-mono">STRONG10</strong> FOR EXTRA 10% OFF | SAME-DAY DISPATCH AVAILABLE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-28">
        
        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-20">

          {/* Left: Product Images Gallery (5 cols on large) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/5] sm:aspect-square bg-[#0C0C0C] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
              <img 
                src={currentDisplayImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-300" 
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-accent text-white font-steelfish text-base px-3 py-1 rounded tracking-wider uppercase font-bold shadow-lg shadow-accent/40">
                  SAVE {discountPercent}% OFF
                </span>
              )}
              {isLowStock && (
                <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-accent/40 text-accent font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider">
                  Only {selectedVariant.inventory_quantity} Left
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images?.length > 1 && (
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveImage(product.image)}
                  className={`aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    currentDisplayImage === product.image ? 'border-accent shadow-md scale-95' : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img src={product.image} alt={`${product.title} main view`} className="w-full h-full object-cover" />
                </button>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      currentDisplayImage === img.url ? 'border-accent shadow-md scale-95' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <img src={img.url} alt={`${product.title} — angle ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Features Strip below images on desktop */}
            <div className="hidden sm:grid grid-cols-3 gap-3 pt-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">2-Yr Warranty</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                <RotateCcw className="h-5 w-5 text-brand-blue shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">30-Day Fits</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Same-Day Air</span>
              </div>
            </div>
          </div>

          {/* Right: Conversion & Purchase Column (6 cols on large) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Reviews & IPF Spec Eyebrow */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-steelfish text-sm uppercase tracking-widest text-brand-blue font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> IPF Dimensional Specification Compliant
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-white font-mono">{avgRating}</span>
                <span className="text-white/40 font-normal">({totalReviews} lifters)</span>
              </div>
            </div>

            {/* Steelfish Product Title */}
            <h1 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white leading-[0.95] mb-3">
              {product.title}
            </h1>

            {/* High-Impact Pricing Block */}
            <div className="bg-[#121212] border border-white/10 p-4 sm:p-5 rounded-2xl mb-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-steelfish text-4xl sm:text-5xl text-accent font-bold tracking-tight">
                  {currentPriceFormatted}
                </span>
                {originalPriceFormatted && (
                  <span className="text-base sm:text-lg text-white/40 line-through font-sans">
                    {originalPriceFormatted}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider font-sans">
                    You Save ₹{savingsInCents / 100} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50 mt-1 font-sans">
                Taxes included. Free Express Air Shipping applied automatically on this order.
              </p>
            </div>

            {/* Variant Option Selectors (Sizes, Thickness, Colors) */}
            {product.options?.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.options.map((opt) => (
                  <div key={opt.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-steelfish text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                        SELECT {opt.title}: <span className="text-accent">{selectedOptions[opt.id]}</span>
                      </label>
                      {/size|belt/i.test(opt.title) && (
                        <SizingChart />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {opt.values.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.id]: v.value }))}
                          className={`min-h-[46px] min-w-[52px] px-4 py-2 rounded-xl border font-steelfish text-lg tracking-wider uppercase transition-all active:scale-95 ${
                            selectedOptions[opt.id] === v.value
                              ? 'bg-accent border-accent text-white shadow-lg shadow-accent/25 font-bold'
                              : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30'
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

            {/* Dual High-Conversion CTA Buttons */}
            <div className="space-y-3 mb-6">
              {/* Direct BUY NOW (1-Click straight to Razorpay/UPI) */}
              <Button
                onClick={handleDirectBuyNow}
                disabled={isOutOfStock || buyNowLoading}
                className="w-full h-14 sm:h-16 bg-accent hover:bg-accent/90 text-white font-steelfish text-2xl tracking-wider uppercase rounded-xl shadow-xl shadow-accent/30 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {buyNowLoading ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /> PROCEEDING TO GATEWAY...</>
                ) : (
                  <><Zap className="h-6 w-6 fill-white" /> BUY NOW — INSTANT CHECKOUT</>
                )}
              </Button>

              {/* Add to Cart Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/15 rounded-xl bg-white/5 h-12 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="h-full px-3.5 text-white hover:text-accent font-bold active:scale-90"
                  >
                    -
                  </button>
                  <span className="px-3 text-white font-bold font-mono text-sm">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    className="h-full px-3.5 text-white hover:text-accent font-bold active:scale-90"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant="outline"
                  className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white border-white/20 font-steelfish text-xl tracking-wider uppercase rounded-xl transition-all"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO SHOPPING CART'}
                </Button>
              </div>
            </div>

            {/* Pincode Delivery Estimator Box */}
            <div className="bg-[#121212] border border-white/10 p-4 rounded-xl mb-6">
              <label className="text-xs uppercase font-bold text-white/80 tracking-wider flex items-center gap-1.5 mb-2">
                <MapPin className="h-4 w-4 text-brand-blue" /> Check Delivery to Your Pincode
              </label>
              
              <form onSubmit={checkPincodeDelivery} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 411001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 rounded-lg border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white uppercase font-mono tracking-wider"
                />
                <Button 
                  type="submit" 
                  variant="secondary"
                  className="h-auto font-steelfish text-base tracking-wider uppercase px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  CHECK
                </Button>
              </form>

              {deliveryEstimate && (
                <div className="mt-3 text-xs bg-[#25D366]/10 border border-[#25D366]/30 p-2.5 rounded-lg text-white">
                  <p className="font-bold text-[#25D366] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Express Air Delivery to {deliveryEstimate.pincode}
                  </p>
                  <p className="text-white/80 mt-1">
                    Expected Delivery: <strong>{deliveryEstimate.minDate} — {deliveryEstimate.maxDate}</strong>. Orders before 4PM dispatched today from Pune.
                  </p>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="prose prose-invert max-w-none text-white/70 text-xs sm:text-sm font-sans mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Specifications Cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="luxury-card rounded-xl p-4 border border-white/10">
                <h4 className="font-steelfish text-lg uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-brand-blue" /> Platform Specs
                </h4>
                {additionalInfo.find((i) => /spec/i.test(i.title)) ? (
                  <div className="text-xs text-white/60 space-y-1" dangerouslySetInnerHTML={{ __html: additionalInfo.find((i) => /spec/i.test(i.title)).description }} />
                ) : (
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• Strict 10cm competition width</li>
                    <li>• Heavy 100% full-grain steerhide leather</li>
                    <li>• Solid stainless steel lever buckle</li>
                    <li>• 6-row bonded quad-core stitching</li>
                  </ul>
                )}
              </div>

              <div className="luxury-card rounded-xl p-4 border border-white/10">
                <h4 className="font-steelfish text-lg uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-accent" /> Peace of Mind
                </h4>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• 2-Year Unconditional Hardware Warranty</li>
                  <li>• 30-Day Hassle-Free Sizing Exchange</li>
                  <li>• 100% Safe Payments via Razorpay & UPI</li>
                  <li>• Priority WhatsApp Support Support</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Global Trust Badges */}
        <TrustBadges />

        {/* Frequently Bought Together (Bundle Upsell) */}
        {fbt.length > 0 && (
          <div className="py-14 sm:py-20 border-b border-white/10">
            <span className="font-steelfish text-sm uppercase tracking-widest text-accent font-bold">
              Pair with Your Gear
            </span>
            <h2 className="font-steelfish text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white tracking-tight mt-1 mb-2">
              FREQUENTLY BOUGHT TOGETHER
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mb-8 font-sans">
              Complete your meet day equipment setup and qualify for instant free express shipping.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {fbt.map((p) => (
                <ProductCard key={`fbt-${p.id}`} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews & Product FAQs */}
        <div className="grid md:grid-cols-2 gap-8 py-14">
          <div>
            <h2 className="font-steelfish text-3xl sm:text-4xl font-bold uppercase text-white mb-6 tracking-tight">
              ATHLETE VERIFIED REVIEWS
            </h2>

            {/* Write a review */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="luxury-card rounded-2xl p-5 mb-6 space-y-3 border border-white/10">
                <h3 className="font-steelfish text-lg text-white uppercase tracking-wider font-bold">Write a verified review</h3>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                      <Star className={`h-5 w-5 ${n <= reviewForm.rating ? 'fill-current text-amber-400' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="Review title (e.g. 240kg Squat in this belt)" 
                  value={reviewForm.title} 
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} 
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs" 
                />
                <textarea 
                  rows="3" 
                  placeholder="Share your experience on the platform..." 
                  value={reviewForm.comment} 
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} 
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs" 
                />
                <Button type="submit" disabled={reviewLoading} className="bg-accent hover:bg-accent/90 text-white font-steelfish text-lg uppercase tracking-wider rounded-xl">
                  {reviewLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> SUBMITTING...</> : <><Send className="h-4 w-4 mr-1.5" /> POST ATHLETE REVIEW</>}
                </Button>
              </form>
            ) : (
              <div className="luxury-card rounded-2xl p-5 mb-6 border border-white/10 text-xs text-white/60">
                <Link to="/login" className="text-accent font-bold uppercase tracking-wider underline">Log in</Link> to leave an athlete review with verified PR proof.
              </div>
            )}

            <div className="space-y-3">
              {reviews.length > 0 ? reviews.map((r) => (
                <div key={r.id} className="luxury-card rounded-xl p-4 border border-white/10">
                  <div className="flex gap-1 mb-1.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < (r.rating || 0) ? 'fill-current' : 'text-white/20'}`} />
                    ))}
                  </div>
                  {r.title && <p className="font-bold text-white text-sm mb-1">{r.title}</p>}
                  <p className="text-white/80 text-xs mb-2 leading-relaxed">&quot;{r.comment}&quot;</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    {new Date(r.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.verified_purchase ? ' — Verified Buyer' : ''}
                  </p>
                </div>
              )) : (
                <div className="luxury-card rounded-xl p-5 text-center text-xs text-white/50 border border-white/10">
                  No written reviews yet for this product. Be the first to record your platform review.
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-steelfish text-3xl sm:text-4xl font-bold uppercase text-white mb-6 tracking-tight">
              GEAR FAQ &amp; SIZING
            </h2>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                { q: 'How do I pick my exact belt size?', a: 'Measure around your belly button (navel) with a tape while bracing slightly. Match that measurement against our Sizing Chart. Never use your pant or jeans size.' },
                { q: 'Is this gear legal for powerlifting meets?', a: 'Yes. All STRONGBUILD belts and wraps are constructed to standard 10cm width and IPF dimensional tolerances used in federations across India.' },
                { q: 'What payment modes are accepted?', a: 'We accept UPI (GPay, PhonePe, Paytm), NetBanking, Credit/Debit Cards, and Razorpay with instant 256-bit encryption.' },
                { q: 'How does the 2-Year Warranty work?', a: 'If your stainless steel lever buckle or structural stitching ever fails during training or competition, send us a photo on WhatsApp and we will replace it.' },
              ].map((f, i) => (
                <div key={i} className="py-4">
                  <p className="font-bold text-white text-sm mb-1.5">{f.q}</p>
                  <p className="text-xs text-white/60 leading-relaxed font-sans">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div className="py-14 border-t border-white/10">
            <h2 className="font-steelfish text-3xl sm:text-4xl font-bold uppercase text-white mb-8 tracking-tight">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* MOBILE STICKY QUICK BUY BAR (High Meta Ads conversion rate) */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-black/95 backdrop-blur-2xl border-t border-white/15 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <img src={currentDisplayImage} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-white/60 truncate max-w-[110px] sm:max-w-[160px] font-sans">{product.title}</p>
            <p className="font-steelfish text-lg text-accent leading-none font-bold">{currentPriceFormatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant="outline"
            className="h-10 px-3 bg-white/5 border-white/20 text-white font-steelfish text-sm uppercase rounded-lg"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={handleDirectBuyNow}
            disabled={isOutOfStock || buyNowLoading}
            className="h-10 px-4 bg-accent hover:bg-accent/90 text-white font-steelfish text-base tracking-wider uppercase rounded-lg shadow-lg shadow-accent/25 active:scale-95 transition-all font-bold flex items-center gap-1"
          >
            {buyNowLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 fill-white" />}
            {isOutOfStock ? 'SOLD OUT' : 'BUY NOW'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
