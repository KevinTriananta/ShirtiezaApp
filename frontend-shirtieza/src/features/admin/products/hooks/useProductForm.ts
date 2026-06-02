import { useState } from 'react';
import { useToast } from '@app/providers/ToastContext';
import { productService } from '@shared/api/productService';
import type { Product, Category } from '@shared/types';

export function useProductForm(categories: Category[], onSuccess: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { notify } = useToast();

  const initialFormData = {
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    images: '',
    colors: 'Black, White',
    collection_ids: [] as number[],
    category_id: categories[0]?.id || 0,
    is_featured: false
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        images: product.images?.join('\n') || '',
        colors: product.colors?.join(', ') || 'Black, White',
        collection_ids: product.collections?.map((collection) => collection.id) || [],
        category_id: product.category?.id || (product as any).category_id || categories[0]?.id || 0,
        is_featured: product.is_featured || false
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        ...initialFormData,
        category_id: categories[0]?.id || 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (selectedProduct) {
        const dataToSave = { ...formData };
        if (!dataToSave.slug) {
          dataToSave.slug = dataToSave.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        await productService.updateProduct(selectedProduct.id, serializeProductForm(dataToSave));
      } else {
        const dataToSave = { ...formData };
        if (!dataToSave.slug) {
          dataToSave.slug = dataToSave.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        await productService.createProduct(serializeProductForm(dataToSave));
      }
      setIsModalOpen(false);
      notify(selectedProduct ? 'Product updated successfully.' : 'Product published successfully.', 'success');
      onSuccess();
    } catch (err) {
      notify('Failed to save product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedProduct,
    formData,
    setFormData,
    isSaving,
    handleOpenModal,
    handleSave
  };
}

function serializeProductForm(data: any) {
  const extraImages = String(data.images || '')
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean);
  const colors = String(data.colors || '')
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);

  return {
    ...data,
    images: JSON.stringify(extraImages),
    colors: JSON.stringify(colors.length ? colors : ['Black']),
  };
}
