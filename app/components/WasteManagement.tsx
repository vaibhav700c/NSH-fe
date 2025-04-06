// app/components/WasteManagement.tsx
"use client";
import { useState } from "react";
import { WasteIdentifyResponse, WasteReturnPlanResponse } from "../types/waste"; // Import types

export default function WasteManagement() {
  const [undockingContainerId, setUndockingContainerId] = useState("");
  const [maxWeight, setMaxWeight] = useState(1000);

  const handleIdentify = async () => {
    const res = await fetch("http://xyz.com:8000/api/waste/identify");
    const data: WasteIdentifyResponse = await res.json();
    alert(`Waste items: ${data.wasteItems.map((w) => w.name).join(", ")}`); // No 'any', uses WasteItem
  };

  const handleReturnPlan = async () => {
    const res = await fetch("http://xyz.com:8000/api/waste/return-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ undockingContainerId, undockingDate: new Date().toISOString(), maxWeight }),
    });
    const data: WasteReturnPlanResponse = await res.json();
    alert(`Return plan: ${data.returnPlan.map((p) => `${p.itemName} to ${p.toContainer}`).join(", ")}`); // No 'any', uses ReturnPlanItem
  };

  const handleCompleteUndocking = async () => {
    const res = await fetch("http://xyz.com:8000/api/waste/complete-undocking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ undockingContainerId, timestamp: new Date().toISOString() }),
    });
    const data = await res.json();
    alert(`Items removed: ${data.itemsRemoved}`);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={undockingContainerId}
        onChange={(e) => setUndockingContainerId(e.target.value)}
        placeholder="Undocking Container ID"
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white w-full"
      />
      <input
        type="number"
        value={maxWeight}
        onChange={(e) => setMaxWeight(Number(e.target.value))}
        placeholder="Max Weight"
        className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white w-full"
      />
      <div className="flex gap-3">
        <button onClick={handleIdentify} className="px-5 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">Identify Waste</button>
        <button onClick={handleReturnPlan} className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Plan Waste Return</button>
        <button onClick={handleCompleteUndocking} className="px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Complete Undocking</button>
      </div>
    </div>
  );
}