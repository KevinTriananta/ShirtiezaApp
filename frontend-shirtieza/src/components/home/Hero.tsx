import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import heroBg from '../../assets/hero-bg.webp';

export default function Hero() {
  return (
    <section className="relative h-[calc(100svh-120px)] min-h-[560px] sm:h-[92vh] sm:min-h-[640px] overflow-hidden group">
      <img
        src={heroBg}
        alt="Shirtieza Hero"
        className="h-full w-full object-cover object-center grayscale-[20%] scale-105 group-hover:scale-100 group-hover:grayscale-0 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="inline-flex max-w-full items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-white/10 animate-fade-in-up transition-all duration-500 hover:bg-white/15 hover:border-white/25">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.24em] sm:tracking-[0.4em] text-white truncate">
                Spring/Summer 2026 Collection
              </p>
            </div>

            <h1 className="text-[clamp(3.8rem,18vw,7.5rem)] lg:text-[120px] font-black uppercase leading-[0.82] text-white tracking-tighter animate-fade-in-up delay-100">
              Raw.<br />
              <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Refined.</span><br />
              Rare.
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-medium max-w-lg leading-relaxed animate-fade-in-up delay-200">
              Deconstruct your style with our latest drop. Merging urban utility with high-fashion silhouettes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 pt-2 sm:pt-4 animate-fade-in-up delay-300">
              <Link
                to="/products"
                className="bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-2xl hover:shadow-white/10 flex items-center justify-center gap-3"
              >
                Shop Now
                <ShoppingBag size={16} />
              </Link>
              <Link
                to="/collections"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 sm:px-10 py-4 sm:py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:-translate-y-0.5 hover:bg-white hover:text-black transition-all duration-500 text-center"
              >
                Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
