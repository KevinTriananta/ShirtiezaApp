import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Category, Product } from '../types';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (slug) loadCategory(); }, [slug]);

  const loadCategory = async () => {
    try {
      setIsLoading(true);
      const catRes = await categoryService.getCategoryBySlug(slug!);
      setCategory(catRes.data);
      const prodRes = await productService.getProductsByCategory(catRes.data.id);
      setProducts(prodRes.data.data || prodRes.data || []);
    } catch (error) {
      console.error('Failed to load category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      <div className="bg-neutral-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 hover:text-white mb-6 transition-colors duration-300 group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> Back to Categories
          </Link>
          {category && (
            <>
              <div className="text-4xl mb-4">{category.icon || '👕'}</div>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight mb-3">{category.name}</h1>
              <p className="text-base text-neutral-400 max-w-lg leading-relaxed">{category.description}</p>
            </>
          )}
        </div>
      </div>

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
            <p className="text-neutral-400 text-sm uppercase tracking-[0.15em] mb-4">No products in this category</p>
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
