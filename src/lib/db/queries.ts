import { sql } from "./schema";
import type { Flight, User } from "./schema";

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, first_name as "firstName", last_name as "lastName", disabled, created_at as "createdAt", updated_at as "updatedAt"
    FROM "user"
    WHERE id = ${id}
  `;
  return result[0] as User | null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, first_name as "firstName", last_name as "lastName", disabled, created_at as "createdAt", updated_at as "updatedAt"
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
    RETURNING id, email, name, first_name as "firstName", last_name as "lastName", disabled, created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as User;
}

export async function updateUserProfile(
  id: string,
  updates: {
    username?: string;
    firstName?: string;
    lastName?: string;
    disabled?: boolean;
  }
): Promise<User | null> {
  // Get current user to preserve values not being updated
  const currentUser = await getUserById(id);
  if (!currentUser) {
    return null;
  }

  // Use the provided updates or keep current values
  const name = updates.username !== undefined ? updates.username : currentUser.name;
  const firstName = updates.firstName !== undefined ? updates.firstName : currentUser.firstName;
  const lastName = updates.lastName !== undefined ? updates.lastName : currentUser.lastName;
  const disabled = updates.disabled !== undefined ? updates.disabled : currentUser.disabled;

  const result = await sql`
    UPDATE "user"
    SET 
      name = ${name},
      first_name = ${firstName},
      last_name = ${lastName},
      disabled = ${disabled},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, email, name, first_name as "firstName", last_name as "lastName", disabled, created_at as "createdAt", updated_at as "updatedAt"
  `;
  return result[0] as User | null;
}

export async function getFlightsByUserId(userId: string): Promise<Flight[]> {
  const result = await sql`
    SELECT 
      id, user_id as "userId", date,
      callsign, aircraft, airframe, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      air_time as "airTime", block_time as "blockTime", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo, route_distance as "routeDistance",
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
    FROM flights
    WHERE user_id = ${userId}
    ORDER BY date DESC, created_at DESC
  `;
  // Parse comma-separated timeOfDay string to array
  return (result as Array<Omit<Flight, 'timeOfDay'> & { timeOfDay: string | null }>).map(flight => ({
    ...flight,
    timeOfDay: flight.timeOfDay ? flight.timeOfDay.split(',').filter(Boolean) as ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] : null,
  })) as Flight[];
}

export async function getPublicFlights(limit = 50): Promise<Flight[]> {
  const result = await sql`
    SELECT 
      f.id, f.user_id as "userId", f.date,
      f.callsign, f.aircraft, f.airframe, f.departure, f.arrival, f.cruise_altitude as "cruiseAltitude",
      f.block_fuel as "blockFuel", f.route,
      f.takeoff_runway as "takeoffRunway", f.sid, f.v1, f.vr, f.v2, f.toga, f.flaps,
      f.landing_runway as "landingRunway", f.star, f.brake, f.vapp,
      f.air_time as "airTime", f.block_time as "blockTime", f.land_rate as "landRate",
      f.time_of_day as "timeOfDay", f.passengers, f.cargo, f.route_distance as "routeDistance",
      f.is_public as "isPublic", f.created_at as "createdAt", f.updated_at as "updatedAt",
      u.name as "username", u.email as "userEmail"
    FROM flights f
    JOIN "user" u ON f.user_id = u.id
    WHERE f.is_public = true
    ORDER BY f.date DESC, f.created_at DESC
    LIMIT ${limit}
  `;
  // Parse comma-separated timeOfDay string to array
  return (result as Array<Omit<Flight, 'timeOfDay'> & { timeOfDay: string | null; username?: string; userEmail?: string }>).map(flight => ({
    ...flight,
    timeOfDay: flight.timeOfDay ? flight.timeOfDay.split(',').filter(Boolean) as ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] : null,
  })) as (Flight & { username?: string; userEmail?: string })[];
}

export async function getPublicFlightsByUsername(username: string): Promise<(Flight & { username?: string; userEmail?: string })[]> {
  const result = await sql`
    SELECT 
      f.id, f.user_id as "userId", f.date,
      f.callsign, f.aircraft, f.airframe, f.departure, f.arrival, f.cruise_altitude as "cruiseAltitude",
      f.block_fuel as "blockFuel", f.route,
      f.takeoff_runway as "takeoffRunway", f.sid, f.v1, f.vr, f.v2, f.toga, f.flaps,
      f.landing_runway as "landingRunway", f.star, f.brake, f.vapp,
      f.air_time as "airTime", f.block_time as "blockTime", f.land_rate as "landRate",
      f.time_of_day as "timeOfDay", f.passengers, f.cargo, f.route_distance as "routeDistance",
      f.is_public as "isPublic", f.created_at as "createdAt", f.updated_at as "updatedAt",
      u.name as "username", u.email as "userEmail", u.first_name as "firstName", u.last_name as "lastName"
    FROM flights f
    JOIN "user" u ON f.user_id = u.id
    WHERE f.is_public = true AND u.name = ${username}
    ORDER BY f.date DESC, f.created_at DESC
  `;
  // Parse comma-separated timeOfDay string to array
  return (result as Array<Omit<Flight, 'timeOfDay'> & { timeOfDay: string | null; username?: string; userEmail?: string; firstName?: string | null; lastName?: string | null }>).map(flight => ({
    ...flight,
    timeOfDay: flight.timeOfDay ? flight.timeOfDay.split(',').filter(Boolean) as ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] : null,
  })) as (Flight & { username?: string; userEmail?: string; firstName?: string | null; lastName?: string | null })[];
}

export async function getUserByUsername(username: string): Promise<(User & { firstName?: string | null; lastName?: string | null }) | null> {
  const result = await sql`
    SELECT id, email, name, first_name as "firstName", last_name as "lastName", disabled, created_at as "createdAt", updated_at as "updatedAt"
    FROM "user"
    WHERE name = ${username}
  `;
  return result[0] as (User & { firstName?: string | null; lastName?: string | null }) | null;
}

export async function createFlight(userId: string, flightData: Partial<Flight>): Promise<Flight> {
  const result = await sql`
    INSERT INTO flights (
      user_id, date, callsign, aircraft, airframe, departure, arrival, cruise_altitude,
      block_fuel, route, takeoff_runway, sid, v1, vr, v2, toga, flaps,
      landing_runway, star, brake, vapp, air_time, block_time, land_rate,
      time_of_day, passengers, cargo, route_distance, is_public
    )
    VALUES (
      ${userId}, ${flightData.date}, ${flightData.callsign || null}, 
      ${flightData.aircraft || null}, ${flightData.airframe || null}, 
      ${flightData.departure || null}, ${flightData.arrival || null}, ${flightData.cruiseAltitude || null},
      ${flightData.blockFuel || null}, ${flightData.route || null},
      ${flightData.takeoffRunway || null}, ${flightData.sid || null},
      ${flightData.v1 || null}, ${flightData.vr || null}, ${flightData.v2 || null},
      ${flightData.toga || false}, ${flightData.flaps || null},
      ${flightData.landingRunway || null}, ${flightData.star || null},
      ${flightData.brake || null}, ${flightData.vapp || null},
      ${flightData.airTime || null}, ${flightData.blockTime || null}, ${flightData.landRate || null},
      ${flightData.timeOfDay || null}, ${flightData.passengers || null},
      ${flightData.cargo || null}, ${flightData.routeDistance || null}, ${flightData.isPublic || false}
    )
    RETURNING 
      id, user_id as "userId", date,
      callsign, aircraft, airframe, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      air_time as "airTime", block_time as "blockTime", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo, route_distance as "routeDistance",
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
  `;
  // Parse comma-separated timeOfDay string to array
  const flight = result[0] as Omit<Flight, 'timeOfDay'> & { timeOfDay: string | null };
  return {
    ...flight,
    timeOfDay: flight.timeOfDay ? flight.timeOfDay.split(',').filter(Boolean) as ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] : null,
  } as Flight;
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
      callsign = ${flightData.callsign || null},
      aircraft = ${flightData.aircraft || null},
      airframe = ${flightData.airframe || null},
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
      air_time = ${flightData.airTime || null},
      block_time = ${flightData.blockTime || null},
      land_rate = ${flightData.landRate || null},
      time_of_day = ${flightData.timeOfDay || null},
      passengers = ${flightData.passengers || null},
      cargo = ${flightData.cargo || null},
      route_distance = ${flightData.routeDistance || null},
      is_public = ${flightData.isPublic || false},
      updated_at = NOW()
    WHERE id = ${flightId} AND user_id = ${userId}
    RETURNING 
      id, user_id as "userId", date,
      callsign, aircraft, airframe, departure, arrival, cruise_altitude as "cruiseAltitude",
      block_fuel as "blockFuel", route,
      takeoff_runway as "takeoffRunway", sid, v1, vr, v2, toga, flaps,
      landing_runway as "landingRunway", star, brake, vapp,
      air_time as "airTime", block_time as "blockTime", land_rate as "landRate",
      time_of_day as "timeOfDay", passengers, cargo, route_distance as "routeDistance",
      is_public as "isPublic", created_at as "createdAt", updated_at as "updatedAt"
  `;
  if (result.length === 0) return null;
  // Parse comma-separated timeOfDay string to array
  const flight = result[0] as Omit<Flight, 'timeOfDay'> & { timeOfDay: string | null };
  return {
    ...flight,
    timeOfDay: flight.timeOfDay ? flight.timeOfDay.split(',').filter(Boolean) as ("MORNING" | "MID-DAY" | "EVENING" | "NIGHT")[] : null,
  } as Flight;
}

export async function deleteFlight(flightId: string, userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM flights
    WHERE id = ${flightId} AND user_id = ${userId}
    RETURNING id
  `;
  return result.length > 0;
}

