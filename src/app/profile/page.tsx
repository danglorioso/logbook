"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, LogOut } from "lucide-react";
import { AddFlightDialog } from "@/components/AddFlightDialog";
import { FlightCard } from "@/components/FlightCard";
import Link from "next/link";

interface Flight {
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
}

export default function ProfilePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userLoaded && user) {
      fetchFlights();
    }
  }, [userLoaded, user]);

  const fetchFlights = async () => {
    try {
      const res = await fetch("/api/flights");
      if (res.ok) {
        const data = await res.json();
        setFlights(data);
      }
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleFlightAdded = () => {
    fetchFlights();
    setOpen(false);
  };

  const handleFlightDeleted = (flightId: string) => {
    setFlights(flights.filter((f) => f.id !== flightId));
  };

  if (!userLoaded || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const stats = {
    totalFlights: flights.length,
    totalHours: flights.reduce((acc, f) => {
      if (f.totalDuration) {
        const [hours, mins] = f.totalDuration.split(":").map(Number);
        return acc + hours + mins / 60;
      }
      return acc;
    }, 0),
    totalMiles: 0, // Calculate from routes later
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
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {user.firstName || user.fullName || "Pilot"}
          </h1>
          <p className="text-white/60">{user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <CardTitle className="text-sm text-white/60">Total Miles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalMiles.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Flights Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Flights</h2>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>

        {flights.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-white/60 mb-4">No flights logged yet.</p>
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Flight
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onDelete={handleFlightDeleted}
              />
            ))}
          </div>
        )}

        <AddFlightDialog open={open} onOpenChange={setOpen} onSuccess={handleFlightAdded} />
      </div>
    </div>
  );
}

