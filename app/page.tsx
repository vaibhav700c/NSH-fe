// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import ContainerArea from "./components/ContainerArea";
import ItemSearch from "./components/ItemSearch";
import TimeControl from "./components/TimeControl";
import AddContainers from "./components/AddContainers";
import AddItems from "./components/AddItems";
import RetrieveItem from "./components/RetrieveItem";
import MoveItem from "./components/MoveItem";
import LogsViewer from "./components/LogsViewer";
import WasteManagement from "./components/WasteManagement";
import { Item } from "./types/item";
import { Position } from "./types/placement"; // Import Position type
import { motion } from "framer-motion";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const refreshItems = async () => {
    const res = await fetch("http://xyz.com:8000/api/export/arrangement");
    const csv = await res.text();
    const newItems = csv.split("\n").map((row) => {
      const [itemId, containerId, startCoords, endCoords] = row.split(",");
      const [sw, sd, sh] = startCoords.slice(1, -1).split(",").map(Number);
      const [ew, ed, eh] = endCoords.slice(1, -1).split(",").map(Number);
      return {
        itemId,
        name: `Item ${itemId}`,
        width: ew - sw,
        depth: ed - sd,
        height: eh - sh,
        priority: 1,
        expiryDate: "2025-12-31",
        usageLimit: 1,
        usageCount: 1,
        preferredZone: "ZoneA",
        containerId,
        position: { startCoordinates: { width: sw, depth: sd, height: sh }, endCoordinates: { width: ew, depth: ed, height: eh } },
      };
    });
    setItems(newItems);
    setFilteredItems([]);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const handleSearch = (results: Item[]) => {
    setFilteredItems(results);
  };

  const handleRetrieve = (itemId: string) => {
    setItems((prev) => prev.map((item) => item.itemId === itemId ? { ...item, usageCount: item.usageCount - 1 } : item));
    setFilteredItems((prev) => prev.map((item) => item.itemId === itemId ? { ...item, usageCount: item.usageCount - 1 } : item));
  };

  const handleMove = (itemId: string, containerId: string, position: Position) => { // Replace 'any' with 'Position'
    setItems((prev) => prev.map((item) => item.itemId === itemId ? { ...item, containerId, position } : item));
    setFilteredItems((prev) => prev.map((item) => item.itemId === itemId ? { ...item, containerId, position } : item));
  };

  return (
    <motion.div className="py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Space Station Storage Management
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ContainerArea items={filteredItems.length > 0 ? filteredItems : items} />
          <LogsViewer />
        </div>
        <div className="space-y-8">
          <AddContainers />
          <AddItems />
          <ItemSearch onSearch={handleSearch} />
          <RetrieveItem onRetrieve={handleRetrieve} items={items} />
          <MoveItem onMove={handleMove} items={items} />
          <TimeControl />
          <WasteManagement />
          <button
            onClick={refreshItems}
            className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors w-full"
          >
            Refresh Arrangement
          </button>
        </div>
      </div>
    </motion.div>
  );
}