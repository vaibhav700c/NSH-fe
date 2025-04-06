// types/wasteReturnPlan.ts
import { Item } from "./item";

export interface WasteReturnPlan {
  item: Item;
  destination: string;
}