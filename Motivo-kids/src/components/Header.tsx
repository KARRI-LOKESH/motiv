// src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useAuth } from '../contexts/AuthContext';
import { useWishlistContext } from '../contexts/WishlistContext';
import { useTheme } from '../contexts/ThemeContext';
import mtvLogo from '../assets/mtv.png';
import confetti from 'canvas-confetti';
import defaultAvatar from '../assets/default-avatar.png';

interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
}

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistItems } = useWishlistContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);

  const categories = [
    { name: 'All Products', path: '/category/allproducts' },
    { name: 'Toys', path: '/category/toys' },
    { name: 'Kids Clothing', path: '/category/kids-clothing' },
    { name: 'Baby Care', path: '/category/baby-care' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Stationary', path: '/category/stationary' },
    { name: 'Arts & Crafts', path: '/category/arts-crafts' },
  ];

  const hasWishlist = wishlistItems.length > 0;

  // Fetch suggestions
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(searchQuery)}`
        );
        const data: Product[] = await res.json();
        setSuggestions(data.slice(0, 5));
        setShowDropdown(true);
        setShowProfileDropdown(false);
        setShowPartnerDropdown(false);
        setIsMenuOpen(false);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (partnerRef.current && !partnerRef.current.contains(event.target as Node)) {
        setShowPartnerDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close other dropdowns when one opens
  const closeOtherDropdowns = () => {
    setShowProfileDropdown(false);
    setShowPartnerDropdown(false);
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    closeOtherDropdowns();
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeOtherDropdowns();
    }
  };

  const handleProtectedClick = (path: string) => {
    if (!isAuthenticated) navigate('/login');
    else navigate(path);
    closeOtherDropdowns();
  };

  const handleLogout = () => {
    logout();
    closeOtherDropdowns();
    navigate('/login');
  };

  const handleBlast = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      {/* Main Header */}
      <div className="flex items-center h-16 lg:h-20 px-2 sm:px-4 justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          onClick={handleBlast}
          onMouseEnter={handleBlast}
        >
          <img
            src={mtvLogo || defaultAvatar}
            alt="Motivo Kids"
            className="w-20 sm:w-24 object-contain"
          />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="Search for toys, books, clothes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                searchQuery && setShowDropdown(true);
                setShowPartnerDropdown(false);
                setShowProfileDropdown(false);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

            {/* Suggestions */}
            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden"
              >
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectSuggestion(product.name)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={product.image || defaultAvatar}
                        alt={product.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-gray-800 dark:text-gray-200">{product.name}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">₹{product.price}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Always-visible Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme */}
          <button
            onClick={() => { toggleTheme(); closeOtherDropdowns(); }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-6 h-6 text-gray-700" /> : <Sun className="w-6 h-6 text-yellow-400" />}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => handleProtectedClick('/wishlist')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {hasWishlist ? (
              <AiFillHeart className="w-6 h-6 text-green-500 animate-pulse" />
            ) : (
              <AiOutlineHeart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Partner Dropdown (Shakehand) */}
          <div ref={partnerRef} className="relative">
            <button
              onClick={() => {
                setShowPartnerDropdown(!showPartnerDropdown);
                setShowProfileDropdown(false);
                setShowDropdown(false);
                setIsMenuOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
            >
              🤝
            </button>

            {showPartnerDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 py-2 z-50">
                <Link
                  to="/partner/signup"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Up as Seller
                </Link>
                <Link
                  to="/seller/dashboard"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Seller Dashboard
                </Link>
                <Link
                  to="/partner/how-it-works"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  How It Works
                </Link>
                <Link
                  to="/partner/faq"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  FAQs & Support
                </Link>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowPartnerDropdown(false);
                setShowDropdown(false);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <img
                src={user?.profile_pic || defaultAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border"
              />
              <span className="hidden sm:inline text-gray-700 dark:text-gray-200 font-medium">
                {isAuthenticated ? user?.name : 'Guest'}
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => handleProtectedClick('/profile')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleProtectedClick('/orders')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleProtectedClick('/wishlist')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Wishlist
                </button>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Signup
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              closeOtherDropdowns();
            }}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Categories */}
      <nav className="hidden md:flex items-center space-x-8 py-2 pl-16 pr-4 border-t border-gray-200 dark:border-gray-700">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Menu 📋</h2>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="p-4 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </form>

        {/* Mobile Links */}
        <nav className="flex flex-col space-y-2 p-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleProtectedClick('/profile')}
                className="block py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
              >
                Profile
              </button>
              <button
                onClick={() => handleProtectedClick('/orders')}
                className="block py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
              >
                Orders
              </button>
              <button
                onClick={() => handleProtectedClick('/wishlist')}
                className="block py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
              >
                Wishlist
              </button>
              <button
                onClick={handleLogout}
                className="block py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Login 🔑
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
