import { useEffect, useState } from 'react';
import { Calendar, Edit3, Mail, MapPin, RefreshCw, Save, Search, Shield, User as UserIcon, X } from 'lucide-react';
import { useToast } from '@app/providers/ToastContext';
import { userService } from '@shared/api/userService';
import type { User } from '@shared/types';

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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const { notify } = useToast();

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
    setIsEditing(false);
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

  const saveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;
    try {
      setIsSaving(true);
      const payload = { ...formData };
      if (!payload.password.trim()) delete (payload as Partial<typeof payload>).password;
      await userService.adminUpdateUser(selectedUser.id, payload);
      await loadUsers();
      setSelectedUser({ ...selectedUser, ...payload });
      setIsEditing(false);
      notify('User updated successfully.', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Failed to update user.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );
  const activeUser = selectedUser || filteredUsers[0] || null;

  const selectUser = (user: AdminUser) => openUser(user);

  const closeEditMenu = () => {
    setIsEditing(false);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">User Manager</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-black">{filteredUsers.length} Users</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={loadUsers}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <div className="hidden grid-cols-[minmax(220px,1.2fr)_130px_minmax(220px,1fr)] gap-4 border-b border-neutral-100 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 lg:grid">
            <span>Full Name</span>
            <span>Status</span>
            <span>Email</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="grid gap-4 px-5 py-4 animate-pulse lg:grid-cols-[minmax(220px,1.2fr)_130px_minmax(220px,1fr)] lg:px-6">
                  <div className="flex items-center gap-4"><div className="h-11 w-11 rounded-full bg-neutral-100" /><div className="h-4 w-36 rounded bg-neutral-100" /></div>
                  <div className="h-6 w-20 rounded-full bg-neutral-100" />
                  <div className="h-4 w-44 rounded bg-neutral-100" />
                </div>
              ))
            ) : filteredUsers.length ? (
              filteredUsers.map((user) => {
                const isActive = activeUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user)}
                    className={`grid w-full gap-3 px-5 py-4 text-left transition-all hover:bg-neutral-50 lg:grid-cols-[minmax(220px,1.2fr)_130px_minmax(220px,1fr)] lg:gap-4 lg:px-6 ${isActive ? 'bg-neutral-50 shadow-[inset_3px_0_0_#000]' : ''}`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 text-black">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : <UserIcon size={20} strokeWidth={1.7} />}
                      </span>
                      <span>
                        <span className="block font-bold text-black">{user.name}</span>
                        <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-neutral-400">ID #{user.id}</span>
                      </span>
                    </span>
                    <span className="flex items-center">
                      <RoleBadge role={user.role} />
                    </span>
                    <span className="flex items-center text-sm font-medium text-neutral-500">{user.email}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-6 py-16 text-center text-sm font-medium text-neutral-400">No users found.</div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-neutral-200 bg-white p-6 xl:sticky xl:top-6 xl:self-start">
          {activeUser ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">User Information</h3>
                  <div className="mt-2"><RoleBadge role={activeUser.role} /></div>
                </div>
                <button
                  onClick={() => { selectUser(activeUser); setIsEditing(true); }}
                  className="rounded-2xl p-3 text-neutral-400 transition-all hover:bg-black hover:text-white"
                  title="Edit user"
                >
                  <Edit3 size={18} />
                </button>
              </div>

              <div className="mt-8 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
                  {activeUser.avatar ? <img src={activeUser.avatar} alt={activeUser.name} className="h-full w-full object-cover" /> : <UserIcon size={44} strokeWidth={1.4} />}
                </div>
                <h4 className="mt-4 text-xl font-black tracking-tight">{activeUser.name}</h4>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-neutral-400">#{activeUser.id}</p>
              </div>

              <div className="mt-8 space-y-5">
                <InfoRow icon={<Mail size={18} />} label="Email" value={activeUser.email} />
                <InfoRow icon={<MapPin size={18} />} label="Location" value={[activeUser.city, activeUser.country].filter(Boolean).join(', ') || 'Not specified'} />
                <InfoRow icon={<Calendar size={18} />} label="Joined" value={formatDate(activeUser.created_at)} />
                <InfoRow icon={<Shield size={18} />} label="Role" value={activeUser.role} />
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-sm font-medium text-neutral-400">Select a user to view details.</div>
          )}
        </aside>
      </div>

      {isEditing && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in" onClick={closeEditMenu}>
          <form
            onSubmit={saveUser}
            className="w-full max-w-xl max-h-[86vh] overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl animate-scale-in sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Edit User</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-black">{selectedUser.name}</h3>
                <p className="mt-1 text-xs font-medium text-neutral-400">{selectedUser.email}</p>
              </div>
              <button type="button" onClick={closeEditMenu} className="rounded-2xl p-3 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              <label className="block"><span className="label-admin">Name</span><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Phone</span><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-admin" /></label>
              <label className="block md:col-span-2"><span className="label-admin">Address</span><input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">City</span><input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Country</span><input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">ZIP Code</span><input value={formData.zip_code} onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} className="input-admin" /></label>
              <label className="block"><span className="label-admin">Role</span><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-admin bg-white"><option value="customer">Customer</option><option value="admin">Admin</option></select></label>
              <label className="block md:col-span-2"><span className="label-admin">Avatar URL</span><input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} placeholder="https://..." className="input-admin" /></label>
              <label className="block md:col-span-2"><span className="label-admin">Reset Password</span><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Leave blank to keep current password" className="input-admin" /></label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeEditMenu} className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 transition-all hover:text-black">
                <X size={15} />
                Cancel
              </button>
              <button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-xl hover:shadow-black/10 disabled:opacity-50">
                <Save size={15} />
                {isSaving ? 'Saving' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
      {role === 'admin' ? 'Admin' : 'Active'}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 text-neutral-300">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-neutral-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-neutral-600">{value}</p>
      </div>
    </div>
  );
}
