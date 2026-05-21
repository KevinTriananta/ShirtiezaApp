export default function PromoBanner() {
  return (
    <section className="bg-black py-3 sm:py-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left animate-fade-in">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.3em] text-white/45 transition-colors duration-300 hover:text-white/75">
          Season Sale Up to <span className="text-white">40% OFF</span>
        </p>
        <div className="hidden lg:flex gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:text-white/70">Free Shipping over Rp 1.000.000</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:text-white/70">30-Day Elite Returns</p>
        </div>
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.3em] text-white/45 transition-colors duration-300 hover:text-white/75">Code: <span className="text-white underline decoration-white/30 underline-offset-4">SHRTZ2026</span></p>
      </div>
    </section>
  );
}
