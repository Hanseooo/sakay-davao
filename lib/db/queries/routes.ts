import { db } from "@/lib/db/db"
import { routes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getAllRoutes() {
  return db.select().from(routes)
}

export async function getRouteById(id: string) {
  const result = await db
    .select()
    .from(routes)
    .where(eq(routes.id, id))
    .limit(1)

  return result[0] ?? null
}
