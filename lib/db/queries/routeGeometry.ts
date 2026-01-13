import { sql } from "drizzle-orm";
import { db } from "../db";

export async function getRouteGeometry(routeId: string) {
  const result = await db.execute<{ lng: number; lat: number }>(sql`
    SELECT
      ST_X(geom::geometry) AS lng,
      ST_Y(geom::geometry) AS lat
    FROM route_points
    WHERE route_id = ${routeId}
    ORDER BY sequence ASC;
  `)

  return result.map(p => [p.lng, p.lat] as [number, number])
}
