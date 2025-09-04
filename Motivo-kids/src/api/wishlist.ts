import { api } from "./index";

export const fetchWishlist = async (): Promise<any[]> => {
  try {
    const res = await api.get("/wishlist-items/");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    return [];
  }
};

export const addToWishlist = async (productId: number): Promise<any | null> => {
  try {
    const res = await api.post("/wishlist-items/", { product_id: productId });
    return res.data;
  } catch (err) {
    console.error("Failed to add to wishlist:", err);
    return null;
  }
};

export const removeFromWishlist = async (wishlistItemId: number): Promise<boolean> => {
  try {
    await api.delete(`/wishlist-items/${wishlistItemId}/`);
    return true;
  } catch (err) {
    console.error("Failed to remove wishlist item:", err);
    return false;
  }
};

export const updateWishlistItem = async (wishlistItemId: number, updatedData: Partial<any>): Promise<any | null> => {
  try {
    const res = await api.patch(`/wishlist-items/${wishlistItemId}/`, updatedData);
    return res.data;
  } catch (err) {
    console.error("Failed to update wishlist item:", err);
    return null;
  }
};
export const clearWishlist = async (): Promise<void> => {
  try {
    await api.delete("/wishlist-items/clear/");
  } catch (err) {
    console.error("Failed to clear wishlist:", err);
  }
};