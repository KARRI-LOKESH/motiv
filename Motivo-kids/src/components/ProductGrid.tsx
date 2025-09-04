// src/components/ProductGrid.tsx
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ShoppingCart } from "lucide-react";
import { Product, useCart } from "../contexts/CartContext";
import { useWishlist } from "../hooks/useWishlist";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { theme } = useTheme();

  // Map API snake_case to camelCase
  const formattedProducts = React.useMemo(
    () =>
      products.map((p) => ({
        ...p,
        ageRange: (p as any).age_range,
        isNew: (p as any).is_new,
        isSale: (p as any).is_sale,
        reviewCount: (p as any).review_count,
      })),
    [products]
  );

  const wishlistIdSet = React.useMemo(
    () =>
      new Set(
        wishlistItems.map((w) =>
          "product" in w ? w.product.id : w.id ?? w
        )
      ),
    [wishlistItems]
  );

  const handleAddToCart = (product: Product) => addToCart(product.id, 1);
  const handleRemoveFromCart = (id: number) => {
    const cartItem = cartItems.find((item) => item.product.id === id);
    if (cartItem) removeFromCart(cartItem.id);
  };

  // Theme-based classes
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const cardTextSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cardBorder = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonHover = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-700";

  return (
    <div className="max-w-[1600px] mx-auto p-4">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {formattedProducts.map((product) => {
          const inCart = cartItems.some(
            (item) => item.product.id === product.id
          );
          const inWishlist = wishlistIdSet.has(product.id);

          return (
            <div
              key={product.id}
              className={`rounded-lg shadow-md transition-transform duration-300 flex flex-col overflow-hidden hover:scale-105 border ${cardBorder} ${cardBg}`}
            >
              {/* Image Section */}
              <div className="relative w-full h-52">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name || "Product Image"}
                    className="w-full h-full object-contain p-3"
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-700 rounded-full shadow hover:scale-110 transition"
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {inWishlist ? (
                    <AiFillHeart className="text-green-500 w-6 h-6" />
                  ) : (
                    <AiOutlineHeart className="text-gray-400 dark:text-gray-300 w-6 h-6" />
                  )}
                </button>

                {/* Labels */}
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    NEW
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-2 left-2 bg-violet-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    SALE
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className={`font-semibold mb-1 text-lg line-clamp-2 ${cardText}`}>
                  {product.name || "Unnamed Product"}
                </h3>
                <p className={`text-sm line-clamp-3 mb-3 ${cardTextSecondary}`}>
                  {product.description || "No description available."}
                </p>

                <div className="flex items-center text-yellow-400 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                      {i < (product.rating ?? 0) ? "★" : "☆"}
                    </span>
                  ))}
                  <span className={`ml-2 text-xs ${cardTextSecondary}`}>
                    ({product.reviewCount ?? 0})
                  </span>
                </div>

                <span className={`text-xs mb-3 ${cardTextSecondary}`}>
                  Age: {product.ageRange || "All ages"}
                </span>

                {product.location && (
                  <span className={`text-xs mb-3 ${cardTextSecondary}`}>
                    Location: {product.location}
                  </span>
                )}

                {/* Price & Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{product.price ?? "0"}
                  </span>

                  {inCart ? (
                    <button
                      onClick={() => handleRemoveFromCart(product.id)}
                      className={`px-3 py-2 bg-red-500 text-white rounded ${buttonHover} transition text-sm`}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-3 py-2 bg-blue-600 text-white rounded ${buttonHover} transition flex items-center justify-center text-sm`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
