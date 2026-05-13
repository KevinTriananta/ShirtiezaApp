import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, AlertCircle, Check } from 'lucide-react';
import type { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../providers/CartContext';
import { useAuth } from '../providers/AuthContext';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProductBySlug(slug!);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      setError('Product not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsAdding(true);
    setError('');
    try {
      await addToCart(product!.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

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

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

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
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-neutral-50 aspect-[3/4] overflow-hidden rounded-2xl">
              <img
                src={allImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-neutral-50 overflow-hidden rounded-xl border-2 transition-all duration-200 hover:opacity-80 ${
                      selectedImage === idx ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:py-4 animate-fade-in-up">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              {product.category?.name}
            </span>

            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-black mt-2 mb-5">
              {product.name}
            </h1>

            {product.rating > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-neutral-200'}>★</span>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wide">
                  {product.rating.toFixed(1)} · {product.review_count} reviews
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-100">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl lg:text-3xl font-black text-black">
                  Rp {product.discount_price
                    ? product.discount_price.toLocaleString('id-ID')
                    : product.price.toLocaleString('id-ID')}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-lg text-neutral-400 line-through font-medium">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-neutral-500 leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">Availability</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Quantity</p>
              <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="w-12 h-12 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="w-14 h-12 flex items-center justify-center text-sm font-bold text-black border-x border-neutral-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                  className="w-12 h-12 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Success / Error Messages */}
            {addedSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 mb-4 animate-scale-in">
                <Check size={18} />
                <span>Added to cart successfully!</span>
              </div>
            )}
            {error && product && (
              <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 mb-4 animate-scale-in">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  product.stock === 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]'
                }`}
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={16} strokeWidth={1.5} />
                )}
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-14 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  isFavorite
                    ? 'bg-black text-white'
                    : 'border border-neutral-200 text-neutral-400 hover:border-black hover:text-black'
                }`}
              >
                <Heart size={18} strokeWidth={1.5} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Collection Tags */}
            {product.collections && product.collections.length > 0 && (
              <div className="pt-6 border-t border-neutral-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Collections</p>
                <div className="flex flex-wrap gap-2">
                  {product.collections.map((col) => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.slug}`}
                      className="border border-neutral-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600 rounded-lg hover:border-black hover:text-black transition-all duration-200"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-20 pt-12 border-t border-neutral-100">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-neutral-50 rounded-2xl p-6 hover:bg-neutral-100/80 transition-colors duration-200">
                  <div className="flex items-center gap-1 mb-3 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-amber-400' : 'text-neutral-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">{review.comment}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">— {review.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
