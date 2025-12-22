"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface FlightCardProps {
  flight: {
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
  };
  onDelete: (flightId: string) => void;
}

export function FlightCard({ flight, onDelete }: FlightCardProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this flight?")) {
      try {
        const res = await fetch(`/api/flights/${flight.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          onDelete(flight.id);
        }
      } catch (error) {
        console.error("Failed to delete flight:", error);
      }
    }
  };

  return (
    <Card className="bg-[#0a0a0a] border-white/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-white/60 mb-1">
              {format(new Date(flight.date), "MMMM d, yyyy")}
            </div>
            <div className="text-xl font-semibold">
              {flight.departure || "N/A"} → {flight.arrival || "N/A"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-white/40 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
  );
}

