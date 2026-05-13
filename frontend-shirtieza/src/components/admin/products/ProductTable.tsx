import { Eye, Edit2, Trash2, Check } from 'lucide-react';
import type { Product } from '../../../types';
import Badge from '../../ui/Badge';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete
}: ProductTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-10 w-40 bg-neutral-100 rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-100 rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-100 rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-neutral-100 rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-neutral-100 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-neutral-100 rounded-lg inline-block" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 text-sm italic">
                  No products found.
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black leading-none mb-1">{product.name}</p>
                      <p className="text-[10px] text-neutral-400 font-medium">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-black">Rp {product.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : 'text-neutral-500'}`}>
                    {product.stock} pcs
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={product.is_featured ? 'amber' : 'success'}
                    icon={product.is_featured ? <Check size={10} /> : null}
                  >
                    {product.is_featured ? 'Featured' : 'Active'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
