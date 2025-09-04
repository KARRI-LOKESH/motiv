// src/pages/Wishlist.tsx
import React from "react";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../hooks/useWishlist";

const Wishlist: React.FC = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { wishlistItems, toggleWishlist, loading } = useWishlist();

  const wishlistProducts = wishlistItems.map(item => item.product);

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <p className="text-gray-500">No items in wishlist.</p>
      ) : (
        <ProductGrid
          products={wishlistProducts}
          wishlistItems={wishlistItems.map(item => item.product.id)}
          onToggleWishlist={toggleWishlist}
        />
      )}
    </div>
  );
};

export default Wishlist;
