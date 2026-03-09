import { type NextRequest, NextResponse } from "next/server";
import { validateUserCredentials } from "@/lib/authentication";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez indiquer l'email et le mot de passe" },
        { status: 400 },
      );
    }

    // Validate user credentials against SurrealDB
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
