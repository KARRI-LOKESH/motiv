import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { addToWishlist, removeFromWishlist } from '../api/wishlist';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface WishlistItem {
  id: number;
  product: Product;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addOrRemove: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get<WishlistItem[]>('/wishlist-items/');
      setWishlistItems(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addOrRemove = async (productId: number) => {
    const existing = wishlistItems.find(item => item.product.id === productId);
    try {
      if (existing) {
        await removeFromWishlist(existing.id);
        setWishlistItems(prev => prev.filter(item => item.id !== existing.id));
      } else {
        const data = await addToWishlist(productId);
        setWishlistItems(prev => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addOrRemove, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlistContext must be used inside WishlistProvider');
  return context;
};
