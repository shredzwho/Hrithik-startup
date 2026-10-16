import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Loader2, CheckCircle } from 'lucide-react';
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
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/64d2f3751498e17703be6c6d3a5616d6.png"
                alt="StrongBuild logo"
                className="h-[40px] w-auto"
              />
              <span className="text-xl font-black tracking-tight text-white">
                STRONGBUILD
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium powerlifting equipment engineered for strength, pride, and honour. Built by lifters, for lifters.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/strongbuild.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.youtube.com/@strongbuild.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors" aria-label="YouTube"><Youtube className="h-5 w-5" /></a>
              <a href="https://www.facebook.com/strongbuild.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-sm text-muted-foreground hover:text-accent transition-colors">Shop All Gear</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">Training Blog</Link></li>
              <li><Link to="/athlete-sponsorship" className="text-sm text-muted-foreground hover:text-accent transition-colors">Athlete Sponsorship</Link></li>
              <li><Link to="/affiliate" className="text-sm text-muted-foreground hover:text-accent transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-accent transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="text-sm text-muted-foreground hover:text-accent transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/track-order" className="text-sm text-muted-foreground hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6">Join The Ranks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get exclusive offers, lifting tips, and early access to new drops.
            </p>
            {done ? (
              <div className="flex items-center gap-2 text-accent text-sm font-bold">
                <CheckCircle className="h-5 w-5" /> You are on the list.
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-secondary border-white/10 text-white focus-visible:ring-accent"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-white font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</> : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} STRONGBUILD. All rights reserved. Strength · Pride · Honour.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
