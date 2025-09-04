// src/pages/VerifyOtpPage.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import mtvLogo from '../assets/mtv.png';
const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  const { theme } = useTheme();

  const handleVerifyOtp = async () => {
    if (!otp || !email) return setMessage("OTP required");
    try {
      await verifyOtp(email, otp);
      navigate("/");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "OTP verification failed");
    }
  };

  // Theme-based classes
  const leftBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-green-500 to-green-700 text-white";
  const rightBg = theme === "dark" ? "bg-gray-800" : "bg-green-50";
  const cardBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const inputBg = theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300";
  const buttonBg = theme === "dark" ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Branding */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`flex-1 flex flex-col justify-center items-center p-10 ${leftBg}`}
      >
        <div className="w-48 h-20 sm:w-56 sm:h-24 overflow-hidden relative mb-6">
  <img
    src={mtvLogo}
    alt="Motivo Kids Logo"
    className="w-full h-full object-contain"
  />
</div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
          Verify Your Account
        </h1>
        <p className="text-lg max-w-md text-center leading-relaxed">
          Enter the OTP sent to your email to continue securely.
        </p>
      </motion.div>

      {/* Right - Verify Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`flex-1 flex flex-col justify-center items-center px-4 ${rightBg}`}
      >
        <div className={`p-10 rounded-2xl shadow-2xl w-full max-w-md ${cardBg}`}>
          {message && (
            <p
              className={`mb-4 text-center font-medium ${
                message.includes("failed") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <h2 className="text-3xl font-extrabold mb-6 text-center">Verify OTP</h2>

          <div className="space-y-4">
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg}`}
            />
            <button
              onClick={handleVerifyOtp}
              className={`w-full py-3 text-white font-semibold rounded-lg hover:shadow-lg transition ${buttonBg}`}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
