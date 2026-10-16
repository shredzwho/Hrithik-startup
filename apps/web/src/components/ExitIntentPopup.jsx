import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Loader2, CheckCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const STORAGE_KEY = 'sb_exit_popup_seen';
const SESSION_KEY = 'sb_exit_popup_session';

const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    // Respect users who already subscribed or dismissed recently
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch (_) { /* ignore */ }

    const trigger = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setOpen(true);
    };

    const pageMountTime = Date.now();

    // Desktop: exit intent when cursor leaves through the top of the viewport
    const handleMouseOut = (e) => {
      if (e.relatedTarget === null && e.clientY <= 0) trigger();
    };

    // Mobile: trigger only after user has browsed for at least 25s and then scrolls back up
    let mobileTriggered = false;
    const handleScroll = () => {
      if (mobileTriggered) return;
      if (Date.now() - pageMountTime < 25000) return; // Must have browsed at least 25 seconds
      
      const scrolled = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      if (pct > 0.4 && pct < 0.7) {
        mobileTriggered = true;
        setTimeout(trigger, 800);
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
      // Don't permanently dismiss on a simple close — only on subscribe
    } catch (_) { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create(
        { email, source: 'exit-intent-10off' },
        { $autoCancel: false },
      );
      setDone(true);
      toast.success('Code unlocked: Use STRONGBUILD10 at checkout.');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) { /* ignore */ }
      setEmail('');
      // Give enough time for lifter to copy the discount code
      setTimeout(() => setOpen(false), 9000);
    } catch (err) {
      const msg = err?.response?.data?.email?.message || 'Could not subscribe. You may already be on the list.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-7 md:p-9 text-center">
              <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                <Gift className="h-7 w-7 text-accent" />
              </div>

              {done ? (
                <div className="py-4">
                  <CheckCircle className="h-10 w-10 text-accent mx-auto mb-3" />
                  <h3 className="font-steelfish text-3xl font-bold uppercase text-white tracking-wide mb-2">YOU'RE IN THE SQUAD.</h3>
                  <p className="text-white/70 text-xs sm:text-sm mb-4 font-sans">
                    Here is your exclusive <span className="text-accent font-bold">10% OFF</span> code for your order:
                  </p>
                  <div className="flex items-center justify-between bg-black border border-accent/50 rounded-xl p-3 mb-4 max-w-xs mx-auto">
                    <span className="font-mono text-lg font-black tracking-widest text-accent">STRONG10</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('STRONG10');
                        setCopied(true);
                        toast.success('Discount code copied to clipboard!');
                        setTimeout(() => setCopied(false), 2500);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold uppercase rounded-lg transition-colors font-sans"
                    >
                      {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/50 font-sans">
                    Use code at checkout for 10% off your competition gear.
                  </p>
                </div>
              ) : (
                <>
                  <span className="font-steelfish text-sm uppercase tracking-widest text-accent font-bold">Before You Step Off the Platform</span>
                  <h3 className="font-steelfish text-3xl md:text-4xl font-bold uppercase text-white tracking-wide mt-1 mb-2">
                    GET 10% OFF YOUR FIRST GEAR
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-6 max-w-sm mx-auto font-sans leading-relaxed">
                    Join over 5,000+ lifters. Get instant 10% off on your first order plus priority dispatch access.
                  </p>
                  <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-white text-center text-xs sm:text-sm font-sans"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-steelfish text-xl tracking-wider uppercase rounded-xl py-5 flex items-center justify-center gap-2 shadow-lg shadow-accent/30"
                    >
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Unlocking...</> : 'UNLOCK MY 10% OFF'}
                    </Button>
                  </form>
                  <button onClick={close} className="mt-4 text-[11px] text-white/40 hover:text-white transition-colors font-sans">
                    No thanks, I'll pay full price
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
