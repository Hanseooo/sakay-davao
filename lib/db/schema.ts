import {
  pgTable,
  uuid,
  text,
  integer,
  serial,
  index,
} from "drizzle-orm/pg-core"
import { customType } from "drizzle-orm/pg-core"

const geography = customType<{ data: string }>({
  dataType() {
    return "geography(Point,4326)"
  },
})

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey(),
  routeNumber: text("route_number").notNull(),
  name: text("name").notNull(),
  area: text("area").notNull(),
  timePeriod: text("time_period").notNull(),
  color: text("color").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
})

export const stops = pgTable(
  "stops",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    geom: geography("geom").notNull(),
  },
  (table) => ({
    geomIdx: index("stops_geom_idx").using("gist", table.geom),
  })
)

export const routeStops = pgTable(
  "route_stops",
  {
    id: serial("id").primaryKey(),
    routeId: uuid("route_id").notNull(),
    stopId: uuid("stop_id").notNull(),
    sequence: integer("sequence").notNull(),
  },
  (table) => ({
    routeSeqIdx: index("route_seq_idx").on(table.routeId, table.sequence),
  })
)

export const routePoints = pgTable(
  "route_points",
  {
    id: serial("id").primaryKey(),
    routeId: uuid("route_id").notNull(),
    sequence: integer("sequence").notNull(),
    geom: geography("geom").notNull(),
  },
  (table) => ({
    geomIdx: index("route_points_geom_idx").using("gist", table.geom),
  })
)
