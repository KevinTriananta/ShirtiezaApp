import Button from '../ui/Button';

export default function Newsletter() {
  return (
    <section className="py-24 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[40px] overflow-hidden bg-black py-24 lg:py-32 px-8 lg:px-20 text-center">
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Join the<br />Collective.
            </h2>
            <p className="text-lg text-white/40 font-medium max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive early access to drops and member-only events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:bg-white/10 focus:border-white/20 outline-none transition-all"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
