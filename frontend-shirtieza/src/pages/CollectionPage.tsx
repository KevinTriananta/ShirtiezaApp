import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Collection, Product } from '../types';
import { collectionService } from '../services/collectionService';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (slug) loadCollection(); }, [slug]);

  const loadCollection = async () => {
    try {
      setIsLoading(true);
      const colRes = await collectionService.getCollectionBySlug(slug!);
      setCollection(colRes.data);
      const prodRes = await productService.getProductsByCollection(colRes.data.id);
      setProducts(prodRes.data.data || prodRes.data || []);
    } catch (error) {
      console.error('Failed to load collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      {collection?.image ? (
        <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
          <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <Link
                to="/collections"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white mb-4 transition-colors duration-300 group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> Collections
              </Link>
              <h1 className="text-3xl lg:text-5xl font-black uppercase text-white mb-2">{collection.name}</h1>
              <p className="text-sm lg:text-base text-white/50 max-w-lg">{collection.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-950 text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Link
              to="/collections"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 hover:text-white mb-4 transition-colors duration-300 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> Collections
            </Link>
            {collection && (
              <>
                <h1 className="text-3xl lg:text-5xl font-black uppercase mb-2">{collection.name}</h1>
                <p className="text-base text-neutral-400 max-w-lg">{collection.description}</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton rounded-2xl mb-4" />
                <div className="h-3 w-16 skeleton mb-2" />
                <div className="h-4 w-32 skeleton" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm uppercase tracking-[0.15em] mb-4">No products in this collection</p>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
