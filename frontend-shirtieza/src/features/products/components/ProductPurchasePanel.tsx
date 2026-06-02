import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { wishlistService } from '@shared/api/wishlistService';
import type { Product } from '@shared/types';

interface ProductPurchasePanelProps {
  product: Product;
  error: string;
  onError: (message: string) => void;
}

export default function ProductPurchasePanel({ product, error, onError }: ProductPurchasePanelProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Black');

  useEffect(() => {
    setSelectedColor(product.colors?.[0] || 'Black');
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      return;
    }
    wishlistService.getWishlist()
      .then((response) => setIsFavorite((response.data || []).some((item) => item.product_id === product.id)))
      .catch(() => setIsFavorite(false));
  }, [isAuthenticated, product.id]);

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Checkout Now handler
  const handleCheckoutNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      onError('Please select a size before checkout.');
      return;
    }
    // Redirect ke halaman checkout now dengan data produk
    navigate(`/checkout-now/${product.id}`, {
      state: {
        product,
        quantity,
        size: selectedSize,
        color: selectedColor,
      },
    });
  };

  return (
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

      <div className="mb-8 pb-8 border-b border-neutral-100">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl lg:text-3xl font-black text-black">
            Rp {(product.discount_price || product.price).toLocaleString('id-ID')}
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

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">Availability</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
          <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-neutral-700' : 'text-neutral-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {['S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`w-12 h-11 rounded-xl border text-xs font-black ${selectedSize === size ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-500'}`}>{size}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Color</p>
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-11 rounded-xl border border-neutral-200 px-3 text-sm font-bold bg-white">
            {(product.colors?.length ? product.colors : ['Black']).map((color) => <option key={color}>{color}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Quantity</p>
        <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0} className="w-12 h-12 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30">
            <Minus size={14} />
          </button>
          <span className="w-14 h-12 flex items-center justify-center text-sm font-bold text-black border-x border-neutral-200">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock === 0} className="w-12 h-12 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 mb-4 animate-scale-in"><AlertCircle size={18} /><span>{error}</span></div>}

      <div className="flex gap-3 mb-8">
        <button
          onClick={handleCheckoutNow}
          disabled={product.stock === 0}
          className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 ${product.stock === 0 ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]'}`}
        >
          <ShoppingCart size={16} strokeWidth={1.5} />
          Checkout Now
        </button>
        <button onClick={async () => {
          if (!isAuthenticated) return navigate('/login');
          try {
            if (isFavorite) {
              await wishlistService.removeWishlistItem(product.id);
              setIsFavorite(false);
            } else {
              await wishlistService.addWishlistItem(product.id);
              setIsFavorite(true);
            }
          } catch (error) {
            onError('Failed to update wishlist. Please try again.');
          }
        }} className={`w-14 rounded-xl transition-all duration-300 flex items-center justify-center ${isFavorite ? 'bg-black text-white' : 'border border-neutral-200 text-neutral-400 hover:border-black hover:text-black'}`}>
          <Heart size={18} strokeWidth={1.5} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {product.collections && product.collections.length > 0 && (
        <div className="pt-6 border-t border-neutral-100">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Collections</p>
          <div className="flex flex-wrap gap-2">
            {product.collections.map((col) => (
              <Link key={col.id} to={`/collections/${col.slug}`} className="border border-neutral-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600 rounded-lg hover:border-black hover:text-black transition-all duration-200">
                {col.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
