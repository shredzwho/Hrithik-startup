import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Star, Award, Heart, Loader2, ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export const TrustBadges = () => {
  const badges = [
    { icon: ShieldCheck, title: "100% SECURE CHECKOUT", desc: "Razorpay, UPI & 256-Bit SSL", color: "text-brand-blue" },
    { icon: Truck, title: "SAME-DAY DISPATCH", desc: "Orders before 4PM dispatched today", color: "text-accent" },
    { icon: Award, title: "2-YEAR WARRANTY", desc: "Steel levers & structural stitching", color: "text-brand-blue" },
    { icon: Star, title: "IPF SPECIFICATION", desc: "Built for tested competition platforms", color: "text-accent" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-8 sm:py-12 border-y border-white/10 bg-[#080808]">
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center text-center px-3 sm:px-4">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-inner">
            <badge.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${badge.color}`} strokeWidth={2.2} />
          </div>
          <h4 className="font-steelfish text-base sm:text-lg uppercase tracking-wider mb-1 text-white font-bold">{badge.title}</h4>
          <p className="text-[11px] sm:text-xs text-white/50">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
    <Loader2 className="h-10 w-10 animate-spin text-accent" />
    <span className="font-steelfish text-sm tracking-widest uppercase text-white/50">Loading STRONGBUILD Arsenal...</span>
  </div>
);

export const WishlistButton = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!pb.authStore.isValid) {
      toast.error('Please login to save to wishlist');
      return;
    }
    setIsAdding(true);
    try {
      const defaultVariant = product.variants?.[0];
      const price = defaultVariant?.sale_price_formatted || defaultVariant?.price_formatted || '';
      await pb.collection('wishlist').create({
        user_id: pb.authStore.model.id,
        product_external_id: product.id,
        product_title: product.title,
        product_image: product.image || '',
        product_price: price,
      }, { $autoCancel: false });
      toast.success('Saved to your wishlist');
    } catch (err) {
      toast.error('Item is already in your wishlist');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button 
      onClick={handleWishlist}
      disabled={isAdding}
      className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors border border-white/10 z-10 active:scale-90"
      aria-label="Add to wishlist"
    >
      <Heart className={`h-4 w-4 ${isAdding ? 'animate-pulse text-accent' : 'text-white'}`} />
    </button>
  );
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const defaultVariant = product.variants?.[0];
  const isLowStock = defaultVariant?.inventory_quantity > 0 && defaultVariant?.inventory_quantity <= 5;
  const isOutOfStock = defaultVariant?.inventory_quantity === 0;

  // Calculate discount percentage if sale price is active
  let discountPercentage = 0;
  if (defaultVariant?.price_in_cents && defaultVariant?.sale_price_in_cents && defaultVariant.price_in_cents > defaultVariant.sale_price_in_cents) {
    discountPercentage = Math.round(
      ((defaultVariant.price_in_cents - defaultVariant.sale_price_in_cents) / defaultVariant.price_in_cents) * 100
    );
  }

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity)
      .then(() => toast.success(`Added ${product.title} to cart`))
      .catch(err => toast.error(err.message));
  };

  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="luxury-card rounded-2xl overflow-hidden h-full flex flex-col relative border border-white/10 hover:border-accent/50 transition-all duration-300">
        <WishlistButton product={product} />
        
        {/* Product Image Stage */}
        <div className="aspect-[4/5] bg-[#0c0c0c] relative overflow-hidden">
          <img 
            src={product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+'} 
            alt={`${product.title} — powerlifting gear by STRONGBUILD`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges Stack */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
            {discountPercentage > 0 && (
              <span className="bg-accent text-white font-steelfish text-sm px-2 py-0.5 rounded tracking-wider uppercase shadow-lg shadow-accent/40 font-bold">
                SAVE {discountPercentage}%
              </span>
            )}
            {product.ribbon_text && (
              <span className="bg-brand-blue text-white font-steelfish text-xs sm:text-sm px-2 py-0.5 rounded tracking-wider uppercase shadow-md font-bold">
                {product.ribbon_text}
              </span>
            )}
            {isLowStock && (
              <span className="bg-black/80 backdrop-blur-md border border-accent/40 text-accent text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Only {defaultVariant.inventory_quantity} Left
              </span>
            )}
          </div>
        </div>
        
        {/* Content & Action Area */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1.5 font-bold">
              <span>★ 4.9</span>
              <span className="text-white/40 text-[10px]">(Verified Platform Gear)</span>
            </div>
            
            <h3 className="font-steelfish text-xl sm:text-2xl uppercase tracking-wide text-white leading-tight group-hover:text-accent transition-colors line-clamp-1 font-bold">
              {product.title}
            </h3>
            
            <p className="text-[11px] sm:text-xs text-white/50 mt-1 line-clamp-1 font-sans">{product.subtitle || 'Competition Grade Specification'}</p>
          </div>
          
          <div className="pt-3 mt-3 border-t border-white/5 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-steelfish text-2xl sm:text-3xl text-white font-bold tracking-tight">
                    {defaultVariant?.sale_price_formatted || defaultVariant?.price_formatted || '₹1,999'}
                  </span>
                  {defaultVariant?.sale_price_formatted && (
                    <span className="text-xs sm:text-sm text-white/40 line-through font-sans">
                      {defaultVariant.price_formatted}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-[#25D366] font-bold uppercase tracking-wider bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/20">
                In Stock
              </span>
            </div>
            
            {/* Quick Action Button */}
            <Button 
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`w-full h-10 sm:h-11 font-steelfish text-base tracking-wider uppercase rounded-xl transition-all duration-200 active:scale-95 ${
                isOutOfStock 
                  ? 'bg-secondary text-muted-foreground cursor-not-allowed' 
                  : 'bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 font-bold'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              {isOutOfStock ? 'Sold Out' : 'Quick Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};