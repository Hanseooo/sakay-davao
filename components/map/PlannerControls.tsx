"use client";

import { Button } from "@/components/ui/button";
import { PlacementMode } from "./SakayMap";

import { LngLat } from "./SakayMap";

export function PlannerControls({
  mode,
  setMode,
  origin,
  destination,
  onFindRoute,
  isLoading,
  error,
}: {
  mode: PlacementMode;
  setMode: (m: PlacementMode) => void;
  origin: LngLat | null;
  destination: LngLat | null;
  onFindRoute: () => void;
  isLoading: boolean;
  error: string | null;
}) {


  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-md">
      <div className="bg-background/95 backdrop-blur border rounded-xl shadow-lg p-3 space-y-2">
        <div className="flex gap-2">
          <Button
            variant={mode === "origin" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setMode("origin")}
          >
            Set Origin
          </Button>

          <Button
            variant={mode === "destination" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setMode("destination")}
          >
            Set Destination
          </Button>
        </div>

        <Button
        className="w-full"
        disabled={!origin || !destination || isLoading}
        onClick={onFindRoute}
        >
        {isLoading ? "Finding route..." : "Find Direct Route"}
        </Button>

        {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
        )}




        {mode !== "none" && (
          <p className="text-xs text-muted-foreground text-center">
            Tap on the map to place your {mode === "origin" ? "origin" : "destination"}
          </p>
        )}
      </div>
    </div>
  );
}
