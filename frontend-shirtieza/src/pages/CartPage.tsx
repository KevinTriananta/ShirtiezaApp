import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, AlertCircle, CreditCard, Truck, Heart } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { useCart } from '@app/providers/CartContext';
import { useToast } from '@app/providers/ToastContext';
import CartItem from '@features/cart/components/CartItem';
import { orderService } from '@shared/api/orderService';
import { voucherService } from '@shared/api/voucherService';
import { wilayahService } from '@shared/api/wilayahService';
import type { City, District, Province, Village } from '@shared/api/wilayahService';
import { wishlistService } from '@shared/api/wishlistService';
import type { UserVoucher, WishlistItem } from '@shared/types';
import ConfirmDialog from '@shared/ui/ConfirmDialog';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, cart, removeFromCart, updateCartItem, isLoading } = useCart();
  const { notify } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const [isCheckoutConfirmOpen, setIsCheckoutConfirmOpen] = useState(false);
  const [shippingCost] = useState(50000);
  const [taxRate] = useState(0.05);
  const [shipping, setShipping] = useState({
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Indonesia',
    zip: '',
    paymentMethod: 'bank_transfer',
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedRegion, setSelectedRegion] = useState({ provinceId: 0, cityId: 0, districtId: 0, villageId: 0 });
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [selectedUserVoucherId, setSelectedUserVoucherId] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    wilayahService.getProvinces().then(setProvinces).catch((error) => console.error('Failed to load provinces:', error));
  }, []);

  useEffect(() => {
    setSelectedItemIds(items.map((item) => item.id));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated) return;
    voucherService.getUserVouchers().then((response) => setUserVouchers(response.data)).catch((error) => console.error('Failed to load vouchers:', error));
    wishlistService.getWishlist().then((response) => setWishlistItems(response.data || [])).catch((error) => console.error('Failed to load wishlist:', error));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedRegion.provinceId) return;
    wilayahService.getCities(selectedRegion.provinceId).then(setCities).catch((error) => console.error('Failed to load cities:', error));
    setDistricts([]);
    setVillages([]);
  }, [selectedRegion.provinceId]);

  useEffect(() => {
    if (!selectedRegion.cityId) return;
    wilayahService.getDistricts(selectedRegion.cityId).then(setDistricts).catch((error) => console.error('Failed to load districts:', error));
    setVillages([]);
  }, [selectedRegion.cityId]);

  useEffect(() => {
    if (!selectedRegion.districtId) return;
    wilayahService.getVillages(selectedRegion.districtId).then(setVillages).catch((error) => console.error('Failed to load villages:', error));
  }, [selectedRegion.districtId]);

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

  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedUserVoucher = userVouchers.find((item) => item.id === selectedUserVoucherId && !item.used_at);
  const voucher = selectedUserVoucher?.voucher;
  const eligibleVoucherSubtotal = voucher?.category_id
    ? selectedItems.filter((item) => item.product.category?.id === voucher.category_id).reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : subtotal;
  const rawDiscount = voucher && subtotal >= (voucher.min_purchase || 0) ? eligibleVoucherSubtotal * (voucher.discount_percentage / 100) : 0;
  const discount = voucher?.max_discount ? Math.min(rawDiscount, voucher.max_discount) : rawDiscount;
  const tax = subtotal * taxRate;
  const total = Math.max(0, subtotal - discount) + tax + shippingCost;

  const handleRemoveItem = async () => {
    if (!pendingRemoveId) return;
    try {
      await removeFromCart(pendingRemoveId);
      setPendingRemoveId(null);
      notify('Item removed from cart.', 'success');
    } catch (error) {
      notify('Failed to remove item.', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    if (selectedItems.length === 0) {
      setError('Please select at least one cart item before checkout.');
      notify('Please select at least one cart item before checkout.', 'error');
      return;
    }
    if (!shipping.address.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      setError('Please complete shipping address before checkout.');
      notify('Please complete shipping address before checkout.', 'error');
      return;
    }
    setIsCheckoutConfirmOpen(false);
    setError('');
    setIsCheckingOut(true);
    try {
      const orderItems = selectedItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
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
        user_voucher_id: selectedUserVoucherId || undefined,
        cart_item_ids: selectedItemIds,
        items: orderItems,
      });

      notify('Order created successfully.', 'success');
      navigate(`/orders/${response.data.id}`);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err?.response?.data?.message || 'Failed to create order. Please try again.');
      notify('Failed to create order. Please try again.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckoutSingleItem = (item: typeof items[number]) => {
    navigate(`/checkout-now/${item.product.id}`, {
      state: {
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      },
    });
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

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-10">
          <div className="rounded-[28px] border border-neutral-100 bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Cart Items</p>
                <h2 className="mt-1 text-lg font-black tracking-tight">Your Selection</h2>
              </div>
                  <span className="rounded-full bg-neutral-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">{items.length} item{items.length > 1 ? 's' : ''}</span>
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  <button type="button" onClick={() => setSelectedItemIds(items.map((item) => item.id))} className="hover:text-black">Select All</button>
                  <span>/</span>
                  <button type="button" onClick={() => setSelectedItemIds([])} className="hover:text-black">Clear Selection</button>
                  <span className="ml-auto text-black">{selectedItems.length} selected</span>
                </div>
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                      key={item.id}
                      item={item}
                      isSelected={selectedItemIds.includes(item.id)}
                      onSelect={(id, selected) => setSelectedItemIds((current) => selected ? [...new Set([...current, id])] : current.filter((itemId) => itemId !== id))}
                      onUpdateQuantity={updateCartItem}
                  onRemove={setPendingRemoveId}
                  onCheckoutNow={handleCheckoutSingleItem}
                />
              ))}
            </div>
            <div className="mt-8 border-t border-neutral-100 pt-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-black" />
                  <h2 className="text-sm font-black uppercase tracking-[0.16em]">Liked Items</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{wishlistItems.length} saved</span>
              </div>
              {wishlistItems.length === 0 ? (
                <p className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-400">No liked items yet. Tap the heart on products to save them here.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {wishlistItems.map((item) => item.product && (
                    <Link key={item.id} to={`/products/${item.product.slug}`} className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3 transition-colors hover:bg-neutral-100">
                      <img src={item.product.image} alt={item.product.name} className="h-16 w-14 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-black">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-400">Rp {(item.product.discount_price || item.product.price).toLocaleString('id-ID')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-neutral-100 bg-neutral-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Checkout</p>
                <h2 className="mt-2 text-xl font-black tracking-tight">Shipping & Payment</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500">
                    <Truck size={15} />
                    Shipping
                  </div>
                  <div className="grid gap-3">
                    <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street address" className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                    <select value={selectedRegion.provinceId} onChange={(e) => setSelectedRegion({ provinceId: Number(e.target.value), cityId: 0, districtId: 0, villageId: 0 })} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                      <option value={0}>Select province</option>
                      {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={selectedRegion.cityId} onChange={(e) => {
                        const cityId = Number(e.target.value);
                        const city = cities.find((item) => item.id === cityId);
                        setSelectedRegion({ ...selectedRegion, cityId, districtId: 0, villageId: 0 });
                        setShipping({ ...shipping, city: city ? `${city.type} ${city.name}` : '', zip: '' });
                      }} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                        <option value={0}>City / Regency</option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.type} {city.name}</option>)}
                      </select>
                      <select value={selectedRegion.districtId} onChange={(e) => setSelectedRegion({ ...selectedRegion, districtId: Number(e.target.value), villageId: 0 })} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                        <option value={0}>District</option>
                        {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={selectedRegion.villageId} onChange={(e) => {
                        const villageId = Number(e.target.value);
                        const village = villages.find((item) => item.id === villageId);
                        setSelectedRegion({ ...selectedRegion, villageId });
                        setShipping({ ...shipping, zip: village?.pos_code || '' });
                      }} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                        <option value={0}>Village</option>
                        {villages.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}
                      </select>
                      <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} placeholder="ZIP code" className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                    </div>
                    <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} placeholder="Country" className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500">
                    Voucher
                  </div>
                  <select value={selectedUserVoucherId} onChange={(e) => setSelectedUserVoucherId(Number(e.target.value))} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                    <option value={0}>No voucher</option>
                    {userVouchers.filter((item) => !item.used_at && item.voucher).map((item) => (
                      <option key={item.id} value={item.id}>{item.voucher?.code} · {item.voucher?.discount_percentage}% off</option>
                    ))}
                  </select>
                  {voucher && discount <= 0 && <p className="mt-2 text-[11px] text-red-500">Voucher belum memenuhi minimum belanja atau kategori produk.</p>}
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500">
                    <CreditCard size={15} />
                    Payment
                  </div>
                  <select value={shipping.paymentMethod} onChange={(e) => setShipping({ ...shipping, paymentMethod: e.target.value })} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="ewallet">E-Wallet</option>
                  </select>
                </div>

                <div className="space-y-4 border-t border-neutral-200/70 pt-5">
                  {[
                    { label: 'Subtotal', value: subtotal },
                    { label: 'Voucher', value: -Math.round(discount) },
                    { label: 'Tax (5%)', value: Math.round(tax) },
                    { label: 'Shipping', value: shippingCost },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-neutral-500">{row.label}</span>
                      <span className="font-semibold text-black">Rp {row.value.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200/70 pt-5">
                  <span className="text-sm font-black uppercase tracking-[0.16em]">Total</span>
                  <span className="text-2xl font-black text-black">Rp {Math.round(total).toLocaleString('id-ID')}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutConfirmOpen(true)}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full rounded-2xl bg-black px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>

                <Link to="/products" className="block text-center text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-black">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <ConfirmDialog
        isOpen={pendingRemoveId !== null}
        title="Remove item?"
        message="This item will be removed from your shopping cart."
        confirmLabel="Remove"
        isDanger
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={handleRemoveItem}
      />
      <ConfirmDialog
        isOpen={isCheckoutConfirmOpen}
        title="Place this order?"
        message="Please make sure your shipping and payment details are correct before checkout."
        confirmLabel="Checkout"
        onCancel={() => setIsCheckoutConfirmOpen(false)}
        onConfirm={handleCheckout}
      />
    </div>
  );
}
