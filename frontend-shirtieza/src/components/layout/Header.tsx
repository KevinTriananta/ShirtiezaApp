import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { useCart } from '../../providers/CartContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
  };

  const cartCount = items.length;
  const isAdmin = user?.role === 'admin';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${isScrolled
          ? 'glass-effect py-1'
          : 'bg-white py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
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
          <button
            className="lg:hidden text-black p-2 rounded-xl hover:bg-neutral-50 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Center Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
          >
            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-black italic group-hover:scale-105 transition-transform duration-500">
              SHIRTIEZA<span className="text-neutral-300">.</span>
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
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
            <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition-all">
              <Search size={18} strokeWidth={2} />
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

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition-all"
            >
              <ShoppingCart size={18} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] font-black rounded-full h-[16px] w-[16px] flex items-center justify-center ring-4 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-neutral-100 animate-fade-in-up">
          <nav className="flex flex-col p-6 gap-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Shop' },
              { to: '/collections', label: 'Collections' },
              { to: '/categories', label: 'Categories' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-black p-4 rounded-2xl hover:bg-neutral-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-black uppercase tracking-[0.2em] text-white bg-black p-4 rounded-2xl flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
                <ShieldCheck size={18} />
              </Link>
            )}

            <div className="mt-4 pt-4 border-t border-neutral-100">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center p-4 text-sm font-black uppercase tracking-[0.2em] text-red-500"
                >
                  Logout Account
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="text-center text-xs font-black uppercase tracking-widest border border-black p-4 rounded-2xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center text-xs font-black uppercase tracking-widest bg-black text-white p-4 rounded-2xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

