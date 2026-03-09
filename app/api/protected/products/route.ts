import { NextResponse } from "next/server";
import { getDb } from "@/lib/surreal";

export async function GET() {
  const db = await getDb();
  try {
    const [products] = await db.query("SELECT * FROM product");
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const db = await getDb();
  const data = await request.json();
  try {
    const [product] = await db.query("CREATE product CONTENT $data", { data });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
