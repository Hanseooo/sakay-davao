import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

type GeometryRow = { geojson: string };
type GeoJSONLineString = { type: "LineString"; coordinates: [number, number][] };

// Type guard for LineString
function isLineString(obj: unknown): obj is GeoJSONLineString {
  if (typeof obj !== "object" || obj === null) return false;
  if (!('type' in obj) || !('coordinates' in obj)) return false;
  const maybeLine = obj as { type?: unknown; coordinates?: unknown };
  if (maybeLine.type !== "LineString") return false;
  if (!Array.isArray(maybeLine.coordinates)) return false;
  return maybeLine.coordinates.every(
    (c) => Array.isArray(c) && c.length === 2 && typeof c[0] === "number" && typeof c[1] === "number"
  );
}

export async function GET(
  _: Request,
  { params }: { params: { id: string } } // required
) {
  const routeId = params.id;

  try {
    const result = await db.execute<GeometryRow>(sql`
      SELECT ST_AsGeoJSON(geom) AS geojson
      FROM routes
      WHERE id = ${routeId}
    `);

    if (!result.length || !result[0].geojson) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    let parsed: unknown;
    try { parsed = JSON.parse(result[0].geojson); } 
    catch { return NextResponse.json({ error: "Failed to parse geometry" }, { status: 500 }); }

    if (!isLineString(parsed)) {
      return NextResponse.json({ error: "Invalid geometry format" }, { status: 500 });
    }

    return NextResponse.json(parsed.coordinates);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
