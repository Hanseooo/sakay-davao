"use client";

import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
import { MapClickHandler } from "./MapClickHandler";
import { OriginMarker } from "./OriginMarker";
import { DestinationMarker } from "./DestinationMarker";
import { MapRouteData, RouteRenderer } from "./RouteRenderer";

export type LngLat = { lng: number; lat: number };
export type PlacementMode = "none" | "origin" | "destination";

export function SakayMap({
  mode,
  setMode,
  origin,
  setOrigin,
  destination,
  setDestination,
  routes,
  originStop,
  destinationStop,
}: {
  mode: PlacementMode
  setMode: (m: PlacementMode) => void
  origin: LngLat | null
  setOrigin: (p: LngLat) => void
  destination: LngLat | null
  setDestination: (p: LngLat) => void
  routes: MapRouteData[]
  originStop?: LngLat | null
  destinationStop?: LngLat | null
}) {
  return (
    <Map center={[125.6131, 7.0731]} zoom={12}>
      <MapClickHandler
        mode={mode}
        onPlaceOrigin={setOrigin}
        onPlaceDestination={setDestination}
        clearMode={() => setMode("none")}
      />

      {origin && <OriginMarker value={origin} onChange={setOrigin} />}
      {destination && <DestinationMarker value={destination} onChange={setDestination} />}

      {originStop && (
        <MapMarker longitude={originStop.lng} latitude={originStop.lat}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-blue-500 border-2 border-white" />
          </MarkerContent>
        </MapMarker>
      )}

      {destinationStop && (
        <MapMarker longitude={destinationStop.lng} latitude={destinationStop.lat}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-yellow-400 border-2 border-white" />
          </MarkerContent>
        </MapMarker>
      )}

      <MapControls
      position="bottom-right"
      showFullscreen
      showCompass
      showLocate
      />

      <RouteRenderer origin={origin} destination={destination} routes={routes} />
    </Map>
  )
}
