"use client";

import { useEffect, useState } from "react";
import { FaMicrochip, FaMemory, FaList, FaTerminal, FaHdd, FaNetworkWired } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

type SystemStats = {
  cpu: number;
  ram: number;
  total_ram: number;
  used_ram: number;
  free_ram: number;
};

type DiskStats = {
  total: number;
  used: number;
  free: number;
  percent: number;
};

type NetworkStats = {
  upload: number;   // Bytes per second
  download: number; // Bytes per second
  total_sent: number;     // Total bytes sent
  total_received: number; // Total bytes received
};

type ProcessInfo = {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    ram: 0,
    total_ram: 0,
    used_ram: 0,
    free_ram: 0,
  });
  const [diskStats, setDiskStats] = useState<DiskStats>({
    total: 0,
    used: 0,
    free: 0,
    percent: 0,
  });
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    upload: 0,
    download: 0,
    total_sent: 0,
    total_received: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    const wsStats = new WebSocket("ws://localhost:8080/ws");
    wsStats.onmessage = (event) => {
      const data: SystemStats = JSON.parse(event.data);
      setStats(data);
    };

    const wsDisk = new WebSocket("ws://localhost:8080/disk");
    wsDisk.onmessage = (event) => {
      const data: DiskStats = JSON.parse(event.data);
      setDiskStats(data);
    };

    const wsNetwork = new WebSocket("ws://localhost:8080/network");
    wsNetwork.onmessage = (event) => {
      const data: NetworkStats = JSON.parse(event.data);
      setNetworkStats(data);
    };

    const wsLogs = new WebSocket("ws://localhost:8080/logs");
    wsLogs.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data].slice(-5));
    };

    const wsProcesses = new WebSocket("ws://localhost:8080/processes");
    wsProcesses.onmessage = (event) => {
      const data: ProcessInfo[] = JSON.parse(event.data);
      setProcesses(data.slice(0, 5));
    };

    return () => {
      wsStats.close();
      wsDisk.close();
      wsNetwork.close();
      wsLogs.close();
      wsProcesses.close();
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* CPU Card */}
          <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl shadow-2xl cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 rounded-xl group-hover:opacity-20 opacity-0 transition-opacity" />
            <div className="flex items-center space-x-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <FaMicrochip className="text-white text-3xl" />
              </motion.div>
              <div>
                <h2 className="text-sm font-medium text-blue-100">CPU Usage</h2>
                <p className="text-2xl font-bold text-white mt-1">{stats.cpu.toFixed(2)}%</p>
                <div className="mt-2 h-1.5 w-full bg-blue-900/30 rounded-full">
                  <motion.div
                    className="h-full bg-blue-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.cpu}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* RAM Card */}
          <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-gradient-to-br from-green-600 to-cyan-600 p-6 rounded-xl shadow-2xl cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 rounded-xl group-hover:opacity-20 opacity-0 transition-opacity" />
            <div className="flex items-center space-x-4">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <FaMemory className="text-white text-3xl" />
              </motion.div>
              <div>
                <h2 className="text-sm font-medium text-green-100">RAM Usage</h2>
                <p className="text-2xl font-bold text-white mt-1">{stats.ram.toFixed(2)}%</p>
                <div className="mt-2 text-xs font-medium text-green-200">
                  {Math.round(stats.used_ram / 1024 / 1024)}MB / {Math.round(stats.total_ram / 1024 / 1024)}MB
                </div>
                <div className="mt-2 h-1.5 w-full bg-green-900/30 rounded-full">
                  <motion.div
                    className="h-full bg-green-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.ram}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disk Space Card */}
          <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-xl shadow-2xl cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 rounded-xl group-hover:opacity-20 opacity-0 transition-opacity" />
            <div className="flex items-center space-x-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <FaHdd className="text-white text-3xl" />
              </motion.div>
              <div>
                <h2 className="text-sm font-medium text-yellow-100">Disk Usage</h2>
                <p className="text-2xl font-bold text-white mt-1">{diskStats.percent.toFixed(2)}%</p>
                <div className="mt-2 text-xs font-medium text-yellow-200">
                  {(diskStats.used / 1e9).toFixed(2)}GB / {(diskStats.total / 1e9).toFixed(2)}GB
                </div>
                <div className="mt-2 h-1.5 w-full bg-yellow-900/30 rounded-full">
                  <motion.div
                    className="h-full bg-yellow-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${diskStats.percent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Network Usage Card */}
          <motion.div
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ scale: 1.05 }}
            className="group relative bg-gradient-to-br from-teal-600 to-indigo-600 p-6 rounded-xl shadow-2xl cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 rounded-xl group-hover:opacity-20 opacity-0 transition-opacity" />
            <div className="flex items-center space-x-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <FaNetworkWired className="text-white text-3xl" />
              </motion.div>
              <div>
                <h2 className="text-sm font-medium text-teal-100">Network Usage</h2>
                <p className="text-2xl font-bold text-white mt-1">
                  {(networkStats.download / 1024 / 1024).toFixed(2)} Mbps ↓
                </p>
                <p className="text-sm text-teal-200">
                  {(networkStats.upload / 1024 / 1024).toFixed(2)} Mbps ↑
                </p>
                <div className="mt-2 text-xs font-medium text-teal-200">
                  Total: {(networkStats.total_received / 1e9).toFixed(2)}GB ↓ / {(networkStats.total_sent / 1e9).toFixed(2)}GB ↑
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaList className="mr-2 text-purple-400" />
            Top Processes
          </h3>
          <div className="space-y-4">
            {processes.map((process, index) => (
              <motion.div
                key={process.pid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{process.name}</p>
                  <p className="text-xs text-gray-400">PID: {process.pid}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-400">{process.cpu.toFixed(1)}% CPU</p>
                  <p className="text-xs text-blue-400">{process.memory.toFixed(1)} MB</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaTerminal className="mr-2 text-cyan-400" />
            System Logs
          </h3>
          <div className="space-y-2 font-mono">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={`${log}-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}