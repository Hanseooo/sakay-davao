import { api } from "./client"

export type NearbyStop = {
  id: string
  name: string
  distance: number
}

export async function getNearbyStops(
  lat: number,
  lng: number,
  radius = 500
): Promise<NearbyStop[]> {
  const res = await api.get<NearbyStop[]>("/api/stops/nearby", {
    params: { lat, lng, radius },
  })
  return res.data
}
