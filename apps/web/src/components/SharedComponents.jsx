import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Star, Award, Heart, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export const TrustBadges = () => {
  const badges = [
    { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encryption" },
    { icon: Truck, title: "Fast Shipping", desc: "Worldwide delivery" },
    { icon: Award, title: "Premium Quality", desc: "Built to last" },
    { icon: Star, title: "Athlete Tested", desc: "Competition ready" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-border/50 bg-secondary/30">
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center text-center px-4">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <badge.icon className="h-6 w-6 text-primary" />
          </div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{badge.title}</h4>
          <p className="text-xs text-muted-foreground">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <Loader2 className="h-10 w-10 animate-spin text-accent" />
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
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error('Could not add to wishlist. It may already be saved.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button 
      onClick={handleWishlist}
      disabled={isAdding}
      className="absolute top-4 right-4 h-10 w-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors border border-white/10 z-10"
      aria-label="Add to wishlist"
    >
      <Heart className={`h-5 w-5 ${isAdding ? 'animate-pulse' : ''}`} />
    </button>
  );
};

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const defaultVariant = product.variants[0];
  const isLowStock = defaultVariant?.inventory_quantity > 0 && defaultVariant?.inventory_quantity <= 5;
  const isOutOfStock = defaultVariant?.inventory_quantity === 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity)
      .then(() => toast.success('Added to cart'))
      .catch(err => toast.error(err.message));
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="luxury-card rounded-lg overflow-hidden h-full flex flex-col relative">
        <WishlistButton product={product} />
        
        <div className="aspect-[4/5] bg-secondary relative overflow-hidden">
          <img 
            src={product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+'} 
            alt={`${product.title} — powerlifting gear by STRONGBUILD`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          {product.ribbon_text && (
            <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 tracking-wider uppercase">
              {product.ribbon_text}
            </span>
          )}
          {isLowStock && (
            <span className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-bold px-2 py-1 tracking-wider uppercase">
              Only {defaultVariant.inventory_quantity} Left
            </span>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg mb-1 truncate">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.subtitle}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="font-bold text-lg">
              {defaultVariant?.sale_price_formatted ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-accent whitespace-nowrap">{defaultVariant.sale_price_formatted}</span>
                  <span className="text-sm text-muted-foreground line-through whitespace-nowrap">{defaultVariant.price_formatted}</span>
                </div>
              ) : (
                <span>{defaultVariant?.price_formatted || 'TBD'}</span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full mt-4 font-bold tracking-wider uppercase rounded-sm ${isOutOfStock ? 'bg-secondary text-muted-foreground' : 'bg-white text-black hover:bg-accent hover:text-white'}`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
          </Button>
        </div>
      </div>
    </Link>
  );
};