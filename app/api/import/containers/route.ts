import { NextRequest, NextResponse } from "next/server";
import { initializeContainers } from "../../../lib/storage";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ success: false, errors: [{ row: 0, message: "No file uploaded" }] });

  const csvText = await file.text();
  const containers = csvText.split("\n").map((row) => {
    const [containerId, zone, width, depth, height] = row.split(",");
    return { containerId, zone, width: Number(width), depth: Number(depth), height: Number(height) };
  });
  initializeContainers(containers);
  return NextResponse.json({ success: true, containersImported: containers.length, errors: [] });
}