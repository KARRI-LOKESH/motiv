// src/components/CartSidebar.tsx
import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useTheme } from "../contexts/ThemeContext"; // ✅ import the hook

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ get current theme

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const selectAll = cartItems.length > 0 && selectedItems.length === cartItems.length;

  useEffect(() => {
    if (cartItems.length === 0) setSelectedItems([]);
  }, [cartItems]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) setSelectedItems([]);
    else setSelectedItems(cartItems.map((item) => item.id));
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please login to book items!");
      navigate("/login");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item to book!");
      return;
    }

    try {
      const itemsPayload = cartItems
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        }));

      const res = await api.post("/orders/", { items: itemsPayload });
      if (res.status === 200 || res.status === 201) {
        alert("✅ Order booked successfully!");
        selectedItems.forEach((id) => removeFromCart(id));
        setSelectedItems([]);
        onClose();
        navigate("/orders");
      } else alert("❌ Failed to book order.");
    } catch (err) {
      console.error(err);
      alert("❌ Error booking order.");
    }
  };

  if (!isOpen) return null;

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const secondaryText = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const buttonBg = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 ${bgColor} shadow-lg z-50 p-4 flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 ${textColor}`}>
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Select All */}
        {cartItems.length > 0 && (
          <div className={`flex items-center mb-2 ${textColor}`}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <span className="ml-2 font-medium">Select All</span>
          </div>
        )}

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className={`flex flex-col items-center justify-center flex-1 text-center ${secondaryText}`}>
            <ShoppingCart className="w-12 h-12 mb-2 text-gray-400" />
            <p>Your cart is empty.</p>
            <Link
              to="/category/products"
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {cartItems.map((item) => {
              const price = Number(item.product.price);
              const subtotal = price * item.quantity;
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 border p-2 rounded ${borderColor}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                  <img
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium line-clamp-2 ${textColor}`}>{item.product.name}</h3>
                    <p className={`text-sm ${secondaryText}`}>
                      ₹{price.toFixed(2)} x {item.quantity} = ₹{subtotal.toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <button
                        className="px-2 py-1 border rounded-l"
                        onClick={() =>
                          updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 border-t border-b">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border rounded-r"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Total & Checkout */}
        {cartItems.length > 0 && (
          <div className={`mt-4 border-t pt-3 ${borderColor}`}>
            <p className={`font-bold text-lg ${textColor}`}>Total: ₹{totalPrice.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className={`w-full mt-2 py-2 rounded flex items-center justify-center ${
                selectedItems.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : buttonBg + " text-white"
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Book Selected Items
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
