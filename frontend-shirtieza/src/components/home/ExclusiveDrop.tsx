import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ExclusiveDrop() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[40px] overflow-hidden bg-neutral-900 aspect-[16/9] lg:aspect-[21/9] group">
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" 
            alt="Exclusive Drop" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-20 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Limited Edition</p>
            </div>
            
            <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              Midnight<br />Aesthetic.
            </h2>
            
            <p className="text-white/60 text-sm lg:text-base max-w-md font-medium">
              Our most exclusive drop yet. Hand-crafted pieces designed for those who thrive after dark.
            </p>
            
            <div className="flex gap-4">
              <Link to="/products?collection=midnight">
                <Button variant="secondary" icon={<ArrowRight size={16} />}>
                  Explore Drop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
