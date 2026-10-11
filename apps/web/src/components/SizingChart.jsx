import React, { useState } from 'react';
import { Ruler, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Standard lever belt sizing chart (inches & cm). Honest, competition-spec guidance.
const SIZING_ROWS = [
  { size: 'XS', waistIn: '24–28"', waistCm: '61–71 cm', beltIn: '26–32"', beltCm: '66–81 cm' },
  { size: 'S', waistIn: '28–32"', waistCm: '71–81 cm', beltIn: '30–36"', beltCm: '76–91 cm' },
  { size: 'M', waistIn: '32–36"', waistCm: '81–91 cm', beltIn: '34–40"', beltCm: '86–101 cm' },
  { size: 'L', waistIn: '36–40"', waistCm: '91–101 cm', beltIn: '38–44"', beltCm: '96–111 cm' },
  { size: 'XL', waistIn: '40–44"', waistCm: '101–111 cm', beltIn: '42–48"', beltCm: '106–121 cm' },
  { size: 'XXL', waistIn: '44–48"', waistCm: '111–121 cm', beltIn: '46–52"', beltCm: '116–132 cm' },
];

const SizingChart = ({ buttonLabel = 'Sizing Chart & How to Measure' }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-blue hover:text-accent transition-colors"
      >
        <Ruler className="h-4 w-4" /> {buttonLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
              <h3 className="text-lg font-black uppercase text-white tracking-tight">Lever Belt Sizing Chart</h3>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 md:p-6">
              {/* How to measure note */}
              <div className="glass-panel rounded-xl p-4 mb-5 flex gap-3">
                <Info className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-bold text-white uppercase tracking-wider text-xs mb-1">How to measure your waist for a lever belt</p>
                  Wrap a soft tape measure around your torso at the <span className="text-white font-semibold">navel (belly button)</span>, over whatever you normally wear while lifting — singlet, shirt, or nothing. Don't suck in; measure relaxed. Match that measurement to the <span className="text-white font-semibold">Waist</span> column. The belt length column shows the hole range the belt will fit, so you land in the middle of the holes for future size changes.
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Waist</th>
                      <th>Belt Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZING_ROWS.map((r) => (
                      <tr key={r.size}>
                        <td className="font-bold text-white">{r.size}</td>
                        <td className="text-muted-foreground">
                          <span className="text-white">{r.waistIn}</span>
                          <span className="block text-xs">{r.waistCm}</span>
                        </td>
                        <td className="text-muted-foreground">
                          <span className="text-white">{r.beltIn}</span>
                          <span className="block text-xs">{r.beltCm}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Between sizes? Size down if you're cutting weight, size up if you're in a bulk. Lever belts are adjustable in ~3 inch increments via the lever position, so you can re-set the prong as your weight changes.
              </p>

              <div className="mt-5 flex justify-end">
                <Button onClick={() => setOpen(false)} className="bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider rounded-sm">
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizingChart;
