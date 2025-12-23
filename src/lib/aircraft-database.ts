// Common aircraft database for standardization
export const AIRCRAFT_DATABASE = [
  // Boeing
  "Boeing 737-800",
  "Boeing 737-900",
  "Boeing 737 MAX 8",
  "Boeing 737 MAX 9",
  "Boeing 747-400",
  "Boeing 747-8",
  "Boeing 757-200",
  "Boeing 757-300",
  "Boeing 767-300",
  "Boeing 767-400",
  "Boeing 777-200",
  "Boeing 777-300",
  "Boeing 777-300ER",
  "Boeing 777-9",
  "Boeing 787-8",
  "Boeing 787-9",
  "Boeing 787-10",
  
  // Airbus
  "Airbus A319",
  "Airbus A320",
  "Airbus A320neo",
  "Airbus A321",
  "Airbus A321neo",
  "Airbus A330-200",
  "Airbus A330-300",
  "Airbus A330-900neo",
  "Airbus A340-300",
  "Airbus A340-600",
  "Airbus A350-900",
  "Airbus A350-1000",
  "Airbus A380",
  
  // Regional Jets
  "Bombardier CRJ-200",
  "Bombardier CRJ-700",
  "Bombardier CRJ-900",
  "Embraer E170",
  "Embraer E175",
  "Embraer E190",
  "Embraer E195",
  "Embraer E-Jet E2",
  
  // Business Jets
  "Cessna Citation",
  "Cessna Citation X",
  "Gulfstream G650",
  "Gulfstream G700",
  "Bombardier Challenger 350",
  "Bombardier Global 7500",
  "Dassault Falcon 7X",
  "Dassault Falcon 8X",
  
  // General Aviation
  "Cessna 172",
  "Cessna 182",
  "Cessna 206",
  "Piper PA-28",
  "Beechcraft Bonanza",
  "Beechcraft King Air",
  "Cirrus SR22",
  "Diamond DA40",
  "Diamond DA42",
  
  // Military
  "F-16 Fighting Falcon",
  "F-18 Hornet",
  "F-22 Raptor",
  "F-35 Lightning II",
  "C-130 Hercules",
  "C-17 Globemaster",
  "KC-135 Stratotanker",
  
  // Helicopters
  "Bell 206",
  "Bell 407",
  "Bell 429",
  "Sikorsky S-76",
  "Sikorsky S-92",
  "Airbus H125",
  "Airbus H145",
  "Leonardo AW139",
  
  // Other
  "ATR 72",
  "De Havilland Dash 8",
  "Bombardier Q400",
  "Antonov An-124",
  "Antonov An-225",
].sort();

export function searchAircraft(query: string): string[] {
  if (!query) return AIRCRAFT_DATABASE;
  const lowerQuery = query.toLowerCase();
  return AIRCRAFT_DATABASE.filter(aircraft =>
    aircraft.toLowerCase().includes(lowerQuery)
  );
}

