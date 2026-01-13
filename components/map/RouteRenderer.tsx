"use client";

import { MapRoute } from "@/components/ui/map";
import { LngLat } from "./SakayMap";

export type MapRouteData = {
  routeId: string
  routeNumber: string
  name: string
  timePeriod: string
  color: string
  startTime: string
  endTime: string
  geometry: [number, number][]
}


export function RouteRenderer({
  origin,
  destination,
  routes,
}: {
  origin: LngLat | null;
  destination: LngLat | null;
  routes: MapRouteData[];
}) {
  if (!origin || !destination || routes.length === 0) return null;

  return (
    <>
      {routes.map((route, index) => (
        <MapRoute
          key={index}
          coordinates={route.geometry}
          color={route.color}
          width={index === 0 ? 6 : 5}
          opacity={index === 0 ? 1 : 0.6}
        />
      ))}
    </>
  );
}
