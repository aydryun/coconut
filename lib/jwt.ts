import * as jose from "jose";
export const runtime = "edge";

interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Convert string secret to Uint8Array
  const secretKey = new TextEncoder().encode(secret);

  // Set expiration time
  const expiresIn = process.env.JWT_EXPIRATION || "1h";
  const expirationTime = calculateExpirationTime(expiresIn);

  // Create and sign the JWT
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Convert string secret to Uint8Array
  const secretKey = new TextEncoder().encode(secret);

  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Helper function to calculate expiration time in seconds
function calculateExpirationTime(expiresIn: string): number {
  if (expiresIn.endsWith("h")) {
    const hours = parseInt(expiresIn.slice(0, -1), 10);
    return Math.floor(Date.now() / 1000) + hours * 3600;
  } else if (expiresIn.endsWith("m")) {
    const minutes = parseInt(expiresIn.slice(0, -1), 10);
    return Math.floor(Date.now() / 1000) + minutes * 60;
  } else if (expiresIn.endsWith("s")) {
    const seconds = parseInt(expiresIn.slice(0, -1), 10);
    return Math.floor(Date.now() / 1000) + seconds;
  } else {
    // Default to seconds if no unit is specified
    return Math.floor(Date.now() / 1000) + parseInt(expiresIn, 10);
  }
}
