"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function TimeControl() {
  const [days, setDays] = useState(1);

  const simulateDay = async () => {
    await fetch("http://xyz.com:8000/api/simulate/day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numOfDays: days, itemsToBeUsedPerDay: [] }),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.p
        className="text-lg text-gray-200"
        key={Date.now()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Current Time: {new Date().toLocaleString()}
      </motion.p>
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
      />
      <button
        onClick={simulateDay}
        className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Simulate Days
      </button>
    </div>
  );
}