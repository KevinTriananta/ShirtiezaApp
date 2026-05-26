import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import CircularText from '../ui/CircularText';
import type { Product } from '../../types';

interface ExclusiveDropProps {
  product?: Product;
}

export default function ExclusiveDrop({ product }: ExclusiveDropProps) {
  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <div className="w-full">
        <div className="relative overflow-hidden bg-neutral-900 sm:aspect-[16/9] lg:aspect-[21/9] group">
          {product?.image && (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end gap-8 p-6 sm:justify-center sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-20">
            <div className="max-w-xl space-y-5 sm:space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                About<br />Shirtieza.
              </h2>

              <p className="text-white/70 text-sm lg:text-base max-w-md font-medium">
                Shirtieza is built for daily expression: clean essentials, sharp silhouettes, and wearable streetwear made to move from casual days to late-night plans.
              </p>

              <div className="flex gap-4">
                <Link to="/products?collection=new-arrivals">
                  <Button variant="secondary" icon={<ArrowRight size={16} />}>
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden shrink-0 rounded-full border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:block lg:mr-6">
              <CircularText
                text="SHIRTIEZA*SHIRTIEZA*"
                spinDuration={18}
                onHover="speedUp"
                className="text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
