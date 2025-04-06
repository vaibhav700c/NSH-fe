// app/api/place/route.ts
import { NextRequest, NextResponse } from "next/server";
import { placeItem } from "../../lib/storage";
import { Position } from "../../types/placement"; // Import Position type

// Define the expected request body type
interface PlaceRequestBody {
  itemId: string;
  userId: string;
  timestamp: string; // ISO format string
  containerId: string;
  position: Position;
}

export async function POST(req: NextRequest) {
  const { itemId, userId, timestamp, containerId, position } = await req.json() as PlaceRequestBody;
  const success = placeItem(itemId, userId, containerId, position, timestamp); // Pass timestamp
  return NextResponse.json({ success });
}