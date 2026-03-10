import { type NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/database";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, stock } = body;

    if (!name || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { error: "name, price, category and stock are required" },
        { status: 400 },
      );
    }

    const product = await createProduct({ name, price, category, stock });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
