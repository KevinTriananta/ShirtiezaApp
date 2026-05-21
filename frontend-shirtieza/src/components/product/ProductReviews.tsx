import type { Review } from '../../types';

interface ProductReviewsProps {
  reviews?: Review[];
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews?.length) return null;

  return (
    <section className="mt-20 pt-12 border-t border-neutral-100">
      <h2 className="text-xl font-black uppercase tracking-tight mb-8">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((review) => (
          <div key={review.id} className="bg-neutral-50 rounded-2xl p-6 hover:bg-neutral-100/80 transition-colors duration-200">
            <div className="flex items-center gap-1 mb-3 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < review.rating ? 'text-amber-400' : 'text-neutral-200'}>★</span>
              ))}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed mb-3">{review.comment}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">— {review.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
