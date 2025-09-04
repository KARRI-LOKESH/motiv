import React, { useState } from "react";
import axios from "axios";
import mtvLogo from "../assets/mtv.png";

const PartnerSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    shop_name: "",
    phone_number: "",
    address: "",
    website: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileImage(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Required fields validation
    if (!formData.username || !formData.email || !formData.password || !formData.shop_name) {
      setMessage("❌ Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as string);
      });
      if (profileImage) data.append("profile_image", profileImage);

      const response = await axios.post(
        "http://localhost:8000/api/sellers/signup/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Seller registered successfully!");
      // Reset form only after successful signup
      setFormData({
        username: "",
        email: "",
        password: "",
        shop_name: "",
        phone_number: "",
        address: "",
        website: "",
        bio: "",
      });
      setProfileImage(null);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setMessage(
        "❌ Signup failed: " + JSON.stringify(error.response?.data || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side: Logo + Info */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-white dark:bg-gray-900 p-10 text-center">
        <img src={mtvLogo} alt="Motivo Kids Logo" className="w-48 h-auto object-contain mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          Join Motivo Kids Today!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xs">
          Become a partner and start selling your products with ease. Manage your shop, track orders, and grow your business effortlessly.
        </p>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Partner Signup
          </h2>

          {message && (
            <p className={`mb-4 text-center font-medium ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {["username", "email", "password", "shop_name", "phone_number", "address", "website"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) + (["username", "email", "password", "shop_name"].includes(field) ? " *" : "")}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required={["username", "email", "password", "shop_name"].includes(field)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
              />
            ))}

            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <a href="/seller/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;
