import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AlertCircle, CreditCard, Package, Truck } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { useToast } from '@app/providers/ToastContext';
import { orderService } from '@shared/api/orderService';
import { useWilayahSelection } from '@shared/hooks/useWilayahSelection';
import ConfirmDialog from '@shared/ui/ConfirmDialog';

export default function CheckoutNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { notify } = useToast();
  const { product, quantity, size, color } = location.state || {};
  const [shipping, setShipping] = useState({
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Indonesia',
    zip: '',
    paymentMethod: 'bank_transfer',
  });
  const {
    provinces, cities, districts, villages,
    selectedRegion, selectProvince, selectCity, selectDistrict, selectVillage
  } = useWilayahSelection();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isCheckoutConfirmOpen, setIsCheckoutConfirmOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-neutral-100 bg-neutral-50">
            <Package size={28} className="text-neutral-300" strokeWidth={1.4} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Invalid product data</h1>
          <p className="mt-3 text-sm text-neutral-400">Please choose a product again before checkout.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectProvince(Number(e.target.value));
    setShipping({ ...shipping, city: '', zip: '' });
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = Number(e.target.value);
    const city = cities.find((item) => item.id === cityId);
    selectCity(cityId);
    setShipping({ ...shipping, city: city ? `${city.type} ${city.name}` : '', zip: '' });
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectDistrict(Number(e.target.value));
    setShipping({ ...shipping, zip: '' });
  };
  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const villageId = Number(e.target.value);
    const village = villages.find((item) => item.id === villageId);
    selectVillage(villageId);
    setShipping({ ...shipping, zip: village?.pos_code || '' });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (!shipping.address.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      setError('Please complete shipping address before checkout.');
      notify('Please complete shipping address before checkout.', 'error');
      return;
    }
    setIsCheckoutConfirmOpen(false);
    setIsProcessing(true);
    setError('');
    try {
      const orderData = {
        user_id: user.id,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_country: shipping.country,
        shipping_zip: shipping.zip,
        shipping_cost: 50000,
        tax: Math.round(product.price * 0.05),
        payment_method: shipping.paymentMethod,
        items: [{
          product_id: product.id,
          quantity,
          size,
          color,
        }],
      };
      const response = await orderService.createOrder(orderData);
      notify('Order created successfully.', 'success');
      navigate(`/orders/${response.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create order. Please try again.');
      notify('Failed to create order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = product.discount_price ? product.discount_price * quantity : product.price * quantity;
  const discount = product.discount_price ? (product.price - product.discount_price) * quantity : 0;
  const shippingCost = 50000;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;
  const unitPrice = product.discount_price || product.price;

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      <div className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <button type="button" onClick={() => navigate('/')} className="text-neutral-400 transition-colors hover:text-black">Home</button>
            <span className="text-neutral-300">/</span>
            <button type="button" onClick={() => navigate(-1)} className="text-neutral-400 transition-colors hover:text-black">Product</button>
            <span className="text-neutral-300">/</span>
            <span className="font-medium text-neutral-600">Checkout</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight lg:mb-12 lg:text-3xl">Checkout Now</h1>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
          <section className="rounded-[28px] border border-neutral-100 bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Product</p>
                <h2 className="mt-1 text-lg font-black tracking-tight">Order Item</h2>
              </div>
              <span className="rounded-full bg-neutral-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">{quantity} item</span>
            </div>

            <div className="rounded-[24px] border border-neutral-100 bg-neutral-50/70 p-4 sm:p-5">
              <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 py-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-neutral-400">{product.category?.name || 'Shirtieza'}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-black">{product.name}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-neutral-600">Size {size}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-neutral-600">Color {color}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-neutral-600">Qty {quantity}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">Unit Price</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xl font-black text-black">Rp {unitPrice.toLocaleString('id-ID')}</span>
                        {product.discount_price && <span className="text-sm text-neutral-400 line-through">Rp {product.price.toLocaleString('id-ID')}</span>}
                      </div>
                    </div>
                    {discount > 0 && <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black text-red-500">Save Rp {discount.toLocaleString('id-ID')}</span>}
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                    <input name="address" value={shipping.address} onChange={handleInputChange} placeholder="Street address" className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                    <select value={selectedRegion.provinceId} onChange={handleProvinceChange} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                      <option value={0}>Select province</option>
                      {provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
                    </select>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select value={selectedRegion.cityId} onChange={handleCityChange} disabled={!selectedRegion.provinceId} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5 disabled:text-neutral-300">
                        <option value={0}>City / Regency</option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.type} {city.name}</option>)}
                      </select>
                      <select value={selectedRegion.districtId} onChange={handleDistrictChange} disabled={!selectedRegion.cityId} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5 disabled:text-neutral-300">
                        <option value={0}>District</option>
                        {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select value={selectedRegion.villageId} onChange={handleVillageChange} disabled={!selectedRegion.districtId} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5 disabled:text-neutral-300">
                        <option value={0}>Village</option>
                        {villages.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}
                      </select>
                      <input name="zip" value={shipping.zip} onChange={handleInputChange} placeholder="ZIP code" className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                    </div>
                    <input name="country" value={shipping.country} onChange={handleInputChange} placeholder="Country" className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-500">
                    <CreditCard size={15} />
                    Payment
                  </div>
                  <select name="paymentMethod" value={shipping.paymentMethod} onChange={handleInputChange} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="ewallet">E-Wallet</option>
                  </select>
                </div>

                <div className="space-y-4 border-t border-neutral-200/70 pt-5">
                  {[
                    { label: 'Subtotal', value: subtotal },
                    ...(discount > 0 ? [{ label: 'Discount', value: -discount }] : []),
                    { label: 'Tax (5%)', value: tax },
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
                  <span className="text-2xl font-black text-black">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutConfirmOpen(true)}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-black px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isCheckoutConfirmOpen}
        title="Place this order?"
        message="Please make sure your shipping and payment details are correct before checkout."
        confirmLabel="Place Order"
        onCancel={() => setIsCheckoutConfirmOpen(false)}
        onConfirm={handleCheckout}
      />
    </div>
  );
}
