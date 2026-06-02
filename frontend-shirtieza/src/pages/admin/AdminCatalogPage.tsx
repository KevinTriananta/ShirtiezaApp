import { useEffect, useState } from 'react';
import { useToast } from '@app/providers/ToastContext';
import CatalogRow from '@features/admin/catalog/components/CatalogRow';
import CatalogSection from '@features/admin/catalog/components/CatalogSection';
import NewArrivalsSection from '@features/admin/catalog/components/NewArrivalsSection';
import { categoryService } from '@shared/api/categoryService';
import { collectionService } from '@shared/api/collectionService';
import { productService } from '@shared/api/productService';
import type { Category, Collection, Product } from '@shared/types';
import ConfirmDialog from '@shared/ui/ConfirmDialog';

type PendingDelete =
  | { type: 'category'; item: Category }
  | { type: 'collection'; item: Collection }
  | null;

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newArrivalsCollection, setNewArrivalsCollection] = useState<Collection | null>(null);
  const [selectedNewArrivalIds, setSelectedNewArrivalIds] = useState<number[]>([]);
  const [isSavingNewArrivals, setIsSavingNewArrivals] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryCollectionId, setCategoryCollectionId] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const { notify } = useToast();

  useEffect(() => { load(); }, []);

  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const getCategorySlug = () => {
    const categorySlug = slugify(categoryName);
    const selectedCollection = collections.find((collection) => String(collection.id) === categoryCollectionId);
    const collectionSlug = selectedCollection ? slugify(selectedCollection.slug || selectedCollection.name) : '';
    return collectionSlug ? `${collectionSlug}-${categorySlug}` : categorySlug;
  };

  const load = async () => {
    const [catRes, colRes, productRes, newArrivalsRes] = await Promise.all([
      categoryService.getAllCategories(),
      collectionService.getAllCollections(),
      productService.getAllProducts({ page_size: 100, sort_by: 'newest' }),
      collectionService.getCollectionBySlug('new-arrivals').catch(() => null),
    ]);
    setCategories(catRes.data || []);
    setCollections(colRes.data || []);
    setProducts(productRes.data?.data || []);
    setNewArrivalsCollection(newArrivalsRes?.data || null);
    setSelectedNewArrivalIds((newArrivalsRes?.data?.products || []).slice(0, 4).map((product: Product) => product.id));
  };

  const addCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await categoryService.createCategory({
        name: categoryName.trim(),
        slug: getCategorySlug(),
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

  const toggleNewArrival = (productId: number) => {
    setSelectedNewArrivalIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= 4) {
        notify('New Arrivals hanya bisa menampilkan 4 produk.', 'error');
        return current;
      }
      return [...current, productId];
    });
  };

  const saveNewArrivals = async () => {
    if (!newArrivalsCollection) {
      notify('Collection New Arrivals belum tersedia.', 'error');
      return;
    }
    setIsSavingNewArrivals(true);
    try {
      const currentIds = [...new Set((newArrivalsCollection.products || []).map((product) => product.id))];
      await Promise.all([
        ...currentIds.map((id) => collectionService.removeProductFromCollection(newArrivalsCollection.id, id)),
      ]);
      for (const id of selectedNewArrivalIds) {
        await collectionService.addProductToCollection(newArrivalsCollection.id, id);
      }
      notify('Homepage New Arrivals updated.', 'success');
      await load();
    } catch (error) {
      notify('Failed to update Homepage New Arrivals.', 'error');
    } finally {
      setIsSavingNewArrivals(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <NewArrivalsSection
        products={products}
        selectedIds={selectedNewArrivalIds}
        isSaving={isSavingNewArrivals}
        isUnavailable={!newArrivalsCollection}
        onToggle={toggleNewArrival}
        onSave={saveNewArrivals}
      />

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
