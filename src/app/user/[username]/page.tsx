"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FlightCardSkeleton } from "@/components/skeletons/FlightCardSkeleton";
import { StatsSkeleton } from "@/components/skeletons/StatsSkeleton";
import { FlightMap } from "@/components/FlightMap";

interface PublicFlight {
  id: string;
  date: string;
  callsign: string | null;
  aircraft: string | null;
  airframe: string | null;
  departure: string | null;
  arrival: string | null;
  cruiseAltitude: string | null;
  blockFuel: number | null;
  route: string | null;
  takeoffRunway: string | null;
  sid: string | null;
  v1: string | null;
  vr: string | null;
  v2: string | null;
  toga: boolean;
  flaps: string | null;
  landingRunway: string | null;
  star: string | null;
  brake: "LOW" | "MED" | "MAX" | null;
  vapp: string | null;
  airTime: string | null;
  blockTime: string | null;
  landRate: "butter" | "great" | "acceptable" | "hard" | "wasted" | null;
  timeOfDay: ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] | null;
  passengers: number | null;
  cargo: number | null;
  routeDistance: number | null;
  isPublic: boolean;
  username?: string;
  userEmail?: string;
}

interface UserProfile {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [flights, setFlights] = useState<PublicFlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/user/${username}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFlights(data.flights);
      } else if (res.status === 404) {
        // User not found
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 bg-white/10 rounded-md w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-white/10 rounded-md w-48 animate-pulse"></div>
          </div>
          <StatsSkeleton />
          <div className="mb-4 mt-8">
            <div className="h-8 bg-white/10 rounded-md w-48 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <FlightCardSkeleton />
            <FlightCardSkeleton />
            <FlightCardSkeleton />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 py-8">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
              <p className="text-white/60">
                The user &quot;{username}&quot; does not exist or has no public flights.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.username || "Pilot";

  const stats = {
    totalFlights: flights.length,
    totalHours: flights.reduce((acc, f) => {
      if (f.blockTime) {
        const [hours, mins] = f.blockTime.split(":").map(Number);
        return acc + hours + mins / 60;
      }
      return acc;
    }, 0),
    totalMiles: flights.reduce((acc, f) => {
      const distance = typeof f.routeDistance === 'number' ? f.routeDistance : parseFloat(f.routeDistance || '0') || 0;
      return acc + distance;
    }, 0),
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 break-words">
            {displayName}&apos;s Flights
          </h1>
          <p className="text-sm sm:text-base text-white/60 break-all">
            @{user.username}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-white/60">Total Flights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalFlights}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-white/60">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-white/60">Total Nautical Miles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalMiles.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Flights Section */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Public Flights</h2>
        </div>

        {flights.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-white/60">No public flights yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="bg-[#0a0a0a] border-white/10">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        {format(new Date(flight.date), "MMMM d, yyyy")}
                      </div>
                      <div className="text-xl font-semibold">
                        {flight.departure || "N/A"} → {flight.arrival || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Two-column layout: content on left, map on right */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    {/* Left column: Flight details */}
                    <div className="flex-1 space-y-4 text-sm min-w-0">
                      {/* Flight Summary Header */}
                      {(flight.aircraft || flight.callsign || flight.airframe) && (
                        <div className="flex flex-wrap gap-6 pb-3 border-b border-white/5">
                          {flight.aircraft && (
                            <div>
                              <div className="text-white/40 text-xs uppercase mb-1">Aircraft</div>
                              <div className="font-semibold text-base">{flight.aircraft}</div>
                            </div>
                          )}
                          {flight.callsign && (
                            <div>
                              <div className="text-white/40 text-xs uppercase mb-1">Callsign</div>
                              <div className="font-semibold text-base">{flight.callsign}</div>
                            </div>
                          )}
                          {flight.airframe && (
                            <div>
                              <div className="text-white/40 text-xs uppercase mb-1">Airframe</div>
                              <div className="font-semibold text-base">{flight.airframe}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Flight Details */}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-x-6 sm:gap-y-4">
                      {/* Takeoff Group */}
                      {(flight.takeoffRunway || flight.sid || flight.v1 || flight.vr || flight.v2 || flight.toga) && (
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                          {flight.takeoffRunway && (
                            <div>
                              <div className="text-white/60 mb-1">TO Runway</div>
                              <div className="font-medium">{flight.takeoffRunway}</div>
                            </div>
                          )}
                          {flight.sid && (
                            <div>
                              <div className="text-white/60 mb-1">SID</div>
                              <div className="font-medium">{flight.sid}</div>
                            </div>
                          )}
                          {flight.v1 && (
                            <div>
                              <div className="text-white/60 mb-1">V₁</div>
                              <div className="font-medium">{flight.v1}</div>
                            </div>
                          )}
                          {flight.vr && (
                            <div>
                              <div className="text-white/60 mb-1">Vᵣ</div>
                              <div className="font-medium">{flight.vr}</div>
                            </div>
                          )}
                          {flight.v2 && (
                            <div>
                              <div className="text-white/60 mb-1">V₂</div>
                              <div className="font-medium">{flight.v2}</div>
                            </div>
                          )}
                          {flight.toga && (
                            <div>
                              <div className="text-white/60 mb-1">TOGA</div>
                              <div className="font-medium">Yes</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Landing Group */}
                      {(flight.landingRunway || flight.star || flight.vapp) && (
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 sm:border-l sm:border-white/5 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          {flight.landingRunway && (
                            <div>
                              <div className="text-white/60 mb-1">LDG Runway</div>
                              <div className="font-medium">{flight.landingRunway}</div>
                            </div>
                          )}
                          {flight.star && (
                            <div>
                              <div className="text-white/60 mb-1">STAR</div>
                              <div className="font-medium">{flight.star}</div>
                            </div>
                          )}
                          {flight.vapp && (
                            <div>
                              <div className="text-white/60 mb-1">Vₐₚₚ</div>
                              <div className="font-medium">{flight.vapp}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Misc Group (Cruise Altitude, Block Time, Block Fuel, Passengers, Cargo, Route Distance) */}
                      {(flight.cruiseAltitude || flight.blockTime || flight.blockFuel !== null || flight.passengers !== null || flight.cargo !== null || flight.routeDistance !== null) && (
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 sm:border-l sm:border-white/5 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          {flight.cruiseAltitude && (
                            <div>
                              <div className="text-white/60 mb-1">Cruise Altitude</div>
                              <div className="font-medium">
                                {flight.cruiseAltitude.toUpperCase().startsWith("FL") 
                                  ? flight.cruiseAltitude 
                                  : `FL${flight.cruiseAltitude}`}
                              </div>
                            </div>
                          )}
                          {flight.blockTime && (
                            <div>
                              <div className="text-white/60 mb-1">Block Time</div>
                              <div className="font-medium">{flight.blockTime}</div>
                            </div>
                          )}
                          {flight.blockFuel !== null && (
                            <div>
                              <div className="text-white/60 mb-1">Block Fuel</div>
                              <div className="font-medium">{flight.blockFuel} kg</div>
                            </div>
                          )}
                          {flight.passengers !== null && (
                            <div>
                              <div className="text-white/60 mb-1">Passengers</div>
                              <div className="font-medium">{flight.passengers}</div>
                            </div>
                          )}
                          {flight.cargo !== null && (
                            <div>
                              <div className="text-white/60 mb-1">Cargo</div>
                              <div className="font-medium">{flight.cargo} kg</div>
                            </div>
                          )}
                          {flight.routeDistance !== null && (
                            <div>
                              <div className="text-white/60 mb-1">Route Distance</div>
                              <div className="font-medium">{flight.routeDistance} nm</div>
                            </div>
                          )}
                        </div>
                      )}
                      </div>

                      {/* Route */}
                      {flight.route && (
                        <div className="w-full border-t border-white/5 pt-3 mt-2">
                          <div className="text-white/60 mb-1">Route</div>
                          <div className="font-medium">{flight.route}</div>
                        </div>
                      )}
                    </div>

                    {/* Right column: Map */}
                    {flight.departure && flight.arrival && (
                      <div className="lg:w-64 lg:flex-shrink-0 lg:self-stretch">
                        <FlightMap
                          departure={flight.departure}
                          arrival={flight.arrival}
                          route={flight.route}
                          className="w-full h-48 lg:h-full"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

