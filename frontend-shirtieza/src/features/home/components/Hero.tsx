import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import heroBg from '@assets/hero-bg.webp';

export default function Hero() {
  return (
    <section className="relative h-[calc(100svh-56px)] min-h-[700px] sm:h-[calc(100vh-72px)] sm:min-h-[760px] overflow-hidden group">
      <img
        src={heroBg}
        alt="Shirtieza Hero"
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover object-[58%_center] sm:object-center grayscale-[12%] scale-110 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/30 to-black/5 sm:from-black/45 sm:via-transparent sm:to-black/5" />
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-black/35 to-transparent sm:block" />

      <div className="absolute inset-0 flex items-end pb-8 sm:items-end sm:pb-10 lg:items-center lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[20rem] space-y-3.5 sm:max-w-3xl sm:space-y-7">
            <h1 className="text-[clamp(2.75rem,12.8vw,4.8rem)] sm:text-[clamp(4.5rem,9vw,7rem)] lg:text-[110px] font-black uppercase leading-[0.86] text-white tracking-tighter animate-fade-in-up delay-100">
              Raw.<br />
              <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Refined.</span><br />
              Rare.
            </h1>

            <p className="text-[12px] sm:text-lg text-white/75 font-medium max-w-[19.5rem] sm:max-w-lg leading-relaxed animate-fade-in-up delay-200">
              Deconstruct your style with our latest drop. Merging urban utility with high-fashion silhouettes.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-4 animate-fade-in-up delay-300">
              <Link
                to="/products"
                className="bg-white text-black px-8 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-500 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-2xl hover:shadow-white/10 flex items-center justify-center gap-3"
              >
                Shop Now
                <ShoppingBag size={16} />
              </Link>
              <Link
                to="/collections"
                className="bg-white/10 backdrop-blur-md border border-white/25 text-white px-8 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] hover:-translate-y-0.5 hover:bg-white hover:text-black transition-all duration-500 text-center"
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
