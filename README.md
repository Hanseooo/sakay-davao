# SakayDavao

## Overview

SakayDavao is a public transportation routing system built with a strong focus on geospatial accuracy, clean architecture, and long-term scalability. This backend implementation follows established industry best practices while remaining lightweight and maintainable.

---

## Frontend Architecture

The frontend is a fully client-driven map explorer built with React and Next.js (App Router). It integrates geospatial data with an interactive map to allow users to explore bus routes and stops.

### Frontend Tech Stack

| Layer         | Technology                   | Purpose                                           |
|:------------- |:---------------------------- |:------------------------------------------------ |
| Framework     | Next.js (App Router)          | Client & server components, routing             |
| State         | Zustand                       | Centralized store for routes, stops, geometry  |
| Map UI        | MapLibre GL / mapcn          | Map rendering, route visualization, markers    |
| UI Components | ShadCN / Radix UI             | Dialogs, toggles, buttons, cards               |
| HTTP Client   | Axios / API wrapper           | Fetches routes, stops, and geometry endpoints |

---

### Route Explorer Store

The store manages:

- `routes` — metadata for all bus routes
- `selectedRoutes` — toggled route IDs
- `geometries` — polyline coordinates for each route
- `stops` — origin and destination stops for each route
- `fetch` functions — lazy-load routes, geometry, and stops

```ts
const { routes, selectedRoutes, geometries, stops, fetchRoutes } = useRouteExplorerStore()
```

## Backend Architecture

### Backend Tech Stack

| Layer       | Technology                      | Description                          |
|:----------- |:--------------------------------|:------------------------------------|
| Database    | Supabase (PostgreSQL + PostGIS) | Managed PostgreSQL with native GIS support |
| ORM         | Drizzle ORM                     | Type-safe, SQL-first ORM             |
| Migrations  | drizzle-kit                     | Schema migration and versioning      |
| Runtime     | Next.js (App Router)            | Fullstack runtime for API and UI     |
| Env Config  | dotenv                          | Environment variable management      |

---

## Environment Configuration

Environment variables are loaded via `.env` to ensure consistent configuration between runtime and migration tooling.

### Required variables

```env
DATABASE_DATABASE_URL=postgresql://...
```

### Drizzle ORM Configuration

File: `drizzle.config.ts`

```ts
import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" })

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_DATABASE_URL!,
  },
} satisfies Config;
```

---

### Configuration Fields

- **schema** — Canonical database schema definition  
- **out** — Generated migration output directory  
- **dialect** — PostgreSQL dialect (required for PostGIS)  
- **url** — Supabase connection string  

## Database Architecture

### Tables

| Table Name    | Purpose                         |
|-------------- |-------------------------------- |
| `routes`      | Bus route metadata              |
| `stops`       | Physical bus stop locations     |
| `route_stops` | Ordered stops per route         |
| `route_points`| Geometry defining route paths   |

### Relationships

```text
routes
  ├──< route_stops >── stops
  └──< route_points
```

---

### Design Principles

- Schema definitions are isolated from query logic
- Queries encapsulate all database behavior
- Clear separation improves testability and maintainability

---

## Spatial Stop Queries

**File:** `lib/db/queries/stops.ts`

### Nearest Stop Resolution

Resolves raw GPS coordinates to the nearest bus stop using PostGIS spatial functions.

## Purpose

- Convert free-form geographic input into graph-aware transit nodes

## Use Cases

- Trip planning
- Location snapping
- Transit graph traversal

## Direct Trip Planner

### Description

Identifies routes that connect an origin and destination using a single bus route, without transfers.

### API Endpoint

**POST** `/api/trip/direct`

### Request Payload

```json
{
  "origin": { "lat": 7.123, "lng": 125.456 },
  "destination": { "lat": 7.130, "lng": 125.480 }
}
```

---

### Response Payload

```json
{
  "originStop": { "...": "..." },
  "destinationStop": { "...": "..." },
  "routes": [ ... ]
}
```

---

### Processing Flow

1. Validate request payload using Zod  
2. Resolve origin and destination to nearest stops  
3. Identify routes containing both stops in correct order  
4. Return matching routes  

This implements a classical single-route transit pathfinding algorithm.

## API Client Architecture

### Directory Layout

```bash
lib/api/
├── client.ts   # Axios instance configuration
└── trip.ts     # Trip-related API calls
```

---

### Rationale

- Centralized HTTP configuration
- Consistent base URL handling
- Extensible for authentication and interceptors
- Avoids duplicated request logic

## Data Source

Route geometry and stop data are derived from the  
[ttg-eng/routes](https://github.com/ttg-eng/routes) repository.

This dataset is used as the foundational source for:

- Route metadata
- Stop locations
- Route geometry and sequencing
