import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Package
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await orderService.getAdminStats();
        if (res.data) {
          setStats({
            revenue: res.data.revenue || 0,
            orders: res.data.orders || 0,
            users: res.data.users || 0,
            products: res.data.products || 0
          });
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    loadStats();
  }, []);

  const metrics = [
    { label: 'Total Revenue', value: `Rp ${stats.revenue.toLocaleString()}`, icon: <DollarSign size={20} />, trend: '+12%', positive: true },
    { label: 'Total Orders', value: stats.orders.toString(), icon: <ShoppingBag size={20} />, trend: '+5%', positive: true },
    { label: 'Total Customers', value: stats.users.toString(), icon: <Users size={20} />, trend: '+18%', positive: true },
    { label: 'Active Products', value: stats.products.toString(), icon: <Package size={20} />, trend: '0%', positive: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold tracking-tight text-black">Recent Orders</h3>
            <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-neutral-400">
                    #00{item}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">Customer Name</p>
                    <p className="text-xs text-neutral-400">2 items • Rp 500,000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Processing</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-black mb-4">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-black mb-2">Ready to Scale?</h3>
          <p className="text-sm text-neutral-400 max-w-xs mb-6">Analyze your sales data and optimize your inventory for the next big drop.</p>
          <Button>Get Full Report</Button>
        </Card>
      </div>
    </div>
  );
}
