import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import type { Product } from '../../types';

interface ProductGridStateProps {
  isLoading: boolean;
  products: Product[];
}

export default function ProductGridState({ isLoading, products }: ProductGridStateProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] skeleton mb-4 rounded-2xl" />
            <div className="h-3 w-16 skeleton mb-2" />
            <div className="h-4 w-32 skeleton mb-2" />
            <div className="h-4 w-20 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-neutral-400 text-sm uppercase tracking-[0.15em] mb-4">No products found</p>
        <Link to="/products" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block">
          Clear Filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 mb-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
