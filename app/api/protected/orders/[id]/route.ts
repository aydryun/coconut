import { NextResponse } from "next/server";
import { getDb } from "@/lib/surreal";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const data = await request.json();
  const { id } = await params;

  try {
    const [result] = await db.query("UPDATE $id MERGE $data", { id, data });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;

  try {
    await db.query("DELETE $id", { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
