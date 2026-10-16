import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';

import { useAuth } from '@/contexts/AuthContext.jsx';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartTotalInCents } = useCart();
  const { currentUser } = useAuth();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

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

      const { url } = await initializeCheckout({
        items,
        successUrl,
        cancelUrl,
        customer,
      });

      // Redirect to secure payment gateway without prematurely wiping cart
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cartItems, currentUser, toast]);

  const totalInCents = getCartTotalInCents ? getCartTotalInCents() : 0;
  const freeShippingThresholdInCents = 149900; // ₹1,499
  const progressPercent = Math.min(100, Math.round((totalInCents / freeShippingThresholdInCents) * 100));
  const remainingForFreeShipping = Math.max(0, Math.round((freeShippingThresholdInCents - totalInCents) / 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col border-l border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-card-foreground">Shopping Cart</h2>
                <span className="text-xs bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-card-foreground hover:text-primary hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Free Shipping Progress Bar */}
            {cartItems.length > 0 && (
              <div className="bg-white/5 border-b border-border p-3 sm:p-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-white">
                    {progressPercent >= 100 ? (
                      <span className="text-[#25D366]">🎉 FREE Delivery Unlocked!</span>
                    ) : (
                      <span>Add <strong className="text-accent">₹{remainingForFreeShipping}</strong> more for FREE Delivery</span>
                    )}
                  </span>
                  <span className="text-muted-foreground">{progressPercent}%</span>
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

            {/* Cart Items */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center p-6">
                  <ShoppingCartIcon size={48} className="mb-4 opacity-40 text-accent" />
                  <p className="text-base font-bold text-white mb-1">Your cart is empty</p>
                  <p className="text-xs text-muted-foreground mb-6">Looks like you have not added any gear yet.</p>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-accent hover:bg-accent/90 text-white font-bold uppercase text-xs tracking-wider rounded-xl px-6"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-3 sm:gap-4 bg-background border border-border/80 p-3 rounded-xl shadow-sm">
                    <img src={item.product.image} alt={item.product.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-border shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{item.product.title}</h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{item.variant.title}</p>
                      <p className="text-xs sm:text-sm text-accent font-black mt-1">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center border border-border rounded-lg bg-card">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 flex items-center justify-center text-white hover:text-accent active:scale-90"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center text-white hover:text-accent active:scale-90"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variant.id)}
                        className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors pt-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-border bg-card pb-safe">
                <div className="flex justify-between items-center mb-4 text-card-foreground">
                  <div>
                    <span className="text-xs sm:text-sm text-muted-foreground block">Estimated Subtotal</span>
                    <span className="text-xs text-white/50">Taxes & shipping calculated at checkout</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-accent">{getCartTotal()}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-black py-6 text-base tracking-wider uppercase rounded-xl shadow-lg shadow-accent/25 transition-all duration-200 active:scale-95"
                >
                  Proceed to Checkout →
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