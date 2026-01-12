import { api } from "./client"

export type DirectTripRequest = {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
}

export type DirectTripResult = {
  originStop: {
    id: string
    name: string
    distance: number
  }
  destinationStop: {
    id: string
    name: string
    distance: number
  }
  routes: {
    route_id: string
    route_number: string
    name: string
    color: string
  }[]
}

export async function findDirectTrip(data: DirectTripRequest) {
  const res = await api.post<DirectTripResult>("/api/trip/direct", data)
  return res.data
}
