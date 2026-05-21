import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import type { Product, Category, Collection } from '../../types';
import ProductTable from '../../components/admin/products/ProductTable';
import ProductModal from '../../components/admin/products/ProductModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../providers/ToastContext';

import { useProductForm } from '../../hooks/useProductForm';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    loadProducts();
    loadCatalog();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getAllProducts();
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCatalog = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        categoryService.getAllCategories(),
        collectionService.getAllCollections(),
      ]);
      setCategories(catRes.data || []);
      setCollections(colRes.data || []);
    } catch (err) {
      console.error('Failed to load catalog', err);
    }
  };

  const {
    isModalOpen,
    setIsModalOpen,
    selectedProduct,
    formData,
    setFormData,
    isSaving,
    handleOpenModal,
    handleSave
  } = useProductForm(categories, loadProducts);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await productService.deleteProduct(pendingDeleteId);
      setPendingDeleteId(null);
      notify('Product deleted successfully.', 'success');
      loadProducts();
    } catch (err) {
      notify('Failed to delete product.', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || String(p.category?.id || (p as any).category_id) === categoryFilter;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' ? p.stock < 10 : p.stock >= 10);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="ready">Ready Stock</option>
          </select>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl hover:shadow-lg hover:shadow-black/20 transition-all font-bold text-[11px] uppercase tracking-widest"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <ProductTable 
        products={filteredProducts} 
        isLoading={isLoading} 
        onEdit={handleOpenModal} 
        onDelete={setPendingDeleteId} 
      />

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        selectedProduct={selectedProduct}
        categories={categories}
        collections={collections}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="Delete product?"
        message="This product will be removed from the admin catalog and storefront."
        confirmLabel="Delete"
        isDanger
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
