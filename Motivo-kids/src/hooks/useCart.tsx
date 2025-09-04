import { useState, useEffect } from 'react';
import { fetchCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../api';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from backend
  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCartItems(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product: any) => {
    try {
      // Check if product already exists in cart
      const exists = cartItems.find(item => item.product.id === product.id);
      if (exists) return; // skip if already in cart

      const newItem = await apiAddToCart(product.id);
      setCartItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await apiRemoveFromCart(cartItemId);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  return { cartItems, addToCart, removeFromCart, loading };
};
