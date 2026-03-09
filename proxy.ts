import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { extractTokenFromHeader, verifyToken } from "./lib/jwt";

export async function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  // Pour les requêtes preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Authentification pour /api/protected
  if (request.nextUrl.pathname.startsWith("/api/protected")) {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader || "");
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication token is missing" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, X-Requested-With",
            "Access-Control-Allow-Credentials": "true",
          },
        },
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, X-Requested-With",
            "Access-Control-Allow-Credentials": "true",
          },
        },
      );
    }
  }

  // Réponse normale avec headers CORS
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
