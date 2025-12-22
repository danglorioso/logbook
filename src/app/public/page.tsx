"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane } from "lucide-react";
import { FlightCard } from "@/components/FlightCard";
import { format } from "date-fns";

interface PublicFlight {
  id: string;
  date: string;
  aircraft: string | null;
  callsign: string | null;
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
  brake: "LOW" | "MED" | null;
  vapp: string | null;
  totalDuration: string | null;
  landRate: number | null;
  timeOfDay: "MORNING" | "MID-DAY" | "EVENING" | "NIGHT" | null;
  passengers: number | null;
  cargo: number | null;
  isPublic: boolean;
  userName?: string;
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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-6 w-6" />
            <span className="text-xl font-semibold">Logbook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Public Flights</h1>
          <p className="text-white/60">
            Discover flights shared by the community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/60">Loading...</div>
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
                  <div className="mb-4">
                    <div className="text-sm text-white/60 mb-1">
                      {format(new Date(flight.date), "MMMM d, yyyy")}
                      {flight.userName && (
                        <span className="ml-2">by {flight.userName}</span>
                      )}
                    </div>
                    <div className="text-xl font-semibold">
                      {flight.departure || "N/A"} → {flight.arrival || "N/A"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/60 mb-1">Aircraft</div>
                      <div className="font-medium">{flight.aircraft || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Callsign</div>
                      <div className="font-medium">{flight.callsign || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Duration</div>
                      <div className="font-medium">{flight.totalDuration || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Cruise Altitude</div>
                      <div className="font-medium">{flight.cruiseAltitude || "N/A"}</div>
                    </div>
                    {flight.route && (
                      <div className="col-span-2 md:col-span-4">
                        <div className="text-white/60 mb-1">Route</div>
                        <div className="font-medium">{flight.route}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

