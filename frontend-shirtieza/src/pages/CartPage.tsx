import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../providers/CartContext';
import { useAuth } from '../providers/AuthContext';
import { orderService } from '../services/orderService';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, cart, removeFromCart, updateCartItem, clearCart, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [shippingCost] = useState(50000);
  const [taxRate] = useState(0.05);
  const [shipping, setShipping] = useState({
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Indonesia',
    zip: '',
    paymentMethod: 'bank_transfer',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Loading cart</p>
        </div>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
            <ShoppingCart size={32} className="text-neutral-300" strokeWidth={1.2} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Your Cart is Empty</h1>
          <p className="text-sm text-neutral-400 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2.5 bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] transition-all duration-300 group"
          >
            Continue Shopping
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  const handleCheckout = async () => {
    if (!user) return;
    if (!shipping.address.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      setError('Please complete shipping address before checkout.');
      return;
    }
    setError('');
    setIsCheckingOut(true);
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const response = await orderService.createOrder({
        user_id: user.id,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_country: shipping.country,
        shipping_zip: shipping.zip,
        shipping_cost: shippingCost,
        tax: Math.round(tax),
        payment_method: shipping.paymentMethod,
        items: orderItems,
      });

      await clearCart();
      navigate(`/orders/${response.data.id}`);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err?.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight mb-8 lg:mb-12">
          Shopping Cart
          <span className="text-neutral-300 font-normal text-lg ml-3">({items.length})</span>
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 mb-6 animate-scale-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateCartItem}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <div className="mt-8 bg-neutral-50 border border-neutral-100 rounded-2xl p-6">
              <h2 className="text-sm font-black uppercase tracking-widest mb-5">Shipping & Payment</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street address" className="md:col-span-2 px-4 py-3 rounded-xl border border-neutral-200 text-sm" />
                <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="City" className="px-4 py-3 rounded-xl border border-neutral-200 text-sm" />
                <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} placeholder="ZIP code" className="px-4 py-3 rounded-xl border border-neutral-200 text-sm" />
                <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} placeholder="Country" className="px-4 py-3 rounded-xl border border-neutral-200 text-sm" />
                <select value={shipping.paymentMethod} onChange={(e) => setShipping({ ...shipping, paymentMethod: e.target.value })} className="px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="ewallet">E-Wallet Demo</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              shippingCost={shippingCost}
              total={total}
              isCheckingOut={isCheckingOut}
              onCheckout={handleCheckout}
              itemCount={items.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
