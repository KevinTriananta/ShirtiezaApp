import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  total: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user?.id) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user?.id]);

  const loadCart = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const response = await cartService.getUserCart(user.id);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user?.id) return;
    try {
      const response = await cartService.addToCart(user.id, { product_id: productId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      const response = await cartService.updateCartItem(itemId, { quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    try {
      await cartService.clearCart(user.id);
      setCart(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    cart,
    items: cart?.items ?? [],
    total: cart?.total ?? 0,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
