"use client";
import { Item } from "../types/item";

interface RetrieveItemProps {
  onRetrieve: (id: string) => void;
  items: Item[];
}

export default function RetrieveItem({ onRetrieve, items }: RetrieveItemProps) {
  const handleRetrieve = async (itemId: string) => {
    await fetch("http://xyz.com:8000/api/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, userId: "astronaut1", timestamp: new Date().toISOString() }),
    });
    onRetrieve(itemId);
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        onChange={(e) => handleRetrieve(e.target.value)}
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
      >
        <option value="">Select item to retrieve</option>
        {items.map((item) => (
          <option key={item.itemId} value={item.itemId}>
            {item.name} (Uses: {item.usageCount}/{item.usageLimit})
          </option>
        ))}
      </select>
    </div>
  );
}