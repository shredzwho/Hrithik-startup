import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Loader2, CheckCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create({ email, source: 'footer' }, { $autoCancel: false });
      setDone(true);
      toast.success('Subscribed. Welcome to the ranks.');
      setEmail('');
    } catch (err) {
      const msg = err?.response?.data?.email?.message || 'Could not subscribe. You may already be on the list.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Proof Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-white/10 mb-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-steelfish text-lg tracking-wide uppercase text-white font-bold">2-Year Break-Free Warranty</h4>
              <p className="text-xs text-white/50">Covers lever hardware & heavy-duty industrial stitching</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h4 className="font-steelfish text-lg tracking-wide uppercase text-white font-bold">Same-Day Priority Dispatch</h4>
              <p className="text-xs text-white/50">Dispatched within 24h via Express Air across India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-steelfish text-lg tracking-wide uppercase text-white font-bold">Hassle-Free 30-Day Exchanges</h4>
              <p className="text-xs text-white/50">Sizing exchange guarantee on belts and wraps</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/64d2f3751498e17703be6c6d3a5616d6.png"
                alt="StrongBuild logo"
                className="h-[44px] w-auto drop-shadow-[0_2px_10px_rgba(255,30,39,0.3)]"
              />
              <span className="font-steelfish text-2xl tracking-wider uppercase font-bold text-white">
                STRONGBUILD<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              India&apos;s competition-grade powerlifting gear brand. Engineered with 100% full-grain leather, stainless steel lever buckles, and IPF dimensional compliance. Built by lifters, for lifters.
            </p>
            <div className="flex gap-4 pt-1">
              <a href="https://www.instagram.com/strongbuild.in" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-accent hover:bg-accent/20 transition-all" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
              <a href="https://www.youtube.com/@strongbuild.in" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-accent hover:bg-accent/20 transition-all" aria-label="YouTube"><Youtube className="h-4 w-4" /></a>
              <a href="https://www.facebook.com/strongbuild.in" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-accent hover:bg-accent/20 transition-all" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-steelfish text-xl tracking-wider uppercase text-white mb-5 font-bold">The Arsenal</h3>
            <ul className="space-y-3 font-medium text-xs sm:text-sm">
              <li><Link to="/shop" className="text-muted-foreground hover:text-accent transition-colors">All Competition Gear</Link></li>
              <li><Link to="/shop?q=13mm" className="text-muted-foreground hover:text-accent transition-colors">13mm Heavy Lever Belts</Link></li>
              <li><Link to="/shop?q=10mm" className="text-muted-foreground hover:text-accent transition-colors">10mm Everyday Lever Belts</Link></li>
              <li><Link to="/shop?q=wrap" className="text-muted-foreground hover:text-accent transition-colors">Competition Wrist Wraps</Link></li>
              <li><Link to="/shop?q=bundle" className="text-muted-foreground hover:text-accent transition-colors">Discounted Power Bundles</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-accent transition-colors">Platform Journal & Guides</Link></li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h3 className="font-steelfish text-xl tracking-wider uppercase text-white mb-5 font-bold">Athlete Support</h3>
            <ul className="space-y-3 font-medium text-xs sm:text-sm">
              <li><Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-accent transition-colors">Sizing & Order FAQ</Link></li>
              <li><Link to="/shipping-policy" className="text-muted-foreground hover:text-accent transition-colors">Shipping & Delivery Times</Link></li>
              <li><Link to="/return-policy" className="text-muted-foreground hover:text-accent transition-colors">Exchange & Return Policy</Link></li>
              <li><Link to="/track-order" className="text-muted-foreground hover:text-accent transition-colors">Track Active Order</Link></li>
              <li>
                <a href="https://wa.me/918317339439" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:underline">
                  WhatsApp: +91 83173 39439
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-steelfish text-xl tracking-wider uppercase text-white mb-5 font-bold">Join The Division</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
              Unlock exclusive Meta VIP drops, meet discounts, and technique guides from national athletes.
            </p>
            {done ? (
              <div className="flex items-center gap-2 text-accent text-sm font-bold bg-accent/15 border border-accent/30 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" /> You are now registered in the ranks.
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-secondary/70 border-white/10 text-white focus-visible:ring-accent rounded-xl text-xs py-5"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-white font-steelfish text-lg tracking-wider uppercase rounded-xl py-5 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</> : 'Subscribe for VIP Perks'}
                </Button>
              </form>
            )}
            
            {/* Payment Trust Badges */}
            <div className="pt-5 mt-5 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-2">100% Secure Checkout</span>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/70 font-mono">
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">UPI</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">GPay</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">PhonePe</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Razorpay</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">RuPay</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Cards / EMI</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} STRONGBUILD. All rights reserved. Built for the Platform · Strength · Pride · Honour.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
