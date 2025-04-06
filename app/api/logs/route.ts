import { NextRequest, NextResponse } from "next/server";
import { getLogs } from "../../lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const itemId = searchParams.get("itemId");
  const userId = searchParams.get("userId");
  const actionType = searchParams.get("actionType");
  const logs = getLogs(startDate || undefined, endDate || undefined, itemId || undefined, userId || undefined, actionType || undefined);
  return NextResponse.json({ logs });
}