import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe2, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-[22px] font-black italic tracking-tight mb-4">
              SHIRTIEZA
            </h3>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              Premium streetwear untuk gaya modern Anda. Temukan koleksi kaos dan apparel berkualitas tinggi yang menggabungkan kenyamanan dan style.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: <Globe2 size={15} strokeWidth={1.5} />, label: 'Website' },
                { icon: <ExternalLink size={15} strokeWidth={1.5} />, label: 'Social' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-xl border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-neutral-800/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/collections', label: 'Collections' },
                { to: '/categories', label: 'Categories' },
                { to: '/cart', label: 'Shopping Cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-500 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">
              Help
            </h4>
            <ul className="space-y-3">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Returns & Exchange'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-neutral-500 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center group-hover:bg-neutral-800 transition-colors duration-200">
                  <Mail size={14} strokeWidth={1.5} className="text-neutral-500" />
                </div>
                <span className="text-sm text-neutral-500">info@shirtieza.com</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center group-hover:bg-neutral-800 transition-colors duration-200">
                  <MapPin size={14} strokeWidth={1.5} className="text-neutral-500" />
                </div>
                <span className="text-sm text-neutral-500">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600 tracking-wide">
            &copy; {new Date().getFullYear()} Shirtieza. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
