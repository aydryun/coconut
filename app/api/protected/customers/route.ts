import { type NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomers } from "@/lib/database";

export async function GET() {
  try {
    const customers = await getCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName and email are required" },
        { status: 400 },
      );
    }

    const customer = await createCustomer({
      firstName,
      lastName,
      email,
      phone: phone || "",
      address: address || "",
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST /customers error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}
