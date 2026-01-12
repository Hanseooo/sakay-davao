import { db } from "@/lib/db/db"
import { sql } from "drizzle-orm"

export type DirectRouteMatch = {
  route_id: string
  route_number: string
  name: string
  color: string
  origin_stop_id: string
  destination_stop_id: string
  origin_sequence: number
  destination_sequence: number
}

export async function findDirectRoutes(
  originStopId: string,
  destinationStopId: string
): Promise<DirectRouteMatch[]> {
  const result = await db.execute<DirectRouteMatch>(sql`
    SELECT
      r.id           AS route_id,
      r.route_number AS route_number,
      r.name,
      r.color,
      rs1.stop_id    AS origin_stop_id,
      rs2.stop_id    AS destination_stop_id,
      rs1.sequence   AS origin_sequence,
      rs2.sequence   AS destination_sequence
    FROM routes r
    JOIN route_stops rs1 ON r.id = rs1.route_id
    JOIN route_stops rs2 ON r.id = rs2.route_id
    WHERE rs1.stop_id = ${originStopId}
      AND rs2.stop_id = ${destinationStopId}
      AND rs1.sequence < rs2.sequence
    ORDER BY r.route_number;
  `)

  return result
}
