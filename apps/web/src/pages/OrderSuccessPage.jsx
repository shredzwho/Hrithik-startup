import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { trackPurchase } from '@/lib/metaPixel.js';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get('order_id') || searchParams.get('order_number') || searchParams.get('cart_id') || '';
  const totalAmount = parseFloat(searchParams.get('total') || searchParams.get('amount') || '0') || 0;

  useEffect(() => {
    // Safely clear shopping cart now that order has completed
    clearCart();

    // Fire Meta Pixel Purchase event with deduplication
    if (orderNumber) {
      trackPurchase({
        orderId: orderNumber,
        totalValue: totalAmount || 2999, // Fallback default value if not passed in query params
        currency: 'INR',
      });
    }
  }, [clearCart, orderNumber, totalAmount]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | STRONGBUILD Competition Division</title>
        <meta name="description" content="Thank you for your order with STRONGBUILD India. Your powerlifting gear is being prepared for priority dispatch." />
      </Helmet>

      <div className="min-h-[85vh] pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-black flex items-center justify-center">
        <div className="max-w-2xl w-full luxury-card p-6 sm:p-10 rounded-3xl border border-white/15 text-center relative overflow-hidden shadow-2xl">
          
          <div className="h-20 w-20 sm:h-24 sm:w-24 bg-accent/20 border-2 border-accent/40 rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-xl shadow-accent/25">
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>

          <span className="font-steelfish text-base uppercase tracking-widest text-accent font-bold">
            Order Confirmed &amp; Payment Verified
          </span>
          <h1 className="font-steelfish text-5xl sm:text-6xl md:text-7xl font-bold uppercase text-white tracking-tight mt-1 mb-3">
            WELCOME TO THE RANKS
          </h1>
          <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto mb-8 font-sans leading-relaxed">
            Thank you for trusting STRONGBUILD. Your competition-grade equipment is now queued for priority dispatch from our Pune fulfilment facility.
          </p>

          {orderNumber && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md mx-auto mb-8">
              <span className="text-xs uppercase text-white/50 tracking-widest block mb-1 font-steelfish text-sm">
                Official Order Reference ID
              </span>
              <span className="font-mono text-base font-bold text-accent tracking-wider">
                #{orderNumber.toUpperCase()}
              </span>
            </div>
          )}

          {/* Next Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left mb-10">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <Package className="h-5 w-5 text-accent mb-2" />
              <h4 className="font-steelfish text-base uppercase tracking-wider text-white font-bold">Priority Dispatch</h4>
              <p className="text-[11px] text-white/50 mt-1 font-sans">Orders before 4PM IST leave our facility today.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <Truck className="h-5 w-5 text-brand-blue mb-2" />
              <h4 className="font-steelfish text-base uppercase tracking-wider text-white font-bold">2–3 Days Delivery</h4>
              <p className="text-[11px] text-white/50 mt-1 font-sans">Express air courier across metro cities in India.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-accent mb-2" />
              <h4 className="font-steelfish text-base uppercase tracking-wider text-white font-bold">2-Year Warranty</h4>
              <p className="text-[11px] text-white/50 mt-1 font-sans">Lever hardware & quad stitching coverage.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-steelfish text-xl tracking-wider uppercase px-8 py-6 rounded-xl shadow-lg shadow-accent/25">
                <ShoppingBag className="h-4 w-4 mr-2" /> Explore More Gear
              </Button>
            </Link>
            <Link to="/track-order" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-steelfish text-xl tracking-wider uppercase px-8 py-6 rounded-xl">
                Track Shipment <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/50 mt-8 font-sans">
            Need urgent sizing support, address updates, or custom embroidery? Chat on WhatsApp:{' '}
            <a href="https://wa.me/918317339439" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline">
              +91 83173 39439
            </a>
          </p>

        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
