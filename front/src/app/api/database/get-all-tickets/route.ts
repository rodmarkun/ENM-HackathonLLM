import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendResponse = await fetch("http://localhost:8000/tickets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: `Fetch failed: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json(); // Parse JSON from backend response
    console.log(data, "<-SERVER TICKETS: ");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
