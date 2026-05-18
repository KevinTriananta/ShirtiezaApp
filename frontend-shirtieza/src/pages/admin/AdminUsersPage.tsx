import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { userService } from '../../services/userService';
import UserCard from '../../components/admin/users/UserCard';
import Card from '../../components/ui/Card';
import type { User } from '../../types';

interface AdminUser extends User {
  created_at?: string;
  zip_code?: string;
}

const emptyForm = {
  name: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  zip_code: '',
  avatar: '',
  role: 'customer',
  password: '',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openUser = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      zip_code: user.zip_code || '',
      avatar: user.avatar || '',
      role: user.role || 'customer',
      password: '',
    });
  };

  const closeUser = () => {
    setSelectedUser(null);
    setFormData(emptyForm);
  };

  const saveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;
    try {
      setIsSaving(true);
      const payload = { ...formData };
      if (!payload.password.trim()) delete (payload as Partial<typeof payload>).password;
      await userService.adminUpdateUser(selectedUser.id, payload);
      await loadUsers();
      closeUser();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative max-w-md flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={loadUsers} className="px-5 py-3 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest">Refresh Users</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neutral-100" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-neutral-100 rounded" />
                  <div className="h-3 w-32 bg-neutral-100 rounded" />
                </div>
              </div>
              <div className="space-y-3"><div className="h-3 w-full bg-neutral-100 rounded" /><div className="h-3 w-2/3 bg-neutral-100 rounded" /></div>
            </Card>
          ))
        ) : filteredUsers.map((user) => (
          <UserCard key={user.id} user={{ ...user, created_at: user.created_at || new Date().toISOString() }} onView={() => openUser(user)} />
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={closeUser}>
          <form onSubmit={saveUser} className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Manage User</p>
                <h2 className="text-xl font-black uppercase">{selectedUser.email}</h2>
              </div>
              <button type="button" onClick={closeUser} className="p-2 rounded-xl hover:bg-neutral-100"><X size={20} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block"><span className="label-admin">Name</span><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Phone</span><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-admin" /></label>
              <label className="block md:col-span-2"><span className="label-admin">Address</span><input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">City</span><input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Country</span><input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">ZIP Code</span><input value={formData.zip_code} onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Role</span><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-admin bg-white"><option value="customer">Customer</option><option value="admin">Admin</option></select></label>
              <label className="block md:col-span-2"><span className="label-admin">Avatar URL</span><input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} className="input-admin" /></label>
              <label className="block md:col-span-2"><span className="label-admin">Reset Password</span><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Leave blank to keep current password" className="input-admin" /></label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={closeUser} className="px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-400">Cancel</button>
              <button disabled={isSaving} className="px-6 py-3 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50">{isSaving ? 'Saving...' : 'Save User'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
