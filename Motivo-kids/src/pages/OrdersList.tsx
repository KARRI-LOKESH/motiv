// src/pages/OrdersList.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { SiPaytm, SiGooglepay, SiPhonepe } from "react-icons/si";
import { useTheme } from "../contexts/ThemeContext";

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const { theme } = useTheme();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id: number) =>
    setExpandedOrders(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const bgClass = theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`p-4 max-w-3xl mx-auto space-y-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <h1 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>Your Orders</h1>

      {orders.map(order => {
        const isExpanded = expandedOrders.includes(order.id);
        const total = order.total_price || 0;

        const upiLink = `upi://pay?pa=7993549539@pthdfc&pn=MyShop&am=${total}&cu=INR&tn=Order+${order.id}`;
        const showPayment = order.status !== "paid";

        return (
          <div key={order.id} className={`border rounded-lg shadow p-3 space-y-2 ${bgClass} ${borderClass}`}>
            {/* Header */}
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(order.id)}>
              <span className="font-semibold text-sm">Order #{order.id}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                {order.status}
              </span>
            </div>

            {/* Items */}
            {isExpanded && (
              <div className={`space-y-1 text-xs mt-1`}>
                {order.order_items.map((item: any) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between border-b pb-1 last:border-b-0 ${borderClass}`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.product.name}</span>
                        <span className={subText}>Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-semibold">₹{Number(item.price_at_purchase).toFixed(2)}</span>
                      <span className={`text-[10px] ${subText}`}>each</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total & Date */}
            <div className="flex justify-between font-semibold text-sm pt-1 border-t">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className={`text-[10px] ${subText}`}>
              Placed on: {new Date(order.created_at).toLocaleString()}
            </div>

            {/* UPI Payments */}
            {showPayment && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <a href={upiLink} target="_blank" rel="noopener noreferrer">
                    <SiPaytm size={32} color="#FF3F00" title="Pay with Paytm" />
                  </a>
                  <a href={upiLink} target="_blank" rel="noopener noreferrer">
                    <SiPhonepe size={32} color="#00B0FF" title="Pay with PhonePe" />
                  </a>
                  <a href={upiLink} target="_blank" rel="noopener noreferrer">
                    <SiGooglepay size={32} color="#34A853" title="Pay with GPay" />
                  </a>
                </div>

                <div className={`flex items-center space-x-2 p-1 rounded shadow-sm w-fit ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=120x120`}
                    alt="UPI QR Code"
                    className="w-20 h-20 rounded border"
                  />
                  <div className="flex flex-col text-[10px]">
                    <span className="font-semibold">Scan & Pay</span>
                    <span className={subText}>UPI apps open automatically</span>
                    <span className={subText}>(Paytm, PhonePe, GPay)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;
