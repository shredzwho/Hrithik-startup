import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VALUES = [
  { title: 'Competition first', desc: 'Every belt, wrap and strap is specced against tested-federation requirements before it ships.' },
  { title: 'Materials that last', desc: 'Full-grain leather, reinforced stitching and steel hardware chosen for years of heavy use.' },
  { title: 'Built with athletes', desc: 'Prototypes go to national-level lifters first. If it fails under load, it never reaches you.' },
];

const AboutPage = () => (
  <>
    <Helmet>
      <title>About STRONGBUILD | Premium Strength Equipment from India</title>
      <meta name="description" content="STRONGBUILD builds premium, competition-ready strength equipment for powerlifters, bodybuilders and strength athletes across India." />
    </Helmet>

    <section className="relative pt-40 pb-24 overflow-hidden">
      <img src="https://images.hostinger.com/cff56328-d1f3-44b4-966d-91953a987efe.png" alt="Lifter chalking up before a heavy pull" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/80" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <span className="section-eyebrow">Our story</span>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight mt-3 heading-balance">Gear worthy of the lift</h1>
        <p className="text-lg text-white/70 mt-6">
          STRONGBUILD exists to give Indian strength athletes equipment that matches their ambition — premium, competition-ready and honestly priced.
        </p>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 pb-20">
      <div className="glass-panel rounded-3xl p-8 md:p-14 space-y-6 text-muted-foreground leading-relaxed">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">Our mission</h2>
        <p>We build premium competition-ready strength equipment for powerlifters, bodybuilders and strength athletes. For years, serious lifters in India had two options: import gear at painful prices, or settle for equipment that tore, stretched or failed kit check. We started STRONGBUILD to close that gap.</p>
        <p>Each product line begins on the platform, not in a catalogue. We measure what breaks, redesign the failure points, and only then put a product into production. That is why our lever belts carry a two-year hardware and stitching warranty, and why our wraps hold their stiffness through hundreds of sessions.</p>
        <p>Strength, pride and honour are not slogans here — they are the standard we hold every batch to before it leaves the workshop.</p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 pb-24 grid md:grid-cols-3 gap-6">
      {VALUES.map(v => (
        <div key={v.title} className="rounded-2xl border border-white/10 p-8 hover:border-red-600/40 transition-colors">
          <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3">{v.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
        </div>
      ))}
    </section>

    <section className="pb-28 text-center px-4">
      <Link to="/shop">
        <Button className="bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest px-10 py-6 rounded-xl">Shop the range</Button>
      </Link>
    </section>
  </>
);

export default AboutPage;
