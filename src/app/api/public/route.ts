import { NextResponse } from "next/server";
import { getPublicFlights } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
    const flights = await getPublicFlights(limit);
    return NextResponse.json(flights);
  } catch (error) {
    console.error("Error fetching public flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch public flights" },
      { status: 500 }
    );
  }
}


