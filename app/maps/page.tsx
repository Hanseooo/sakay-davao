"use client";

import { useState } from "react";
import { SakayMap, PlacementMode, LngLat } from "@/components/map/SakayMap";
import { MapControls } from "@/components/map/MapControls";
import { MapRouteData } from "@/components/map/RouteRenderer";
import { api } from "@/lib/api/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTo12Hour } from "@/lib/utils/time";

export default function MapPage() {
  const [mode, setMode] = useState<PlacementMode>("none");
  const [origin, setOrigin] = useState<LngLat | null>(null);
  const [destination, setDestination] = useState<LngLat | null>(null);
  const [routes, setRoutes] = useState<MapRouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originStop, setOriginStop] = useState<LngLat | null>(null)
  const [destinationStop, setDestinationStop] = useState<LngLat | null>(null)
  const [routeDialogOpen, setRouteDialogOpen] = useState(false)


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
        setRouteDialogOpen(true)

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

    function clearDirectRoute() {
        setMode("none")
        setOrigin(null)
        setDestination(null)
        setRoutes([])
        setOriginStop(null)
        setDestinationStop(null)
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

    <MapControls
        mode={mode}
        setMode={setMode}
        origin={origin}
        destination={destination}
        onFindRoute={findDirectRoute}
        isLoading={isLoading}
        error={error}
        clearDirectRoute={clearDirectRoute}
    />

    <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
            <DialogTitle>Routes Found</DialogTitle>
            <DialogDescription>
                {routes.length === 0
                ? "No direct routes were found between these stops."
                : `${routes.length} route(s) available.`}
            </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 overflow-auto max-h-98">
            {routes.map((r) => {
                const startHour = formatTo12Hour(r.startTime)
                const endHour = formatTo12Hour(r.endTime)
                return (
                    <div
                    key={r.routeId}
                    className="p-3 border rounded flex justify-between items-center"
                    >
                        <div>
                            <div className="font-medium">{r.routeNumber}</div>
                            <div className="text-sm text-muted-foreground">{r.name}</div>
                            <div className="text-sm text-muted-foreground">{startHour}{r.timePeriod} - {endHour}{r.timePeriod}</div>
                        </div>
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: r.color }}
                        />
                    </div>
                )
            })}
            </div>
        </DialogContent>
    </Dialog>


    </div>
  );
}
