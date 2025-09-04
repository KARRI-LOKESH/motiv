import React, { useState, useEffect } from "react";
import { api } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";

interface Product {
  id: number;
  name: string;
  category: { name: string };
  seller: { email: string };
  price: number;
  rating: number;
  is_new: boolean;
  is_sale: boolean;
  location: string;
  created_at: string;
}

const SellerProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/sellers/my-products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-medium">
        Loading products...
      </div>
    );

  if (!products.length)
    return (
      <div className="p-6 text-center text-lg font-medium">
        No products found.
      </div>
    );

  /* ✅ Theme classes */
  const pageClass =
    theme === "dark"
      ? "bg-gray-950 text-gray-200"
      : "bg-gray-50 text-gray-900";

  const tableHeadClass =
    theme === "dark"
      ? "bg-gray-800 text-gray-200"
      : "bg-gray-200 text-gray-800";

  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const rowHoverClass =
    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100";

  return (
    <div className={`w-full min-h-screen p-6 ${pageClass}`}>
      <h1
        className={`text-2xl font-bold mb-4 ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        My Products
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className={`min-w-full border ${borderClass} rounded-lg`}>
          <thead className={tableHeadClass}>
            <tr>
              <th className="px-4 py-3 border text-sm font-semibold">Name</th>
              <th className="px-4 py-3 border text-sm font-semibold">Category</th>
              <th className="px-4 py-3 border text-sm font-semibold">Seller</th>
              <th className="px-4 py-3 border text-sm font-semibold">Price</th>
              <th className="px-4 py-3 border text-sm font-semibold">Rating</th>
              <th className="px-4 py-3 border text-sm font-semibold">New</th>
              <th className="px-4 py-3 border text-sm font-semibold">Sale</th>
              <th className="px-4 py-3 border text-sm font-semibold">Location</th>
              <th className="px-4 py-3 border text-sm font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr
                key={product.id}
                className={`text-center text-sm transition-colors ${rowHoverClass} ${
                  idx % 2 === 0
                    ? theme === "dark"
                      ? "bg-gray-900"
                      : "bg-white"
                    : theme === "dark"
                    ? "bg-gray-950"
                    : "bg-gray-50"
                }`}
              >
                <td className={`px-4 py-3 border ${borderClass}`}>
                  {product.name}
                </td>
                <td className={`px-4 py-3 border ${borderClass}`}>
                  {product.category.name}
                </td>
                <td className={`px-4 py-3 border ${borderClass}`}>
                  {product.seller.email}
                </td>
                <td className={`px-4 py-3 border font-semibold ${borderClass}`}>
                  ₹{product.price}
                </td>
                <td className={`px-4 py-3 border ${borderClass}`}>
                  ⭐ {product.rating}
                </td>
                <td
                  className={`px-4 py-3 border ${borderClass} ${
                    product.is_new ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.is_new ? "Yes" : "No"}
                </td>
                <td
                  className={`px-4 py-3 border ${borderClass} ${
                    product.is_sale ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {product.is_sale ? "Yes" : "No"}
                </td>
                <td className={`px-4 py-3 border ${borderClass}`}>
                  {product.location}
                </td>
                <td className={`px-4 py-3 border ${borderClass}`}>
                  {new Date(product.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerProducts;
