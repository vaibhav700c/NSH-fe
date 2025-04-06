import { NextResponse } from "next/server";
import { identifyWaste } from "../../../lib/storage";

export async function GET() {
  const waste = identifyWaste();
  return NextResponse.json({
    success: true,
    wasteItems: waste.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      reason: item.usageCount <= 0 ? "Out of Uses" : "Expired",
      containerId: item.containerId,
      position: item.position,
    })),
  });
}