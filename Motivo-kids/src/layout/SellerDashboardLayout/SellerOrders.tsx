// src/layout/SellerDashboardLayout/SellerOrders.tsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("All"); // ✅ filter state
  const { theme } = useTheme();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/sellers/my-orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id: number) =>
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  /* ✅ Theme-based classes */
  const pageClass =
    theme === "dark"
      ? "dark-theme bg-gray-950 text-gray-200"
      : "light-theme bg-gray-100 text-gray-900";

  const cardClass =
    theme === "dark"
      ? "bg-gray-900 border border-gray-700 text-gray-200"
      : "bg-white border border-gray-200 text-gray-800";

  const subText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  /* ✅ Filter logic */
  const filterOrders = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const orderStr = formatDate(orderDate);

      if (filter === "Today") return orderStr === todayStr;
      if (filter === "Yesterday") return orderStr === yesterdayStr;
      if (filter === "Older")
        return orderStr !== todayStr && orderStr !== yesterdayStr;
      return true; // "All"
    });
  };

  const filteredOrders = filterOrders();

  return (
   <div className={`seller-orders-container w-full min-h-screen p-6 ${pageClass}`}>
  {/* Title + Filter */}
  <div className="flex justify-between items-center mb-4">
    <h1
      className={`seller-orders-title text-2xl font-bold transition-colors duration-200 ${
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      }`}
    >
      Seller Orders
    </h1>

    {/* Filter dropdown */}
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className={`px-3 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200
        ${
          theme === "dark"
            ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-indigo-400"
            : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-500"
        }`}
    >
      <option value="All">All</option>
      <option value="Today">Today</option>
      <option value="Yesterday">Yesterday</option>
      <option value="Older">Older</option>
    </select>
  </div>


      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrders.includes(order.id);

          return (
            <div
              key={order.id}
              className={`seller-order-card rounded-xl shadow-md p-4 transition-all hover:shadow-lg ${cardClass}`}
            >
              {/* Header */}
              <div
                className="seller-order-header flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                <span className="font-semibold text-sm">Order #{order.id}</span>
                <span className="seller-order-status px-3 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              {order.customer && (
                <div className="seller-order-customer mt-3 text-sm space-y-1">
                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customer.first_name} {order.customer.last_name || ""}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                  {order.customer.phone_number && (
                    <p>
                      <strong>Phone:</strong> {order.customer.phone_number}
                    </p>
                  )}
                </div>
              )}

              {/* Expandable Items */}
              {isExpanded && (
                <div className="seller-order-items space-y-3 mt-4">
                  {order.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className={`seller-order-item flex items-center justify-between border-b pb-3 last:border-b-0 ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image || "/placeholder.png"}
                          alt={item.product.name}
                          className="w-14 h-14 object-contain rounded-md border"
                        />
                        <div className="seller-order-item-info flex flex-col">
                          <span className="font-medium">{item.product.name}</span>
                          <span className={`${subText} text-xs`}>
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-semibold">
                          ₹{Number(item.price_at_purchase).toFixed(2)}
                        </span>
                        <span className={`text-[10px] ${subText}`}>each</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div
                className={`seller-order-footer flex justify-between font-semibold text-sm pt-3 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <span>Total:</span>
                <span>₹{Number(order.total_price).toFixed(2)}</span>
              </div>
              <div className={`seller-order-date text-[11px] mt-1 ${subText}`}>
                Placed on: {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerOrders;
