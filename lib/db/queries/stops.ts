import { db } from "@/lib/db/db"
import { sql } from "drizzle-orm"

export type NearbyStop = {
  id: string
  name: string
  distance: number
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
  /**
   * We use raw SQL here because:
   * - Drizzle does not yet have high-level helpers for PostGIS
   * - Spatial queries are much clearer in SQL
   * - This is still safe because we use parameter binding
   *
   * This is NOT bad practice. It is normal when using GIS.
   */
  const result = await db.execute<NearbyStop>(sql`
    SELECT
      id,
      name,
      ST_Distance(
        geom,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
      ) AS distance
    FROM stops
    WHERE ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
      ${radius}
    )
    ORDER BY distance
    LIMIT 15;
  `)

  return result
}
