import { NextRequest, NextResponse } from "next/server";
import { calculatePlacement } from "../../lib/storage";
import { PlacementRequestItem, PlacementRequestContainer, PlacementResponse } from "../../types/placement";

export async function POST(req: NextRequest) {
  const { items, containers }: { items: PlacementRequestItem[]; containers: PlacementRequestContainer[] } = await req.json();
  const { placements, rearrangements } = calculatePlacement(items, containers);
  const response: PlacementResponse = { success: true, placements, rearrangements };
  return NextResponse.json(response);
}