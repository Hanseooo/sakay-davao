import { api } from "../client";

export type Route = {
    id: string
    routeNumber: string
    name: string
    area: string
    timePeriod: string
    color: string
    startTime: string
    endTime: string
}

export async function getRoutes(): Promise<Route[]> {
    const res = await api.get<Route[]>("/api/routes")
    return res.data
}