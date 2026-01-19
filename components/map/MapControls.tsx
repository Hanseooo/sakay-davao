"use client";

import { PlacementMode } from "./SakayMap";
import { LngLat } from "./SakayMap";
import { Tabs, TabsList } from "../ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { RoutesExplorer } from "../routes/RoutesExplorer";
import RoutesFinder from "../routes/RoutesFinder";

export type FinderProps = {
  mode: PlacementMode;
  setMode: (m: PlacementMode) => void;
  origin: LngLat | null;
  destination: LngLat | null;
  onFindRoute: () => void;
  isLoading: boolean;
  error: string | null;
  clearDirectRoute: () => void
}

export function MapControls({
  mode,
  setMode,
  origin,
  destination,
  onFindRoute,
  isLoading,
  error,
  clearDirectRoute
}: FinderProps) {

  return (
<div className="absolute bottom-4 left-1/2 z-10 w-[95%] max-w-md -translate-x-1/2">
  <div className="rounded-lg border h-fit min-h-60 bg-background/95 backdrop-blur shadow-sm">
    <Tabs defaultValue="explorer" className="w-full">
      <TabsList
        className="
          flex
          border-b
          w-full
          justify-center
          rounded-none
          bg-transparent
          px-2
        "
      >
        <TabsTrigger
          value="explorer"
          className="
            relative
            px-3 py-2 text-sm
            text-muted-foreground
            transition-colors
            data-[state=active]:text-foreground
            data-[state=active]:after:absolute
            data-[state=active]:after:bottom-0
            data-[state=active]:after:left-0
            data-[state=active]:after:h-0.5
            data-[state=active]:after:w-full
            data-[state=active]:after:bg-foreground
          "
        >
          Explorer
        </TabsTrigger>

        <TabsTrigger
          value="finder"
          className="
            relative
            px-3 py-2 text-sm
            text-muted-foreground
            transition-colors
            data-[state=active]:text-foreground
            data-[state=active]:after:absolute
            data-[state=active]:after:bottom-0
            data-[state=active]:after:left-0
            data-[state=active]:after:h-0.5
            data-[state=active]:after:w-full
            data-[state=active]:after:bg-foreground
          "
        >
          Finder
        </TabsTrigger>
      </TabsList>

      <TabsContent value="explorer" className="p-3">
        <RoutesExplorer />
      </TabsContent>

      <TabsContent value="finder" className="p-3">
        <RoutesFinder
          mode={mode}
          destination={destination}
          error={error}
          isLoading={isLoading}
          onFindRoute={onFindRoute}
          origin={origin}
          setMode={setMode}
          clearDirectRoute={clearDirectRoute}
        />
      </TabsContent>
    </Tabs>
  </div>
</div>

  );
}
