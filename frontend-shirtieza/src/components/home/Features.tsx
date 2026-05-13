import { Truck, Zap, Star } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Truck size={28} />,
      title: 'Swift Delivery',
      desc: 'Priority shipping on all luxury items worldwide.',
    },
    {
      icon: <Zap size={28} />,
      title: 'Elite Quality',
      desc: 'Every piece is hand-inspected for perfection.',
    },
    {
      icon: <Star size={28} />,
      title: 'Secured Payments',
      desc: 'Encrypted and ultra-safe transaction systems.',
    },
  ];

  return (
    <section className="py-16 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xl shadow-black/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
