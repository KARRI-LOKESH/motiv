// src/layout/SellerDashboardLayout/SellerDashboard.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiShoppingCart,
  HiCube,
  HiCash,
  HiOutlineSearch,
} from "react-icons/hi";
import { Sun, Moon } from "lucide-react";
import mtvLogo from "../../assets/mtv.png";
import defaultAvatar from "../../assets/default-avatar.png";
import { useTheme } from "../../contexts/ThemeContext";
import { api } from "../../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface Product {
  id: number;
  name: string;
}

interface SellerProfile {
  shop_name: string;
  profile_image: string | null;
}

interface Order {
  id: number;
  total_price: number;
  created_at: string;
}

const SellerDashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [productsListed, setProductsListed] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Dashboard", path: "/seller/dashboard" },
    { name: "Orders", path: "/seller/orders" },
    { name: "Products", path: "/seller/products" },
    { name: "Add Product", path: "/seller/add-product" },
    { name: "Profile", path: "/seller/profile" },
  ];

  const bgMain = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const bgHeader = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textMain = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardHover = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const navText = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const navHover =
    theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600";
  const inputBg =
    theme === "dark"
      ? "bg-gray-700 text-white border-gray-700 placeholder-gray-400"
      : "bg-white text-black border-gray-300 placeholder-gray-500";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const res = await api.get("/sellers/profile/");
        const data = res.data;
        if (data.profile_image) {
          data.profile_image = `http://127.0.0.1:8000${data.profile_image}`;
        }
        setSellerProfile(data);
      } catch (err) {
        console.error("Failed to fetch seller profile:", err);
      }
    };
    fetchSellerProfile();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/sellers/dashboard-stats/");
        const data = res.data;
        setTotalOrders(data.total_orders);
        setProductsListed(data.products_listed);
        setEarnings(data.total_earnings);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/sellers/my-orders/");
        setOrdersData(res.data);
        setRecentOrders(res.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data: Product[] = await res.json();
        setSuggestions(data.slice(0, 5));
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (product: Product) => {
    setSearchQuery(product.name);
    setShowDropdown(false);
    navigate(`/products/${product.id}`);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setMenuOpen(false);
    }
  };

  // Orders graph data (Yesterday vs Today)
 // Orders graph data (Yesterday vs Today) as mountain graph
const orderGraphData = {
  labels: ["Yesterday", "Today"],
  datasets: [
    {
      label: "Orders",
      data: [
        ordersData.filter(
          (o) =>
            new Date(o.created_at).toDateString() ===
            new Date(Date.now() - 86400000).toDateString()
        ).length,
        ordersData.filter(
          (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
        ).length,
      ],
      fill: true, // <- filled area (mountain)
      backgroundColor: theme === "dark" ? "rgba(74, 222, 128, 0.4)" : "rgba(22, 163, 74, 0.4)",
      borderColor: theme === "dark" ? "#4ade80" : "#16a34a",
      tension: 0.3,
      pointRadius: 3,
    },
  ],
};

const orderGraphOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { color: theme === "dark" ? "#d1d5db" : "#374151" } },
    x: { ticks: { color: theme === "dark" ? "#d1d5db" : "#374151" } },
  },
};


  return (
    <div className={`min-h-screen flex flex-col ${bgMain} font-sans`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 shadow transition-all ${bgHeader}`}>
        <div className="flex items-center justify-between px-4 md:px-8 h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center pl-2 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-10">
            <div className="w-32 h-14 sm:w-36 sm:h-16 overflow-hidden relative">
              <img src={mtvLogo} alt="Motivo Kids Logo" className="w-full h-full object-contain" />
            </div>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex relative flex-1 max-w-xs sm:max-w-md md:max-w-xl mx-2 sm:mx-6"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-serif ${inputBg}`}
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className={`absolute top-full left-0 right-0 mt-1 shadow-lg rounded-md overflow-hidden z-50 ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              >
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectSuggestion(p)}
                    className={`px-4 py-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-800"}`}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center space-x-6 text-lg font-serif">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${navText} ${navHover} transition-all ${location.pathname === link.path ? "font-bold text-blue-600" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Profile, Theme toggle & Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-6 h-6 text-gray-700" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
            </button>

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                className={`flex items-center gap-2 p-1 rounded-full transition ${cardHover}`}
              >
                <img
                  src={sellerProfile?.profile_image || defaultAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border object-cover"
                />
              </button>
              {showProfileDropdown && (
                <div className={`absolute right-0 mt-2 w-40 rounded-md py-2 z-50 shadow-lg ${cardBg}`}>
                  <Link to="/seller/profile" className={`block px-4 py-2 ${cardHover}`}>Profile</Link>
                  <button className={`w-full text-left px-4 py-2 ${cardHover}`}>Logout</button>
                </div>
              )}
            </div>

            <button className="md:hidden p-2" onClick={toggleMenu}>
              {menuOpen ? <HiX size={24} color={theme === "dark" ? "#fff" : "#000"} /> : <HiMenu size={24} color={theme === "dark" ? "#fff" : "#000"} />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}></div>
            <div
              className={`fixed top-0 left-0 h-full w-64 z-50 p-6 flex flex-col gap-4 transition-transform transform duration-300 ${bgHeader}`}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-3 mt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`${navText} ${navHover} transition-all`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button className={`${navText} ${navHover} text-left`} onClick={() => {}}>Logout</button>
              </nav>
            </div>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-24 px-4 md:px-10">
        <Outlet />

        {location.pathname === "/seller/dashboard" && (
          <div className="mt-6">
            <h2 className={`text-3xl font-extrabold mb-6 font-serif ${textMain}`}>
              Seller Dashboard
            </h2>
            <p className={`mb-6 ${textSecondary}`}>
              Manage your products, view orders, and track earnings.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-xl text-center transition-all hover:scale-105 ${cardBg}`}>
                <HiShoppingCart size={32} className="mx-auto mb-2 text-green-500" />
                <h3 className="font-bold text-lg mb-2">Total Orders</h3>
                <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{totalOrders}</p>
                <div className="mt-4">
                  <Line data={orderGraphData} options={orderGraphOptions} height={50} />
                </div>
              </div>

              <div className={`p-6 rounded-xl text-center transition-all hover:scale-105 ${cardBg}`}>
                <HiCube size={32} className="mx-auto mb-2 text-yellow-500" />
                <h3 className="font-bold text-lg mb-2">Products Listed</h3>
                <p className="text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">{productsListed}</p>
              </div>

              <div className={`p-6 rounded-xl text-center transition-all hover:scale-105 ${cardBg}`}>
                <HiCash size={32} className="mx-auto mb-2 text-blue-500" />
                <h3 className="font-bold text-lg mb-2">Earnings</h3>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${earnings}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`p-6 rounded-xl shadow transition-all hover:shadow-lg ${cardBg}`}>
              <h3 className={`text-xl font-bold mb-4 ${textMain}`}>Recent Orders</h3>
              {recentOrders.length ? (
                <ul className={textSecondary}>
                  {recentOrders.map((o) => (
                    <li key={o.id} className="border-b py-2">
                      Order #{o.id} -₹{o.total_price} - {new Date(o.created_at).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={textSecondary}>No orders yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
