import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({ page, totalPages, onPageChange }: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        if (pageNum < page - 1 || pageNum > page + 1) return null;
        return (
          <button key={pageNum} onClick={() => onPageChange(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-[12px] font-semibold transition-all duration-200 ${pageNum === page ? 'bg-black text-white shadow-lg shadow-black/10' : 'border border-neutral-200 text-neutral-600 hover:border-black'}`}>
            {pageNum}
          </button>
        );
      })}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
