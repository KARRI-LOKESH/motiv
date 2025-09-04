import React, { createContext, useContext, useEffect, useState } from "react";
import { addToCart as apiAddToCart, fetchCart as apiFetchCart, removeFromCart as apiRemoveFromCart, updateCart as apiUpdateCart } from "../api";

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const data = await apiFetchCart();
      setCartItems(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!productId || productId <= 0) return console.error("Invalid productId");
    try {
      const data = await apiAddToCart(productId, quantity);
      setCartItems(prev => {
        const exists = prev.find(item => item.id === data.id);
        return exists ? prev.map(item => (item.id === data.id ? data : item)) : [...prev, data];
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await apiRemoveFromCart(cartItemId);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const updateCartQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const data = await apiUpdateCart(cartItemId, quantity);
      setCartItems(prev => prev.map(item => (item.id === cartItemId ? data : item)));
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, fetchCart, addToCart, removeFromCart, updateCartQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
