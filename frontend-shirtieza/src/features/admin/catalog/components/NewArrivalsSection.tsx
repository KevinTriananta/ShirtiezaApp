import type { Product } from '@shared/types';

interface NewArrivalsSectionProps {
  products: Product[];
  selectedIds: number[];
  isSaving: boolean;
  isUnavailable: boolean;
  onToggle: (productId: number) => void;
  onSave: () => void;
}

export default function NewArrivalsSection({
  products,
  selectedIds,
  isSaving,
  isUnavailable,
  onToggle,
  onSave,
}: NewArrivalsSectionProps) {
  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white p-6 lg:col-span-2">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Homepage</p>
          <h2 className="mt-1 font-black uppercase tracking-tight">New Arrivals</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-neutral-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">{selectedIds.length}/4 selected</span>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isUnavailable}
            className="rounded-2xl bg-black px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:hover:translate-y-0"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {isUnavailable ? (
        <p className="rounded-2xl bg-red-50 p-5 text-sm text-red-600">Collection New Arrivals belum tersedia. Buat collection dengan slug new-arrivals terlebih dahulu.</p>
      ) : products.length === 0 ? (
        <p className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-400">Belum ada produk real di database.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isLocked = !isSelected && selectedIds.length >= 4;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onToggle(product.id)}
                disabled={isLocked}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${isSelected ? 'border-black bg-black text-white shadow-xl shadow-black/10' : 'border-neutral-200 bg-neutral-50 text-black hover:border-black/20 hover:bg-white'} ${isLocked ? 'cursor-not-allowed opacity-45' : ''}`}
              >
                <img src={product.image} alt={product.name} className="h-16 w-14 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-black">{product.name}</p>
                  <p className={`mt-1 text-[11px] ${isSelected ? 'text-white/60' : 'text-neutral-400'}`}>Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
