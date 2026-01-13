import { NextResponse } from "next/server"
import { z } from "zod"
import { getNearbyStops } from "@/lib/db/queries/stops"
import { getRouteGeometry } from "@/lib/db/queries/routeGeometry"
import { findDirectRoutesByGeometry } from "@/lib/db/queries/tripGeometry"

const bodySchema = z.object({
  origin: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  destination: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { origin, destination } = parsed.data

    const [originStops, destinationStops] = await Promise.all([
      getNearbyStops(origin.lat, origin.lng, 1000),
      getNearbyStops(destination.lat, destination.lng, 1000),
    ])

    if (!originStops.length || !destinationStops.length) {
      return NextResponse.json({
        routes: [],
        message: "No nearby stops found",
      })
    }

    const originStop = originStops[0]
    const destinationStop = destinationStops[0]

    const routes = await findDirectRoutesByGeometry(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
    )


    const routesWithGeometry = await Promise.all(
      routes.map(async (r) => {
        const geometry = await getRouteGeometry(r.route_id)

        return {
          routeId: r.route_id,
          routeNumber: r.route_number,
          name: r.name,
          color: r.color,
          geometry,
        }
      })
    )

    return NextResponse.json({
      originStop,
      destinationStop,
      routes: routesWithGeometry,
    })
  } catch (err) {
    console.error("POST /api/trip/direct failed:", err)
    return NextResponse.json(
      { error: "Failed to compute direct trip" },
      { status: 500 }
    )
  }
}

