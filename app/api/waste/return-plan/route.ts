import { NextRequest, NextResponse } from "next/server";
import { planWasteReturn } from "../../../lib/storage";

interface ReturnPlanRequestBody {
  undockingContainerId: string;
  undockingDate: string;
  maxWeight: number;
}

export async function POST(req: NextRequest) {
  const { undockingContainerId, undockingDate, maxWeight } = await req.json() as ReturnPlanRequestBody;
  const { returnPlan, retrievalSteps, returnManifest } = planWasteReturn(undockingContainerId, maxWeight, undockingDate); // Pass undockingDate
  return NextResponse.json({ success: true, returnPlan, retrievalSteps, returnManifest });
}