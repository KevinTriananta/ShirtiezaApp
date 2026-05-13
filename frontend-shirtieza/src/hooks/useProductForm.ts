import { useState } from 'react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';

export function useProductForm(categories: Category[], onSuccess: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormData = {
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
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
        category_id: product.category.id,
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
        await productService.updateProduct(selectedProduct.id, formData);
      } else {
        const dataToSave = { ...formData };
        if (!dataToSave.slug) {
          dataToSave.slug = dataToSave.name.toLowerCase().replace(/ /g, '-');
        }
        await productService.createProduct(dataToSave);
      }
      setIsModalOpen(false);
      onSuccess();
    } catch (err) {
      alert('Failed to save product');
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
