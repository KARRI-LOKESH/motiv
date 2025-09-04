// src/pages/CategoryPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, List, ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductGrid, { Product } from "../components/ProductGrid";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { fetchProductsByCategory, fetchAllProducts } from "../api";
import { useTheme } from "../contexts/ThemeContext";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryName =
    category === "allproducts"
      ? "All Products"
      : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "Products";

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Product[] = [];
        if (category === "allproducts") {
          data = await fetchAllProducts();
        } else {
          data = await fetchProductsByCategory(category);
        }
        setProducts(data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category]);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0;
  });

  // Apply Filters
  const filteredProducts = sortedProducts.filter((p) => {
    const withinPrice = p.price >= minPrice && p.price <= maxPrice;
    const meetsRating = ratingFilter ? (p.rating ?? 0) >= ratingFilter : true;
    const meetsStock = inStockOnly ? p.inStock === true : true;
    const meetsSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return withinPrice && meetsRating && meetsStock && meetsSearch;
  });

  // Theme Styles
  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const headerBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBg = theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800";
  const buttonHover =
    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2 sticky top-0 ${headerBg} z-20 p-3 rounded-md shadow`}
        >
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            {categoryName}
          </h1>
          <span className={`text-sm ${textSecondary}`}>
            {filteredProducts.length} Products
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div
              className={`flex items-center border rounded-lg overflow-hidden shadow-sm ${borderColor}`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : `${textSecondary} ${buttonHover}`
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : `${textSecondary} ${buttonHover}`
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center px-3 py-2 border rounded-lg transition-colors shadow-sm ${textPrimary} ${borderColor} ${buttonHover}`}
              >
                Sort: {sortBy.replace("-", " ")}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {showSortDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  } animate-fade-in`}
                >
                  <button
                    onClick={() => {
                      setSortBy("featured");
                      setShowSortDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 transition-colors ${buttonHover}`}
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-low-high");
                      setShowSortDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 transition-colors ${buttonHover}`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-high-low");
                      setShowSortDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 transition-colors ${buttonHover}`}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center px-3 py-2 border rounded-lg shadow-sm ${textPrimary} ${borderColor} ${buttonHover}`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-1" /> Filters
              </button>

              {showFilterDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 p-4 ${
                    theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  } animate-fade-in`}
                >
                  <h3 className="font-semibold mb-3">Filters</h3>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`border p-2 rounded w-full mb-3 ${inputBg} ${borderColor}`}
                  />

                  {/* Price Range */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className={`border p-2 rounded w-1/2 ${inputBg} ${borderColor}`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className={`border p-2 rounded w-1/2 ${inputBg} ${borderColor}`}
                    />
                  </div>

                  {/* Rating Filter */}
                  <select
                    value={ratingFilter || ""}
                    onChange={(e) =>
                      setRatingFilter(e.target.value ? Number(e.target.value) : null)
                    }
                    className={`border p-2 rounded w-full mb-3 ${inputBg} ${borderColor}`}
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1★ & above</option>
                    <option value="2">2★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="4">4★ & above</option>
                  </select>

                  {/* Stock */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                    />
                    <label>In Stock Only</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className={`${textSecondary}`}>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className={`${textSecondary}`}>No products found.</p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
