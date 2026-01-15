"use client"

import { useEffect } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { useRouteExplorerStore } from "@/store/useRouteExplorerStore" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

export function RoutesExplorer() {
  const {
    routes,
    selectedRoutes,
    fetchRoutes,
    toggleRoute,
    fetchRouteGeometry,
    fetchRouteStops,
  } = useRouteExplorerStore()

  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  async function onToggle(routeId: string) {
    toggleRoute(routeId)
    await fetchRouteGeometry(routeId)
    await fetchRouteStops(routeId)
  }

  return (
    <div className="space-y-2 flex flex-col">

      <Dialog>
        <DialogTrigger asChild>
            <Button>Select Routes</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Select Routes</DialogTitle></DialogHeader>
            <ToggleGroup type="multiple" className="flex flex-wrap gap-2 items-center justify-center">
                {routes.map((route) => (
                <ToggleGroupItem
                    key={route.id}
                    value={route.id}
                    onClick={() => onToggle(route.id)}
                >
                    {route.routeNumber} ({route.timePeriod})
                </ToggleGroupItem>
                ))}
        </ToggleGroup>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" disabled={selectedRoutes.length == 0}>
            View Selected Routes ({selectedRoutes.length})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Selected Routes</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            {routes
              .filter((r) => selectedRoutes.includes(r.id))
              .map((r) => (
                <Card key={r.id} className={`p-3 space-y-1 bg-muted/50`}>
                  <p className="font-semibold">
                    {r.routeNumber} ({r.timePeriod})
                  </p>
                  <p className="text-sm">Area: {r.area}</p>
                  <p className="text-sm">
                    Time: {r.startTime} – {r.endTime}
                  </p>
                </Card>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
