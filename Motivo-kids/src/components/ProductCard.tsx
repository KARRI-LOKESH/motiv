import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  ageRange: string | { id: string; name: string };
  category: string | { id: string; name: string };
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist 
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      onAddToCart(product);
    }
  };

  // Helper to safely get string value
  const getDisplayValue = (value: string | { name: string }) =>
    typeof value === 'string' ? value : value?.name || '';

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-52 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              NEW
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Heart 
            className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        {/* Add to Cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1 text-xs text-gray-500 font-medium">
          <span className="text-blue-600">{getDisplayValue(product.ageRange)}</span>
          <span>{getDisplayValue(product.category)}</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {product.originalPrice && (
            <span className="text-xs font-semibold text-green-600">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
