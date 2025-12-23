"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, Lock } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  brake: "LOW" | "MED" | null;
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

interface FlightCardProps {
  flight: Flight;
  onDelete: (flightId: string) => void;
  onEdit?: (flight: Flight) => void;
}

export function FlightCard({ flight, onDelete, onEdit }: FlightCardProps) {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(flight);
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
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center h-9 w-9 cursor-pointer hover:bg-white/5 rounded-md transition-colors">
                    {flight.isPublic ? (
                      <Eye className="h-4 w-4 text-white/60" />
                    ) : (
                      <Lock className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{flight.isPublic ? "Public" : "Private"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleEdit}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 text-sm">
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

          {/* Main Content */}
          <div className="flex flex-wrap gap-x-6 gap-y-4">

            {/* Takeoff Group */}
            {(flight.takeoffRunway || flight.sid || flight.v1 || flight.vr || flight.v2 || flight.toga) && (
              <div className="flex gap-x-6">
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
              <div className="flex gap-x-6 border-l border-white/5 pl-6">
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
              <div className="flex gap-x-6 border-l border-white/5 pl-6">
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
                    <div className="font-medium">{flight.cargo} lbs</div>
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
      </CardContent>
    </Card>
  );
}


