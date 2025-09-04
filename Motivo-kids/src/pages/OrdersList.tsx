// src/pages/OrdersList.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { SiPaytm, SiGooglepay, SiPhonepe } from "react-icons/si";
import { useTheme } from "../contexts/ThemeContext";

const stripePromise = loadStripe(
  "pk_test_51RxXsnGn2cFbcw4tHRyccJuvAI5eHy3duAv83OF4DbpMKm3X16opEayy50bfAdRvpI5sixbIWKBzNDSNnOsnjlXh00A9B33kk2"
);

const CheckoutForm: React.FC<{ orderId: number; onPaymentSuccess: () => void }> = ({ orderId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await api.post("/orders/create-payment-intent/", { order_id: orderId });
      const clientSecret = res.data.client_secret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) alert(result.error.message);
      else if (result.paymentIntent?.status === "succeeded") {
        alert("Payment Successful!");
        await api.post("/orders/generate-token/", { order_id: orderId });
        onPaymentSuccess();
      }
    } catch (err: any) {
      console.error(err);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <CardElement className="p-2 border rounded bg-white dark:bg-gray-800" />
      <button
        disabled={!stripe || loading}
        onClick={handlePay}
        className="w-full py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        {loading ? "Processing..." : "Pay with Card"}
      </button>
    </div>
  );
};

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

  const handlePaymentSuccess = () => fetchOrders();

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

            {/* Payments */}
            {showPayment && (
              <div className="mt-2 space-y-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm orderId={order.id} onPaymentSuccess={handlePaymentSuccess} />
                </Elements>

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
