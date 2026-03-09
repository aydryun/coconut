import { NextResponse } from "next/server";

import { getInfo } from "@/lib/database";

export async function GET() {
  const res = await getInfo();

  return NextResponse.json({
    name: "Api Txek",
    version: "1.0.0",
    description: "API backend uniquement avec authentification JWT",
    endpoints: {
      auth: "/api/auth/token",
      protected: "/api/protected/*",
      health: "/api/health",
    },
    result: res,
  });
}
