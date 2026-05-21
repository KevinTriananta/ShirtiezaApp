import { Link, useParams } from 'react-router-dom';
import ProductGallery from '../components/product/ProductGallery';
import ProductPurchasePanel from '../components/product/ProductPurchasePanel';
import ProductReviews from '../components/product/ProductReviews';
import { useProductDetail } from '../hooks/useProductDetail';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error, setError } = useProductDetail(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-[3/4] skeleton rounded-2xl" />
            <div className="lg:py-4 space-y-6">
              <div className="h-3 w-20 skeleton" />
              <div className="h-8 w-64 skeleton" />
              <div className="h-4 w-32 skeleton" />
              <div className="h-10 w-48 skeleton" />
              <div className="h-20 w-full skeleton" />
              <div className="h-12 w-full skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px] flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-neutral-500">{error}</p>
        <Link
          to="/products"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <Link to="/products" className="text-neutral-400 hover:text-black transition-colors duration-200">Products</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <ProductGallery product={product} />
          <ProductPurchasePanel product={product} error={error} onError={setError} />
        </div>

        <ProductReviews reviews={product.reviews} />
      </div>
    </div>
  );
}
