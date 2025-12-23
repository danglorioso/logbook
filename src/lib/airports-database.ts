// Airport database loaded from CSV
// Format: ICAO,Name,City,Country,Latitude,Longitude

export interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// This will be populated when the CSV is loaded
let airportsCache: Airport[] | null = null;

export async function loadAirports(): Promise<Airport[]> {
  if (airportsCache) {
    return airportsCache;
  }

  try {
    const response = await fetch('/airports.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    airportsCache = dataLines
      .map(line => {
        // Parse CSV with quoted fields
        const fields: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        fields.push(current.trim());
        
        // CSV format: IATA, ICAO, Airport name, Country, City, Information
        // Remove quotes from fields
        const cleanedFields = fields.map(f => f.replace(/^"|"$/g, ''));
        const [iata, icao, name, country, city] = cleanedFields;
        
        // Skip if no ICAO code
        if (!icao || icao.trim() === '') return null;
        
        return {
          icao: icao.toUpperCase().trim(),
          name: name || '',
          city: city || '',
          country: country || '',
          latitude: 0,
          longitude: 0,
        };
      })
      .filter((airport): airport is Airport => airport !== null)
      .sort((a, b) => a.icao.localeCompare(b.icao));
    
    return airportsCache;
  } catch (error) {
    console.error('Failed to load airports:', error);
    return [];
  }
}

export function searchAirports(query: string, airports: Airport[]): Airport[] {
  if (!query) return airports.slice(0, 50); // Show first 50 when empty
  const upperQuery = query.toUpperCase();
  const lowerQuery = query.toLowerCase();
  return airports.filter(airport =>
    airport.icao.includes(upperQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery)
  ).slice(0, 50);
}

