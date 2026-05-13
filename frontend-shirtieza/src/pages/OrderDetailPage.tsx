import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Order } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from '../providers/AuthContext';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (id) loadOrder();
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(parseInt(id!));
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Loading</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px] flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-neutral-500">Order not found</p>
        <Link to="/profile" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block">
          Back to Profile
        </Link>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-violet-50 text-violet-700 border-violet-100',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelled: 'bg-neutral-100 text-neutral-500 border-neutral-200',
  };

  const paymentStyles: Record<string, string> = {
    unpaid: 'bg-amber-50 text-amber-700 border-amber-100',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 lg:pt-[72px]">
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <Link to="/profile" className="text-neutral-400 hover:text-black transition-colors duration-200">Profile</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Order {order.order_number}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 hover:text-black mb-8 transition-colors duration-300 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 lg:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight mb-1">Order {order.order_number}</h1>
              <p className="text-sm text-neutral-400">{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg border ${statusStyles[order.status] || 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                {order.status}
              </span>
              <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg border ${paymentStyles[order.payment_status] || 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-5">Order Items</h2>
              <div className="divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-black">Product #{item.product_id}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-black">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-5">Shipping Address</h2>
              <div className="text-sm text-neutral-600 leading-relaxed space-y-1">
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_zip}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 lg:p-8 sticky top-28">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-5">Order Summary</h2>
              <div className="space-y-3 pb-4 border-b border-neutral-100">
                {[
                  { label: 'Subtotal', value: order.subtotal },
                  { label: 'Tax', value: order.tax },
                  { label: 'Shipping', value: order.shipping_cost },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-neutral-500">{row.label}</span>
                    <span className="font-semibold text-black">Rp {row.value.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.1em]">Total</span>
                <span className="text-lg font-black text-black">Rp {order.total.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-5 pt-5 border-t border-neutral-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">Payment Method</p>
                <p className="text-sm font-medium text-black">{order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
