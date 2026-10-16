import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Truck, Award, Star, Instagram, Quote, Plus, Minus, 
  CheckCircle2, Zap, Flame, Lock, ChevronRight, HelpCircle, ShoppingBag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard, LoadingSpinner, TrustBadges } from '@/components/SharedComponents.jsx';
import RecentlyViewed from '@/components/RecentlyViewed.jsx';
import { getProducts } from '@/api/EcommerceApi.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const HERO_IMG = 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260721-wa0000-92ziE.jpg';

const CATEGORIES = [
  {
    name: '13mm Lever Belts',
    desc: 'Heavy Platform Support',
    tag: 'IPF Compliant',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/screenshot_2026-08-01-00-27-21-00_92460851df6f172a4592fca41cc2d2e6-wJ3SA.jpg',
    url: '/shop?q=13mm',
  },
  {
    name: '10mm Lever Belts',
    desc: 'Versatile Daily Lifting',
    tag: 'Best Seller',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260721-wa0000-CoA3D.jpg',
    url: '/shop?q=10mm',
  },
  {
    name: 'Competition Wrist Wraps',
    desc: 'Stiff & Flex Bench Support',
    tag: 'Zero Wrist Bend',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260719-wa0007-3P5Ed.jpg',
    url: '/shop?q=wrap',
  },
  {
    name: 'Figure-8 Deadlift Straps',
    desc: 'Locked Overhand Grip',
    tag: 'Heavy Pulls',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260719-wa0009-AJ4eU.jpg',
    url: '/shop?q=figure-8',
  },
  {
    name: 'Pure Liquid Chalk',
    desc: 'Fast-Drying Grip',
    tag: 'Zero Residue',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/file_00000000aed071fa80dbc741c3f65896-8Wjsm.png',
    url: '/shop?q=chalk',
  },
  {
    name: 'Full Meet Day Kits',
    desc: 'Belt + Wraps + Bag',
    tag: 'Save Up to 30%',
    img: 'https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260904-wa0017-IRgvo.jpg',
    url: '/shop?q=kit',
  },
];

const REVIEWS = [
  {
    name: 'Rohit Deshmukh',
    city: 'Pune, Maharashtra',
    pr: '260kg Deadlift PR',
    text: 'The 13mm lever belt locked in through my 260kg pull. Zero slip, zero pin play. The stainless steel lever and quad stitching beat imported belts costing triple.',
    stars: 5,
  },
  {
    name: 'Anjali Nair',
    city: 'Kochi, Kerala',
    pr: 'State Record Bench',
    text: 'Wrist wraps are brutally stiff — exactly what you need on heavy singles. Passed kit check at the state meet without any issue. Shipped in 2 days.',
    stars: 5,
  },
  {
    name: 'Karan Sethi',
    city: 'Delhi NCR',
    pr: '230kg Squat PR',
    text: 'Liquid chalk dries in 10 seconds and sticks for the entire set. Belt sizing was spot-on thanks to their navel measurement guide.',
    stars: 5,
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Core Material',
    generic: 'Bonded leather / cardboard core that splits',
    strongbuild: '100% Solid High-Density Steerhide Leather',
  },
  {
    feature: 'Lever Buckle Hardware',
    generic: 'Cheap zinc diecast prone to snapping on heavy squats',
    strongbuild: 'Cast Stainless Steel Levers with 2-Year Replacement Warranty',
  },
  {
    feature: 'Platform Dimension Compliance',
    generic: 'Inconsistent width & illegal contour tapering',
    strongbuild: 'Strict 10cm Uniform Width & 10mm / 13mm IPF Spec',
  },
  {
    feature: 'Stitching Reinforcement',
    generic: 'Single row standard nylon threads',
    strongbuild: '6-Row Heavy Bonded Industrial Tensile Stitching',
  },
  {
    feature: 'Shipping & Replacement',
    generic: 'Slow 10-15 day transit with no size exchange',
    strongbuild: 'Same-Day Dispatch (Before 4PM) + 30-Day Free Sizing Exchanges',
  },
];

const FAQS = [
  {
    q: 'How do I choose between a 10mm and 13mm lever belt?',
    a: 'The 10mm belt is pliable faster, excellent for both squats and deadlifts, and best for lifters under 85kg or everyday training. The 13mm belt provides the maximum possible intra-abdominal bracing for heavy competitive lifters who want uncompromising rigidity on max attempts.',
  },
  {
    q: 'How do I select the right size belt?',
    a: 'Do NOT use your pant size! Take a flexible measuring tape and measure firmly around your navel (belly button) while bracing slightly. Refer to our Sizing Chart. If between sizes, choose the smaller size so you can tighten it.',
  },
  {
    q: 'How fast do you dispatch and deliver?',
    a: 'Orders placed before 4:00 PM IST are dispatched on the same working day from our Pune fulfilment facility. Express Air delivery typically arrives in 2–3 days for metro cities, and 3–5 days across the rest of India.',
  },
  {
    q: 'What is your 2-Year Warranty and Return Policy?',
    a: 'Every STRONGBUILD belt comes with an unconditional 2-year warranty covering the lever mechanism and stitching. We also offer 30-day hassle-free sizing exchanges so you are guaranteed a perfect fit.',
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then((res) => setFeaturedProducts(res.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create({
        email: newsletterEmail,
        source: 'homepage_revamp',
      }, { $autoCancel: false });
      setNewsletterDone(true);
      toast.success('Subscribed! Check your inbox for the VIP welcome perk.');
      setNewsletterEmail('');
    } catch (err) {
      toast.error('Could not subscribe. You may already be registered!');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>STRONGBUILD | Competition-Grade Powerlifting Gear India</title>
        <meta 
          name="description" 
          content="India's leading powerlifting brand. Competition-spec 13mm & 10mm lever belts, stiff wrist wraps, figure-8 straps, liquid chalk, and meet gear. Same-day dispatch, 2-year warranty, free shipping over ₹1,499." 
        />
      </Helmet>

      {/* 1. HIGH-IMPACT HERO SECTION */}
      <section className="relative min-h-[95dvh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-black">
        {/* Athletic Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
          <div className="absolute inset-0 bg-radial-gradient from-accent/15 via-transparent to-transparent z-10 pointer-events-none" />
          <img 
            src={HERO_IMG} 
            alt="Powerlifter bracing for max squat in STRONGBUILD lever belt" 
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125" 
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-accent/60 bg-accent/15 px-3.5 py-1 text-xs md:text-sm font-steelfish uppercase tracking-wider text-white shadow-lg shadow-accent/20">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <Flame className="h-3.5 w-3.5 text-accent fill-accent" />
              <span>OFFICIAL META LAUNCH: USE CODE <strong className="text-white underline font-mono">STRONG10</strong> FOR 10% OFF</span>
            </div>

            {/* Steelfish Hero Typography */}
            <h1 className="font-steelfish text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-wide text-white leading-[0.92] mb-4">
              BUILT FOR THE PLATFORM.<br />
              <span className="text-accent drop-shadow-[0_4px_30px_rgba(255,30,39,0.5)]">
                TESTED UNDER MAX LOADS.
              </span>
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-3 font-medium font-sans">
              Competition-grade 13mm & 10mm lever belts, indestructible wrist wraps, figure-8 straps & liquid chalk — engineered in India for lifters who compete to win.
            </p>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/70 mb-8 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-blue" /> IPF Dimensional Spec</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Solid Steel Levers</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand-blue" /> 2-Year Unconditional Warranty</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Same-Day Dispatch</span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center max-w-md sm:max-w-none mx-auto">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-steelfish text-xl tracking-wider uppercase px-10 py-7 rounded-xl shadow-xl shadow-accent/35 active:scale-95 transition-all">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  SHOP BEST SELLERS
                </Button>
              </Link>
              <Link to="/shop?q=13mm" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto bg-black/50 backdrop-blur-md border-white/25 hover:border-brand-blue hover:text-brand-blue text-white font-steelfish text-xl tracking-wider uppercase px-10 py-7 rounded-xl transition-all">
                  EXPLORE 13MM LEVER BELTS <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>

            <p className="text-[11px] sm:text-xs text-white/50 mt-5 uppercase tracking-wider font-sans">
              Free Express Shipping on Orders Over ₹1,499 · 30-Day Hassle-Free Sizing Exchanges
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST STATS STRIP */}
      <TrustBadges />

      {/* 3. VISUAL CATEGORY EXPLORER GRID */}
      <section className="py-14 sm:py-20 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <span className="font-steelfish text-base sm:text-lg uppercase tracking-widest text-brand-blue font-bold flex items-center gap-2">
                <Zap className="h-4 w-4" /> The Powerlifting Arsenal
              </span>
              <h2 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight mt-1">
                SHOP BY DISCIPLINE &amp; CATEGORY
              </h2>
            </div>
            <Link to="/shop" className="font-steelfish text-lg sm:text-xl font-bold text-accent uppercase tracking-wider hover:underline flex items-center gap-1">
              View All 15+ Gear Items →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={i} 
                to={cat.url} 
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#121212] hover:border-accent transition-all duration-300 shadow-md active:scale-95"
              >
                <div className="aspect-[4/5] w-full overflow-hidden relative">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 opacity-75 group-hover:opacity-100 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-accent px-2 py-0.5 rounded">
                    {cat.tag}
                  </span>
                </div>
                <div className="p-3 bg-gradient-to-b from-[#141414] to-[#0A0A0A] flex flex-col justify-between flex-grow">
                  <h3 className="font-steelfish text-lg sm:text-xl uppercase text-white tracking-wide group-hover:text-accent font-bold line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-white/50 font-sans mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST-SELLERS SHOWCASE */}
      <section className="py-16 sm:py-24 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-3">
            <div>
              <span className="font-steelfish text-base sm:text-lg uppercase tracking-widest text-accent font-bold flex items-center gap-1.5">
                <Flame className="h-4 w-4 fill-accent" /> High Conversion Favorites
              </span>
              <h2 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight mt-1">
                BEST-SELLING POWERLIFTING GEAR
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md font-sans">
              Tested on national platforms. Every piece is built to withstand extreme poundages and delivered straight from our Pune warehouse.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button className="bg-white/5 hover:bg-accent hover:text-white text-white border border-white/20 font-steelfish text-xl tracking-wider uppercase px-12 py-6 rounded-xl transition-all">
                EXPLORE COMPLETE CATALOG →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. "WHY STRONGBUILD" COMPARISON MATRIX (High Purchase Confidence) */}
      <section className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-steelfish text-base sm:text-lg uppercase tracking-widest text-brand-blue font-bold">
              Engineering Standard
            </span>
            <h2 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight mt-1">
              ORDINARY GEAR VS. STRONGBUILD
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mt-2 font-sans">
              Why serious athletes across India switch to STRONGBUILD for their heaviest attempts.
            </p>
          </div>

          <div className="luxury-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="grid grid-cols-12 bg-[#171717] p-4 sm:p-5 border-b border-white/10 font-steelfish text-base sm:text-xl uppercase tracking-wider text-white">
              <div className="col-span-4 font-bold text-white/60">Specification</div>
              <div className="col-span-4 text-center font-bold text-white/40">Generic Gym Belts</div>
              <div className="col-span-4 text-center font-bold text-accent flex items-center justify-center gap-1">
                <Award className="h-4 w-4" /> STRONGBUILD Gear
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {COMPARISON_ROWS.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white/[0.02] transition-colors text-xs sm:text-sm font-sans">
                  <div className="col-span-4 font-bold text-white">
                    {row.feature}
                  </div>
                  <div className="col-span-4 text-center text-white/40 pr-2">
                    <span className="text-red-400 font-bold block sm:inline mr-1">✕</span>
                    {row.generic}
                  </div>
                  <div className="col-span-4 text-center text-white font-medium pl-2 bg-accent/5 py-2 rounded-lg border border-accent/20">
                    <span className="text-[#25D366] font-bold block sm:inline mr-1">✓</span>
                    {row.strongbuild}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEET DAY BUNDLE BANNER */}
      <section id="bundles" className="py-16 sm:py-20 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-black via-[#141414] to-black">
            <img 
              src="https://horizons-cdn.hostinger.com/909a38b5-4cd3-4dfc-8d2d-40035029ddbf/img-20260904-wa0014-YfNIT.jpg" 
              alt="Powerlifting Meet Day Kit with 13mm Lever Belt, Wraps, Chalk and Duffel" 
              className="absolute inset-0 h-full w-full object-cover opacity-35 filter contrast-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
            
            <div className="relative p-6 sm:p-12 md:p-16 max-w-2xl">
              <span className="bg-accent text-white font-steelfish text-sm px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-md">
                ⚡ COMPLETE ARSENAL SAVINGS
              </span>
              <h2 className="font-steelfish text-4xl sm:text-6xl md:text-7xl font-bold uppercase text-white tracking-tight mt-3 mb-3">
                THE MEET DAY POWER BUNDLE
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-6 leading-relaxed font-sans">
                Everything you need to step onto the platform: 13mm/10mm Competition Lever Belt, Heavy-Duty Wrist Wraps, Figure-8 Deadlift Straps, and Liquid Chalk — bundled together at up to <strong>30% OFF</strong> individual retail prices.
              </p>
              
              <div className="flex flex-wrap items-baseline gap-3 mb-8">
                <span className="font-steelfish text-4xl sm:text-5xl text-accent font-bold">STARTING AT ₹4,499</span>
                <span className="text-sm sm:text-base text-white/40 line-through font-sans">MRP ₹6,499</span>
                <span className="bg-[#25D366]/20 text-[#25D366] text-xs font-bold px-2 py-0.5 rounded border border-[#25D366]/30 uppercase font-sans">
                  Instant Save ₹2,000
                </span>
              </div>

              <Link to="/shop?q=bundle">
                <Button className="bg-accent hover:bg-accent/90 text-white font-steelfish text-2xl tracking-wider uppercase px-10 py-7 rounded-xl shadow-xl shadow-accent/30 active:scale-95">
                  CLAIM BUNDLE DEAL →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ATHLETE REVIEWS & SOCIAL PROOF */}
      <section className="py-16 sm:py-24 bg-[#070707] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-steelfish text-base sm:text-lg uppercase tracking-widest text-accent font-bold flex items-center justify-center gap-1.5">
              <Star className="h-4 w-4 fill-accent" /> Verified PRs
            </span>
            <h2 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight mt-1">
              RATED BY LIFTERS, NOT MARKETERS
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mt-2 font-sans">
              Read how athletes are hitting personal records in STRONGBUILD competition belts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="luxury-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: r.stars }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="bg-white/10 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {r.pr}
                    </span>
                  </div>
                  <Quote className="h-6 w-6 text-accent/50 mb-3" />
                  <p className="text-sm sm:text-base text-white/90 mb-6 leading-relaxed font-sans">
                    &quot;{r.text}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-steelfish text-lg uppercase tracking-wider text-white font-bold">{r.name}</p>
                    <p className="text-xs text-white/50 font-sans">{r.city}</p>
                  </div>
                  <span className="text-[10px] text-[#25D366] font-bold uppercase flex items-center gap-1 font-sans">
                    <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM FEED CAROUSEL */}
      <section className="py-14 bg-black border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-6">
          <div>
            <span className="font-steelfish text-sm uppercase tracking-widest text-brand-blue font-bold">Community</span>
            <h2 className="font-steelfish text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">FOLLOW THE GRIND</h2>
          </div>
          <a 
            href="https://www.instagram.com/strongbuild.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-white hover:text-accent font-steelfish text-lg uppercase tracking-wider transition-colors"
          >
            <Instagram className="h-4 w-4 text-accent" /> @strongbuild.in
          </a>
        </div>
        
        <div className="marquee-track gap-3">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <div key={i} className="h-44 w-44 rounded-xl overflow-hidden border border-white/10 shrink-0 relative group">
              <img 
                src={c.img} 
                alt="STRONGBUILD Platform Moment" 
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="font-steelfish text-xs uppercase text-white tracking-wider font-bold">
                  {c.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. RECENTLY VIEWED PRODUCTS */}
      <RecentlyViewed title="Recently Inspected Gear" />

      {/* 10. PRE-PURCHASE FAQ ACCORDION */}
      <section className="py-16 sm:py-24 bg-[#080808] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="font-steelfish text-base sm:text-lg uppercase tracking-widest text-brand-blue font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="font-steelfish text-4xl sm:text-5xl font-bold uppercase text-white tracking-tight mt-1">
              BEFORE YOU PURCHASE
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-sans mt-2">
              Everything you need to know about sizing, delivery times, and IPF platform rules.
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((f, i) => (
              <div key={i} className="py-4 sm:py-5">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)} 
                  className="w-full flex items-center justify-between gap-4 text-left font-sans group"
                >
                  <span className="font-bold text-sm sm:text-base text-white group-hover:text-accent transition-colors">
                    {f.q}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    {openFaq === i ? <Minus className="h-4 w-4 text-accent" /> : <Plus className="h-4 w-4 text-brand-blue" />}
                  </div>
                </button>
                {openFaq === i && (
                  <p className="text-xs sm:text-sm text-white/70 pt-3 leading-relaxed font-sans">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/50 font-sans">
              Still have sizing doubts?{' '}
              <a 
                href="https://wa.me/918317339439?text=Hi%20STRONGBUILD%2C%20I%20have%20a%20question%20before%20ordering" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#25D366] font-bold hover:underline"
              >
                Chat directly with our Athlete Support on WhatsApp →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER / VIP SQUAD */}
      <section className="py-16 sm:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="luxury-card rounded-3xl p-8 sm:p-12 text-center border border-white/15 relative overflow-hidden">
            <span className="font-steelfish text-sm uppercase tracking-widest text-accent font-bold">
              VIP Division
            </span>
            <h2 className="font-steelfish text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight mt-1 mb-3">
              JOIN THE STRONGBUILD SQUAD
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mb-6 max-w-lg mx-auto font-sans leading-relaxed">
              Subscribe to get instant notification on limited belt drops, training journal releases, and exclusive subscriber discount codes.
            </p>

            {newsletterDone ? (
              <div className="bg-accent/15 border border-accent/40 text-accent font-bold text-sm p-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> You are in. Welcome to the ranks.
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletter}>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email" 
                  value={newsletterEmail} 
                  onChange={(e) => setNewsletterEmail(e.target.value)} 
                  className="flex-1 rounded-xl border border-white/15 px-4 py-3.5 text-xs sm:text-sm text-white bg-black/50" 
                />
                <Button 
                  type="submit" 
                  disabled={newsletterLoading} 
                  className="bg-accent hover:bg-accent/90 text-white font-steelfish text-xl tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-lg shadow-accent/30"
                >
                  {newsletterLoading ? 'Joining...' : 'CLAIM 10% OFF'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;