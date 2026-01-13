"use client";

import { useEffect } from "react";
import { useMap } from "@/components/ui/map";
import { PlacementMode, LngLat } from "./SakayMap";

interface Props {
  mode: PlacementMode;
  onPlaceOrigin: (pos: LngLat) => void;
  onPlaceDestination: (pos: LngLat) => void;
  clearMode: () => void;
}

type MapClickEvent = {
  lngLat: {
    lng: number;
    lat: number;
  };
};

export function MapClickHandler({
  mode,
  onPlaceOrigin,
  onPlaceDestination,
  clearMode,
}: Props) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (e: MapClickEvent) => {
      if (mode === "none") return;

      const pos: LngLat = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      };

      if (mode === "origin") onPlaceOrigin(pos);
      if (mode === "destination") onPlaceDestination(pos);

      clearMode();
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, mode, onPlaceOrigin, onPlaceDestination, clearMode]);

  return null;
}
