

CREATE TABLE "route_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"geom" geography(Point,4326) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "route_stops" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" uuid NOT NULL,
	"stop_id" uuid NOT NULL,
	"sequence" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"route_number" text NOT NULL,
	"name" text NOT NULL,
	"area" text NOT NULL,
	"time_period" text NOT NULL,
	"color" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stops" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"geom" geography(Point,4326) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "route_points_geom_idx" ON "route_points" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "route_seq_idx" ON "route_stops" USING btree ("route_id","sequence");--> statement-breakpoint
CREATE INDEX "stops_geom_idx" ON "stops" USING gist ("geom");