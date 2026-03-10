import { type NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders, getOrdersByCustomer } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");
    const orders = customerId
      ? await getOrdersByCustomer(customerId)
      : await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, products, status } = body;

    if (!customer || !products || !status) {
      return NextResponse.json(
        { error: "customer, products and status are required" },
        { status: 400 },
      );
    }

    const order = await createOrder({ customer, products, status });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
