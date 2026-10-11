import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Award, Star, Instagram, Quote, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard, LoadingSpinner } from '@/components/SharedComponents.jsx';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';
import { getProducts } from '@/api/EcommerceApi.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
const HERO_IMG = 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260721-wa0000-92ziE.jpg';
const CATEGORIES = [{
  name: 'Lever Belts',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/screenshot_2026-08-01-00-27-21-00_92460851df6f172a4592fca41cc2d2e6-wJ3SA.jpg'
}, {
  name: 'Wrist Wraps',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260719-wa0007-3P5Ed.jpg'
}, {
  name: 'Figure-8 Straps',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260719-wa0009-AJ4eU.jpg'
}, {
  name: 'Liquid Chalk',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/file_00000000aed071fa80dbc741c3f65896-8Wjsm.png'
}, {
  name: 'Chalk Powder',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/file_00000000db407209ab7c0ca58d719c51-Oc6WC.png'
}, {
  name: 'Smelling Salts',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260723-wa0018-Yes2g.jpg'
}, {
  name: 'Singlets',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260721-wa0000-CoA3D.jpg'
}, {
  name: 'Oversized T-Shirts',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260719-wa0010-1-zHsf0.jpg'
}, {
  name: 'Lever Belt Bags',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260820-wa0002-iGoxO.jpg'
}, {
  name: 'Bundles',
  img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260904-wa0017-IRgvo.jpg'
}];
const BADGES = [{
  icon: Award,
  title: 'Premium Quality',
  desc: 'Competition-grade builds'
}, {
  icon: ShieldCheck,
  title: 'Secure Payments',
  desc: 'Razorpay, UPI & cards'
}, {
  icon: Truck,
  title: 'Fast Shipping',
  desc: 'Dispatched within 24h'
}, {
  icon: Star,
  title: 'Athlete Tested',
  desc: 'Proven on the platform'
}];
const REVIEWS = [{
  name: 'Rohit Deshmukh',
  city: 'Pune',
  text: 'The 13mm lever belt held through a 250kg pull. Stitching and leather quality beat anything I have used in India.'
}, {
  name: 'Anjali Nair',
  city: 'Kochi',
  text: 'Wrist wraps are stiff exactly where they need to be. Passed IPF-style kit check at state meet without a question.'
}, {
  name: 'Karan Sethi',
  city: 'Delhi',
  text: 'Liquid chalk dries fast and lasts a full squat session. Shipping took two days flat.'
}];
const TESTIMONIALS = [{
  name: 'Vikram Rathore',
  title: 'National Champion, 93kg',
  img: 'https://images.hostinger.com/f5e84d34-696a-498b-a01c-91f8a56510b5.png',
  quote: 'STRONGBUILD gear travels with me to every meet. It never gives up before I do.'
}, {
  name: 'Meera Shah',
  title: 'State Record Holder, 63kg',
  img: 'https://images.hostinger.com/ead2b984-f9a5-4df5-9dbb-5c8eb28994a9.png',
  quote: 'Finally an Indian brand that builds for competition standards, not just for the gym floor.'
}];
const FAQS = [{
  q: 'Is the lever belt IPF approved in dimensions?',
  a: 'Our 10mm and 13mm lever belts are built to 10cm width and standard thickness used in tested federations across India.'
}, {
  q: 'How fast do you ship?',
  a: 'Orders placed before 4pm IST are dispatched the same working day. Metro delivery typically lands in 2-3 days.'
}, {
  q: 'Do you offer bundle discounts?',
  a: 'Yes. Belt + wraps + chalk bundles are priced below the sum of individual items, and Frequently Bought Together adds an extra saving at checkout.'
}, {
  q: 'What is the warranty?',
  a: 'Every belt carries a 2-year stitching and hardware warranty. Wraps and straps are covered for 6 months against manufacturing defects.'
}];
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);
  useEffect(() => {
    getProducts({
      limit: 8
    }).then(res => setFeaturedProducts(res.products)).catch(console.error).finally(() => setLoading(false));
  }, []);
  const handleNewsletter = async e => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create({
        email: newsletterEmail,
        source: 'homepage'
      }, {
        $autoCancel: false
      });
      setNewsletterDone(true);
      toast.success('Subscribed. Welcome to the ranks.');
      setNewsletterEmail('');
    } catch (err) {
      const msg = err?.response?.data?.email?.message || 'Could not subscribe. You may already be on the list.';
      toast.error(msg);
    } finally {
      setNewsletterLoading(false);
    }
  };
  const newArrivals = featuredProducts.slice(4, 8).length ? featuredProducts.slice(4, 8) : featuredProducts.slice(0, 4);
  return <>
      <Helmet>
        <title>STRONGBUILD | India&apos;s Premium Powerlifting Gear</title>
        <meta name="description" content="Competition-grade lever belts, wrist wraps, figure-8 straps, chalk and singlets built in India for powerlifters, bodybuilders and strength athletes." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 z-10" />
          <img src={HERO_IMG} alt="Powerlifter preparing for a heavy deadlift" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          ease: 'easeOut'
        }}>
            <span className="inline-flex items-center gap-2 mb-5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Launch Offer — 10% off your first order
            </span>
            <span className="section-eyebrow">Strength · Pride · Honour</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white heading-balance mb-3 sm:mb-5 mt-2 sm:mt-3">
              Built for Max<br className="hidden sm:block" /> Squats &amp; Deadlifts
            </h1>
            <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-2 sm:mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-500 font-black uppercase tracking-widest text-xs sm:text-sm md:text-base">India&apos;s Premium Powerlifting Gear</span>
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-xl mx-auto mb-6 sm:mb-10">
              Competition-ready 13mm lever belts, wrist wraps, figure-8 straps and chalk — engineered for lifters who train to break records, not to look the part.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/shop">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-11 sm:h-12 w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold tracking-widest uppercase px-8 sm:px-10 py-5 sm:py-6 rounded-xl text-sm sm:text-base active:scale-[0.98] transition-transform">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" /> Shop Now
                </button>
              </Link>
              <a href="#bundles" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto glass-panel border-white/20 text-white hover:bg-white hover:text-black font-bold tracking-widest uppercase px-8 sm:px-10 py-5 sm:py-6 rounded-xl text-sm sm:text-base transition-colors h-11 sm:h-12">
                  View Bundles
                </Button>
              </a>
            </div>
            <p className="text-[11px] sm:text-xs text-white/50 mt-4 sm:mt-6 uppercase tracking-wider">Free shipping over ₹1,499 · 30-day returns · 2-year warranty</p>
          </motion.div>
        </div>
      </section>

      {/* Trust badges - Optimized mobile density */}
      <section className="border-y border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
          {BADGES.map(b => (
            <div key={b.title} className="flex items-center gap-3 sm:gap-4 px-3.5 sm:px-6 py-4 sm:py-8">
              <b.icon className="h-5 w-5 sm:h-7 sm:w-7 text-brand-blue shrink-0" strokeWidth={1.6} />
              <div className="min-w-0">
                <p className="font-bold uppercase text-xs sm:text-sm tracking-wider text-white truncate">{b.title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Shop By Category Rail (Thumb-friendly mobile carousel) */}
      <section className="py-10 sm:py-16 bg-[#030303] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="section-eyebrow">Explore Collections</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight mt-1">Shop by Category</h2>
            </div>
            <Link to="/shop" className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider hover:underline flex items-center gap-1">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {CATEGORIES.slice(0, 6).map((c, i) => (
              <Link key={i} to="/shop" className="group flex flex-col items-center text-center">
                <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 group-hover:border-accent bg-secondary/40 relative shadow-sm transition-all duration-300">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 opacity-80 group-hover:opacity-100 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 inset-x-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white line-clamp-1 drop-shadow-md">
                    {c.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle offer */}
      <section id="bundles" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <img src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260904-wa0014-YfNIT.jpg" alt="Powerlifting kit bag with belt and wraps" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="relative p-8 md:p-16 max-w-xl">
              <span className="section-eyebrow">Bundle &amp; save</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mt-2 mb-4">The Meet Day Kit</h2>
              <p className="text-white/70 mb-8">Lever belt, wrist wraps, figure-8 straps and liquid chalk in one kit — priced up to 20% below buying separately, shipped in a STRONGBUILD belt bag.</p>
              <Link to="https://strongbuild.shop/product/prod_01M1EP7XEWJQ1JX6HJJH7YJNTT">
                <Button className="bg-accent hover:bg-accent/90 text-white font-bold tracking-widest uppercase px-8 py-6 rounded-xl">Shop Bundles</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-20 border-y border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="section-eyebrow">Fresh drops</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mt-2">New Arrivals</h2>
            </div>
          </div>
          {loading ? <LoadingSpinner /> : <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-eyebrow">Customer reviews</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mt-2 mb-10">Rated by lifters, not marketers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map(r => <div key={r.name} className="glass-panel rounded-2xl p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({
                length: 5
              }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current text-accent" />)}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">{r.text}</p>
                <p className="text-sm font-bold uppercase tracking-wider text-white">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Athlete testimonials */}
      <section className="py-24 bg-[#070707] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(t => <div key={t.name} className="relative overflow-hidden rounded-3xl border border-white/10 min-h-[380px] flex items-end">
              <img src={t.img} alt={t.name} className="absolute inset-0 h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative p-8">
                <Quote className="h-7 w-7 text-accent mb-4" />
                <p className="text-lg text-white/90 mb-6 leading-relaxed">{t.quote}</p>
                <p className="font-bold uppercase tracking-wider text-white text-sm">{t.name}</p>
                <p className="text-xs text-brand-blue">{t.title}</p>
              </div>
            </div>)}
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 bg-[#070707] border-y border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">Follow the grind</h2>
          <a href="https://www.instagram.com/strongbuild.shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm">
            <Instagram className="h-4 w-4" /> @strongbuild.shop
          </a>
        </div>
        <div className="marquee-track gap-3">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => <img key={i} src={c.img} alt="STRONGBUILD Instagram post" className="h-40 w-40 object-cover rounded-xl border border-white/10 opacity-70 hover:opacity-100 transition-opacity" />)}
        </div>
      </section>

      {/* Recently viewed */}
      <RecentlyViewed title="Recently Viewed" />

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <span className="section-eyebrow">Answers</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mt-2 mb-10">Before you buy</h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((f, i) => <div key={f.q}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left">
                  <span className="font-semibold text-white">{f.q}</span>
                  {openFaq === i ? <Minus className="h-4 w-4 text-accent shrink-0" /> : <Plus className="h-4 w-4 text-brand-blue shrink-0" />}
                </button>
                {openFaq === i && <p className="text-muted-foreground pb-6 leading-relaxed">{f.a}</p>}
              </div>)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-panel rounded-3xl p-8 md:p-14 text-center">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-3">Join the ranks</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Early access to drops, meet-day guides and subscriber-only bundle pricing.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleNewsletter}>
              <input type="email" required placeholder="you@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-white" />
              <Button type="submit" disabled={newsletterLoading} className="bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest rounded-xl px-8 py-3">{newsletterLoading ? 'Subscribing...' : newsletterDone ? 'Subscribed' : 'Subscribe'}</Button>
            </form>
          </div>
        </div>
      </section>
    </>;
};
export default HomePage;