import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="mb-6">
          At <strong>Motivo Kids</strong>, we are committed to safeguarding your
          privacy. This Privacy Policy outlines how we collect, use, disclose,
          and protect your personal information when you use our services.
        </p>

        {/* Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="mb-2">
            We collect the following types of information when you interact with
            our platform:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Personal details such as name, email address, and phone number.</li>
            <li>Payment details when you make a purchase.</li>
            <li>
              Usage information such as pages visited, time spent, and activities performed.
            </li>
            <li>Device and browser information for improving compatibility.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-2">The information collected may be used to:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Provide and improve our services.</li>
            <li>Customize your user experience.</li>
            <li>Send important updates and promotional offers.</li>
            <li>Process payments securely.</li>
            <li>Enhance platform security and prevent fraud.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to analyze traffic, remember
            preferences, and enhance your browsing experience. You may disable
            cookies in your browser settings, but some features may not work
            properly without them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Data Sharing & Disclosure</h2>
          <p className="mb-2">
            We do not sell your personal data. However, we may share information
            with:
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>Trusted third-party service providers (payment gateways, hosting).</li>
            <li>Legal authorities, if required by law or regulation.</li>
            <li>Business partners to improve services and offers.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
          <p>
            We retain your data only for as long as necessary to fulfill the
            purposes outlined in this policy unless a longer retention period is
            required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Children’s Privacy</h2>
          <p>
            Protecting children’s privacy is especially important. We do not
            knowingly collect personal information from children under 13. If we
            discover such data has been collected, we will delete it immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Data Security</h2>
          <p>
            We implement strict technical and organizational measures to protect
            your data against unauthorized access, alteration, or disclosure.
            However, no system is 100% secure, and we cannot guarantee absolute
            security of your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Your Rights</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Right to access and review your data.</li>
            <li>Right to request corrections or deletion.</li>
            <li>Right to opt-out of marketing communications.</li>
            <li>Right to withdraw consent where applicable.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Third-Party Links</h2>
          <p>
            Our platform may include links to third-party websites. We are not
            responsible for their privacy practices, and we encourage you to
            read their policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">10. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted here, and significant changes will be communicated through
            email or platform notifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{" "}
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

export default PrivacyPolicy;
