import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, ShieldCheck, Package, Home, Grid3X3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@app/providers/AuthContext';
import { useCart } from '@app/providers/CartContext';
import ConfirmDialog from '@shared/ui/ConfirmDialog';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsLogoutConfirmOpen(false);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const mobileLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/products', label: 'Shop', icon: <ShoppingCart size={18} /> },
    { to: '/collections', label: 'Collections', icon: <Package size={18} /> },
    { to: '/categories', label: 'Categories', icon: <Grid3X3 size={18} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[998] bg-white py-3 lg:transition-all lg:duration-700 lg:ease-in-out ${isScrolled
          ? 'lg:bg-white/95 lg:shadow-sm lg:backdrop-blur-xl lg:py-1'
          : 'lg:bg-white lg:py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:flex lg:h-[68px] lg:justify-between">
          {/* Left Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Shop' },
              { to: '/collections', label: 'Collections' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 group ${location.pathname === link.to ? 'text-black' : 'text-neutral-400 hover:text-black'
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-black transition-all duration-500 ease-out ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="relative z-[1000] flex items-center lg:hidden">
          <button
            className={`-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-black transition-all hover:bg-neutral-50 ${isScrolled ? 'lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-neutral-100' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={25} strokeWidth={1.8} />}
          </button>
          </div>

          {/* Center Logo */}
          <Link
            to="/"
            className="justify-self-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center group"
            onClick={closeMenu}
          >
            <span className="text-[20px] sm:text-2xl lg:text-3xl font-black tracking-tighter text-black italic group-hover:scale-105 transition-transform duration-500">
              SHIRTIEZA<span className="text-neutral-300">.</span>
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1 lg:gap-4">
            {/* Admin Access */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:shadow-lg hover:shadow-black/20 transition-all duration-300 animate-pulse"
              >
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
              </Link>
            )}

            {/* Search */}
            <button onClick={() => setIsSearchOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all" aria-label="Search products">
              <Search size={19} strokeWidth={1.8} />
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-neutral-50 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold">
                    {user?.name?.[0]}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition-all"
              >
                <User size={18} />
              </Link>
            )}

            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all lg:hidden"
              aria-label={isAuthenticated ? 'Profile' : 'Login'}
              onClick={closeMenu}
            >
              {isAuthenticated && user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
              ) : isAuthenticated ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-black text-black">{user?.name?.[0]}</span>
              ) : (
                <User size={19} strokeWidth={1.8} />
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all"
              onClick={closeMenu}
              aria-label="Cart"
            >
              <ShoppingCart size={19} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black/80 text-white text-[9px] font-black rounded-full h-[16px] w-[16px] flex items-center justify-center ring-2 ring-white/80 backdrop-blur-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/25 lg:hidden" onClick={closeMenu}>
          <div className="flex h-full w-[84vw] max-w-[340px] flex-col overflow-y-auto bg-white px-5 pb-8 pt-5 shadow-2xl animate-slide-in-left" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex h-12 items-center justify-between">
              <button onClick={closeMenu} className="-ml-2 flex h-10 w-10 items-center justify-center text-black" aria-label="Close menu">
                <X size={24} strokeWidth={1.8} />
              </button>
              <Link to="/" onClick={closeMenu} className="text-xl font-black italic tracking-tighter text-black">
                SHIRTIEZA
              </Link>
              <div className="h-10 w-10" />
            </div>
            <nav className="grid gap-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between rounded-2xl px-4 py-4 transition-all ${location.pathname === link.to ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'}`}
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.22em]">
                    {link.icon}
                    {link.label}
                  </span>
                  <span className="text-lg leading-none">›</span>
                </Link>
              ))}
            </nav>

            <div className="mt-5 rounded-3xl border border-neutral-100 bg-neutral-50 p-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center justify-between rounded-2xl bg-black p-4 text-white" onClick={closeMenu}>
                      <span className="text-[11px] font-black uppercase tracking-widest">Admin Dashboard</span>
                      <ShieldCheck size={18} />
                    </Link>
                  )}
                  <button onClick={() => setIsLogoutConfirmOpen(true)} className="w-full rounded-2xl bg-white p-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-red-500">
                    Logout Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="rounded-2xl border border-black p-4 text-center text-[11px] font-black uppercase tracking-widest" onClick={closeMenu}>Login</Link>
                  <Link to="/register" className="rounded-2xl bg-black p-4 text-center text-[11px] font-black uppercase tracking-widest text-white" onClick={closeMenu}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Logout account?"
        message="You will need to sign in again to access your cart, orders, and profile."
        confirmLabel="Logout"
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center px-4 sm:px-6 pt-24 sm:pt-28" onClick={() => setIsSearchOpen(false)}>
          <form onSubmit={submitSearch} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-3xl p-3 sm:p-4 shadow-2xl flex gap-2 sm:gap-3">
            <input autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search hoodie, tee, jacket..." className="min-w-0 flex-1 px-3 sm:px-4 py-3 outline-none text-base sm:text-lg font-bold" />
            <button className="bg-black text-white px-4 sm:px-6 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
