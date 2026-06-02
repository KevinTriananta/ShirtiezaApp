import { useState } from 'react';
import type { Product } from '@shared/types';

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="bg-neutral-50 aspect-[3/4] overflow-hidden rounded-2xl">
        <img
          src={allImages[selectedImage] || product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={img || idx}
              onClick={() => setSelectedImage(idx)}
              className={`aspect-square bg-neutral-50 overflow-hidden rounded-xl border-2 transition-all duration-200 hover:opacity-80 ${
                selectedImage === idx ? 'border-black' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
