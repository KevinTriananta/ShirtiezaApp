import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] overflow-hidden group">
      <img
        src="https://images.unsplash.com/photo-1550991152-e23e989739ee?q=80&w=2000&auto=format&fit=crop"
        alt="Shirtieza Hero"
        className="w-full h-full object-cover grayscale-[20%] scale-105 group-hover:scale-100 group-hover:grayscale-0 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                Spring/Summer 2024 Collection
              </p>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase leading-[0.8] text-white tracking-tighter">
              Raw.<br />
              <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Refined.</span><br />
              Rare.
            </h1>
            
            <p className="text-lg text-white/70 font-medium max-w-lg leading-relaxed">
              Deconstruct your style with our latest drop. Merging urban utility with high-fashion silhouettes.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              <Link
                to="/products"
                className="bg-white text-black px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-neutral-200 hover:shadow-2xl hover:shadow-white/10 flex items-center gap-3"
              >
                Shop Now
                <ShoppingBag size={16} />
              </Link>
              <Link
                to="/collections"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all duration-500"
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
