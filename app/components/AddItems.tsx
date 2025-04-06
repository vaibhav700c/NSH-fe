"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AddItems() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://xyz.com:8000/api/import/items", { method: "POST", body: formData });
    if (res.ok) {
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 2000);
    } else {
      setUploadStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") handleFileUpload(file);
  };

  return (
    <motion.div
      className={`p-6 rounded-xl border-2 border-dashed transition-colors ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800/50"}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => fileInputRef.current?.click()}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="hidden"
      />
      <p className="text-center text-gray-300">
        {uploadStatus === "idle" && "Drag & drop item CSV or click to upload"}
        {uploadStatus === "success" && <span className="text-green-400">Items added!</span>}
        {uploadStatus === "error" && <span className="text-red-400">Upload failed</span>}
      </p>
    </motion.div>
  );
}