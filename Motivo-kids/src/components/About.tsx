import React from "react";
import { motion } from "framer-motion";
import "./About.css"; // Keep your gradient blobs + glow-text CSS

const About: React.FC = () => {
  const teamMembers = [
    { name: "Aarav", role: "Toy Designer" },
    { name: "Mia", role: "Child Psychologist" },
    { name: "Rohan", role: "Product Engineer" },
    { name: "Saanvi", role: "Marketing Lead" },
    { name: "Vivaan", role: "Logistics Manager" },
    { name: "Ishita", role: "Customer Relations" },
  ];

  const locations = [
    { city: "Hyderabad", address: "123 Motivo Street, Hyderabad, India" },
    { city: "Bangalore", address: "456 Play Avenue, Bangalore, India" },
    { city: "Mumbai", address: "789 Toy Blvd, Mumbai, India" },
    { city: "Delhi", address: "321 Fun Street, Delhi, India" },
  ];

  const stats = [
    { label: "Toys Sold", value: "1M+" },
    { label: "Countries Served", value: "12" },
    { label: "Happy Kids", value: "500K+" },
    { label: "Awards Won", value: "15" },
  ];

  const testimonials = [
    { name: "Ananya", quote: "Motivo Kids toys spark creativity in my daughter!", img: "https://randomuser.me/api/portraits/women/21.jpg" },
    { name: "Rahul", quote: "Safe, fun, and educational. Highly recommend!", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sofia", quote: "I love how every toy encourages imagination.", img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  const faqs = [
    { question: "Are Motivo Kids toys safe for all ages?", answer: "Yes! Every toy passes strict safety checks and is suitable for the recommended age." },
    { question: "Do you ship internationally?", answer: "Currently, we ship to 12 countries worldwide." },
    { question: "Can I return or exchange a toy?", answer: "Yes! Returns and exchanges are allowed within 30 days of purchase." },
    { question: "Do you provide toys for schools or events?", answer: "Absolutely! Contact our sales team for bulk orders and partnerships." },
  ];

  return (
    <div className="relative min-h-screen bg-animated text-white overflow-hidden">

      {/* Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      {/* Hero Section */}
      <section className="py-20 text-center px-6 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pink-500/50"
        >
          <span className="text-white font-bold text-4xl glow-text">M</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-pink-300 drop-shadow-md glow-text"
        >
          About Motivo Kids
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200"
        >
          Making childhood magical with safe, fun, and innovative toys for kids everywhere.
        </motion.p>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src="https://cdn-icons-png.flaticon.com/512/5273/5273646.png"
            alt="Mission"
            className="w-full max-w-sm mx-auto drop-shadow-2xl"
          />
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-pink-300 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              At <span className="font-semibold">Motivo Kids</span>, our mission is to bring happiness and creativity to every child’s life. We design toys that are not just fun but also promote learning, imagination, and development. Every toy is carefully chosen to ensure safety, quality, and joy.
            </p>
            <h2 className="text-3xl font-bold text-pink-300 mt-8 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              To be the most trusted brand for children’s toys globally, creating experiences that inspire learning, fun, and lifelong memories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-r from-purple-800/40 via-pink-800/30 to-indigo-800/40 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-pink-300 mb-12"
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", title: "Safety First", desc: "Every toy we sell passes strict safety standards so parents can trust our products." },
              { img: "https://cdn-icons-png.flaticon.com/512/616/616408.png", title: "Creativity", desc: "Inspiring imagination and storytelling through toys designed with love." },
              { img: "https://cdn-icons-png.flaticon.com/512/4206/4206277.png", title: "Learning", desc: "Encouraging curiosity and skill-building with every play experience." },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg hover:scale-110 hover:shadow-pink-500/30 transition-transform"
              >
                <img src={val.img} alt={val.title} className="w-24 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-pink-200 mb-2">{val.title}</h3>
                <p className="text-gray-200">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-pink-300 mb-12"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-pink-400/40 hover:scale-105 transition"
            >
              <img
                src={`https://randomuser.me/api/portraits/lego/${idx + 1}.jpg`}
                alt={member.name}
                className="w-28 h-28 mx-auto rounded-full mb-4 border-4 border-pink-400"
              />
              <h3 className="text-xl font-semibold text-pink-200">{member.name}</h3>
              <p className="text-gray-200">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-pink-300 mb-12"
        >
          Our Locations
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex items-center gap-6 hover:scale-105 transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt={loc.city}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-xl font-semibold text-pink-200">{loc.city}</h3>
                <p className="text-gray-200">{loc.address}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / Achievements */}
      <section className="py-20 bg-gradient-to-r from-pink-700 via-purple-800 to-indigo-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center grid md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-3xl font-bold text-pink-200 mb-2">{stat.value}</h3>
              <p className="text-gray-200">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-pink-300 mb-12"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg hover:scale-105 transition"
            >
              <img src={test.img} alt={test.name} className="w-20 h-20 mx-auto rounded-full mb-4 border-4 border-pink-400" />
              <p className="text-gray-200 italic mb-2">"{test.quote}"</p>
              <h3 className="text-xl font-semibold text-pink-200">{test.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-pink-300 mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg cursor-pointer hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold text-pink-200">{faq.question}</h3>
              <p className="text-gray-200 mt-2">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-800 via-pink-800 to-indigo-900 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-pink-200 mb-6"
        >
          Join Us in Spreading Joy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-200 mb-6 max-w-xl mx-auto"
        >
          Sign up for updates, new product launches, and fun activities for kids.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-pink-500 rounded-full text-white font-semibold shadow-lg hover:bg-pink-600 transition"
        >
          Subscribe Now
        </motion.button>
      </section>

      {/* Closing Statement */}
      <section className="bg-gradient-to-r from-pink-700 via-purple-800 to-indigo-900 py-20 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-pink-200 glow-text"
        >
          Motivo Kids – Because every child deserves joy!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto"
        >
          Join us in building a brighter, happier world for kids through safe and inspiring toys.
        </motion.p>
      </section>

    </div>
  );
};

export default About;
