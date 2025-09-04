// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../hooks/useWishlist";
import ProductGrid from "../components/ProductGrid";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ShoppingCart } from "lucide-react";
import { Product } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { addToCart, cartItems } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);

  // Map API snake_case to camelCase
  const mapProduct = (p: any): Product => ({
    ...p,
    ageRange: p.age_range,
    isNew: p.is_new,
    isSale: p.is_sale,
    reviewCount: p.review_count,
  });

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Fetch product details
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setProduct(mapProduct(data)))
      .catch((err) => console.error(err));

    // Fetch related products
    fetch(`http://127.0.0.1:8000/api/products/${id}/related/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setRelated(data.map(mapProduct)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) return <p className="text-center mt-10">Loading...</p>;

  const inCart = cartItems.some((item) => item.product.id === product.id);
  const inWishlist = wishlistItems.some(
    (item) => ("product" in item ? item.product.id : item.id) === product.id
  );

  const cardBg = theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 shadow-lg rounded-xl p-6 ${cardBg}`}>
        {/* LEFT: Product images */}
        <div className="flex flex-col items-center">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg mb-4"
          />
          {Array.isArray((product as any)?.images) && (
            <div className="flex gap-3 mt-2">
              {(product as any).images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-16 h-16 object-cover border rounded cursor-pointer hover:border-blue-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-3 flex items-center gap-2">
              {product.name}
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">NEW</span>
              )}
              {product.isSale && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">SALE</span>
              )}
            </h1>

            <p className={`${subText} mb-4`}>{product.description}</p>

            {/* Rating */}
            <div className="flex items-center text-yellow-400 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < (product.rating ?? 0) ? "★" : "☆"}</span>
              ))}
              <span className={`ml-2 text-sm ${subText}`}>({product.reviewCount ?? 0} reviews)</span>
            </div>

            <p className={`${subText} text-sm mb-2`}>Age Range: {product.ageRange || "All ages"}</p>
            {product.location && <p className={`${subText} text-sm mb-4`}>Location: {product.location}</p>}

            <p className="text-3xl font-semibold text-blue-600 mb-6">₹{product.price}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            {inCart ? (
              <button
                disabled
                className="flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                In Cart
              </button>
            ) : (
              <button
                onClick={() => addToCart(product.id, 1)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition"
            >
              {inWishlist ? <AiFillHeart className="text-green-500 w-6 h-6" /> : <AiOutlineHeart className="text-gray-400 w-6 h-6" />}
              {inWishlist ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
