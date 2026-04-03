import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ totalShifts: "", fullName: "" });
  }

  try {
    const meta = await getPrisma().monthMeta.findUnique({ where: { month } });
    return NextResponse.json({ totalShifts: meta?.totalShifts ?? "", fullName: meta?.fullName ?? "" });
  } catch (error) {
    console.error("GET /api/month-meta error:", error);
    return NextResponse.json({ totalShifts: "", fullName: "" });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { month, totalShifts, fullName } = await request.json();

    if (!month) {
      return NextResponse.json({ error: "Missing month" }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (totalShifts !== undefined) updateData.totalShifts = totalShifts ?? "";
    if (fullName !== undefined) updateData.fullName = fullName ?? "";

    const meta = await getPrisma().monthMeta.upsert({
      where: { month },
      update: updateData,
      create: { month, totalShifts: totalShifts ?? "", fullName: fullName ?? "" },
    });

    return NextResponse.json(meta);
  } catch (error) {
    console.error("PUT /api/month-meta error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
