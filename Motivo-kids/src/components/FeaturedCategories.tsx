import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const FeaturedCategories: React.FC = () => {
  const { theme } = useTheme();

  const categories = [
    {
      id: 1,
      name: "Toys & Games",
      description: "Fun and educational toys for all ages",
      image:
        "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "bg-red-500",
      path: "/category/toys",
    },
    {
      id: 2,
      name: "Kids Clothing",
      description: "Comfortable and stylish clothes",
      image:
        "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "bg-blue-500",
      path: "/category/clothing",
    },
    {
      id: 3,
      name: "Stationary",
      description: "Educational books and materials",
      image:
        "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "bg-green-500",
      path: "/category/stationary",
    },
    {
      id: 4,
      name: "Baby Care",
      description: "Everything for your little ones",
      image:
        "https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "bg-blue-500",
      path: "/category/baby-care",
    },
    {
      id: 5,
      name: "Sports",
      description: "Let the Kids Play!",
      image:
        "https://www.scripps.org/sparkle-assets/variants/hi_res_youth_sports_1200x750-32639e890266b649c6ee5c0c3b6e37e2_desktop_x++-1200x1200.jpg",
      color: "bg-pink-500",
      path: "/category/sports",
    },
    {
      id: 6,
      name: "Arts & Crafts",
      description: "Where Little Hands Create Big Dreams!",
      image:
        "https://cdn.artbeek.com/media/catalog/product/cache/55ce80b811bc381b7e7cdb09b0d1d41c/8/1/81JLwzJpP_L._AC_SL500_.jpg",
      color: "bg-orange-500",
      path: "/category/arts-crafts",
    },
  ];

  const sectionBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardHover = theme === "dark" ? "hover:shadow-gray-700" : "hover:shadow-xl";
  const hoverText = theme === "dark" ? "group-hover:text-blue-400" : "group-hover:text-blue-600";

  return (
    <section className={`py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${textPrimary}`}>
            Shop by Category
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${textSecondary}`}>
            Find the perfect products for every age and interest
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={category.path}
              key={category.id}
              className={`group ${cardBg} rounded-2xl shadow-md ${cardHover} transition-all duration-300 overflow-hidden cursor-pointer`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>
              </div>

              <div className="p-6">
                <h3
                  className={`text-xl font-semibold mb-2 transition-colors ${textPrimary} ${hoverText}`}
                >
                  {category.name}
                </h3>
                <p className={`${textSecondary} mb-4`}>{category.description}</p>
                <button
                  className={`flex items-center space-x-2 font-medium transition-colors ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
