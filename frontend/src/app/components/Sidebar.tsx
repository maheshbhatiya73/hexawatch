"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, FaChartLine, FaList, FaTerminal, 
  FaCogs, FaBell, FaCog, FaPowerOff 
} from "react-icons/fa";

const navItems = [
    { title: "Dashboard", href: "/", icon: <FaHome /> },
    { title: "Metrics", href: "/metrics", icon: <FaChartLine /> },
    { title: "Gpu process", href: "/Gpuprocess", icon: <FaChartLine /> },

    { title: "Processes", href: "/processes", icon: <FaList /> },
    
    { title: "Logs", href: "/logs", icon: <FaTerminal /> },
    { title: "Services", href: "/services", icon: <FaCogs /> },
    { title: "Alerts", href: "/alerts", icon: <FaBell /> },
    { title: "Settings", href: "/settings", icon: <FaCog /> },
    { title: "Logout", href: "/logout", icon: <FaPowerOff /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed top-0 left-0 h-screen w-72 bg-gray-900 border-r border-gray-700 flex flex-col p-4 space-y-2 z-40 shadow-2xl"
    >
      {/* Logo Section */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mb-8 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600"
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">⨊</span>
          Hexawatch
        </h1>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isLogout = item.title === "Logout";

            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative ${
                  isLogout ? "mt-auto border-t border-gray-700 pt-4" : ""
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center p-3 space-x-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-purple-600/30 text-purple-400 shadow-lg"
                      : "hover:bg-gray-800/50 hover:pl-5 text-gray-300"
                  } ${isLogout ? "hover:bg-red-600/20 hover:text-red-400" : ""}`}
                >
                  <motion.span
                    className={`text-lg ${
                      isActive ? "text-purple-400" : "text-gray-400"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="font-medium">{item.title}</span>
                  
                  {/* Animated underline */}
                  {isActive && (
                    <motion.div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-400 rounded-l-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Ambient Glow Effect */}
      <div className="absolute inset-y-0 left-full w-2 bg-gradient-to-r from-purple-600/20 to-transparent" />
    </motion.aside>
  );
};

export default Sidebar;