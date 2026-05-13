import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
  itemCount: number;
}

export default function CartSummary({
  subtotal,
  tax,
  shippingCost,
  total,
  isCheckingOut,
  onCheckout,
  itemCount
}: CartSummaryProps) {
  return (
    <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 lg:p-8 sticky top-28">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200/60">
        {[
          { label: 'Subtotal', value: subtotal },
          { label: 'Tax (5%)', value: Math.round(tax) },
          { label: 'Shipping', value: shippingCost },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-neutral-500">{row.label}</span>
            <span className="font-semibold text-black">Rp {row.value.toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-8">
        <span className="text-sm font-bold uppercase tracking-[0.1em]">Total</span>
        <span className="text-xl font-black text-black">
          Rp {Math.round(total).toLocaleString('id-ID')}
        </span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={isCheckingOut || itemCount === 0}
        isLoading={isCheckingOut}
        className="w-full py-4"
        size="lg"
      >
        Checkout
      </Button>

      <Link
        to="/products"
        className="block text-center mt-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors duration-200"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
