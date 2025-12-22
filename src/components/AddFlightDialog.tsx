"use client";

import { useState } from "react";
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
  toga: z.boolean().default(false),
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
  isPublic: z.boolean().default(false),
});

type FlightFormData = z.infer<typeof flightSchema>;

interface AddFlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddFlightDialog({ open, onOpenChange, onSuccess }: AddFlightDialogProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
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
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        onSuccess();
      } else {
        alert("Failed to create flight. Please try again.");
      }
    } catch (error) {
      alert("Failed to create flight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Flight</DialogTitle>
          <DialogDescription className="text-white/60">
            Log all the details of your flight simulator session
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Flight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

