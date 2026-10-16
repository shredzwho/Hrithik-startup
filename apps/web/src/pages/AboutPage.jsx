import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Award, Flame, ArrowRight } from 'lucide-react';
import { TrustBadges } from '@/components/SharedComponents.jsx';

const VALUES = [
  { 
    title: 'Competition Standard First', 
    desc: 'Every lever belt, wrist wrap and strap is specced against IPF tested-federation requirements before it ever ships.',
    icon: Award,
    color: 'text-brand-blue'
  },
  { 
    title: 'Materials That Never Fail', 
    desc: 'Solid 100% steerhide leather, quad-core industrial stitching, and cast stainless steel lever buckles engineered for max poundages.',
    icon: ShieldCheck,
    color: 'text-accent'
  },
  { 
    title: 'Platform Tested With Athletes', 
    desc: 'Prototypes go directly to national champions first. If it bends, stretches, or slips under a 300kg deadlift, it is sent back to the drawing board.',
    icon: Flame,
    color: 'text-accent'
  },
];

const AboutPage = () => (
  <>
    <Helmet>
      <title>About STRONGBUILD | India's Premium Powerlifting Gear</title>
      <meta name="description" content="STRONGBUILD engineers competition-grade powerlifting gear for serious lifters across India. 100% full-grain leather, stainless steel lever buckles, and IPF spec." />
    </Helmet>

    <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 overflow-hidden bg-black">
      <img src="https://images.hostinger.com/cff56328-d1f3-44b4-966d-91953a987efe.png" alt="Lifter chalking up before a heavy pull" className="absolute inset-0 h-full w-full object-cover opacity-25 filter contrast-125" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/85" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <span className="font-steelfish text-base uppercase tracking-widest text-brand-blue font-bold">The Origin Story</span>
        <h1 className="font-steelfish text-5xl sm:text-7xl md:text-8xl font-bold uppercase text-white tracking-wide mt-2 heading-balance">
          GEAR WORTHY OF THE HEAVIEST LIFTS
        </h1>
        <p className="text-base sm:text-lg text-white/75 mt-4 max-w-2xl mx-auto font-sans">
          STRONGBUILD was founded in Pune to give Indian powerlifters and strength athletes equipment that matches their ambition — competition-grade, indestructible, and honestly priced.
        </p>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <div className="luxury-card rounded-3xl p-6 sm:p-12 space-y-6 text-white/70 leading-relaxed font-sans border border-white/10">
        <span className="font-steelfish text-sm uppercase tracking-widest text-accent font-bold">Our Philosophy</span>
        <h2 className="font-steelfish text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight">
          BUILT BY LIFTERS, FOR THE PLATFORM
        </h2>
        <p className="text-sm sm:text-base">
          For years, serious powerlifters in India were forced to either pay extortionate import markups on foreign brands or settle for cheap commercial gym belts that split at the rivets, stretched out under heavy air, or failed federation kit check on meet morning.
        </p>
        <p className="text-sm sm:text-base">
          We founded STRONGBUILD to obliterate that compromise. Each piece begins directly with national athletes and coaches. We engineer for maximum intra-abdominal bracing, uniform 10cm competition width, and cast stainless steel lever mechanisms that lock down like a bank vault.
        </p>
        <p className="text-sm sm:text-base">
          Strength, Pride, and Honour are not empty marketing slogans here. They are the rigorous standards that every single belt, strap, and wrap must clear before being dispatched from our Pune facility.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 pb-20 sm:pb-24 grid md:grid-cols-3 gap-6">
      {VALUES.map(v => (
        <div key={v.title} className="luxury-card rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <v.icon className={`h-6 w-6 ${v.color}`} />
            </div>
            <h3 className="font-steelfish text-2xl uppercase tracking-wider text-white font-bold mb-2">{v.title}</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">{v.desc}</p>
          </div>
        </div>
      ))}
    </section>

    <TrustBadges />

    <section className="py-20 text-center px-4">
      <Link to="/shop">
        <Button className="bg-accent hover:bg-accent/90 text-white font-steelfish text-2xl uppercase tracking-wider px-12 py-7 rounded-xl shadow-xl shadow-accent/30 active:scale-95">
          EXPLORE THE ARSENAL <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </Link>
    </section>
  </>
);

export default AboutPage;
