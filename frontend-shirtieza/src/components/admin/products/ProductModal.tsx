import { X, Check, Loader2 } from 'lucide-react';
import type { Product, Category, Collection } from '../../../types';
import type { ProductFormData, UpdateProductForm } from './productFormTypes';
import { ProductCollectionFields, ProductIdentityFields, ProductImageFields, ProductPricingFields } from './ProductModalSections';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  formData: ProductFormData;
  setFormData: UpdateProductForm;
  selectedProduct: Product | null;
  categories: Category[];
  collections: Collection[];
  isSaving: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  selectedProduct,
  categories,
  collections,
  isSaving
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => !isSaving && onClose()}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase">
              {selectedProduct ? 'Refine Product' : 'New Collection Item'}
            </h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white hover:shadow-sm rounded-full transition-all"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <ProductIdentityFields formData={formData} setFormData={setFormData} />
          <ProductPricingFields formData={formData} setFormData={setFormData} />
          <ProductCollectionFields formData={formData} setFormData={setFormData} categories={categories} collections={collections} />
          <ProductImageFields formData={formData} setFormData={setFormData} />

          <div className="col-span-2 flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-all"
              disabled={isSaving}
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-3 px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-black/30 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {selectedProduct ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
