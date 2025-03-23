"use client";
import { FaPowerOff, FaSearch, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-2 w-305 rounded-2xl right-2 h-20 bg-gray-800 border-b border-gray-700 text-white flex items-center justify-between px-6 z-50 shadow-xl"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="hidden md:flex items-center w-96 bg-gray-700 rounded-lg px-4 py-2 space-x-3"
      >
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search dashboard..."
          className="w-full bg-transparent outline-none placeholder-gray-400 text-sm"
        />
      </motion.div>
      <div className="flex items-center space-x-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative cursor-pointer"
        >
          <FaBell className="text-gray-300 hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 bg-gray-700 rounded-lg px-3 py-1.5 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm">A</span>
          </div>
          <span className="text-sm font-medium">Admin</span>
        </motion.div>
        <motion.div
          whileHover={{ rotate: 90 }}
          className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
        >
          <FaPowerOff className="text-red-400 hover:text-red-300 transition-colors" />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;