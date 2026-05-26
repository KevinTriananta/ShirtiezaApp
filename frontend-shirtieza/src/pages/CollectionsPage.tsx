import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Collection } from '../types';
import { collectionService } from '../services/collectionService';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(collections.length / pageSize));
  const visibleCollections = collections.slice((page - 1) * pageSize, page * pageSize);
  const featuredCollection = visibleCollections[0];
  const sideCollections = visibleCollections.slice(1);

  return (
    <div className="min-h-screen bg-[#fbfbfa] pt-16 lg:pt-[72px]">
      <div className="border-b border-neutral-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Collections</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 grid gap-5 border-b border-neutral-200 pb-8 sm:mb-10 sm:pb-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.38em] text-neutral-400">Curated For You</p>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-5xl lg:text-6xl">Collections</h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500 lg:justify-self-end">
            Clean edits for different moods, routines, and daily uniforms.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 skeleton rounded-[18px]" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm">No collections found</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            {featuredCollection && <CollectionFeatureCard collection={featuredCollection} index={(page - 1) * pageSize} />}
            <div className="grid gap-4">
              {sideCollections.map((collection, index) => (
                <CollectionListCard key={collection.id} collection={collection} index={(page - 1) * pageSize + index + 1} />
              ))}
            </div>
          </div>
        )}
        {!isLoading && collections.length > pageSize && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 min-w-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${page === pageNumber ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black'}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionFeatureCard({ collection, index }: { collection: Collection; index: number }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group flex min-h-[360px] flex-col justify-between rounded-[18px] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)] sm:p-8 lg:min-h-[520px]"
    >
      <div className="flex items-start justify-between gap-6">
        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div>
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.32em] text-neutral-400">Selected Edit</p>
        <h2 className="max-w-xl text-4xl font-black uppercase leading-[0.9] tracking-tight text-black sm:text-6xl lg:text-7xl">
          {collection.name}
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-500">
          {collection.description || 'A focused selection for everyday rotation.'}
        </p>
      </div>
      <div className="pt-8">
        <div className="h-px bg-neutral-200">
          <span className="block h-px w-14 bg-black transition-all duration-500 group-hover:w-full" />
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-black">
          Open Collection <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function CollectionListCard({ collection, index }: { collection: Collection; index: number }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group grid min-h-[156px] grid-cols-[auto_1fr_auto] gap-5 rounded-[18px] border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:shadow-[0_16px_45px_rgba(0,0,0,0.06)] sm:p-6"
    >
      <span className="pt-1 text-[10px] font-black uppercase tracking-[0.24em] text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-black sm:text-3xl">
          {collection.name}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500 line-clamp-2">
          {collection.description || 'Explore this collection.'}
        </p>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-300 group-hover:bg-black group-hover:text-white">
        <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}
