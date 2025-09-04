import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-gray-950" : "bg-gray-900";
  const textPrimary = theme === "dark" ? "text-gray-200" : "text-white";
  const textSecondary = theme === "dark" ? "text-gray-500" : "text-gray-400";
  const border = theme === "dark" ? "border-gray-800" : "border-gray-700";
  const hover = theme === "dark" ? "hover:text-white" : "hover:text-white";

  return (
    <footer className={`${bg} ${textPrimary}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">Motivo Kids</span>
            </Link>
            <p className={`${textSecondary} mb-4`}>
              Your trusted partner for quality kids' products. Safe, fun, and
              educational items for children of all ages.
            </p>
            <div className="flex space-x-4">
              <Facebook className={`w-5 h-5 ${textSecondary} ${hover} cursor-pointer transition-colors`} />
              <Instagram className={`w-5 h-5 ${textSecondary} ${hover} cursor-pointer transition-colors`} />
              <Twitter className={`w-5 h-5 ${textSecondary} ${hover} cursor-pointer transition-colors`} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className={`space-y-2 ${textSecondary}`}>
              <li><Link to="/about" className={`${hover} transition-colors`}>About Us</Link></li>
              <li><Link to="/privacy" className={`${hover} transition-colors`}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={`${hover} transition-colors`}>Terms of Service</Link></li>
              <li><Link to="/returns" className={`${hover} transition-colors`}>Return Policy</Link></li>
              <li><Link to="/safety" className={`${hover} transition-colors`}>Safety Standards</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className={`space-y-2 ${textSecondary}`}>
              <li><Link to="/category/toys" className={`${hover} transition-colors`}>Toys</Link></li>
              <li><Link to="/category/clothing" className={`${hover} transition-colors`}>Clothing</Link></li>
              <li><Link to="/category/sports" className={`${hover} transition-colors`}>Sports</Link></li>
              <li><Link to="/category/baby-care" className={`${hover} transition-colors`}>Baby Care</Link></li>
              <li><Link to="/category/stationary" className={`${hover} transition-colors`}>Stationary</Link></li>
              <li><Link to="/category/arts-crafts" className={`${hover} transition-colors`}>Arts & Crafts</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className={`space-y-3 ${textSecondary}`}>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@motivokids.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>1-800-MOTIVO-KIDS</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Kids Street, Mumbai, MH 400001</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t mt-8 pt-8 text-center ${border} ${textSecondary}`}>
          <p>
            &copy; 2024 Motivo Kids. All rights reserved. Safe shopping for your little ones.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
