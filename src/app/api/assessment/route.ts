import { NextRequest, NextResponse } from "next/server";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expressionText } = body;

    const isRisk = expressionText ? detectRisk(expressionText) : false;

    return NextResponse.json({
      success: true,
      zybaScore: 80,
      isRisk,
      crisisResources: isRisk ? CRISIS_RESOURCES : null,
      message: "Assessment saved successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
