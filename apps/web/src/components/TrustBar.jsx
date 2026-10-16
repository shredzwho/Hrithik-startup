import React from 'react';
import { Truck, RotateCcw, Award, ShieldCheck } from 'lucide-react';

const items = [
  { icon: Truck, title: 'FREE SHIPPING OVER ₹1,499', sub: 'Dispatched Same-Day Before 4PM', color: 'text-brand-blue' },
  { icon: Award, title: '2-YEAR UNBREAKABLE WARRANTY', sub: 'Stitching & Steel Levers', color: 'text-accent' },
  { icon: RotateCcw, title: 'EASY 30-DAY SIZE EXCHANGES', sub: '100% Fit Guarantee', color: 'text-brand-blue' },
  { icon: ShieldCheck, title: 'COMPETITION SPECIFICATIONS', sub: 'IPF Standard 10mm & 13mm', color: 'text-accent' },
];

const TrustBar = () => {
  return (
    <div className="bg-[#080808] border-t border-b border-white/10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-x-6 py-2 overflow-x-auto no-scrollbar">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2 text-white/90 whitespace-nowrap shrink-0 group">
              <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-accent/40 transition-colors">
                <it.icon className={`h-3 w-3 ${it.color}`} strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline gap-1.5 font-steelfish tracking-wide text-xs md:text-sm uppercase">
                <span className="text-white font-bold">{it.title}</span>
                <span className="hidden lg:inline text-white/45 font-sans text-[11px] normal-case tracking-normal">
                  — {it.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
