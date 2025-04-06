// types/item.ts
export interface Item {
  itemId: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  priority: number;
  expiryDate: string;
  usageLimit: number;
  preferredZone: string;
  containerId: string;
  position: {
    startCoordinates: { width: number; depth: number; height: number };
    endCoordinates: { width: number; depth: number; height: number };
  };
  usageCount: number;
}