import { NextRequest, NextResponse } from "next/server";
import { addItems } from "../../../lib/storage";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ success: false, errors: [{ row: 0, message: "No file uploaded" }] });

  const csvText = await file.text();
  const items = csvText.split("\n").map((row) => {
    const [itemId, name, width, depth, height, priority, expiryDate, usageLimit, preferredZone] = row.split(",");
    return { itemId, name, width: Number(width), depth: Number(depth), height: Number(height), priority: Number(priority), expiryDate, usageLimit: Number(usageLimit), preferredZone };
  });
  addItems(items);
  return NextResponse.json({ success: true, itemsImported: items.length, errors: [] });
}