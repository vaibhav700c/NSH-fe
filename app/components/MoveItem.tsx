"use client";
import { useState } from "react";
import { Item } from "../types/item";

interface MoveItemProps {
  items: Item[];
  onMove: (itemId: string, containerId: string, position: { startCoordinates: { width: number; depth: number; height: number }; endCoordinates: { width: number; depth: number; height: number } }) => void;
}

export default function MoveItem({ items, onMove }: MoveItemProps) {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [containerId, setContainerId] = useState<string>("");
  const [startWidth, setStartWidth] = useState(0);
  const [startDepth, setStartDepth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [endWidth, setEndWidth] = useState(0);
  const [endDepth, setEndDepth] = useState(0);
  const [endHeight, setEndHeight] = useState(0);

  const handleMove = async () => {
    if (selectedItem && containerId) {
      const position = {
        startCoordinates: { width: startWidth, depth: startDepth, height: startHeight },
        endCoordinates: { width: endWidth, depth: endDepth, height: endHeight },
      };
      await fetch("http://xyz.com:8000/api/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selectedItem, userId: "astronaut1", timestamp: new Date().toISOString(), containerId, position }),
      });
      onMove(selectedItem, containerId, position);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        onChange={(e) => setSelectedItem(e.target.value)}
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select item to move</option>
        {items.map((item) => (
          <option key={item.itemId} value={item.itemId}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={containerId}
        onChange={(e) => setContainerId(e.target.value)}
        placeholder="Container ID"
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="grid grid-cols-3 gap-3">
        <input type="number" value={startWidth} onChange={(e) => setStartWidth(Number(e.target.value))} placeholder="Start W" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
        <input type="number" value={startDepth} onChange={(e) => setStartDepth(Number(e.target.value))} placeholder="Start D" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
        <input type="number" value={startHeight} onChange={(e) => setStartHeight(Number(e.target.value))} placeholder="Start H" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
        <input type="number" value={endWidth} onChange={(e) => setEndWidth(Number(e.target.value))} placeholder="End W" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
        <input type="number" value={endDepth} onChange={(e) => setEndDepth(Number(e.target.value))} placeholder="End D" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
        <input type="number" value={endHeight} onChange={(e) => setEndHeight(Number(e.target.value))} placeholder="End H" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
      </div>
      <button
        onClick={handleMove}
        className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Move Item
      </button>
    </div>
  );
}