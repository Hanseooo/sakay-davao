"use client"

import { useEffect } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { useRouteExplorerStore } from "@/store/useRouteExplorerStore" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { formatTo12Hour } from "@/lib/utils/time"

export function RoutesExplorer() {
  const {
    routes,
    selectedRoutes,
    fetchRoutes,

    fetchRouteGeometry,
    fetchRouteStops,
  } = useRouteExplorerStore()

  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  useEffect(() => {
    selectedRoutes.forEach((routeId) => {
      fetchRouteGeometry(routeId)
      fetchRouteStops(routeId)
    })
  }, [selectedRoutes, fetchRouteGeometry, fetchRouteStops])

  return (
    <div className="space-y-2 flex flex-col">

      <Dialog>
        <DialogTrigger asChild>
            <Button>Select Routes</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Select Routes</DialogTitle></DialogHeader>
<ToggleGroup
  type="multiple"
  value={selectedRoutes}
  onValueChange={(values) =>
    useRouteExplorerStore.setState({ selectedRoutes: values })
  }
  className="flex flex-wrap gap-2"
>
  {routes.map((route) => (
    <ToggleGroupItem key={route.id} value={route.id}>
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

        <DialogContent className="max-w-lg max-h-98 overflow-auto">
          <DialogHeader>
            <DialogTitle>Selected Routes</DialogTitle>
          </DialogHeader>

          <div className={`grid grid-cols-2 gap-3`}>
            {routes
              .filter((r) => selectedRoutes.includes(r.id))
              .map((r) => {
                const startTime = formatTo12Hour(r.startTime)
                const endTime = formatTo12Hour(r.endTime)
                return(
                <Card key={r.id} className={`p-3 bg-muted/50`}>
                  <p className="font-semibold">
                    {r.routeNumber} ({r.timePeriod})
                  </p>
                  <p className="text-sm">{r.name}</p>
                  <p className="text-sm">
                    Time: {startTime}{r.timePeriod} – {endTime}{r.timePeriod}
                  </p>
                </Card>
              )})}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
