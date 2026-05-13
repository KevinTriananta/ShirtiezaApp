import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors duration-200 group">
      <Link
        to={`/products/${item.product.slug}`}
        className="flex-shrink-0 w-20 h-24 lg:w-24 lg:h-28 bg-neutral-100 overflow-hidden rounded-xl"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            to={`/products/${item.product.slug}`}
            className="text-sm font-semibold text-black hover:text-neutral-600 transition-colors duration-200 line-clamp-1"
          >
            {item.product.name}
          </Link>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Rp {item.price.toLocaleString('id-ID')} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all duration-200"
            >
              <Minus size={12} />
            </button>
            <span className="w-9 h-8 flex items-center justify-center text-xs font-bold border-x border-neutral-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all duration-200"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-black">
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </p>
            <button
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
