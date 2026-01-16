"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouteExplorerStore } from "@/store/useRouteExplorerStore" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { formatTo12Hour } from "@/lib/utils/time"
import { CustomToggleGroup, CustomToggleItem } from "../ui/customToggleGroup"

export function RoutesExplorer() {
  const {
    routes,
    selectedRoutes,
    fetchRoutes,
    fetchRouteGeometry,
    fetchRouteStops,
  } = useRouteExplorerStore()

  // Fetch routes on mount
  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  // Fetch geometry & stops when a route is selected
  useEffect(() => {
    selectedRoutes.forEach((routeId) => {
      fetchRouteGeometry(routeId)
      fetchRouteStops(routeId)
    })
  }, [selectedRoutes, fetchRouteGeometry, fetchRouteStops])

  return (
    <div className="space-y-2 flex flex-col items-center">

      {/* Select Routes Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Select Routes</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Routes</DialogTitle>
          </DialogHeader>

          <CustomToggleGroup
            value={selectedRoutes}
            onValueChange={(values) =>
              useRouteExplorerStore.setState({ selectedRoutes: values })
            }
          >
            {routes.map((route) => (
              <CustomToggleItem key={route.id} value={route.id}>
                {route.routeNumber} ({route.timePeriod})
              </CustomToggleItem>
            ))}
          </CustomToggleGroup>
        </DialogContent>
      </Dialog>

      {/* Selected Routes Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="secondary" disabled={selectedRoutes.length === 0}>
            View Selected Routes ({selectedRoutes.length})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg max-h-98 overflow-auto">
          <DialogHeader>
            <DialogTitle>Selected Routes</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            {routes
              .filter((r) => selectedRoutes.includes(r.id))
              .map((r) => {
                const startTime = formatTo12Hour(r.startTime)
                const endTime = formatTo12Hour(r.endTime)
                return (
                  <Card key={r.id} className="p-3 bg-muted/50">
                    <p className="font-semibold">
                      {r.routeNumber} ({r.timePeriod})
                    </p>
                    <p className="text-sm">{r.name}</p>
                    <p className="text-sm">
                      Time: {startTime}{r.timePeriod} – {endTime}{r.timePeriod}
                    </p>
                  </Card>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
