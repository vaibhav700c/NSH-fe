// app/api/retrieve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { retrieveItem } from "../../lib/storage";

// Define the expected request body type
interface RetrieveRequestBody {
  itemId: string;
  userId: string;
  timestamp: string; // ISO format string
}

export async function POST(req: NextRequest) {
  const { itemId, userId, timestamp } = await req.json() as RetrieveRequestBody;
  const success = retrieveItem(itemId, userId, timestamp); // Pass timestamp
  return NextResponse.json({ success });
}