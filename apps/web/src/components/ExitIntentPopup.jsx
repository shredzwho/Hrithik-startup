import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Loader2, CheckCircle } from 'lucide-react';
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

    // Desktop: exit intent when cursor leaves through the top of the viewport
    const handleMouseOut = (e) => {
      if (e.relatedTarget === null && e.clientY <= 0) trigger();
    };

    // Mobile: trigger after user scrolls back up past 40% of the page
    let mobileTriggered = false;
    const handleScroll = () => {
      if (mobileTriggered) return;
      const scrolled = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      if (pct > 0.4 && pct < 0.7) {
        mobileTriggered = true;
        // small delay so it doesn't feel jumpy
        setTimeout(trigger, 600);
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
      toast.success('Code unlocked — check your inbox for 10% off.');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) { /* ignore */ }
      setEmail('');
      // Auto close after showing success
      setTimeout(() => setOpen(false), 2600);
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
                <div className="py-6">
                  <CheckCircle className="h-10 w-10 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-2">You're in.</h3>
                  <p className="text-muted-foreground text-sm">
                    Your <span className="text-accent font-bold">10% off</span> code is on its way to your inbox. Use it on your first order.
                  </p>
                </div>
              ) : (
                <>
                  <span className="section-eyebrow">Before you go</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mt-2 mb-3 heading-balance">
                    Get 10% Off Your First Belt
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Drop your email and we'll send a 10% off code plus meet-day training guides. No spam — just strength.
                  </p>
                  <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 text-white text-center"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest rounded-xl py-3 flex items-center justify-center gap-2"
                    >
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Unlocking...</> : 'Unlock My 10% Off'}
                    </Button>
                  </form>
                  <button onClick={close} className="mt-4 text-xs text-muted-foreground hover:text-white/70 transition-colors">
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
