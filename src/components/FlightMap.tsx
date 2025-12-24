"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface FlightMapProps {
  departure: string | null;
  arrival: string | null;
  route?: string | null;
  className?: string;
}

interface AirportCoords {
  lat: number;
  lng: number;
}

export function FlightMap({ departure, arrival, route, className = "" }: FlightMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !departure || !arrival) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      setError("Mapbox token not configured");
      setLoading(false);
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Fetch airport coordinates
    const fetchCoordinates = async () => {
      try {
        const [depCoords, arrCoords] = await Promise.all([
          fetch(`/api/airports/${departure}`).then((r) => r.json()),
          fetch(`/api/airports/${arrival}`).then((r) => r.json()),
        ]);

        if (!depCoords.lat || !arrCoords.lat) {
          setError("Could not find airport coordinates");
          setLoading(false);
          return;
        }

        const dep: AirportCoords = { lat: depCoords.lat, lng: depCoords.lng };
        const arr: AirportCoords = { lat: arrCoords.lat, lng: arrCoords.lng };

        // Initialize map
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [
              (dep.lng + arr.lng) / 2,
              (dep.lat + arr.lat) / 2,
            ],
            zoom: 3,
            attributionControl: false,
          });

          map.current.on("load", () => {
            // Add route line
            const coordinates: [number, number][] = [
              [dep.lng, dep.lat],
              [arr.lng, arr.lat],
            ];

            // TODO: Parse waypoints from route string if needed
            // For now, just draw straight line

            map.current!.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates,
                },
              },
            });

            map.current!.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3b82f6",
                "line-width": 2,
                "line-opacity": 0.8,
              },
            });

            // Add departure marker
            new mapboxgl.Marker({ color: "#10b981" })
              .setLngLat([dep.lng, dep.lat])
              .addTo(map.current!);

            // Add arrival marker
            new mapboxgl.Marker({ color: "#ef4444" })
              .setLngLat([arr.lng, arr.lat])
              .addTo(map.current!);

            // Fit bounds to show both airports
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([dep.lng, dep.lat]);
            bounds.extend([arr.lng, arr.lat]);
            map.current!.fitBounds(bounds, {
              padding: 20,
              maxZoom: 6,
            });

            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Failed to load map:", err);
        setError("Failed to load map");
        setLoading(false);
      }
    };

    fetchCoordinates();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [departure, arrival, route]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded ${className}`}>
        <p className="text-xs text-white/40">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded z-10">
          <div className="text-xs text-white/40">Loading map...</div>
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full h-full rounded border border-white/10"
        style={{ minHeight: "200px" }}
      />
    </div>
  );
}

