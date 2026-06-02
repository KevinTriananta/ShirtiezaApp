import { ImagePlus, Trash2 } from 'lucide-react';
import type { CollectionCategoryFieldsProps, ProductFormSectionProps } from './productFormTypes';
import { getAdditionalImages, getFilteredCategories, getNextCollectionFormData } from './productFormTypes';

export function ProductIdentityFields({ formData, setFormData }: ProductFormSectionProps) {
  return (
    <>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Product Identity</label>
        <input type="text" required placeholder="e.g. Signature Oversized Hoodie" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Description</label>
        <textarea rows={3} placeholder="Describe the aesthetic and material..." className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
    </>
  );
}

export function ProductPricingFields({ formData, setFormData }: ProductFormSectionProps) {
  return (
    <>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Price (IDR)</label>
        <input type="number" required className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Inventory Stock</label>
        <input type="number" required className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} />
      </div>
    </>
  );
}

export function ProductCollectionFields({ formData, setFormData, categories, collections }: CollectionCategoryFieldsProps) {
  const selectedCollectionIds = formData.collection_ids || [];
  const filteredCategories = getFilteredCategories(categories, selectedCollectionIds);

  return (
    <>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Collections</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collections.map((collection) => {
            const isSelected = selectedCollectionIds.includes(collection.id);
            return (
              <button key={collection.id} type="button" onClick={() => setFormData(getNextCollectionFormData(formData, categories, collection.id))} className={`rounded-2xl border px-4 py-3 text-left transition-all ${isSelected ? 'border-black bg-black text-white shadow-xl shadow-black/10' : 'border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-black/20 hover:bg-white'}`}>
                <span className="block text-[10px] font-black uppercase tracking-widest">{collection.name}</span>
                <span className={`mt-1 block text-[11px] font-medium ${isSelected ? 'text-white/60' : 'text-neutral-400'}`}>/{collection.slug}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-neutral-400 mt-2">Pilih collection utama produk. Category di bawah akan otomatis menyesuaikan collection yang dipilih.</p>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Category</label>
        <select className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-bold appearance-none cursor-pointer" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })} required>
          {filteredCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="flex items-center pt-8">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-12 h-6 rounded-full transition-all relative ${formData.is_featured ? 'bg-black' : 'bg-neutral-200'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_featured ? 'left-7' : 'left-1'}`} />
          </div>
          <input type="checkbox" className="hidden" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">Featured Item</span>
        </label>
      </div>
    </>
  );
}

export function ProductImageFields({ formData, setFormData }: ProductFormSectionProps) {
  const additionalImages = getAdditionalImages(formData.images);
  const updateAdditionalImages = (images: string[]) => setFormData({ ...formData, images: images.filter(Boolean).join('\n') });
  const addAdditionalImage = (imageUrl: string) => {
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl) updateAdditionalImages([...additionalImages, trimmedUrl]);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file such as PNG, JPG, JPEG, or WEBP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      if (!formData.image) setFormData({ ...formData, image: reader.result });
      else addAdditionalImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Imagery URL</label>
        {formData.image && <div className="mb-4 w-32 h-40 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200"><img src={formData.image} alt="Product preview" className="w-full h-full object-cover" /></div>}
        <div className="flex gap-4">
          <input type="text" placeholder="Paste image URL or upload PNG/JPG/WEBP" className="flex-grow px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
          <label className="p-4 bg-neutral-100 text-neutral-500 rounded-2xl hover:bg-black hover:text-white transition-all cursor-pointer" title="Upload image file"><ImagePlus size={20} /><input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" onChange={handleFileUpload} className="hidden" /></label>
        </div>
      </div>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Product Gallery</label>
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {additionalImages.map((image, index) => (
              <div key={`${image}-${index}`} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button type="button" onClick={() => updateAdditionalImages(additionalImages.filter((_, imageIndex) => imageIndex !== index))} className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-neutral-500 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all" title="Remove image"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-neutral-400 mt-2">Upload gambar berikutnya akan otomatis masuk ke gallery. Setiap gambar gallery bisa dihapus kapan saja.</p>
      </div>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2.5 block">Available Colors</label>
        <input type="text" placeholder="Black, White, Navy, Stone" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 focus:border-black/20 transition-all font-medium" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} />
        <p className="text-[11px] text-neutral-400 mt-2">Pisahkan warna dengan koma. Contoh: Black, White, Navy.</p>
      </div>
    </>
  );
}
