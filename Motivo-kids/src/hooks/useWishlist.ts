import { useState, useEffect, useCallback } from "react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const items = await fetchWishlist();
    setWishlistItems(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleWishlist = async (productId: number) => {
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
      console.error("Failed to toggle wishlist:", err);
    }
  };

  return { wishlistItems, toggleWishlist, loading, fetchWishlist: fetch };
};
