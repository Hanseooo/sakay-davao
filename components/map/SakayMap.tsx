"use client";

import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "@/components/ui/map";
import { MapClickHandler } from "./MapClickHandler";
import { OriginMarker } from "./OriginMarker";
import { DestinationMarker } from "./DestinationMarker";
import { MapRouteData, RouteRenderer } from "./RouteRenderer";
import { useRouteExplorerStore } from "@/store/useRouteExplorerStore";
import { Fragment } from "react/jsx-runtime";

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

  const { selectedRoutes, geometries, stops, routes : routeMeta } = useRouteExplorerStore()

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

        {selectedRoutes.map((routeId) => {
    const geometry = geometries[routeId]
    const route = routeMeta.find((r) => r.id === routeId)
    const stop = stops[routeId]

    if (!geometry || !route) return null

    const reversed = [...geometry].reverse()

    return (
      <Fragment key={routeId}>
        <MapRoute coordinates={geometry} color={route.color} width={5} />
        <MapRoute coordinates={reversed} color={route.color} width={3} opacity={0.4} />

        {stop && (
          <>
            <MapMarker longitude={stop.origin.lng} latitude={stop.origin.lat}>
              <MarkerContent>
                <div className="size-3 rounded-full bg-blue-500 border-2 border-white" />
              </MarkerContent>
            </MapMarker>

            <MapMarker longitude={stop.destination.lng} latitude={stop.destination.lat}>
              <MarkerContent>
                <div className="size-3 rounded-full bg-yellow-400 border-2 border-white" />
              </MarkerContent>
            </MapMarker>
          </>
        )}
      </Fragment>
    )
  })}

      <MapControls
        position="top-right"
        showFullscreen
        showCompass
        showLocate
        onLocate={() => console.log("hello")}
      />

      <RouteRenderer origin={origin} destination={destination} routes={routes} />
    </Map>
  )
}
