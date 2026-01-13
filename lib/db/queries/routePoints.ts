import { sql } from "drizzle-orm"
import { db } from "../db"

export type RoutePolylinePoint = {
  lat: number
  lng: number
  sequence: number
}


export async function getRoutePoints(routeId: string) {
  const result = await db.execute<RoutePolylinePoint>(sql`
    SELECT
      ST_Y(geom::geometry) AS lat,
      ST_X(geom::geometry) AS lng,
      sequence
    FROM route_points
    WHERE route_id = ${routeId}
    ORDER BY sequence;
  `)

  return result
}
