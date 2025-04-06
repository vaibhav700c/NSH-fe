// app/components/LogsViewer.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Log } from "../types/log"; // Import the Log type

export default function LogsViewer() {
  const [logs, setLogs] = useState<Log[]>([]); // Replace 'any[]' with 'Log[]'

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(data.logs); // data.logs is Log[]
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-gray-900/80 p-6 rounded-xl border border-gray-800 max-h-96 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs available</p>
      ) : (
        logs.map((log, index) => (
          <motion.div
            key={index}
            className="text-sm text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <span className="text-blue-400">{new Date(log.timestamp).toLocaleString()}</span> -{" "}
            {log.action}: {log.details}
          </motion.div>
        ))
      )}
    </div>
  );
}