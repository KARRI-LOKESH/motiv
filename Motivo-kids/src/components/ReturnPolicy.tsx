import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ReturnPolicy: React.FC = () => {
  const { theme } = useTheme();

  const bgMain =
    theme === "light"
      ? "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
      : "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200";

  const cardBg =
    theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200";

  const linkColor = theme === "light" ? "text-blue-600" : "text-blue-300";

  return (
    <div className={`min-h-screen py-12 px-6 md:px-20 ${bgMain}`}>
      <div className={`max-w-5xl mx-auto shadow-lg rounded-2xl p-8 ${cardBg}`}>
        <h1 className="text-4xl font-bold mb-8 text-center">Return Policy</h1>
        <p className="mb-6">
          At <strong>Motivo Kids</strong>, we want you to be happy with your purchase.
          This Return Policy explains how returns, exchanges, and refunds are handled.
        </p>

        {/* Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Eligibility for Returns</h2>
          <p>
            Items can be returned within <strong>14 days</strong> of delivery.
            Returns are accepted only for products in original condition, unused, and in
            original packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Non-Returnable Items</h2>
          <p>
            Certain items cannot be returned due to hygiene or safety reasons, including:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Used toys or broken items</li>
            <li>Personalized or customized products</li>
            <li>Gift cards and vouchers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Return Request</h2>
          <p>
            To initiate a return, contact our support team via email at{" "}
            <a href="mailto:support@motivokids.com" className={`${linkColor} underline`}>
              support@motivokids.com
            </a>{" "}
            or call 1-800-MOTIVO-KIDS. Include your order number and reason for return.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Return Shipping</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              Customers are responsible for return shipping costs unless the item is defective or incorrect.
            </li>
            <li>Use a secure packaging method to avoid damage during transit.</li>
            <li>Keep the shipping receipt as proof until the return is processed.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Inspection & Approval</h2>
          <p>
            Once the returned item is received, our team will inspect it for eligibility.
            Approved returns will be processed within <strong>7 business days</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Refund Methods</h2>
          <p>
            Refunds will be issued to the original payment method. The processing time
            may vary depending on the bank or payment provider.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Exchanges</h2>
          <p>
            Exchanges are available for defective or wrong items. Contact support to
            arrange the exchange and provide details of the item you want as a replacement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, notify us within 48 hours with
            photos of the issue. We will provide a full refund or replacement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Late Returns</h2>
          <p>
            Items returned after the 14-day period may not be accepted. Contact support
            if you face special circumstances; we handle such cases on a case-by-case basis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">10. Cancellations</h2>
          <p>
            Orders can be canceled before they are shipped. Once shipped, returns
            must follow the standard return procedure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">11. Customer Responsibility</h2>
          <p>
            Ensure items are returned in original condition, with tags and packaging intact.
            Motivo Kids is not responsible for damage caused during return shipping.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
          <p>
            For assistance with returns, contact our support team via email{" "}
            <a href="mailto:support@motivokids.com" className={`${linkColor} underline`}>
              support@motivokids.com
            </a>{" "}
            or call 1-800-MOTIVO-KIDS. We are happy to assist you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">13. Modifications to Policy</h2>
          <p>
            Motivo Kids reserves the right to update this Return Policy at any time.
            Changes will be posted on this page with the effective date updated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">14. Governing Law</h2>
          <p>
            This Return Policy is governed by the laws of India. Any disputes shall
            be subject to the jurisdiction of courts in Mumbai.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">15. Closing Statement</h2>
          <p>
            At Motivo Kids, our goal is to ensure a delightful and worry-free shopping
            experience for every parent and child. Your satisfaction is our priority.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
