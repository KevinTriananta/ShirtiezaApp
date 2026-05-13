import { X, Upload, Check, Loader2 } from 'lucide-react';
import type { Product, Category } from '../../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  formData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category_id: number;
    is_featured: boolean;
  };
  setFormData: (data: any) => void;
  selectedProduct: Product | null;
  categories: Category[];
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
          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Product Identity</label>
            <input
              type="text"
              required
              placeholder="e.g. Signature Oversized Hoodie"
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the aesthetic and material..."
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Price (IDR)</label>
            <input
              type="number"
              required
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Inventory Stock</label>
            <input
              type="number"
              required
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Category</label>
            <select
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold appearance-none cursor-pointer"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-12 h-6 rounded-full transition-all relative ${formData.is_featured ? 'bg-black' : 'bg-neutral-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_featured ? 'left-7' : 'left-1'}`} />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">Featured Item</span>
            </label>
          </div>

          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Imagery URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="https://unsplash.com/..."
                className="flex-grow px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <button type="button" className="p-4 bg-neutral-100 text-neutral-500 rounded-2xl hover:bg-black hover:text-white transition-all">
                <Upload size={20} />
              </button>
            </div>
          </div>

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
