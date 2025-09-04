import React, { useState } from "react";

const UpiPayment = () => {
  const upiId = "7993549539@pthdfc";
  const payeeName = "Lokesh Karri";
  const amount = 100; // you can make this dynamic

  const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Pay with UPI</h1>
      
      {/* QR Code */}
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          upiLink
        )}`}
        alt="UPI QR Code"
        className="rounded-xl shadow-lg mb-4"
      />

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy UPI Link"}
      </button>
    </div>
  );
};

export default UpiPayment;
