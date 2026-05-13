import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import ProductCard from '../common/ProductCard';

interface FeaturedProductsProps {
  title?: string;
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedProducts({ title = "Top Picks", products, isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-24 lg:py-32 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black">
            {title}
          </h2>
          <div className="h-[1px] flex-grow mx-8 bg-neutral-200 hidden md:block" />
          <Link
            to="/products"
            className="border border-neutral-200 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:border-black transition-all"
          >
            Shop All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] skeleton rounded-2xl" />
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-4 w-1/3 skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
