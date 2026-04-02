import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ totalShifts: "" });
  }

  try {
    const meta = await getPrisma().monthMeta.findUnique({ where: { month } });
    return NextResponse.json({ totalShifts: meta?.totalShifts ?? "" });
  } catch (error) {
    console.error("GET /api/month-meta error:", error);
    return NextResponse.json({ totalShifts: "" });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { month, totalShifts } = await request.json();

    if (!month) {
      return NextResponse.json({ error: "Missing month" }, { status: 400 });
    }

    const meta = await getPrisma().monthMeta.upsert({
      where: { month },
      update: { totalShifts: totalShifts ?? "" },
      create: { month, totalShifts: totalShifts ?? "" },
    });

    return NextResponse.json(meta);
  } catch (error) {
    console.error("PUT /api/month-meta error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
