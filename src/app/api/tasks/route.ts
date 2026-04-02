import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    const tasks = await getPrisma().task.findMany({
      where: month ? { month } : undefined,
      orderBy: { id: "asc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { month, category, taskName, progressTime, status, notes } = body;

  if (!month || !category || !taskName || !progressTime || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const task = await getPrisma().task.create({
      data: {
        month,
        category,
        taskName,
        progressTime,
        status,
        notes: notes || "",
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
