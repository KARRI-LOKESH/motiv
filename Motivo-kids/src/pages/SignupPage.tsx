// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import mtvLogo from '../assets/mtv.png';
const SignupPage: React.FC = () => {
  const { signup, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!firstName || !lastName || !email)
      return setMessage("All fields are required");
    try {
      await signup({ firstName, lastName, email });
      await sendOtp(email);
      setStep(2);
      setMessage("OTP sent to your email");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage("OTP is required");
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
  const linkText = theme === "dark" ? "text-green-400" : "text-green-600";

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


  <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center mt-6">
    Create Your Free Account
  </h1>
  <p className="text-lg max-w-md text-center leading-relaxed">
    Join Motivo Kids to explore exciting products, save your favorites, track orders, and enjoy a fun and personalized shopping experience.
  </p>
</motion.div>


      {/* Right - Signup Form */}
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

          {step === 1 ? (
            <>
              <h2 className="text-3xl font-extrabold mb-6 text-center">Sign Up</h2>
              <div className="space-y-4">
                <input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg}`}
                />
                <input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg}`}
                />
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg}`}
                />
                <button
                  onClick={handleSignup}
                  className={`w-full py-3 text-white font-semibold rounded-lg hover:shadow-lg transition ${buttonBg}`}
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
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
                  Verify & Continue
                </button>
              </div>
            </>
          )}
        </div>

        <p className={`mt-6 text-sm text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Already have an account?{" "}
          <Link to="/login" className={`font-semibold hover:underline ${linkText}`}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
