import { NextResponse } from "next/server"
import { getAllRoutes } from "@/lib/db/queries/routes"

export async function GET() {
  try {
    const routes = await getAllRoutes()
    return NextResponse.json(routes)
  } catch (err) {
    console.error("GET /api/routes failed:", err)
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    )
  }
}
