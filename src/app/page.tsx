"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, BarChart3, Users, Plus } from "lucide-react";
import { AnimatedPlane } from "@/components/AnimatedPlane";
import { Navigation } from "@/components/Navigation";
import { AddFlightDialog } from "@/components/AddFlightDialog";
import { FlightCard } from "@/components/FlightCard";
import Footer from "@/components/Footer";

interface Flight {
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
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Track Your
            <br />
            <span className="text-blue-200/80">Flight Simulator</span>
            <br />
            Adventures
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Log every flight, track your progress, and share your journeys with 
            the flight simulator community. Built for pilots who take simulation seriously.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-black">
                Start Logging Flights
              </Button>
            </Link>
            <Link href="/public">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
              >
                View Public Flights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <AnimatedPlane size="sm" />
              </div>
              <h3 className="text-xl font-semibold">Detailed Logging</h3>
              <p className="text-white/60">
                Track every aspect of your flights: takeoff, landing, route, and more.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Route Mapping</h3>
              <p className="text-white/60">
                Visualize your flight paths and see where you&apos;ve been.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Flight Statistics</h3>
              <p className="text-white/60">
                Track your total flights, hours, miles, and achievements.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-white/60">
                Share your flights and discover routes from other pilots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-white/60 mb-8">
            Join the community of flight simulator enthusiasts tracking their journeys.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-black font-semibold">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DashboardContent() {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

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

  const handleFlightAdded = () => {
    fetchFlights();
    setOpen(false);
    setEditingFlight(null);
  };

  const handleFlightDeleted = (flightId: string) => {
    setFlights(flights.filter((f) => f.id !== flightId));
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setOpen(true);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingFlight(null);
    }
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {(user.username || user.firstName || user.fullName || "Pilot")}&apos;s Flights
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
          <Button 
            onClick={() => {
              setEditingFlight(null);
              setOpen(true);
            }}
            className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>

        {flights.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-white/60 mb-4">No flights logged yet.</p>
              <Button 
                onClick={() => {
                  setEditingFlight(null);
                  setOpen(true);
                }}
                className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg"
              >
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
                onEdit={handleEditFlight}
              />
            ))}
          </div>
        )}

        <AddFlightDialog 
          open={open} 
          onOpenChange={handleDialogOpenChange} 
          onSuccess={handleFlightAdded}
          flight={editingFlight}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoaded: userLoaded } = useUser();

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  // If user is logged in, show dashboard content
  if (user) {
    return <DashboardContent />;
  }

  // Otherwise show landing page
  return <LandingPage />;
}
