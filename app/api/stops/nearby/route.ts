import { NextResponse } from "next/server"
import { z } from "zod"
import { getNearbyStops } from "@/lib/db/queries/stops"

/**
 * We validate query params using Zod.
 * This is best practice:
 * - Prevents invalid input
 * - Prevents crashes
 * - Documents your API
 */

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(50).max(5000).default(500),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const parsed = querySchema.safeParse({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      radius: searchParams.get("radius"),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { lat, lng, radius } = parsed.data

    const stops = await getNearbyStops(lat, lng, radius)

    return NextResponse.json(stops)
  } catch (err) {
    console.error("GET /api/stops/nearby failed:", err)
    return NextResponse.json(
      { error: "Failed to fetch nearby stops" },
      { status: 500 }
    )
  }
}
