import { NextResponse } from "next/server";
import { exportArrangement } from "../../../lib/storage";

export async function GET() {
  const csv = exportArrangement();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=arrangement.csv",
    },
  });
}