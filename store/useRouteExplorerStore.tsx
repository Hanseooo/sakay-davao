import { create } from "zustand"
import { api } from "@/lib/api/client"
import type { LngLat } from "@/components/map/SakayMap"

export type RouteMeta = {
  id: string
  routeNumber: string
  name: string
  area: string
  timePeriod: "AM" | "PM"
  startTime: string
  endTime: string
  color: string
}

type RouteExplorerStore = {
  routes: RouteMeta[]
  isLoaded: boolean
  isLoading: boolean
  error: string | null

  selectedRoutes: string[]

  geometries: Record<string, [number, number][]>
  stops: Record<string, { origin: LngLat; destination: LngLat }>

  fetchRoutes: () => Promise<void>
  toggleRoute: (routeId: string) => void
  fetchRouteGeometry: (routeId: string) => Promise<void>
  fetchRouteStops: (routeId: string) => Promise<void>
}

export const useRouteExplorerStore = create<RouteExplorerStore>((set, get) => ({
  routes: [],
  isLoaded: false,
  isLoading: false,
  error: null,

  selectedRoutes: [],
  geometries: {},
  stops: {},

  async fetchRoutes() {
    if (get().isLoaded) return

    set({ isLoading: true, error: null })

    try {
      const res = await api.get("/api/routes")
      set({
        routes: res.data,
        isLoaded: true,
      })
    } catch {
      set({ error: "Failed to load routes" })
    } finally {
      set({ isLoading: false })
    }
  },

  toggleRoute(routeId) {
    const { selectedRoutes } = get()

    if (selectedRoutes.includes(routeId)) {
      set({
        selectedRoutes: selectedRoutes.filter((id) => id !== routeId),
      })
    } else {
      set({
        selectedRoutes: [...selectedRoutes, routeId],
      })
    }
  },

  async fetchRouteGeometry(routeId) {
    if (get().geometries[routeId]) return

    const res = await api.get(`/api/routes/${routeId}/geometry`)
    set((state) => ({
      geometries: {
        ...state.geometries,
        [routeId]: res.data,
      },
    }))
  },

  async fetchRouteStops(routeId) {
    if (get().stops[routeId]) return

    const res = await api.get(`/api/routes/${routeId}/stops`)
    set((state) => ({
      stops: {
        ...state.stops,
        [routeId]: res.data,
      },
    }))
  },
}))
