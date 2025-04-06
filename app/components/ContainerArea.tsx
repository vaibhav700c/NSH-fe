import { Item } from "../types/item";
import { motion } from "framer-motion";

interface ContainerAreaProps {
  items: Item[];
}

export default function ContainerArea({ items }: ContainerAreaProps) {
  return (
    <div className="w-full h-[500px] bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-auto p-6 relative shadow-xl">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No items in container</p>
      ) : (
        items.map((item) => (
          <motion.div
            key={item.itemId}
            className="absolute bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-shadow"
            style={{ left: `${item.position.startCoordinates.width}px`, top: `${item.position.startCoordinates.height}px` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs">ID: {item.itemId}</p>
            <p className="text-xs">Container: {item.containerId}</p>
            <p className="text-xs">Uses: {item.usageCount}/{item.usageLimit}</p>
            <p className="text-xs">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
          </motion.div>
        ))
      )}
    </div>
  );
}