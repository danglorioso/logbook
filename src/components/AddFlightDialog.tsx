"use client";

import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const flightSchema = z.object({
  date: z.string().min(1, "Date is required"),
  aircraft: z.string().optional(),
  callsign: z.string().optional(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  cruiseAltitude: z.string().optional(),
  blockFuel: z.number().optional(),
  route: z.string().optional(),
  takeoffRunway: z.string().optional(),
  sid: z.string().optional(),
  v1: z.string().optional(),
  vr: z.string().optional(),
  v2: z.string().optional(),
  toga: z.boolean().optional(),
  flaps: z.string().optional(),
  landingRunway: z.string().optional(),
  star: z.string().optional(),
  brake: z.enum(["LOW", "MED"]).optional(),
  vapp: z.string().optional(),
  totalDuration: z.string().optional(),
  landRate: z.number().optional(),
  timeOfDay: z.enum(["MORNING", "MID-DAY", "EVENING", "NIGHT"]).optional(),
  passengers: z.number().optional(),
  cargo: z.number().optional(),
  isPublic: z.boolean().optional(),
});

type FlightFormData = z.infer<typeof flightSchema>;

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

interface AddFlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  flight?: Flight | null;
}

export function AddFlightDialog({ open, onOpenChange, onSuccess, flight }: AddFlightDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!flight;
  
  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: flight ? {
      date: formatDateForInput(flight.date),
      aircraft: flight.aircraft || "",
      callsign: flight.callsign || "",
      departure: flight.departure || "",
      arrival: flight.arrival || "",
      cruiseAltitude: flight.cruiseAltitude || "",
      blockFuel: flight.blockFuel || undefined,
      route: flight.route || "",
      takeoffRunway: flight.takeoffRunway || "",
      sid: flight.sid || "",
      v1: flight.v1 || "",
      vr: flight.vr || "",
      v2: flight.v2 || "",
      toga: flight.toga || false,
      flaps: flight.flaps || "",
      landingRunway: flight.landingRunway || "",
      star: flight.star || "",
      brake: flight.brake || undefined,
      vapp: flight.vapp || "",
      totalDuration: flight.totalDuration || "",
      landRate: flight.landRate || undefined,
      timeOfDay: flight.timeOfDay || undefined,
      passengers: flight.passengers || undefined,
      cargo: flight.cargo || undefined,
      isPublic: flight.isPublic || false,
    } : {
      toga: false,
      isPublic: false,
    },
  });

  const toga = watch("toga");
  const brake = watch("brake");
  const timeOfDay = watch("timeOfDay");
  const isPublic = watch("isPublic");

  const onSubmit = async (data: FlightFormData) => {
    setLoading(true);
    try {
      const url = isEditing ? `/api/flights/${flight.id}` : "/api/flights";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        onSuccess();
      } else {
        alert(`Failed to ${isEditing ? "update" : "create"} flight. Please try again.`);
      }
    } catch (error) {
      alert(`Failed to ${isEditing ? "update" : "create"} flight. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when dialog opens/closes or flight changes
  React.useEffect(() => {
    if (open && flight) {
      reset({
        date: formatDateForInput(flight.date),
        aircraft: flight.aircraft || "",
        callsign: flight.callsign || "",
        departure: flight.departure || "",
        arrival: flight.arrival || "",
        cruiseAltitude: flight.cruiseAltitude || "",
        blockFuel: flight.blockFuel || undefined,
        route: flight.route || "",
        takeoffRunway: flight.takeoffRunway || "",
        sid: flight.sid || "",
        v1: flight.v1 || "",
        vr: flight.vr || "",
        v2: flight.v2 || "",
        toga: flight.toga || false,
        flaps: flight.flaps || "",
        landingRunway: flight.landingRunway || "",
        star: flight.star || "",
        brake: flight.brake || undefined,
        vapp: flight.vapp || "",
        totalDuration: flight.totalDuration || "",
        landRate: flight.landRate || undefined,
        timeOfDay: flight.timeOfDay || undefined,
        passengers: flight.passengers || undefined,
        cargo: flight.cargo || undefined,
        isPublic: flight.isPublic || false,
      });
    } else if (open && !flight) {
      reset({
        toga: false,
        isPublic: false,
      });
    }
  }, [open, flight?.id, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Flight" : "Add New Flight"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {isEditing 
              ? "Update the details of your flight" 
              : "Log all the details of your flight simulator session"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="takeoff">Takeoff</TabsTrigger>
              <TabsTrigger value="landing">Landing</TabsTrigger>
              <TabsTrigger value="postflight">Post Flight</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className="bg-black border-white/10"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-400 mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="aircraft">A/C</Label>
                  <Input
                    id="aircraft"
                    {...register("aircraft")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="callsign">Callsign</Label>
                  <Input
                    id="callsign"
                    {...register("callsign")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="departure">Departure</Label>
                  <Input
                    id="departure"
                    placeholder="ICAO code"
                    maxLength={4}
                    {...register("departure")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="arrival">Arrival</Label>
                  <Input
                    id="arrival"
                    placeholder="ICAO code"
                    maxLength={4}
                    {...register("arrival")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="cruiseAltitude">CRZ FL</Label>
                  <Input
                    id="cruiseAltitude"
                    {...register("cruiseAltitude")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="blockFuel">Block Fuel</Label>
                  <Input
                    id="blockFuel"
                    type="number"
                    {...register("blockFuel", { valueAsNumber: true })}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  placeholder="Waypoints and routes"
                  {...register("route")}
                  className="bg-black border-white/10"
                />
              </div>
            </TabsContent>

            <TabsContent value="takeoff" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="takeoffRunway">Runway</Label>
                  <Input
                    id="takeoffRunway"
                    {...register("takeoffRunway")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="sid">SID</Label>
                  <Input
                    id="sid"
                    {...register("sid")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="v1">V1</Label>
                  <Input
                    id="v1"
                    {...register("v1")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="vr">VR</Label>
                  <Input
                    id="vr"
                    {...register("vr")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="v2">V2</Label>
                  <Input
                    id="v2"
                    {...register("v2")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="flaps">Flaps</Label>
                  <Input
                    id="flaps"
                    {...register("flaps")}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="toga"
                  checked={toga}
                  onCheckedChange={(checked) => setValue("toga", checked === true)}
                />
                <Label htmlFor="toga">TOGA</Label>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landingRunway">Runway</Label>
                  <Input
                    id="landingRunway"
                    {...register("landingRunway")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="star">STAR</Label>
                  <Input
                    id="star"
                    {...register("star")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="vapp">VAPP</Label>
                  <Input
                    id="vapp"
                    {...register("vapp")}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label>Brake:</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brake-low"
                    checked={brake === "LOW"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue("brake", "LOW");
                      } else if (brake === "LOW") {
                        setValue("brake", undefined);
                      }
                    }}
                  />
                  <Label htmlFor="brake-low" className="cursor-pointer">LOW</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brake-med"
                    checked={brake === "MED"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue("brake", "MED");
                      } else if (brake === "MED") {
                        setValue("brake", undefined);
                      }
                    }}
                  />
                  <Label htmlFor="brake-med" className="cursor-pointer">MED</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="postflight" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalDuration">Total Duration</Label>
                  <Input
                    id="totalDuration"
                    placeholder="HH:MM"
                    {...register("totalDuration")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="landRate">Land Rate</Label>
                  <Input
                    id="landRate"
                    type="number"
                    {...register("landRate", { valueAsNumber: true })}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="passengers">PAX</Label>
                  <Input
                    id="passengers"
                    type="number"
                    {...register("passengers", { valueAsNumber: true })}
                    className="bg-black border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    type="number"
                    {...register("cargo", { valueAsNumber: true })}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div>
                <Label>Time of Day:</Label>
                <div className="flex items-center gap-4 mt-2">
                  {(["MORNING", "MID-DAY", "EVENING", "NIGHT"] as const).map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${time}`}
                        checked={timeOfDay === time}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue("timeOfDay", time);
                          } else if (timeOfDay === time) {
                            setValue("timeOfDay", undefined);
                          }
                        }}
                      />
                      <Label htmlFor={`time-${time}`} className="cursor-pointer">{time}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={(checked) => setValue("isPublic", checked === true)}
                />
                <Label htmlFor="isPublic">Make this flight public</Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update Flight" : "Save Flight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

