import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Package, ChevronRight, AlertCircle, Check, Mail, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { useToast } from '@app/providers/ToastContext';
import { userService } from '@shared/api/userService';
import WilayahFields from '@shared/components/WilayahFields';
import type { Order } from '@shared/types';
import ConfirmDialog from '@shared/ui/ConfirmDialog';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { notify } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    zip_code: user?.zip_code || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); }
    else if (user?.id) { loadOrders(); }
  }, [isAuthenticated, user?.id, navigate]);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      zip_code: user?.zip_code || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  const loadOrders = async () => {
    try {
      if (!user?.id) return;
      const response = await userService.getUserOrders(user.id);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    notify('You have been logged out.', 'info');
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await userService.updateUserProfile(user.id, formData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      notify('Profile updated successfully.', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      notify('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 lg:pt-[72px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2.5';

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 lg:pt-[72px]">
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] tracking-wide">
              <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-600 font-medium">Profile</span>
            </div>
            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-black px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-all duration-200"
            >
              <LogOut size={14} strokeWidth={1.5} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-scale-in ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-600'
          }`}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 lg:p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-neutral-100 rounded-3xl flex items-center justify-center mb-4 overflow-hidden border border-neutral-100">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User size={34} className="text-neutral-400" strokeWidth={1.2} />}
                </div>
                <h2 className="text-lg font-bold text-black">{user.name}</h2>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{user.role}</p>
              </div>
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                {[
                  { label: 'Email', value: user.email, icon: <Mail size={15} /> },
                  { label: 'Phone', value: user.phone, icon: <Phone size={15} /> },
                  { label: 'Address', value: user.address, icon: <MapPin size={15} /> },
                  { label: 'Location', value: [user.city, user.country, user.zip_code].filter(Boolean).join(', '), icon: <MapPin size={15} /> },
                
                ].map((item) => item.value ? (
                  <div key={item.label} className="flex gap-3">
                    <span className="mt-0.5 text-neutral-300">{item.icon}</span>
                    <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">{item.label}</p>
                    <p className="break-words text-sm font-medium text-black">{item.value}</p>
                    </div>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Account Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-black px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-all duration-200"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                  </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} />
                  </div>
                  <WilayahFields
                    city={formData.city}
                    country={formData.country || 'Indonesia'}
                    zipCode={formData.zip_code}
                    onCityChange={(city) => setFormData({ ...formData, city })}
                    onCountryChange={(country) => setFormData({ ...formData, country })}
                    onZipCodeChange={(zipCode) => setFormData({ ...formData, zip_code: zipCode })}
                    labelClass={labelClass}
                    inputClass={inputClass}
                  />
                  <div>
                    <label className={labelClass}>Avatar URL</label>
                    <input type="text" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} placeholder="https://..." className={inputClass} />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Phone', value: user.phone || 'Not provided' },
                    { label: 'Address', value: user.address || 'Not provided' },
                    { label: 'City', value: user.city || 'Not provided' },
                    { label: 'Country', value: user.country || 'Not provided' },
                    { label: 'ZIP Code', value: user.zip_code || 'Not provided' },
                    { label: 'Avatar URL', value: user.avatar || 'Not provided' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">{item.label}</p>
                      <p className="break-words text-sm font-medium text-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 lg:p-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">Your Orders</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 skeleton rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <Package size={24} className="text-neutral-300" strokeWidth={1.2} />
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">No orders yet</p>
                  <Link to="/products" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-5 py-2.5 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="flex flex-col gap-3 py-4 px-4 rounded-xl hover:bg-neutral-50 transition-all duration-200 group sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-black">{order.order_number}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400">
                          {(order.items || []).slice(0, 2).map((item) => [item.product?.name || `Product #${item.product_id}`, item.size && `Size ${item.size}`, item.color && `Color ${item.color}`].filter(Boolean).join(' · ')).join(' / ')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-black">Rp {order.total.toLocaleString('id-ID')}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${order.status === 'delivered' ? 'text-emerald-600' : 'text-neutral-400'}`}>
                            {order.status}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-neutral-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Logout from account?"
        message="You will need to sign in again to access your cart, orders, and profile."
        confirmLabel="Logout"
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
