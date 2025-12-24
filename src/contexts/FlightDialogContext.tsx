"use client";

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";

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
  timeOfDay: ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] | string | null;
  passengers: number | null;
  cargo: number | null;
  routeDistance: number | null;
  isPublic: boolean;
}

interface FlightDialogContextType {
  open: boolean;
  editingFlight: Flight | null;
  openDialog: (flight?: Flight | null) => void;
  closeDialog: () => void;
  setEditingFlight: (flight: Flight | null) => void;
  onFlightSuccess: (callback: () => void) => void;
  triggerFlightSuccess: () => void;
}

const FlightDialogContext = createContext<FlightDialogContextType | undefined>(undefined);

export function FlightDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const successCallbacksRef = useRef<(() => void)[]>([]);

  const openDialog = useCallback((flight?: Flight | null) => {
    setEditingFlight(flight || null);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setEditingFlight(null);
  }, []);

  const setEditingFlightState = useCallback((flight: Flight | null) => {
    setEditingFlight(flight);
  }, []);

  const onFlightSuccess = useCallback((callback: () => void) => {
    successCallbacksRef.current.push(callback);
  }, []);

  const triggerFlightSuccess = useCallback(() => {
    successCallbacksRef.current.forEach((callback) => callback());
  }, []);

  return (
    <FlightDialogContext.Provider
      value={{
        open,
        editingFlight,
        openDialog,
        closeDialog,
        setEditingFlight: setEditingFlightState,
        onFlightSuccess,
        triggerFlightSuccess,
      }}
    >
      {children}
    </FlightDialogContext.Provider>
  );
}

export function useFlightDialog() {
  const context = useContext(FlightDialogContext);
  if (context === undefined) {
    throw new Error("useFlightDialog must be used within a FlightDialogProvider");
  }
  return context;
}

