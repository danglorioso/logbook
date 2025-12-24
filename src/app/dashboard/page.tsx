"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";
import { AddFlightDialog } from "@/components/AddFlightDialog";
import { FlightCard } from "@/components/FlightCard";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FlightCardSkeleton } from "@/components/skeletons/FlightCardSkeleton";
import { StatsSkeleton } from "@/components/skeletons/StatsSkeleton";

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

export default function ProfilePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [userProfile, setUserProfile] = useState<{ firstName?: string | null; lastName?: string | null; name?: string | null } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublic, setFilterPublic] = useState<string>("all");
  const [filterAircraft, setFilterAircraft] = useState<string>("all");

  useEffect(() => {
    if (userLoaded && user) {
      fetchFlights();
      fetchUserProfile();
    }
  }, [userLoaded, user]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

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

  if (!userLoaded) {
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

  // Get unique aircraft types for filter
  const uniqueAircraft = useMemo(() => {
    const aircraftSet = new Set<string>();
    flights.forEach((flight) => {
      if (flight.aircraft) {
        aircraftSet.add(flight.aircraft);
      }
    });
    return Array.from(aircraftSet).sort();
  }, [flights]);

  // Filter flights based on search and filters
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          (flight.departure?.toLowerCase().includes(query)) ||
          (flight.arrival?.toLowerCase().includes(query)) ||
          (flight.aircraft?.toLowerCase().includes(query)) ||
          (flight.callsign?.toLowerCase().includes(query)) ||
          (flight.airframe?.toLowerCase().includes(query)) ||
          (flight.route?.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Public/Private filter
      if (filterPublic === "public" && !flight.isPublic) return false;
      if (filterPublic === "private" && flight.isPublic) return false;

      // Aircraft filter
      if (filterAircraft !== "all" && flight.aircraft !== filterAircraft) return false;

      return true;
    });
  }, [flights, searchQuery, filterPublic, filterAircraft]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPublic("all");
    setFilterAircraft("all");
  };

  const hasActiveFilters = searchQuery || filterPublic !== "all" || filterAircraft !== "all";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {(() => {
              if (userProfile?.firstName && userProfile?.lastName) {
                return `${userProfile.firstName} ${userProfile.lastName}`;
              } else if (userProfile?.firstName) {
                return userProfile.firstName;
              } else if (userProfile?.name) {
                return userProfile.name;
              } else if (user.username) {
                return user.username;
              } else if (user.firstName) {
                return user.firstName;
              } else if (user.fullName) {
                return user.fullName;
              }
              return "Pilot";
            })()}&apos;s Flights
          </h1>
          <p className="text-sm sm:text-base text-white/60 break-all">{user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Flights Section */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Your Flights</h2>
          <Button 
            onClick={() => {
              setEditingFlight(null);
              setOpen(true);
            }}
            className="w-full sm:w-auto bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search Bar */}
            <div className="relative flex-1 w-full sm:w-auto">
              <Label htmlFor="search-input" className="text-sm text-white/60 mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search flights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Public/Private Filter */}
            <div className="flex-1 sm:flex-initial sm:w-48">
              <Label htmlFor="public-filter" className="text-sm text-white/60 mb-2 block">
                Visibility
              </Label>
              <Select value={filterPublic} onValueChange={setFilterPublic}>
                <SelectTrigger
                  id="public-filter"
                  className="bg-[#0a0a0a] border-white/10 text-white focus:ring-white/20"
                >
                  <SelectValue placeholder="All flights" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="all">All flights</SelectItem>
                  <SelectItem value="public">Public only</SelectItem>
                  <SelectItem value="private">Private only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aircraft Filter */}
            {uniqueAircraft.length > 0 && (
              <div className="flex-1 sm:flex-initial sm:w-48">
                <Label htmlFor="aircraft-filter" className="text-sm text-white/60 mb-2 block">
                  Aircraft
                </Label>
                <Select value={filterAircraft} onValueChange={setFilterAircraft}>
                  <SelectTrigger
                    id="aircraft-filter"
                    className="bg-[#0a0a0a] border-white/10 text-white focus:ring-white/20"
                  >
                    <SelectValue placeholder="All aircraft" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <SelectItem value="all">All aircraft</SelectItem>
                    {uniqueAircraft.map((aircraft) => (
                      <SelectItem key={aircraft} value={aircraft}>
                        {aircraft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results Count and Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-white/60">
                Showing {filteredFlights.length} of {flights.length} flights
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
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
        ) : filteredFlights.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-white/60 mb-4">No flights match your search or filters.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
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
      <Footer />
    </div>
  );
}

