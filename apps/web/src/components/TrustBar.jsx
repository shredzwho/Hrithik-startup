import React from 'react';
import { Truck, RotateCcw, Award } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Free Shipping ₹1,499+', sub: 'Dispatched in 24h' },
  { icon: RotateCcw, title: '30-Day Returns', sub: 'Easy exchanges' },
  { icon: Award, title: '2-Year Warranty', sub: 'Made for powerlifters' },
];

// Compact trust bar designed to sit as the bottom row of the fixed header.
const TrustBar = () => {
  return (
    <div className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-between gap-x-6 gap-y-1 py-2 flex-nowrap overflow-x-auto">
          {items.map((it) => (
            <div key={it.title} className="flex items-center gap-2 text-white/80 whitespace-nowrap shrink-0">
              <it.icon className="h-3.5 w-3.5 text-brand-blue shrink-0" strokeWidth={2} />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                {it.title}
                <span className="hidden md:inline text-muted-foreground font-medium normal-case tracking-normal"> — {it.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
