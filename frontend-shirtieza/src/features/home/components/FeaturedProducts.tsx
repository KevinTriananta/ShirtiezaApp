import { Link } from 'react-router-dom';
import ProductCard from '@features/products/components/ProductCard';
import type { Product } from '@shared/types';

interface FeaturedProductsProps {
  title?: string;
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedProducts({ title = "Top Picks", products, isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black">
            {title}
          </h2>
          <div className="h-[1px] flex-grow mx-8 bg-neutral-200 hidden md:block" />
          <Link
            to="/products"
            className="w-fit border border-neutral-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:-translate-y-0.5 hover:border-black hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
          >
            Shop All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] skeleton rounded-2xl" />
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-4 w-1/3 skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-9 sm:gap-y-14">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
