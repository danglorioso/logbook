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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Lock } from "lucide-react";
import { AIRCRAFT_DATABASE } from "@/lib/aircraft-database";
import { loadAirports, searchAirports } from "@/lib/airports-database";

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
  const [currentTab, setCurrentTab] = useState("general");
  const [aircraftSuggestions, setAircraftSuggestions] = useState<string[]>([]);
  const [showAircraftSuggestions, setShowAircraftSuggestions] = useState(false);
  const [departureSuggestions, setDepartureSuggestions] = useState<Array<{icao: string; name: string; city: string}>>([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [arrivalSuggestions, setArrivalSuggestions] = useState<Array<{icao: string; name: string; city: string}>>([]);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
  const [airports, setAirports] = useState<Array<{icao: string; name: string; city: string; country: string}>>([]);
  const isEditing = !!flight;
  
  const tabs = ["general", "takeoff", "landing", "postflight"];
  const currentTabIndex = tabs.indexOf(currentTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;
  
  const handleNext = () => {
    if (!isLastTab) {
      setCurrentTab(tabs[currentTabIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    if (!isFirstTab) {
      setCurrentTab(tabs[currentTabIndex - 1]);
    }
  };
  
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
      date: formatDateForInput(new Date()),
      toga: false,
      isPublic: true,
    },
  });

  const toga = watch("toga");
  const brake = watch("brake");
  const timeOfDay = watch("timeOfDay");
  const isPublic = watch("isPublic");
  const aircraftValue = watch("aircraft");
  const departureValue = watch("departure");
  const arrivalValue = watch("arrival");

  // Update aircraft suggestions when aircraft value changes
  React.useEffect(() => {
    if (aircraftValue) {
      const filtered = AIRCRAFT_DATABASE.filter(aircraft =>
        aircraft.toLowerCase().includes(aircraftValue.toLowerCase())
      );
      setAircraftSuggestions(filtered.slice(0, 10));
      setShowAircraftSuggestions(filtered.length > 0);
    } else {
      setAircraftSuggestions([]);
      setShowAircraftSuggestions(false);
    }
  }, [aircraftValue]);

  // Update departure suggestions
  React.useEffect(() => {
    if (departureValue && airports.length > 0) {
      const filtered = searchAirports(departureValue, airports.map(a => ({
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        latitude: 0,
        longitude: 0,
      })));
      setDepartureSuggestions(filtered.slice(0, 10).map(a => ({
        icao: a.icao,
        name: a.name,
        city: a.city,
      })));
      setShowDepartureSuggestions(filtered.length > 0 && departureValue.length > 0);
    } else {
      setDepartureSuggestions([]);
      setShowDepartureSuggestions(false);
    }
  }, [departureValue, airports]);

  // Update arrival suggestions
  React.useEffect(() => {
    if (arrivalValue && airports.length > 0) {
      const filtered = searchAirports(arrivalValue, airports.map(a => ({
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        latitude: 0,
        longitude: 0,
      })));
      setArrivalSuggestions(filtered.slice(0, 10).map(a => ({
        icao: a.icao,
        name: a.name,
        city: a.city,
      })));
      setShowArrivalSuggestions(filtered.length > 0 && arrivalValue.length > 0);
    } else {
      setArrivalSuggestions([]);
      setShowArrivalSuggestions(false);
    }
  }, [arrivalValue, airports]);

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
    } catch {
      alert(`Failed to ${isEditing ? "update" : "create"} flight. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Load airports when dialog opens
  React.useEffect(() => {
    if (open) {
      loadAirports().then(loadedAirports => {
        setAirports(loadedAirports.map(a => ({
          icao: a.icao,
          name: a.name,
          city: a.city,
          country: a.country,
        })));
      });
      setCurrentTab("general");
    }
  }, [open]);

  // Reset tab when dialog opens
  React.useEffect(() => {
    if (open) {
      setCurrentTab("general");
    }
  }, [open]);
  
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
        date: formatDateForInput(new Date()),
        toga: false,
        isPublic: true,
      });
    }
  }, [open, flight, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10 text-white">
        {/* Visibility toggle positioned to align with X button */}
        <div className="absolute right-16 top-4 flex items-center gap-3">
          {isPublic ? (
            <Eye className="h-5 w-5 text-white/60" />
          ) : (
            <Lock className="h-5 w-5 text-white/60" />
          )}
          <div className="flex items-center gap-2">
            <Label htmlFor="visibility-toggle" className="text-sm cursor-pointer">
              {isPublic ? "Public" : "Private"}
            </Label>
            <Switch
              id="visibility-toggle"
              checked={isPublic}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
            />
          </div>
        </div>
        <DialogHeader>
          <div>
            <DialogTitle className="text-2xl">Add New Flight</DialogTitle>
            <DialogDescription className="text-white/60">
              Log all the details of your flight simulator session
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20 p-1 h-12">
              <TabsTrigger 
                value="general"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 hover:text-white transition-all"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="takeoff"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 hover:text-white transition-all"
              >
                Takeoff
              </TabsTrigger>
              <TabsTrigger 
                value="landing"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 hover:text-white transition-all"
              >
                Landing
              </TabsTrigger>
              <TabsTrigger 
                value="postflight"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 hover:text-white transition-all"
              >
                Post Flight
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[400px]">
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
                <div className="relative">
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <Input
                    id="aircraft"
                    {...register("aircraft")}
                    className="bg-black border-white/10"
                    placeholder="Type to search or enter custom aircraft"
                    autoComplete="off"
                    onFocus={() => {
                      if (aircraftValue) {
                        const filtered = AIRCRAFT_DATABASE.filter(aircraft =>
                          aircraft.toLowerCase().includes(aircraftValue.toLowerCase())
                        );
                        setAircraftSuggestions(filtered.slice(0, 10));
                        setShowAircraftSuggestions(filtered.length > 0);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicks
                      setTimeout(() => setShowAircraftSuggestions(false), 200);
                    }}
                  />
                  {showAircraftSuggestions && aircraftSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {aircraftSuggestions.map((aircraft) => (
                        <div
                          key={aircraft}
                          className="px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setValue("aircraft", aircraft);
                            setShowAircraftSuggestions(false);
                          }}
                        >
                          {aircraft}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="callsign">Callsign</Label>
                  <Input
                    id="callsign"
                    {...register("callsign")}
                    className="bg-black border-white/10"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="departure">Departure</Label>
                  <Input
                    id="departure"
                    placeholder="ICAO code or airport name"
                    maxLength={4}
                    {...register("departure", {
                      onChange: (e) => {
                        const value = e.target.value.toUpperCase().slice(0, 4);
                        setValue("departure", value);
                      }
                    })}
                    className="bg-black border-white/10 uppercase"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setShowDepartureSuggestions(false), 200);
                    }}
                  />
                  {showDepartureSuggestions && departureSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {departureSuggestions.map((airport) => (
                        <div
                          key={airport.icao}
                          className="px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setValue("departure", airport.icao);
                            setShowDepartureSuggestions(false);
                            // Focus next field (arrival)
                            setTimeout(() => {
                              const arrivalInput = document.getElementById("arrival");
                              arrivalInput?.focus();
                            }, 100);
                          }}
                        >
                          <div className="font-medium">{airport.icao}</div>
                          <div className="text-xs text-white/60">{airport.name} {airport.city && `- ${airport.city}`}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Label htmlFor="arrival">Arrival</Label>
                  <Input
                    id="arrival"
                    placeholder="ICAO code or airport name"
                    maxLength={4}
                    {...register("arrival", {
                      onChange: (e) => {
                        const value = e.target.value.toUpperCase().slice(0, 4);
                        setValue("arrival", value);
                      }
                    })}
                    className="bg-black border-white/10 uppercase"
                    autoComplete="off"
                    onBlur={() => {
                      setTimeout(() => setShowArrivalSuggestions(false), 200);
                    }}
                  />
                  {showArrivalSuggestions && arrivalSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {arrivalSuggestions.map((airport) => (
                        <div
                          key={airport.icao}
                          className="px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setValue("arrival", airport.icao);
                            setShowArrivalSuggestions(false);
                            // Focus next field (cruiseAltitude)
                            setTimeout(() => {
                              const cruiseInput = document.getElementById("cruiseAltitude");
                              cruiseInput?.focus();
                            }, 100);
                          }}
                        >
                          <div className="font-medium">{airport.icao}</div>
                          <div className="text-xs text-white/60">{airport.name} {airport.city && `- ${airport.city}`}</div>
                        </div>
                      ))}
                    </div>
                  )}
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
            </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-between items-center">
            <div>
              {!isFirstTab && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              {!isLastTab ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Flight"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

