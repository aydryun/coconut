import { NextResponse } from "next/server";
import { getDb } from "@/lib/surreal";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { role } = await request.json();
  const { id } = await params;

  if (!role) {
    return NextResponse.json({ error: "Role required" }, { status: 400 });
  }

  try {
    const [user] = await db.query(`UPDATE $id MERGE $data`, {
      id,
      data: { role }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;

  try {
    await db.query(`DELETE $id`, { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
