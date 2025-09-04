// src/pages/PartnerLoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, verifyOtpRequest } from "../api";
import mtvLogo from "../assets/mtv.png";

const PartnerLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Enter your email");
    setLoading(true);
    try {
      await loginRequest(email); // Sends OTP
      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await verifyOtpRequest(email, otp);
      alert("Login successful!");
      navigate("/seller/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side: Logo + text */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-white dark:bg-gray-900 p-10 text-center">
        <img src={mtvLogo} alt="Motivo Kids Logo" className="w-64 h-auto object-contain mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Welcome Partner!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Join Motivo Kids and grow your business with us. Manage your products, track orders, and boost sales easily.
        </p>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Partner Login
          </h2>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition"
              >
                {loading ? "Verifying..." : "Login"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Don't have an account?{" "}
            <a
              href="/seller/signup"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginPage;
