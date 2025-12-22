import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFlightsByUserId, createFlight } from "@/lib/db/queries";
import { toNextJsHandler } from "better-auth/next-js";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flights = await getFlightsByUserId(session.user.id);
    return NextResponse.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const flight = await createFlight(session.user.id, {
      ...body,
      date: new Date(body.date),
    });

    return NextResponse.json(flight, { status: 201 });
  } catch (error) {
    console.error("Error creating flight:", error);
    return NextResponse.json(
      { error: "Failed to create flight" },
      { status: 500 }
    );
  }
}

