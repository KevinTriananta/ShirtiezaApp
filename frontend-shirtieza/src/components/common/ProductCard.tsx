import type { Product } from '../../types';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../providers/CartContext';
import { useAuth } from '../../providers/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number, quantity: number) => Promise<void>;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 1500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-neutral-100 rounded-2xl aspect-[3/4] mb-4">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
            -{discount}%
          </div>
        )}

        {/* Out of Stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 bg-white/80 px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Added feedback */}
        {showAdded && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-fade-in z-10">
            <span className="text-white text-sm font-bold uppercase tracking-wider">✓ Added!</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="flex-1 bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.15em] py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-black transition-all duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={13} strokeWidth={1.5} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="bg-white/90 backdrop-blur-sm text-black p-3 rounded-xl hover:bg-white transition-all duration-200"
          >
            <Eye size={15} strokeWidth={1.5} />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isFavorite
                ? 'bg-black text-white'
                : 'bg-white/90 backdrop-blur-sm text-black hover:bg-white'
            }`}
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col px-1">
        {/* Category */}
        {product.category?.name && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <Link
          to={`/products/${product.slug}`}
          className="text-[13px] font-semibold text-neutral-800 hover:text-black transition-colors duration-200 mb-2 line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-neutral-200'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-neutral-400">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-sm font-bold text-black">
            Rp {product.discount_price
              ? product.discount_price.toLocaleString('id-ID')
              : product.price.toLocaleString('id-ID')}
          </span>
          {product.discount_price && (
            <span className="text-xs text-neutral-400 line-through">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
