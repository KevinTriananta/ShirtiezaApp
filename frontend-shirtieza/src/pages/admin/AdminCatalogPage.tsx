import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../providers/ToastContext';
import type { Category, Collection } from '../../types';

type PendingDelete =
  | { type: 'category'; item: Category }
  | { type: 'collection'; item: Collection }
  | null;

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryCollectionId, setCategoryCollectionId] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const { notify } = useToast();

  useEffect(() => { load(); }, []);

  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const load = async () => {
    const [catRes, colRes] = await Promise.all([categoryService.getAllCategories(), collectionService.getAllCollections()]);
    setCategories(catRes.data || []);
    setCollections(colRes.data || []);
  };

  const addCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await categoryService.createCategory({
        name: categoryName,
        slug: slugify(categoryName),
        description: `${categoryName} category`,
        collection_id: categoryCollectionId ? Number(categoryCollectionId) : null,
      });
      setCategoryName('');
      setCategoryCollectionId('');
      await load();
      notify('Category created successfully.', 'success');
    } catch (error) {
      notify('Failed to create category.', 'error');
    }
  };

  const addCollection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!collectionName.trim()) return;
    try {
      await collectionService.createCollection({ name: collectionName, slug: slugify(collectionName), description: `${collectionName} curated drop`, is_active: true });
      setCollectionName('');
      await load();
      notify('Collection created successfully.', 'success');
    } catch (error) {
      notify('Failed to create collection.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      if (pendingDelete.type === 'category') {
        await categoryService.deleteCategory(pendingDelete.item.id);
        notify('Category deleted successfully.', 'success');
      } else {
        await collectionService.deleteCollection(pendingDelete.item.id);
        notify('Collection deleted successfully.', 'success');
      }
      setPendingDelete(null);
      await load();
    } catch (error) {
      notify(`Failed to delete ${pendingDelete.type}.`, 'error');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <CatalogSection
        title="Categories"
        count={categories.length}
        inputValue={categoryName}
        inputPlaceholder="New category"
        onInputChange={setCategoryName}
        onSubmit={addCategory}
        extraInput={
          <select value={categoryCollectionId} onChange={(e) => setCategoryCollectionId(e.target.value)} className="rounded-2xl border border-neutral-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 outline-none transition-all focus:border-black/20 focus:ring-4 focus:ring-black/5">
            <option value="">All Collections</option>
            {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
          </select>
        }
      >
        {categories.map((item) => (
          <CatalogRow key={item.id} label={item.name} slug={item.slug} meta={item.collection?.name || 'All collections'} onDelete={() => setPendingDelete({ type: 'category', item })} />
        ))}
      </CatalogSection>

      <CatalogSection
        title="Collections"
        count={collections.length}
        inputValue={collectionName}
        inputPlaceholder="New collection"
        onInputChange={setCollectionName}
        onSubmit={addCollection}
      >
        {collections.map((item) => (
          <CatalogRow key={item.id} label={item.name} slug={item.slug || ''} onDelete={() => setPendingDelete({ type: 'collection', item })} />
        ))}
      </CatalogSection>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        title={`Delete ${pendingDelete?.type || 'item'}?`}
        message={`This will permanently remove "${pendingDelete?.item.name || ''}" from the catalog.`}
        confirmLabel="Delete"
        isDanger
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CatalogSection({
  title,
  count,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onSubmit,
  children,
  extraInput,
}: {
  title: string;
  count: number;
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  children: React.ReactNode;
  extraInput?: React.ReactNode;
}) {
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

function CatalogRow({ label, slug, meta, onDelete }: { label: string; slug: string; meta?: string; onDelete: () => void }) {
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
