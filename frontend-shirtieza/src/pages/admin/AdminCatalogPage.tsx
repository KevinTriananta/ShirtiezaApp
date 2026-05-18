import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import type { Category, Collection } from '../../types';

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [collectionName, setCollectionName] = useState('');

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
    await categoryService.createCategory({ name: categoryName, slug: slugify(categoryName), description: `${categoryName} collection`, icon: 'S' });
    setCategoryName('');
    load();
  };

  const addCollection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!collectionName.trim()) return;
    await collectionService.createCollection({ name: collectionName, slug: slugify(collectionName), description: `${collectionName} curated drop`, is_active: true });
    setCollectionName('');
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <section className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="font-black uppercase tracking-tight mb-5">Categories</h2>
        <form onSubmit={addCategory} className="flex gap-3 mb-6">
          <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category" className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm" />
          <button className="bg-black text-white px-5 rounded-xl text-[11px] font-black uppercase tracking-widest">Add</button>
        </form>
        <div className="space-y-2">
          {categories.map((item) => <div key={item.id} className="flex justify-between p-3 rounded-xl bg-neutral-50"><span className="font-bold text-sm">{item.name}</span><span className="text-xs text-neutral-400">/{item.slug}</span></div>)}
        </div>
      </section>
      <section className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="font-black uppercase tracking-tight mb-5">Collections</h2>
        <form onSubmit={addCollection} className="flex gap-3 mb-6">
          <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="New collection" className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm" />
          <button className="bg-black text-white px-5 rounded-xl text-[11px] font-black uppercase tracking-widest">Add</button>
        </form>
        <div className="space-y-2">
          {collections.map((item) => <div key={item.id} className="flex justify-between p-3 rounded-xl bg-neutral-50"><span className="font-bold text-sm">{item.name}</span><span className="text-xs text-neutral-400">/{item.slug}</span></div>)}
        </div>
      </section>
    </div>
  );
}
