import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags,
  Users, 
  ShoppingBag, 
  Settings, 
  TicketPercent,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Tags size={20} />, label: 'Catalog', path: '/admin/catalog' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <TicketPercent size={20} />, label: 'Vouchers', path: '/admin/vouchers' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 lg:flex">
      {/* Sidebar */}
      <aside className="sticky top-0 z-20 flex max-h-screen flex-col border-b border-neutral-200 bg-white lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-100 p-4 lg:block lg:p-8">
          <div>
            <Link to="/" className="text-xl font-black uppercase tracking-tighter italic">
              Shirtieza<span className="text-neutral-400">.</span>
            </Link>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400 lg:mt-2 lg:text-[10px] lg:tracking-[0.2em]">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-500 transition-all hover:bg-red-50 hover:text-red-600 lg:hidden"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        <nav className="no-scrollbar flex gap-2 overflow-x-auto p-3 lg:block lg:flex-grow lg:space-y-1 lg:overflow-visible lg:p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-200 group lg:w-full ${
                  isActive 
                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-xs font-semibold tracking-tight lg:text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="hidden opacity-50 lg:block" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-neutral-100 p-4 lg:block">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-h-screen min-w-0 flex-grow flex-col lg:min-h-screen">
        <header className="z-10 flex h-[64px] items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6 lg:sticky lg:top-0 lg:h-[72px] lg:px-8">
          <h1 className="text-lg font-bold tracking-tight text-black">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
          </h1>
          <div className="flex min-w-0 items-center gap-3 lg:gap-4">
            <div className="min-w-0 text-right">
              <p className="text-sm font-bold text-black leading-none">{user.name}</p>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">{user.role}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <Users size={20} className="text-neutral-400" />
              )}
            </div>
          </div>
        </header>

        <div className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
