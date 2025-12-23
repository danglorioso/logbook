import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db/schema";
import { updateFlight, deleteFlight } from "@/lib/db/queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const flight = await updateFlight(id, userId, {
      ...body,
      date: new Date(body.date),
    });

    if (!flight) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error("Error updating flight:", error);
    return NextResponse.json(
      { error: "Failed to update flight" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteFlight(id, userId);

    if (!success) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return NextResponse.json(
      { error: "Failed to delete flight" },
      { status: 500 }
    );
  }
}

