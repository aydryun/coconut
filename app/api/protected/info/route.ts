import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");
  const userRole = request.headers.get("x-user-role");

  const data = {
    message: "Cette route est protégé",
    timestamp: new Date().toISOString(),
    user: {
      id: userId,
      email: userEmail,
      role: userRole,
    },
  };

  return NextResponse.json(data);
}
