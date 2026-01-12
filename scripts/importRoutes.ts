import fs from "fs"
import path from "path"
import { db } from "@/lib/db/db"
import { routes, routeStops } from "@/lib/db/schema"

export async function importRoutes() {
  const dir = path.join(process.cwd(), "data/routes")
  const files = fs.readdirSync(dir)

  console.log("Using DB:", process.env.DATABASE_URL?.slice(0, 40) + "...")

  if (process.env.CLEAN_IMPORT === "true") {
    console.log("⚠️ Performing clean import: truncating tables")

    await db.execute(`TRUNCATE route_stops, route_points, stops, routes RESTART IDENTITY CASCADE`)
    }
    


  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8")
    const route = JSON.parse(raw)

    await db
    .insert(routes)
    .values({
        id: route.id,
        routeNumber: route.route_number,
        name: route.name,
        area: route.area,
        timePeriod: route.time_period,
        color: route.color,
        startTime: route.start_time,
        endTime: route.end_time,
    })
    .onConflictDoNothing()


    let stopSeq = 0
    let pointSeq = 0

    for (const p of route.points) {
    await db.execute(`
        INSERT INTO route_points (route_id, sequence, geom)
        VALUES (
        '${route.id}',
        ${pointSeq++},
        ST_SetSRID(ST_MakePoint(${p.longitude}, ${p.latitude}), 4326)::geography
        )
        ON CONFLICT DO NOTHING
    `)

    if (p.kind === "stop" && p.name) {
        await db.execute(`
        INSERT INTO stops (id, name, geom)
        VALUES (
            '${p.id}',
            '${p.name.replace(/'/g, "''")}',
            ST_SetSRID(ST_MakePoint(${p.longitude}, ${p.latitude}), 4326)::geography
        )
        ON CONFLICT (id) DO NOTHING
        `)

        await db
        .insert(routeStops)
        .values({
            routeId: route.id,
            stopId: p.id,
            sequence: stopSeq++,
        })
        .onConflictDoNothing()
    }
    }
  }
}

importRoutes()
  .then(() => {
    console.log("Routes imported successfully")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Import failed:", err)
    process.exit(1)
  })

