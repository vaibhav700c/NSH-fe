// types/waste.ts
export interface WasteItem {
    itemId: string;
    name: string;
    reason: string; // "Expired" | "Out of Uses"
    containerId: string;
    position: {
      startCoordinates: { width: number; depth: number; height: number };
      endCoordinates: { width: number; depth: number; height: number };
    };
  }
  
  export interface WasteIdentifyResponse {
    success: boolean;
    wasteItems: WasteItem[];
  }
  
  export interface ReturnPlanItem {
    step: number;
    itemId: string;
    itemName: string;
    fromContainer: string;
    toContainer: string;
  }
  
  export interface RetrievalStep {
    step: number;
    action: "remove" | "setAside" | "retrieve" | "placeBack";
    itemId: string;
    itemName: string;
  }
  
  export interface ReturnManifest {
    undockingContainerId: string;
    undockingDate: string;
    returnItems: { itemId: string; name: string; reason: string }[];
    totalVolume: number;
    totalWeight: number;
  }
  
  export interface WasteReturnPlanResponse {
    success: boolean;
    returnPlan: ReturnPlanItem[];
    retrievalSteps: RetrievalStep[];
    returnManifest: ReturnManifest;
  }