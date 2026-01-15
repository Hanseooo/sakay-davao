import { Button } from "../ui/button";
import type { FinderProps } from "../map/MapControls";


export default function RoutesFinder({
  mode,
  setMode,
  origin,
  destination,
  onFindRoute,
  isLoading,
  error,
}: FinderProps) {

    return(
        <main className="flex flex-col gap-4">
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
        </main>
        
    )
}