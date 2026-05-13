import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '../types';
import { collectionService } from '../services/collectionService';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadCollections(); }, []);

  const loadCollections = async () => {
    try {
      const response = await collectionService.getAllCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Collections</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-neutral-400 mb-2">Curated For You</p>
        <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-10">Collections</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] skeleton rounded-2xl" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm">No collections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative overflow-hidden bg-neutral-100 rounded-2xl aspect-[16/10]"
              >
                {collection.image && (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-black uppercase text-white mb-1">{collection.name}</h3>
                  <p className="text-sm text-white/50 mb-3 line-clamp-1">{collection.description || 'Explore this collection'}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors duration-300">
                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
