import { type NextRequest, NextResponse } from "next/server";
import { StringRecordId } from "surrealdb";
import { connectToDatabase } from "@/lib/authentication";
import { extractTokenFromHeader, verifyToken } from "@/lib/jwt";
import type { SurrealResponse } from "@/types/SurrealResponse";

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader || "");
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.role === "admin";
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const db = await connectToDatabase();
    const result: SurrealResponse<any> = await db.query(
      "SELECT id, email, name, role FROM user;",
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { email, name, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const result: SurrealResponse<any> = await db.query(
      `CREATE ONLY user CONTENT {
        email: $email,
        name: $name,
        password: crypto::argon2::generate($password),
        role: $role
      };`,
      { email, name: name || "", password, role: role || "user" },
    );
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { error: "id and role are required" },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const result: SurrealResponse<any> = await db.query(
      "UPDATE ONLY type::thing('user', $id) SET role = $role;",
      { id, role },
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PUT /admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const result: SurrealResponse<any> = await db.query(
      "DELETE ONLY $id RETURN BEFORE;",
      { id: new StringRecordId(`user:${id}`) },
    );
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("DELETE /admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
