"use client";
import { useState } from "react";
import { Item } from "../types/item";

interface ItemSearchProps {
  onSearch: (results: Item[]) => void;
}

export default function ItemSearch({ onSearch }: ItemSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const res = await fetch(`http://xyz.com:8000/api/search?itemName=${encodeURIComponent(query)}`);
    const data = await res.json();
    onSearch(data.found ? [data.item] : []);
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items by name..."
        className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        onClick={handleSearch}
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </div>
  );
}