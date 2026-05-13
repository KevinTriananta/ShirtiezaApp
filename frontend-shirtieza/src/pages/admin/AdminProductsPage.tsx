import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { Product, Category } from '../../types';
import ProductTable from '../../components/admin/products/ProductTable';
import ProductModal from '../../components/admin/products/ProductModal';

import { useProductForm } from '../../hooks/useProductForm';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
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

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

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
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all font-bold text-[11px] uppercase tracking-widest text-neutral-500">
            <Filter size={16} />
            Filter
          </button>
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
        onDelete={handleDelete} 
      />

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        selectedProduct={selectedProduct}
        categories={categories}
        isSaving={isSaving}
      />
    </div>
  );
}
