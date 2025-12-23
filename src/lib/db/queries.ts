import { neon } from "@neondatabase/serverless";
import { sql } from "./schema";
import type { Flight, User } from "./schema";

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at as "createdAt", updated_at as "updatedAt"
    FROM "user"
    WHERE id = ${id}
  `;
  return result[0] as User | null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at as "createdAt", updated_at as "updatedAt"
    FROM "user"
    WHERE email = ${email}
  `;
  return result[0] as User | null;
}

export async function createUser(email: string, name?: string): Promise<User> {
  const result = await sql`
    INSERT INTO "user" (id, email, name, created_at, updated_at)
    VALUES (gen_random_uuid()::text, ${email}, ${name || null}, NOW(), NOW())
    RETURNING id, email, name, created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as User;
}

export async function upsertUser(id: string, email: string, username?: string): Promise<User> {
  const result = await sql`
    INSERT INTO "user" (id, email, name, created_at, updated_at)
    VALUES (${id}, ${email}, ${username || null}, NOW(), NOW())
    ON CONFLICT (id) 
    DO UPDATE SET 
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING id, email, name, created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as User;
}

export async function getFlightsByUserId(userId: string): Promise<Flight[]> {
  const result = await sql`
    SELECT 
      id, user_id as "userId", date,
      aircraft, callsign, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      total_duration as "totalDuration", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo,
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
    FROM flights
    WHERE user_id = ${userId}
    ORDER BY date DESC, created_at DESC
  `;
  return result as Flight[];
}

export async function getPublicFlights(limit = 50): Promise<Flight[]> {
  const result = await sql`
    SELECT 
      f.id, f.user_id as "userId", f.date,
      f.aircraft, f.callsign, f.departure, f.arrival, f.cruise_altitude as "cruiseAltitude",
      f.block_fuel as "blockFuel", f.route,
      f.takeoff_runway as "takeoffRunway", f.sid, f.v1, f.vr, f.v2, f.toga, f.flaps,
      f.landing_runway as "landingRunway", f.star, f.brake, f.vapp,
      f.total_duration as "totalDuration", f.land_rate as "landRate",
      f.time_of_day as "timeOfDay", f.passengers, f.cargo,
      f.is_public as "isPublic", f.created_at as "createdAt", f.updated_at as "updatedAt",
      u.name as "username", u.email as "userEmail"
    FROM flights f
    JOIN "user" u ON f.user_id = u.id
    WHERE f.is_public = true
    ORDER BY f.date DESC, f.created_at DESC
    LIMIT ${limit}
  `;
  return result as any[];
}

export async function createFlight(userId: string, flightData: Partial<Flight>): Promise<Flight> {
  const result = await sql`
    INSERT INTO flights (
      user_id, date, aircraft, callsign, departure, arrival, cruise_altitude,
      block_fuel, route, takeoff_runway, sid, v1, vr, v2, toga, flaps,
      landing_runway, star, brake, vapp, total_duration, land_rate,
      time_of_day, passengers, cargo, is_public
    )
    VALUES (
      ${userId}, ${flightData.date}, ${flightData.aircraft || null}, 
      ${flightData.callsign || null}, ${flightData.departure || null}, 
      ${flightData.arrival || null}, ${flightData.cruiseAltitude || null},
      ${flightData.blockFuel || null}, ${flightData.route || null},
      ${flightData.takeoffRunway || null}, ${flightData.sid || null},
      ${flightData.v1 || null}, ${flightData.vr || null}, ${flightData.v2 || null},
      ${flightData.toga || false}, ${flightData.flaps || null},
      ${flightData.landingRunway || null}, ${flightData.star || null},
      ${flightData.brake || null}, ${flightData.vapp || null},
      ${flightData.totalDuration || null}, ${flightData.landRate || null},
      ${flightData.timeOfDay || null}, ${flightData.passengers || null},
      ${flightData.cargo || null}, ${flightData.isPublic || false}
    )
    RETURNING 
      id, user_id as "userId", date,
      aircraft, callsign, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      total_duration as "totalDuration", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo,
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as Flight;
}

export async function updateFlight(
  flightId: string,
  userId: string,
  flightData: Partial<Flight>
): Promise<Flight | null> {
  const result = await sql`
    UPDATE flights
    SET
      date = ${flightData.date},
      aircraft = ${flightData.aircraft || null},
      callsign = ${flightData.callsign || null},
      departure = ${flightData.departure || null},
      arrival = ${flightData.arrival || null},
      cruise_altitude = ${flightData.cruiseAltitude || null},
      block_fuel = ${flightData.blockFuel || null},
      route = ${flightData.route || null},
      takeoff_runway = ${flightData.takeoffRunway || null},
      sid = ${flightData.sid || null},
      v1 = ${flightData.v1 || null},
      vr = ${flightData.vr || null},
      v2 = ${flightData.v2 || null},
      toga = ${flightData.toga || false},
      flaps = ${flightData.flaps || null},
      landing_runway = ${flightData.landingRunway || null},
      star = ${flightData.star || null},
      brake = ${flightData.brake || null},
      vapp = ${flightData.vapp || null},
      total_duration = ${flightData.totalDuration || null},
      land_rate = ${flightData.landRate || null},
      time_of_day = ${flightData.timeOfDay || null},
      passengers = ${flightData.passengers || null},
      cargo = ${flightData.cargo || null},
      is_public = ${flightData.isPublic || false},
      updated_at = NOW()
    WHERE id = ${flightId} AND user_id = ${userId}
    RETURNING 
      id, user_id as "userId", date,
      aircraft, callsign, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      total_duration as "totalDuration", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo,
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as Flight | null;
}

export async function deleteFlight(flightId: string, userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM flights
    WHERE id = ${flightId} AND user_id = ${userId}
    RETURNING id
  `;
  return result.length > 0;
}

