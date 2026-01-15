"use client";

import { useState } from "react";
import { SakayMap, PlacementMode, LngLat } from "@/components/map/SakayMap";
import { PlannerControls } from "@/components/map/MapControls";
import { MapRouteData } from "@/components/map/RouteRenderer";
import { api } from "@/lib/api/client";

export default function PlannerPage() {
  const [mode, setMode] = useState<PlacementMode>("none");
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [destination, setDestination] = useState<LngLat | null>(null);
  const [routes, setRoutes] = useState<MapRouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originStop, setOriginStop] = useState<LngLat | null>(null)
  const [destinationStop, setDestinationStop] = useState<LngLat | null>(null)


    async function findDirectRoute() {
    if (!origin || !destination) return;

    setIsLoading(true);
    setError(null);
    setRoutes([]);

    try {
        const res = await api.post("/api/trip/direct", {
        origin: {
            lat: origin.lat,
            lng: origin.lng,
        },
        destination: {
            lat: destination.lat,
            lng: destination.lng,
        },
        });

        const data = res.data;

        if (!Array.isArray(data.routes)) {
        throw new Error("Invalid response format");
        }

        setRoutes(data.routes)

        setOriginStop({
            lat: data.originStop.lat,
            lng: data.originStop.lng,
        })

        setDestinationStop({
        lat: data.destinationStop.lat,
        lng: data.destinationStop.lng,
        })

        } catch (err) {
            setError("Could not find a route. Try another location.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <div className="h-screen w-screen relative">
      <SakayMap
        mode={mode}
        setMode={setMode}
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        routes={routes}
        originStop={originStop}
        destinationStop={destinationStop}
      />

    <PlannerControls
        mode={mode}
        setMode={setMode}
        origin={origin}
        destination={destination}
        onFindRoute={findDirectRoute}
        isLoading={isLoading}
        error={error}
    />

    </div>
  );
}
