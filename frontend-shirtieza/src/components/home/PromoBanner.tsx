export default function PromoBanner() {
  return (
    <section className="bg-black py-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Season Sale Up to <span className="text-white">40% OFF</span>
        </p>
        <div className="hidden md:flex gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Free Shipping over Rp 1.000.000</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">30-Day Elite Returns</p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Code: <span className="text-white underline">SHRTZ2024</span></p>
      </div>
    </section>
  );
}
