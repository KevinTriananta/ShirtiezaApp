export default function Marquee() {
  return (
    <section className="relative overflow-hidden bg-black py-4 sm:py-5 border-y border-white/5">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
      <div className="marquee-track flex items-center gap-8 sm:gap-12 whitespace-nowrap transition-opacity duration-500 hover:opacity-70">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 sm:gap-8 text-white text-[10px] sm:text-[12px] font-black uppercase tracking-[0.34em] sm:tracking-[0.5em] flex-shrink-0 opacity-80"
          >
            SHIRTIEZA LUXURY ✦ EST 2026 ✦ PRE-ORDER NOW ✦ WORLDWIDE SHIPPING
          </span>
        ))}
      </div>
    </section>
  );
}
