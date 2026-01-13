import { db } from "@/lib/db/db"
import { sql } from "drizzle-orm"

export type DirectRouteGeometryMatch = {
  route_id: string
  route_number: string
  name: string
  color: string
  origin_sequence: number
  destination_sequence: number
}

export async function findDirectRoutesByGeometry(
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
): Promise<DirectRouteGeometryMatch[]> {
  return db.execute(sql`
    WITH
    origin_hits AS (
      SELECT
        rp.route_id,
        rp.sequence,
        ST_Distance(
          rp.geom,
          ST_SetSRID(ST_MakePoint(${originLng}, ${originLat}), 4326)::geography
        ) AS dist
      FROM route_points rp
      WHERE ST_DWithin(
        rp.geom,
        ST_SetSRID(ST_MakePoint(${originLng}, ${originLat}), 4326)::geography,
        400
      )
    ),
    destination_hits AS (
      SELECT
        rp.route_id,
        rp.sequence,
        ST_Distance(
          rp.geom,
          ST_SetSRID(ST_MakePoint(${destinationLng}, ${destinationLat}), 4326)::geography
        ) AS dist
      FROM route_points rp
      WHERE ST_DWithin(
        rp.geom,
        ST_SetSRID(ST_MakePoint(${destinationLng}, ${destinationLat}), 4326)::geography,
        400
      )
    ),
    ranked_origin AS (
      SELECT DISTINCT ON (route_id)
        route_id,
        sequence
      FROM origin_hits
      ORDER BY route_id, dist ASC
    ),
    ranked_destination AS (
      SELECT DISTINCT ON (route_id)
        route_id,
        sequence
      FROM destination_hits
      ORDER BY route_id, dist ASC
    )
    SELECT
      r.id           AS route_id,
      r.route_number AS route_number,
      r.name,
      r.color,
      o.sequence     AS origin_sequence,
      d.sequence     AS destination_sequence
    FROM routes r
    JOIN ranked_origin o ON r.id = o.route_id
    JOIN ranked_destination d ON r.id = d.route_id
    WHERE o.sequence < d.sequence
    ORDER BY r.route_number;
  `)
}
