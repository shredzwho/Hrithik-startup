import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { trackInitiateCheckout } from '@/lib/metaPixel.js';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartTotalInCents } = useCart();
  const { currentUser } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const totalInCents = getCartTotalInCents ? getCartTotalInCents() : 0;
  const freeShippingThresholdInCents = 149900; // ₹1,499
  const progressPercent = Math.min(100, Math.round((totalInCents / freeShippingThresholdInCents) * 100));
  const remainingForFreeShipping = Math.max(0, Math.round((freeShippingThresholdInCents - totalInCents) / 100));

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some gear to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setCheckoutLoading(true);

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const customer = currentUser?.id && currentUser?.email ? {
        external_id: currentUser.id,
        email: currentUser.email,
      } : undefined;

      // Track Meta Pixel InitiateCheckout
      trackInitiateCheckout({
        items: cartItems,
        totalValue: totalInCents / 100,
        currency: 'INR',
      });

      const { url } = await initializeCheckout({
        items,
        successUrl,
        cancelUrl,
        customer,
      });

      // Redirect to secure payment gateway without wiping cart prematurely
      window.location.href = url;
    } catch (error) {
      setCheckoutLoading(false);
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cartItems, currentUser, totalInCents, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0C0C0C] text-white shadow-2xl flex flex-col border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#121212]">
              <div className="flex items-center gap-2.5">
                <h2 className="font-steelfish text-2xl uppercase tracking-wider text-white font-bold">Your Gear Arsenal</h2>
                <span className="font-steelfish text-sm bg-accent/20 text-accent font-bold px-2.5 py-0.5 rounded-full border border-accent/30">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Free Shipping Progress Bar */}
            {cartItems.length > 0 && (
              <div className="bg-[#171717] border-b border-white/10 p-3 sm:p-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-white font-sans">
                    {progressPercent >= 100 ? (
                      <span className="text-[#25D366]">🎉 FREE EXPRESS AIR DELIVERY UNLOCKED!</span>
                    ) : (
                      <span>Add <strong className="text-accent font-mono">₹{remainingForFreeShipping}</strong> more for FREE Shipping</span>
                    )}
                  </span>
                  <span className="text-white/50 font-mono text-[11px]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      progressPercent >= 100 ? 'bg-[#25D366]' : 'bg-accent'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-grow p-4 sm:p-5 overflow-y-auto space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center text-white/50 h-full flex flex-col items-center justify-center p-6">
                  <ShoppingCartIcon size={52} className="mb-4 text-accent/40" />
                  <p className="font-steelfish text-2xl uppercase text-white font-bold mb-1">Your Cart is Empty</p>
                  <p className="text-xs text-white/50 mb-6 font-sans">You have not added any competition-grade gear yet.</p>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-accent hover:bg-accent/90 text-white font-steelfish text-xl tracking-wider uppercase rounded-xl px-8 py-5"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-3 bg-[#141414] border border-white/10 p-3 rounded-xl shadow-sm">
                    <img 
                      src={item.product.image} 
                      alt={item.product.title} 
                      className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-lg border border-white/10 shrink-0" 
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-steelfish text-lg uppercase text-white truncate font-bold">{item.product.title}</h3>
                      <p className="text-[11px] text-white/50 truncate font-sans">{item.variant.title}</p>
                      <p className="font-steelfish text-xl text-accent font-bold mt-0.5">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center border border-white/15 rounded-lg bg-black/60">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 flex items-center justify-center text-white hover:text-accent font-bold active:scale-90"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-white hover:text-accent font-bold active:scale-90"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variant.id)}
                        className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider transition-colors pt-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Actions */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121212] pb-safe">
                <div className="flex justify-between items-baseline mb-3">
                  <div>
                    <span className="font-steelfish text-lg uppercase tracking-wider text-white font-bold block">Estimated Subtotal</span>
                    <span className="text-[11px] text-white/50 font-sans">Taxes & shipping calculated at checkout</span>
                  </div>
                  <span className="font-steelfish text-3xl font-bold text-accent">{getCartTotal()}</span>
                </div>

                {/* Trust Badges Strip */}
                <div className="flex items-center justify-center gap-2 py-2 mb-3 text-[10px] text-white/60 font-mono bg-white/5 rounded-lg border border-white/5">
                  <Lock className="h-3 w-3 text-[#25D366]" />
                  <span>256-Bit SSL · UPI · Razorpay · Cards</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-steelfish text-2xl tracking-wider uppercase py-6 rounded-xl shadow-xl shadow-accent/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 font-bold"
                >
                  {checkoutLoading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Gateway...</>
                  ) : (
                    <>Proceed to Checkout <ArrowRight className="h-5 w-5" /></>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;