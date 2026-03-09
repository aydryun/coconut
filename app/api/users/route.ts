import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch external users" }, { status: 500 });
  }
}
