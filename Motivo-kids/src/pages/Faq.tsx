// src/pages/PartnerFAQ.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const faqs = [
  {
    question: "How do I register as a seller?",
    answer:
      "Click 'Sign Up', fill the form and submit. Our team will verify your account quickly.",
  },
  {
    question: "How long does verification take?",
    answer: "Verification usually takes 24–48 hours.",
  },
  {
    question: "Can I sell multiple product categories?",
    answer: "Yes, you can list products across different categories.",
  },
  {
    question: "How do I track orders?",
    answer:
      "Go to your dashboard > Orders to view and manage all orders easily.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We support bank transfers and digital payments directly to your account.",
  },
];

const PartnerFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const bgMain = theme === "light" ? "bg-gray-50" : "bg-gray-900";
  const textMain = theme === "light" ? "text-gray-800" : "text-gray-200";
  const textSecondary = theme === "light" ? "text-gray-600" : "text-gray-400";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const cardShadow = theme === "light" ? "shadow hover:shadow-lg" : "shadow-md hover:shadow-lg";

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen px-6 md:px-20 py-12 ${bgMain}`}>
      <h1 className={`text-4xl font-bold mb-6 ${textMain}`}>FAQs</h1>
      <input
        type="text"
        placeholder="Search FAQs..."
        className={`w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark" ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-800"}`}
      />
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded ${cardBg} ${cardShadow} cursor-pointer transition`}
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center"
            >
              <h2 className={`font-medium text-lg ${textMain}`}>{faq.question}</h2>
              <span className={`text-xl ${textMain}`}>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`mt-2 ${textSecondary}`}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PartnerFAQ;
