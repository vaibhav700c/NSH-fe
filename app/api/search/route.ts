import { NextRequest, NextResponse } from "next/server";
import { searchItems } from "../../lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  const itemName = searchParams.get("itemName");
  const userId = searchParams.get("userId"); // Declared and used
  const item = searchItems(itemId || undefined, itemName || undefined, userId || undefined); // Pass userId
  return NextResponse.json({
    success: true,
    found: !!item,
    item: item ? { itemId: item.itemId, name: item.name, containerId: item.containerId, zone: item.preferredZone, position: item.position } : null,
    retrievalSteps: item ? [{ step: 1, action: "retrieve", itemId: item.itemId, itemName: item.name }] : [],
  });
}