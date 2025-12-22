import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

// Database schema types
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flight {
  id: string;
  userId: string;
  date: Date;
  
  // General
  aircraft: string | null;
  callsign: string | null;
  departure: string | null;
  arrival: string | null;
  cruiseAltitude: string | null;
  blockFuel: number | null;
  route: string | null;
  
  // Takeoff
  takeoffRunway: string | null;
  sid: string | null;
  v1: string | null;
  vr: string | null;
  v2: string | null;
  toga: boolean;
  flaps: string | null;
  
  // Landing
  landingRunway: string | null;
  star: string | null;
  brake: "LOW" | "MED" | null;
  vapp: string | null;
  
  // Post Flight
  totalDuration: string | null;
  landRate: number | null;
  timeOfDay: "MORNING" | "MID-DAY" | "EVENING" | "NIGHT" | null;
  passengers: number | null;
  cargo: number | null;
  
  // Metadata
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

