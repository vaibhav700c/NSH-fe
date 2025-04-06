// types/placement.ts
export interface PlacementRequestItem {
    itemId: string;
    name: string;
    width: number;
    depth: number;
    height: number;
    priority: number;
    expiryDate: string;
    usageLimit: number;
    preferredZone: string;
  }
  
  export interface PlacementRequestContainer {
    containerId: string;
    zone: string;
    width: number;
    depth: number;
    height: number;
  }
  
  export interface Coordinates {
    width: number;
    depth: number;
    height: number;
  }
  
  export interface Position {
    startCoordinates: Coordinates;
    endCoordinates: Coordinates;
  }
  
  export interface Placement {
    itemId: string;
    containerId: string;
    position: Position;
  }
  
  export interface Rearrangement {
    step: number;
    action: "move" | "remove" | "place";
    itemId: string;
    fromContainer: string;
    fromPosition: Position;
    toContainer: string;
    toPosition: Position;
  }
  
  export interface PlacementResponse {
    success: boolean;
    placements: Placement[];
    rearrangements: Rearrangement[];
  }