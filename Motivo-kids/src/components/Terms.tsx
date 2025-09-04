import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Terms: React.FC = () => {
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
        <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        <p className="mb-6">
          Welcome to <strong>Motivo Kids</strong>! By accessing or using our website,
          products, and services, you agree to comply with these Terms & Conditions.
          Please read them carefully.
        </p>

        {/* Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By using our website, you accept and agree to be bound by these terms.
            If you do not agree, you must not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Account Registration</h2>
          <p>
            Users may need to register to access certain features. You must provide
            accurate information, maintain account confidentiality, and notify us
            of any unauthorized use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Eligibility</h2>
          <p>
            Our services are intended for individuals of legal age. By using the
            platform, you confirm that you meet the age requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Product Information</h2>
          <p>
            We strive to provide accurate product descriptions, images, and pricing.
            However, we do not guarantee that the content is error-free or complete.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Orders & Payment</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Orders are subject to availability and confirmation.</li>
            <li>Payments must be made through approved methods only.</li>
            <li>We reserve the right to cancel orders in case of payment or stock issues.</li>
            <li>All prices include applicable taxes unless stated otherwise.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Shipping & Delivery</h2>
          <p>
            Delivery timelines are estimates and not guaranteed. Motivo Kids is not
            responsible for delays caused by external factors such as courier issues,
            weather, or customs clearance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Returns & Refunds</h2>
          <p>
            Returns and refunds are handled in accordance with our Return Policy.
            Items must be returned within the specified period and in original condition.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. User Conduct</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Do not misuse the website or services.</li>
            <li>Do not attempt unauthorized access or interfere with site functionality.</li>
            <li>Respect intellectual property rights of Motivo Kids and others.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Intellectual Property</h2>
          <p>
            All content, logos, images, and designs are owned by Motivo Kids or its
            licensors. You may not use them without written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">10. Limitation of Liability</h2>
          <p>
            Motivo Kids is not liable for any indirect, incidental, or consequential
            damages arising from the use or inability to use our services or products.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">11. Third-Party Links</h2>
          <p>
            Our site may contain links to external websites. We are not responsible
            for their content, policies, or practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">12. Privacy Policy</h2>
          <p>
            By using our website, you agree to our Privacy Policy, which explains how
            we collect, use, and protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">13. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms or for other operational reasons.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">14. Changes to Terms</h2>
          <p>
            Terms & Conditions may be updated from time to time. Users will be
            notified of significant changes via email or platform notifications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">15. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes will be
            subject to the jurisdiction of courts in Mumbai.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">16. Contact Information</h2>
          <p>
            For any questions regarding these Terms & Conditions, reach us at{" "}
            <a href="mailto:support@motivokids.com" className={`${linkColor} underline`}>
              support@motivokids.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
