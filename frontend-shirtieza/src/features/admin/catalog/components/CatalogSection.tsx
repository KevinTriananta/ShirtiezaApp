import type { FormEvent, ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface CatalogSectionProps {
  title: string;
  count: number;
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
  extraInput?: ReactNode;
}

export default function CatalogSection({
  title,
  count,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onSubmit,
  children,
  extraInput,
}: CatalogSectionProps) {
  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Catalog</p>
          <h2 className="mt-1 font-black uppercase tracking-tight">{title}</h2>
        </div>
        <span className="rounded-full bg-neutral-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">{count}</span>
      </div>
      <form onSubmit={onSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input value={inputValue} onChange={(e) => onInputChange(e.target.value)} placeholder={inputPlaceholder} className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5" />
        {extraInput}
        <button className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10">
          <Plus size={15} />
          Add
        </button>
      </form>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
