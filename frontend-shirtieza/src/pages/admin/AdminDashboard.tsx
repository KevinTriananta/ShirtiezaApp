import { useEffect, useState } from 'react';
import { AlertCircle, Boxes, DollarSign, Package, ShoppingBag, TicketPercent, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/admin/StatCard';
import type { Order } from '../../types';

interface AdminStats {
  revenue: number;
  orders: number;
  active_orders: number;
  pending_orders: number;
  shipped_orders: number;
  users: number;
  products: number;
  low_stock_products: number;
  items_sold: number;
}

const emptyStats: AdminStats = {
  revenue: 0,
  orders: 0,
  active_orders: 0,
  pending_orders: 0,
  shipped_orders: 0,
  users: 0,
  products: 0,
  low_stock_products: 0,
  items_sold: 0,
};

const statusTone: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-violet-50 text-violet-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-neutral-100 text-neutral-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [statsRes, ordersRes] = await Promise.all([
        orderService.getAdminStats(),
        orderService.getAllOrders(),
      ]);
      setStats({ ...emptyStats, ...(statsRes.data || {}) });
      setRecentOrders((ordersRes.data || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setStats(emptyStats);
      setRecentOrders([]);
      setError('Dashboard data could not be loaded. Check backend connection or admin session.');
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { label: 'Revenue', value: `Rp ${Math.round(stats.revenue).toLocaleString('id-ID')}`, icon: <DollarSign size={20} />, trend: `${stats.active_orders} active`, positive: true },
    { label: 'Orders', value: stats.orders.toString(), icon: <ShoppingBag size={20} />, trend: `${stats.pending_orders} pending`, positive: stats.pending_orders === 0 },
    { label: 'Customers', value: stats.users.toString(), icon: <Users size={20} />, trend: 'real DB', positive: true },
    { label: 'Products', value: stats.products.toString(), icon: <Package size={20} />, trend: `${stats.low_stock_products} low`, positive: stats.low_stock_products === 0 },
  ];

  return (
      <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-neutral-400 mb-2">Realtime store overview</p>
          <h2 className="text-2xl font-black uppercase tracking-tight">Admin Dashboard</h2>
        </div>
        <button onClick={loadDashboard} className="w-full rounded-xl bg-black px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white sm:w-fit">
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {metrics.map((item) => <StatCard key={item.label} {...item} isLoading={isLoading} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card padding="lg" className="lg:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8 sm:items-center">
            <div>
              <h3 className="font-bold tracking-tight text-black">Recent Orders</h3>
              <p className="text-xs text-neutral-400 mt-1">Latest checkout activity from database</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">View All</Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
              No orders yet. Orders will appear here after customer checkout.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recentOrders.map((order) => {
                const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                return (
                    <Link key={order.id} to="/admin/orders" className="flex flex-col gap-3 rounded-xl px-2 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center font-black text-neutral-400 flex-shrink-0">#{String(order.id).padStart(3, '0')}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black truncate">{order.order_number}</p>
                          <p className="text-xs text-neutral-400">{itemCount} item • {order.shipping_city || 'No city'} • {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:block sm:text-right">
                      <p className="text-sm font-black">Rp {order.total.toLocaleString('id-ID')}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusTone[order.status] || statusTone.pending}`}>{order.status}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card padding="lg">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-4"><Boxes size={22} /></div>
            <h3 className="text-lg font-black tracking-tight text-black mb-2">Inventory Health</h3>
            <p className="text-sm text-neutral-400 mb-5">{stats.low_stock_products} products need restock. {stats.items_sold} items sold from non-cancelled orders.</p>
            <Link to="/admin/products"><Button className="w-full">Manage Products</Button></Link>
          </Card>

          <Card padding="lg">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mb-4"><TicketPercent size={22} /></div>
            <h3 className="text-lg font-black tracking-tight text-black mb-2">Vouchers</h3>
            <p className="text-sm text-neutral-400 mb-5">Create claimable percentage vouchers with expiry for customer checkout.</p>
            <Link to="/admin/vouchers"><Button variant="outline" className="w-full">Manage Vouchers</Button></Link>
          </Card>

          <Card padding="lg">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mb-4"><Truck size={22} /></div>
            <h3 className="text-lg font-black tracking-tight text-black mb-2">Fulfillment</h3>
            <p className="text-sm text-neutral-400 mb-5">{stats.pending_orders} orders waiting to process and {stats.shipped_orders} currently shipped.</p>
            <Link to="/admin/orders"><Button variant="outline" className="w-full">Process Orders</Button></Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
