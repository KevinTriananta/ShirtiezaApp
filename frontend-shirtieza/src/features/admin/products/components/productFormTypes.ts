import type { Category, Collection } from '@shared/types';

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images: string;
  colors: string;
  collection_ids: number[];
  category_id: number;
  is_featured: boolean;
}

export type UpdateProductForm = (data: ProductFormData) => void;

export interface ProductFormSectionProps {
  formData: ProductFormData;
  setFormData: UpdateProductForm;
}

export function getAdditionalImages(images: string) {
  return String(images || '')
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean);
}

export function getFilteredCategories(categories: Category[], collectionIds: number[]) {
  return categories.filter((category) => {
    if (!collectionIds.length) return true;
    if (!category.collection_id) return true;
    return collectionIds.includes(category.collection_id);
  });
}

export function getNextCollectionFormData(formData: ProductFormData, categories: Category[], collectionId: number) {
  const selectedCollectionIds = formData.collection_ids || [];
  const nextCollectionIds = selectedCollectionIds.includes(collectionId)
    ? selectedCollectionIds.filter((id) => id !== collectionId)
    : [...selectedCollectionIds, collectionId];
  const nextCategories = getFilteredCategories(categories, nextCollectionIds);
  const nextCategoryId = nextCategories.some((category) => category.id === formData.category_id)
    ? formData.category_id
    : nextCategories[0]?.id || 0;

  return { ...formData, collection_ids: nextCollectionIds, category_id: nextCategoryId };
}

export interface CollectionCategoryFieldsProps extends ProductFormSectionProps {
  categories: Category[];
  collections: Collection[];
}
