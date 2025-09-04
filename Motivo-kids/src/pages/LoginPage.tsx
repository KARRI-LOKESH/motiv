// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import mtvLogo from '../assets/mtv.png';
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email) return setMessage("Email is required");
    try {
      await sendOtp(email);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  // Theme-based classes
  const leftBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-green-500 to-green-700 text-white";
  const rightBg = theme === "dark" ? "bg-gray-800" : "bg-green-50";
  const cardBg = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const inputBg = theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300";
  const buttonBg = theme === "dark" ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700";
  const linkText = theme === "dark" ? "text-green-400" : "text-green-600";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Branding */}
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
    Welcome Back!
  </h1>
  <p className="text-lg max-w-md text-center leading-relaxed">
    Log in to explore exciting products, save your favorites, track your orders, 
    and enjoy a personalized shopping experience.
  </p>
</motion.div>

      {/* Right - Form */}
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

          <h2 className="text-3xl font-extrabold mb-6 text-center">
            Login to Your Account
          </h2>

          <div className="space-y-5">
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg}`}
            />
            <button
              onClick={handleLogin}
              className={`w-full py-3 text-white font-semibold rounded-lg hover:shadow-lg transition ${buttonBg}`}
            >
              Send OTP
            </button>
          </div>
        </div>

        <p className={`mt-6 text-sm text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Don’t have an account?{" "}
          <Link to="/signup" className={`font-semibold hover:underline ${linkText}`}>
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
