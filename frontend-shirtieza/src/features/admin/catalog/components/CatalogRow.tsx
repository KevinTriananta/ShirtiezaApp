import { Trash2 } from 'lucide-react';

interface CatalogRowProps {
  label: string;
  slug: string;
  meta?: string;
  onDelete: () => void;
}

export default function CatalogRow({ label, slug, meta, onDelete }: CatalogRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-3 transition-all hover:bg-neutral-100/70">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-black">{label}</p>
        <p className="mt-1 truncate text-xs font-medium text-neutral-400">/{slug}{meta ? ` • ${meta}` : ''}</p>
      </div>
      <button onClick={onDelete} className="rounded-xl p-2 text-neutral-300 transition-all hover:bg-red-50 hover:text-red-600" title="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
