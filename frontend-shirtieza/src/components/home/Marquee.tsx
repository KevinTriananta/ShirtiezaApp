export default function Marquee() {
  return (
    <section className="relative overflow-hidden bg-black py-5 border-y border-white/5">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 text-white text-[12px] font-black uppercase tracking-[0.5em] flex-shrink-0 opacity-80"
          >
            SHIRTIEZA LUXURY ✦ EST 2024 ✦ PRE-ORDER NOW ✦ WORLDWIDE SHIPPING
          </span>
        ))}
      </div>
    </section>
  );
}
