import { NextRequest, NextResponse } from "next/server";
import { getPublicFlightsByUsername, getUserByUsername } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Get user info
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get public flights for this user
    const flights = await getPublicFlightsByUsername(username);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email, // We can include this for display purposes
      },
      flights,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

