import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white pt-24 flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">404</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Page Not Found</h1>
        <p className="text-sm text-neutral-500 mb-8">Halaman yang kamu buka tidak tersedia atau sudah dipindahkan.</p>
        <Link to="/products" className="inline-flex bg-black text-white px-7 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
