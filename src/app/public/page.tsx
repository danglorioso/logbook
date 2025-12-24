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
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="bg-[#0a0a0a] border-white/10">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        {format(new Date(flight.date), "MMMM d, yyyy")}
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

                      {/* Misc Group (Cruise Altitude, Block Time, Block Fuel, Passengers, Cargo) */}
                      {(flight.cruiseAltitude || flight.blockTime || flight.blockFuel !== null || flight.passengers !== null || flight.cargo !== null) && (
                        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 sm:border-l sm:border-white/5 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          {flight.cruiseAltitude && (
                            <div>
                              <div className="text-white/60 mb-1">Cruise Altitude</div>
                              <div className="font-medium">{flight.cruiseAltitude}</div>
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
                              <div className="font-medium">{flight.blockFuel} lbs</div>
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
                        </div>
                      )}
                      </div>

                      {/* Route */}
                      {flight.route && (
                        <div className="border-t border-white/5 pt-4">
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


