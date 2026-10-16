import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get('order_id') || searchParams.get('order_number') || searchParams.get('cart_id') || '';

  useEffect(() => {
    // Safely clear shopping cart now that order has completed
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | STRONGBUILD</title>
        <meta name="description" content="Thank you for your order with STRONGBUILD India. Your powerlifting gear is being prepared for dispatch." />
      </Helmet>

      <div className="min-h-[85vh] pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background flex items-center justify-center">
        <div className="max-w-2xl w-full luxury-card p-6 sm:p-10 rounded-2xl border border-white/10 text-center relative overflow-hidden">
          
          <div className="h-20 w-20 sm:h-24 sm:w-24 bg-accent/20 border-2 border-accent/40 rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-lg shadow-accent/20">
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>

          <span className="section-eyebrow text-accent">Order Confirmed</span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-2 mb-3">
            Welcome to the Ranks
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8">
            Thank you for trusting STRONGBUILD. Your competition-grade gear is now in the queue for priority dispatch from our Pune fulfilment facility.
          </p>

          {orderNumber && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-md mx-auto mb-8">
              <span className="text-xs uppercase text-muted-foreground tracking-widest block mb-1">Reference ID</span>
              <span className="font-mono text-base font-bold text-white tracking-wider">#{orderNumber.toUpperCase()}</span>
            </div>
          )}

          {/* Next Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-10">
            <div className="bg-secondary/40 border border-white/5 p-4 rounded-xl">
              <Package className="h-5 w-5 text-accent mb-2" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Dispatched Same-Day</h4>
              <p className="text-[11px] text-muted-foreground mt-1">Orders before 4pm IST leave our warehouse today.</p>
            </div>
            <div className="bg-secondary/40 border border-white/5 p-4 rounded-xl">
              <Truck className="h-5 w-5 text-accent mb-2" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">2–3 Days Delivery</h4>
              <p className="text-[11px] text-muted-foreground mt-1">Express air courier across metro cities in India.</p>
            </div>
            <div className="bg-secondary/40 border border-white/5 p-4 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-accent mb-2" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">2-Year Warranty</h4>
              <p className="text-[11px] text-muted-foreground mt-1">Comprehensive stitching and lever hardware coverage.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold tracking-widest uppercase px-8 py-6 rounded-xl text-xs sm:text-sm">
                <ShoppingBag className="h-4 w-4 mr-2" /> Explore More Gear
              </Button>
            </Link>
            <Link to="/track-order" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white font-bold tracking-widest uppercase px-8 py-6 rounded-xl text-xs sm:text-sm">
                Track Order <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            Need help with sizing, address updates or custom embroidery? Message us on WhatsApp: <a href="https://wa.me/918317339439" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline">+91 83173 39439</a>
          </p>

        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
