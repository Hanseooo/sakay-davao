import { db } from "@/lib/db/db"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

type SeqResult = {
  min_seq: number | null
  max_seq: number | null
}

type StopRow = {
  sequence: number
  lat: number
  lng: number
}

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const routeId = params.id

  // 1. Get min/max sequence
  const seqResult = await db.execute(sql<SeqResult>`
    SELECT
      MIN(sequence) as min_seq,
      MAX(sequence) as max_seq
    FROM route_points
    WHERE route_id = ${routeId}
  `)

  if (!seqResult.length || seqResult[0].min_seq === null || seqResult[0].max_seq === null) {
    return NextResponse.json({ error: "Stops not found" }, { status: 404 })
  }

  const { min_seq, max_seq } = seqResult[0]

  // 2. Get stop coordinates
  const stops = await db.execute(sql<StopRow>`
    SELECT
      sequence,
      ST_Y(geom::geometry) AS lat,
      ST_X(geom::geometry) AS lng
    FROM route_points
    WHERE route_id = ${routeId}
      AND (sequence = ${min_seq} OR sequence = ${max_seq})
  `)

  const origin = stops.find((s) => s.sequence === min_seq)
  const destination = stops.find((s) => s.sequence === max_seq)

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Origin or destination stop missing" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    origin: {
      lat: origin.lat,
      lng: origin.lng,
    },
    destination: {
      lat: destination.lat,
      lng: destination.lng,
    },
  })
}
