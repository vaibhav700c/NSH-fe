import { NextRequest, NextResponse } from "next/server";
import { simulateDay } from "../../../lib/storage";

interface SimulateDayRequestBody {
  numOfDays?: number;
  toTimestamp?: string;
  itemsToBeUsedPerDay: { itemId: string; name: string }[];
}

export async function POST(req: NextRequest) {
  const { numOfDays, toTimestamp, itemsToBeUsedPerDay } = await req.json() as SimulateDayRequestBody;
  const { newDate, changes } = simulateDay(numOfDays || 1, itemsToBeUsedPerDay || [], toTimestamp); // Pass toTimestamp
  return NextResponse.json({ success: true, newDate, changes });
}