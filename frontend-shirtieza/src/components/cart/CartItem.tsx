import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onCheckoutNow?: (item: CartItemType) => void;
}

export default function CartItem({ item, isSelected = true, onSelect, onUpdateQuantity, onRemove, onCheckoutNow }: CartItemProps) {
  const handleCheckoutNow = () => {
    onCheckoutNow?.(item);
  };

  return (
    <div
      role={onCheckoutNow ? 'button' : undefined}
      tabIndex={onCheckoutNow ? 0 : undefined}
      onClick={handleCheckoutNow}
      onKeyDown={(event) => {
        if (!onCheckoutNow) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleCheckoutNow();
        }
      }}
      className={`flex gap-4 p-4 border rounded-2xl transition-all duration-200 group outline-none ${onCheckoutNow ? 'cursor-pointer hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-xl hover:shadow-black/5 focus:ring-4 focus:ring-black/5' : ''} ${isSelected ? 'bg-neutral-50/50 border-neutral-100' : 'bg-white border-neutral-200 opacity-70'}`}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onSelect(item.id, event.target.checked)}
          className="mt-10 h-4 w-4 accent-black"
        />
      )}
      <div
        className="flex-shrink-0 w-20 h-24 lg:w-24 lg:h-28 bg-neutral-100 overflow-hidden rounded-xl"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-sm font-semibold text-black transition-colors duration-200 line-clamp-1 group-hover:text-neutral-600">
            {item.product.name}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Rp {item.price.toLocaleString('id-ID')} each
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {[item.size && `Size ${item.size}`, item.color && `Color ${item.color}`].filter(Boolean).join(' / ')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1));
              }}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all duration-200"
            >
              <Minus size={12} />
            </button>
            <span className="w-9 h-8 flex items-center justify-center text-xs font-bold border-x border-neutral-200">
              {item.quantity}
            </span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onUpdateQuantity(item.id, item.quantity + 1);
              }}
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
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item.id);
              }}
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
