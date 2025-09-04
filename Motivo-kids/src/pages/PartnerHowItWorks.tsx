// src/pages/PartnerHowItWorks.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const steps = [
  {
    number: 1,
    title: "Register as Seller",
    description:
      "Create your seller account in minutes. Fill the form and get verified quickly.",
    icon: "📝",
  },
  {
    number: 2,
    title: "Add Products",
    description:
      "Upload images, descriptions, and prices to showcase your products to millions of buyers.",
    icon: "📦",
  },
  {
    number: 3,
    title: "Get Verified",
    description:
      "Our team verifies your account to ensure safety and trust before you start selling.",
    icon: "✅",
  },
  {
    number: 4,
    title: "Start Selling",
    description:
      "Manage orders, track earnings, and grow your business with our seller dashboard.",
    icon: "💰",
  },
];

const PartnerHowItWorks: React.FC = () => {
  const { theme } = useTheme();

  const bgMain = theme === "light" ? "bg-gray-50" : "bg-gray-900";
  const textMain = theme === "light" ? "text-gray-800" : "text-gray-200";
  const textSecondary = theme === "light" ? "text-gray-700" : "text-gray-400";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const cardShadow = theme === "light" ? "shadow hover:shadow-lg" : "shadow-md hover:shadow-lg";

  return (
    <div className={`min-h-screen ${bgMain}`}>
      {/* Hero Section */}
      <section className="flex flex-col items-start px-6 md:px-20 py-16">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          {/* Logo at top */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className={`text-2xl font-bold ${textMain}`}>Motivo Kids 🎉</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textMain}`}>
            How Motivo Works
          </h1>
          <p className={`mb-6 ${textSecondary}`}>
            Join thousands of sellers growing their business on Motivo Kids.
            Easy registration, product management, and secure payments.
          </p>
          <Link
            to="/partner/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up Now
          </Link>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex items-start space-x-4 ${cardBg} p-6 rounded-lg ${cardShadow} transition`}
          >
            <div className="bg-blue-500 text-white p-4 rounded-full text-xl flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h2 className={`font-semibold text-xl mb-1 ${textMain}`}>{step.title}</h2>
              <p className={`${textSecondary}`}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default PartnerHowItWorks;
