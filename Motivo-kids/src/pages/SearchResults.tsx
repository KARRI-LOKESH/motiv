// src/components/SearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart, Product as CartProduct } from "../contexts/CartContext";
import { AiOutlineShoppingCart, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useWishlist } from "../hooks/useWishlist";
import { useTheme } from "../contexts/ThemeContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface Product extends CartProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  ageRange?: string;
  category?: string;
}

const SearchResults: React.FC = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Record<number, Product[]>>({});

  const { cartItems, addToCart, removeFromCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { theme } = useTheme();

  const bgMain = theme === "light" ? "bg-gray-50" : "bg-gray-900";
  const textMain = theme === "light" ? "text-gray-800" : "text-gray-200";
  const textSecondary = theme === "light" ? "text-gray-500" : "text-gray-400";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const cardShadow = theme === "light" ? "shadow-md hover:shadow-xl" : "shadow-md hover:shadow-lg";

  const isInCart = (id: number) => cartItems.some(item => item.product.id === id);
  const handleRemove = (id: number) => {
    const cartItem = cartItems.find(item => item.product.id === id);
    if (cartItem) removeFromCart(cartItem.id);
  };

  const wishlistIdSet = React.useMemo(
    () => new Set(wishlistItems.map(w => ('product' in w ? w.product.id : w.id ?? w))),
    [wishlistItems]
  );

  // Fetch main search results
  useEffect(() => {
    const fetchSearchResults = async (query: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${query ? `?search=${encodeURIComponent(query)}` : ""}`
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: Product[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults(searchTerm);
  }, [searchTerm]);

  // Fetch related products for each main product
  useEffect(() => {
    const fetchRelated = async (product: Product) => {
      if (!product.category) return;
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/?category=${encodeURIComponent(product.category)}&exclude=${product.id}`
        );
        const data: Product[] = await res.json();
        setRelatedProducts(prev => ({ ...prev, [product.id]: data.slice(0, 4) })); // top 4 related
      } catch (err) {
        console.error(err);
      }
    };

    results.forEach(fetchRelated);
  }, [results]);

  return (
    <div className={`max-w-[1600px] mx-auto p-4 ${bgMain}`}>
      <h2 className={`text-xl font-bold mb-4 ${textMain}`}>
        Search results for: <span className="text-blue-600">"{searchTerm || 'All Products'}"</span>
      </h2>

      {loading && <p className={textMain}>Loading...</p>}
      {!loading && results.length === 0 && <p className={textMain}>No products found.</p>}

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {results.map(product => {
          const inCart = isInCart(product.id);
          const inWishlist = wishlistIdSet.has(product.id);

          return (
            <div
              key={product.id}
              className={`rounded-lg ${cardBg} ${cardShadow} transition-transform duration-300 flex flex-col overflow-hidden hover:scale-105`}
            >
              {/* Product Image */}
              <div className="relative w-full h-48">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name || "Product Image"}
                    className="w-full h-full object-contain p-2"
                  />
                </Link>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow transition group"
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {inWishlist ? (
                    <AiFillHeart className="text-green-500 w-5 h-5 group-hover:text-green-600 transition" />
                  ) : (
                    <AiOutlineHeart className="text-gray-400 w-5 h-5 group-hover:text-gray-600 transition" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-1 justify-between">
                <h3 className={`font-semibold mb-1 text-lg line-clamp-2 ${textMain}`}>
                  {product.name || "Unnamed Product"}
                </h3>

                <p className={`text-sm line-clamp-3 mb-2 ${textSecondary}`}>
                  {product.description || "No description available."}
                </p>

                <span className={`text-xs mb-2 ${textSecondary}`}>
                  Age: {product.ageRange || "All ages"}
                </span>

                <div className="flex items-center text-yellow-400 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < (product.rating ?? 0) ? "★" : "☆"}</span>
                  ))}
                  <span className={`ml-2 text-xs ${textSecondary}`}>
                    ({product.reviewCount ?? 0} reviews)
                  </span>
                </div>

                {/* Price & Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-blue-600">₹{product.price ?? 0}</span>
                  {inCart ? (
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id, 1)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <AiOutlineShoppingCart className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Related Products */}
                {relatedProducts[product.id] && relatedProducts[product.id].length > 0 && (
                  <div className="mt-4">
                    <h4 className={`text-sm font-semibold mb-2 ${textMain}`}>Related Products</h4>
                    <div className="flex gap-2 overflow-x-auto">
                      {relatedProducts[product.id].map(rp => {
                        const rpInCart = isInCart(rp.id);
                        const rpInWishlist = wishlistIdSet.has(rp.id);

                        return (
                          <div
                            key={rp.id}
                            className={`min-w-[120px] rounded ${cardBg} p-2 flex-shrink-0 flex flex-col items-center ${cardShadow}`}
                          >
                            <Link to={`/product/${rp.id}`}>
                              <img
                                src={rp.image || '/placeholder.png'}
                                alt={rp.name}
                                className="w-24 h-24 object-contain"
                              />
                            </Link>
                            <span className={`mt-1 text-xs text-center ${textMain}`}>{rp.name}</span>
                            <span className="text-sm font-bold text-blue-600">₹{rp.price}</span>

                            {/* Related Cart */}
                            {rpInCart ? (
                              <button
                                onClick={() => handleRemove(rp.id)}
                                className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                onClick={() => addToCart(rp.id, 1)}
                                className="mt-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                              >
                                Add
                              </button>
                            )}

                            {/* Wishlist */}
                            <button
                              onClick={() => toggleWishlist(rp.id)}
                              className="mt-1 p-1 bg-white rounded-full shadow"
                            >
                              {rpInWishlist ? (
                                <AiFillHeart className="text-green-500 w-4 h-4" />
                              ) : (
                                <AiOutlineHeart className="text-gray-400 w-4 h-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
