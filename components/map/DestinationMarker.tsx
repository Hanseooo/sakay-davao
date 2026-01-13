"use client";

import { MapMarker, MarkerContent } from "@/components/ui/map";
import { LngLat } from "./SakayMap";

export function DestinationMarker({
  value,
  onChange,
}: {
  value: LngLat;
  onChange: (pos: LngLat) => void;
}) {
  return (
    <MapMarker
      draggable
      longitude={value.lng}
      latitude={value.lat}
      onDragEnd={(lngLat) => onChange(lngLat)}
    >
      <MarkerContent>
        <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
      </MarkerContent>
    </MapMarker>
  );
}
