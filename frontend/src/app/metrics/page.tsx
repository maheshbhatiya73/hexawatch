"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type SystemStats = {
  cpu: number;
  ram: number;
  total_ram: number;
  used_ram: number;
  free_ram: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    ram: 0,
    total_ram: 0,
    used_ram: 0,
    free_ram: 0,
  });
  const [cpuData, setCpuData] = useState<number[]>([]);
  const [ramData, setRamData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.onmessage = (event) => {
      const data: SystemStats = JSON.parse(event.data);
      setStats(data);

      // Update chart data (limit to last 20 points for performance)
      setCpuData((prev) => [...prev.slice(-19), data.cpu]);
      setRamData((prev) => [...prev.slice(-19), data.ram]);
      setLabels((prev) => {
        const time = new Date().toLocaleTimeString();
        return [...prev.slice(-19), time];
      });
    };

    return () => ws.close();
  }, []);

  // Chart.js configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Usage (%)", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        title: { display: true, text: "Time", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
    },
  };

  const cpuChartData = {
    labels,
    datasets: [
      {
        label: "CPU Usage",
        data: cpuData,
        borderColor: "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ramChartData = {
    labels,
    datasets: [
      {
        label: "RAM Usage",
        data: ramData,
        borderColor: "rgba(16, 185, 129, 1)", // Green
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className=" bg-gray-900 text-white p-6">
     

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* CPU Monitor Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-12h2v4h-2zm0 6h2v2h-2z" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold">CPU Usage</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-blue-400">{stats.cpu.toFixed(2)}%</p>
            <p className="text-sm text-gray-400">Current Load</p>
          </div>
          <div className="h-64">
            <Line data={cpuChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* RAM Monitor Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4zm2 2v12h12V6zm2 2h8v2H8zm0 4h8v2H8zm0 4h8v2H8z" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold">RAM Usage</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-green-400">{stats.ram.toFixed(2)}%</p>
            <p className="text-sm text-gray-400">
              {Math.round(stats.used_ram / 1024 / 1024)}MB / {Math.round(stats.total_ram / 1024 / 1024)}MB
            </p>
          </div>
          <div className="h-64">
            <Line data={ramChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}