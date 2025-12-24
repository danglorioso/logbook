"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FlightCardSkeleton } from "@/components/skeletons/FlightCardSkeleton";
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

export default function PublicFlightsPage() {
  const [flights, setFlights] = useState<PublicFlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await fetch("/api/public");
      if (res.ok) {
        const data = await res.json();
        setFlights(data);
      }
    } catch (error) {
      console.error("Failed to fetch public flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Recent Flights</h1>
          <p className="text-sm sm:text-base text-white/60">
            Discover flights shared by the community
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <FlightCardSkeleton />
            <FlightCardSkeleton />
            <FlightCardSkeleton />
          </div>
        ) : flights.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-white/60">No public flights yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="bg-[#0a0a0a] border-white/10 flex flex-col">
                <CardContent className="p-4 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-3">
                    <div className="text-xs text-white/60 mb-1">
                      {format(new Date(flight.date), "MMM d, yyyy")}
                      {flight.username && (
                        <span className="ml-2">
                          by{" "}
                          <Link
                            href={`/user/${flight.username}`}
                            className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60"
                          >
                            @{flight.username}
                          </Link>
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-semibold">
                      {flight.departure || "N/A"} → {flight.arrival || "N/A"}
                    </div>
                  </div>

                  {/* Flight Details - Compact Grid */}
                  <div className="space-y-2 text-xs mb-3 flex-1">
                    {/* Aircraft Info */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {flight.aircraft && (
                        <div>
                          <span className="text-white/60">Aircraft: </span>
                          <span className="font-medium">{flight.aircraft}</span>
                        </div>
                      )}
                      {flight.callsign && (
                        <div>
                          <span className="text-white/60">Callsign: </span>
                          <span className="font-medium">{flight.callsign}</span>
                        </div>
                      )}
                      {flight.airframe && (
                        <div>
                          <span className="text-white/60">Airframe: </span>
                          <span className="font-medium">{flight.airframe}</span>
                        </div>
                      )}
                    </div>

                    {/* Takeoff Info */}
                    {(flight.takeoffRunway || flight.sid) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {flight.takeoffRunway && (
                          <div>
                            <span className="text-white/60">TO Runway: </span>
                            <span className="font-medium">{flight.takeoffRunway}</span>
                          </div>
                        )}
                        {flight.sid && (
                          <div>
                            <span className="text-white/60">SID: </span>
                            <span className="font-medium">{flight.sid}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Landing Info */}
                    {(flight.landingRunway || flight.star) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {flight.landingRunway && (
                          <div>
                            <span className="text-white/60">LDG Runway: </span>
                            <span className="font-medium">{flight.landingRunway}</span>
                          </div>
                        )}
                        {flight.star && (
                          <div>
                            <span className="text-white/60">STAR: </span>
                            <span className="font-medium">{flight.star}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flight Stats */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {flight.cruiseAltitude && (
                        <div>
                          <span className="text-white/60">Cruise: </span>
                          <span className="font-medium">
                            {flight.cruiseAltitude.toUpperCase().startsWith("FL") 
                              ? flight.cruiseAltitude 
                              : `FL${flight.cruiseAltitude}`}
                          </span>
                        </div>
                      )}
                      {flight.blockTime && (
                        <div>
                          <span className="text-white/60">Block Time: </span>
                          <span className="font-medium">{flight.blockTime}</span>
                        </div>
                      )}
                      {flight.blockFuel !== null && (
                        <div>
                          <span className="text-white/60">Fuel: </span>
                          <span className="font-medium">{flight.blockFuel} lbs</span>
                        </div>
                      )}
                      {flight.passengers !== null && (
                        <div>
                          <span className="text-white/60">Pax: </span>
                          <span className="font-medium">{flight.passengers}</span>
                        </div>
                      )}
                      {flight.cargo !== null && (
                        <div>
                          <span className="text-white/60">Cargo: </span>
                          <span className="font-medium">{flight.cargo} kg</span>
                        </div>
                      )}
                    </div>

                    {/* Route */}
                    {flight.route && (
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-white/60 mb-0.5">Route</div>
                        <div className="font-medium text-xs break-words">{flight.route}</div>
                      </div>
                    )}
                  </div>

                  {/* Map below */}
                  {flight.departure && flight.arrival && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <FlightMap
                        departure={flight.departure}
                        arrival={flight.arrival}
                        route={flight.route}
                        className="w-full h-40"
                      />
                    </div>
                  )}
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


