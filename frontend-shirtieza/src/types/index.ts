export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  images?: string[];
  price: number;
  discount_price?: number;
  description: string;
  stock: number;
  rating: number;
  review_count: number;
  category: Category;
  collections?: Collection[];
  is_featured?: boolean;
  reviews?: Review[];
  created_at: string;
}

export interface Collection {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  is_active?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  image?: string;
  created_at?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  role: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  user_id: number;
  total: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_zip: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}


