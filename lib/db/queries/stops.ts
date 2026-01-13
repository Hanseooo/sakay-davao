import { db } from "@/lib/db/db"
import { sql } from "drizzle-orm"

export type NearbyStop = {
  id: string
  name: string
  distance: number
  lat: number
  lng: number
}



/**
 * Finds nearby stops using PostGIS.
 *
 * @param lat Latitude
 * @param lng Longitude
 * @param radius Search radius in meters
 */
export async function getNearbyStops(
  lat: number,
  lng: number,
  radius: number
): Promise<NearbyStop[]> {
  const result = await db.execute<NearbyStop>(sql`
    SELECT
      id,
      name,
      ST_Distance(
        geom,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
      ) AS distance,
      ST_Y(geom::geometry) AS lat,
      ST_X(geom::geometry) AS lng
    FROM stops
    WHERE ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
      ${radius}
    )
    ORDER BY distance
    LIMIT 1;
  `)

  return result
}



