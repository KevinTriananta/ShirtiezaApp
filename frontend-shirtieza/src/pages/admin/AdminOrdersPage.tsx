import { useEffect, useState } from 'react';
import { Search, RefreshCw, PackageCheck, Truck, XCircle, FileText } from 'lucide-react';
import type { Order } from '../../types';
import { orderService } from '../../services/orderService';
import { API_BASE_URL } from '../../config/env';

const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const getPaymentProofUrl = (proof?: string) => {
  if (!proof) return '';
  return proof.startsWith('http') ? proof : `${apiOrigin}${proof}`;
};

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  processing: 'bg-blue-50 text-blue-700 border-blue-100',
  shipped: 'bg-violet-50 text-violet-700 border-violet-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-neutral-100 text-neutral-500 border-neutral-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (order: Order, status: string) => {
    try {
      setUpdatingId(order.id);
      const payment_status = status === 'cancelled' ? order.payment_status : order.payment_status;
      await orderService.updateOrderStatus(order.id, { status, payment_status });
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePaymentStatus = async (order: Order, paymentStatus: string) => {
    try {
      setUpdatingId(order.id);
      await orderService.updateOrderStatus(order.id, { status: order.status, payment_status: paymentStatus });
      const response = await orderService.getAllOrders();
      const nextOrders = response.data || [];
      setOrders(nextOrders);
      setSelectedOrder((current) => current?.id === order.id ? nextOrders.find((item) => item.id === order.id) || current : current);
    } catch (error) {
      console.error('Failed to update payment status', error);
      alert('Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(keyword) ||
      order.shipping_city.toLowerCase().includes(keyword) ||
      order.status.toLowerCase().includes(keyword)
    );
  });

  const totals = orders.reduce(
    (acc, order) => {
      if (order.status !== 'cancelled') acc.revenue += order.total;
      acc.items += order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      return acc;
    },
    { revenue: 0, items: 0 }
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Orders</p>
          <p className="text-2xl font-black mt-2">{orders.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Revenue</p>
          <p className="text-2xl font-black mt-2">Rp {totals.revenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Items Sold</p>
          <p className="text-2xl font-black mt-2">{totals.items}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative max-w-md flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search order, city, or status..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-black/20 transition-all"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Ship To</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 w-32 bg-neutral-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="h-4 w-48 bg-neutral-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="h-4 w-24 bg-neutral-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="h-4 w-24 bg-neutral-100 rounded" /></td>
                    <td className="px-6 py-5"><div className="h-7 w-24 bg-neutral-100 rounded-full" /></td>
                    <td className="px-6 py-5"><div className="h-10 w-32 bg-neutral-100 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-neutral-400">No orders found.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-6 py-5 align-top">
                    <p className="text-sm font-black text-black">{order.order_number}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                    <button onClick={() => setSelectedOrder(order)} className="text-[10px] font-black uppercase tracking-widest text-black underline mt-2">Detail</button>
                  </td>
                  <td className="px-6 py-5 align-top min-w-[260px]">
                    <div className="space-y-2">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.image && <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">{item.product?.name || `Product #${item.product_id}`}</p>
                             <p className="text-[10px] text-neutral-400">Qty {item.quantity} {[item.size && `Size ${item.size}`, item.color && `Color ${item.color}`].filter(Boolean).join(' / ')} x Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <p className="text-xs font-bold text-black">{order.shipping_city}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{order.shipping_country}</p>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <p className="text-sm font-black">Rp {order.total.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">{order.payment_status}</p>
                    {order.payment_proof && <a href={getPaymentProofUrl(order.payment_proof)} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-black underline">Proof</a>}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status] || statusStyles.pending}`}>
                      {order.status === 'delivered' && <PackageCheck size={12} />}
                      {order.status === 'shipped' && <Truck size={12} />}
                      {order.status === 'cancelled' && <XCircle size={12} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) => updateStatus(order, event.target.value)}
                      className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white outline-none focus:border-black disabled:opacity-50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <select
                      value={order.payment_status}
                      disabled={updatingId === order.id}
                      onChange={(event) => updatePaymentStatus(order, event.target.value)}
                      className="mt-2 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white outline-none focus:border-black disabled:opacity-50"
                    >
                      {['unpaid', 'waiting_confirmation', 'paid', 'rejected', 'refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-end" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white h-full w-full max-w-lg p-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black uppercase mb-2">{selectedOrder.order_number}</h2>
            <p className="text-sm text-neutral-400 mb-6">Invoice Preview</p>
            <div className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Payment Proof</p>
                  <p className="mt-1 text-sm font-bold text-black">Status: {selectedOrder.payment_status}</p>
                </div>
                <select
                  value={selectedOrder.payment_status}
                  disabled={updatingId === selectedOrder.id}
                  onChange={(event) => updatePaymentStatus(selectedOrder, event.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-black disabled:opacity-50"
                >
                  {['unpaid', 'waiting_confirmation', 'paid', 'rejected', 'refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              {selectedOrder.payment_proof ? (
                selectedOrder.payment_proof.toLowerCase().endsWith('.pdf') ? (
                  <a href={getPaymentProofUrl(selectedOrder.payment_proof)} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm font-bold text-black underline"><FileText size={17} /> Open PDF proof</a>
                ) : (
                  <a href={getPaymentProofUrl(selectedOrder.payment_proof)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <img src={getPaymentProofUrl(selectedOrder.payment_proof)} alt="Payment proof" className="max-h-80 w-full object-contain" />
                  </a>
                )
              ) : (
                <p className="rounded-xl bg-white p-4 text-sm text-neutral-400">Customer has not uploaded payment proof yet.</p>
              )}
            </div>
            <div className="space-y-4 mb-6">
              {(selectedOrder.items || []).map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.product?.name || `Product #${item.product_id}`} x {item.quantity}</span><b>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</b></div>)}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <p><b>Ship to:</b> {selectedOrder.shipping_address}, {selectedOrder.shipping_city}</p>
              <p><b>Payment:</b> {selectedOrder.payment_method}</p>
              <p><b>Total:</b> Rp {selectedOrder.total.toLocaleString('id-ID')}</p>
              <p><b>Tracking:</b> SHZ-{String(selectedOrder.id).padStart(5, '0')}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-8 w-full bg-black text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
