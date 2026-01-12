import { NextResponse } from "next/server"
import { z } from "zod"
import { getNearbyStops } from "@/lib/db/queries/stops"
import { findDirectRoutes } from "@/lib/db/queries/trip"

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

    // 1. Snap to nearest stops
    const [originStops, destinationStops] = await Promise.all([
      getNearbyStops(origin.lat, origin.lng, 300),
      getNearbyStops(destination.lat, destination.lng, 300),
    ])

    if (!originStops.length || !destinationStops.length) {
      return NextResponse.json({
        routes: [],
        message: "No nearby stops found",
      })
    }

    const originStop = originStops[0]
    const destinationStop = destinationStops[0]

    // 2. Find direct routes
    const routes = await findDirectRoutes(originStop.id, destinationStop.id)

    return NextResponse.json({
      originStop,
      destinationStop,
      routes,
    })
  } catch (err) {
    console.error("POST /api/trip/direct failed:", err)
    return NextResponse.json(
      { error: "Failed to compute direct trip" },
      { status: 500 }
    )
  }
}
