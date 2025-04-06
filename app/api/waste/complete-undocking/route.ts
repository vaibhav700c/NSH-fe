import { NextRequest, NextResponse } from "next/server";
import { completeUndocking } from "../../../lib/storage";

interface CompleteUndockingRequestBody {
  undockingContainerId: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  const { undockingContainerId, timestamp } = await req.json() as CompleteUndockingRequestBody;
  const itemsRemoved = completeUndocking(undockingContainerId, timestamp); // Pass timestamp
  return NextResponse.json({ success: true, itemsRemoved });
}