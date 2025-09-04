// src/components/Hero.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Star, Shield, Truck } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../contexts/ThemeContext";

import toy2 from "../assets/toy2.jpg";
import baby1 from "../assets/baby1.jpg";
import oip3 from "../assets/oip3.jpg";
import sport4 from "../assets/sports4.jpg";

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hearts, setHearts] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);

  const bgGradient =
    theme === "dark"
      ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500";

  const textPrimary = theme === "dark" ? "text-gray-100" : "text-white";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-blue-100";
  const btnPrimary =
    theme === "dark"
      ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
      : "bg-white text-blue-600 hover:bg-gray-100";
  const btnSecondary =
    theme === "dark"
      ? "border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900"
      : "border-2 border-white text-white hover:bg-white hover:text-blue-600";

  const heroProducts = [
    { id: 4, image: toy2 },
    { id: 4, image: baby1 },
    { id: 12, image: oip3 },
    { id: 15, image: sport4 },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  const createHeart = (parentWidth: number) => {
    const id = Date.now();
    const left = Math.random() * (parentWidth - 20);
    const size = 12 + Math.random() * 10;
    const duration = 3 + Math.random() * 2;

    const style: React.CSSProperties = {
      left,
      fontSize: size,
      animationDuration: `${duration}s`,
    };

    setHearts((prev) => [...prev, { id, style }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, duration * 1000);
  };

  return (
    <section className={`${bgGradient} ${textPrimary}`}>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Magical Products for
              <span
                className={
                  theme === "dark" ? "block text-yellow-400" : "block text-yellow-300"
                }
              >
                Amazing Kids
              </span>
            </h1>
            <p className={`text-xl lg:text-2xl max-w-lg ${textSecondary}`}>
              Discover safe, educational, and fun products that spark imagination
              and joy for children of all ages.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/category/toys"
                className={`px-8 py-4 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 ${btnPrimary}`}
              >
                <span>Shop Now</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/category/allproducts"
                className={`px-8 py-4 rounded-full font-semibold transition-colors text-center ${btnSecondary}`}
              >
                View Categories
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8 flex-wrap">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-sm font-medium">Safety Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-sm font-medium">Top Rated</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative w-full max-w-lg mx-auto">
            <Slider {...settings}>
              {heroProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-2 cursor-pointer relative overflow-hidden group"
                  onClick={() => navigate(`/product/${prod.id}`)}
                  onMouseMove={(e) => createHeart((e.currentTarget as HTMLDivElement).offsetWidth)}
                >
                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center relative">
                    <img
                      src={prod.image}
                      alt={`Product ${prod.id}`}
                      className="w-full h-80 object-cover transition-transform duration-500 transform group-hover:scale-105"
                    />

                    {/* Floating deep green hearts */}
                    {hearts.map((heart) => (
                      <span
                        key={heart.id}
                        className="absolute text-green-800 animate-heartWave"
                        style={heart.style}
                      >
                        🤖
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Heart Wave Animation */}
      <style>
        {`
          @keyframes heartWave {
            0% {
              transform: translate(0,0) scale(1);
              opacity: 1;
            }
            25% {
              transform: translate(-10px,-30px) scale(1.1);
            }
            50% {
              transform: translate(10px,-60px) scale(1.2);
            }
            75% {
              transform: translate(-5px,-90px) scale(1.1);
            }
            100% {
              transform: translate(0,-120px) scale(0.8);
              opacity: 0;
            }
          }
          .animate-heartWave {
            animation-name: heartWave;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
            pointer-events: none;
            position: absolute;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
