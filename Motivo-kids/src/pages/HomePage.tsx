// src/pages/HomePage.tsx
import React from 'react';
import Hero from '../components/Hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { sampleProducts } from '../data/products';
import { useTheme } from "../contexts/ThemeContext";

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { theme } = useTheme();

  // Theme-based classes
  const headingText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const newsletterBg = theme === "dark" ? "bg-gray-900" : "bg-blue-50";
  const inputBg = theme === "dark" ? "bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400" : "bg-white text-gray-700 border-gray-300 placeholder-gray-500";

  return (
    <main className={theme === "dark" ? "bg-gray-900" : "bg-gray-50"}>
      <Hero />
      <FeaturedCategories />

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${headingText}`}>
              Featured Products
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${subText}`}>
              Discover our most popular and highly-rated products loved by kids and parents
            </p>
          </div>

          <ProductGrid
            products={sampleProducts}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`${newsletterBg} py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${headingText}`}>
            Stay Updated with Motivo Kids
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${subText}`}>
            Get the latest updates on new arrivals, special offers, and parenting tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
