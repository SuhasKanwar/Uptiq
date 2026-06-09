import { WebsiteTick } from "@/utils/websites";

export type TimeSpan = "1h" | "6h" | "24h" | "all";
export type ChartType = "bar" | "line";

export interface ChartDataPoint {
    id: string;
    timeLabel: string;
    responseTime: number;
    status: string;
}

export function filterTicks(ticks: WebsiteTick[], timeSpan: TimeSpan): WebsiteTick[] {
    const now = Date.now() / 1000;
    return ticks.filter(t => {
        if (timeSpan === "all") return true;
        if (timeSpan === "1h") return t.created_at >= now - 3600;
        if (timeSpan === "6h") return t.created_at >= now - 3600 * 6;
        if (timeSpan === "24h") return t.created_at >= now - 3600 * 24;
        return true;
    });
}

export function formatChartData(ticks: WebsiteTick[]): ChartDataPoint[] {
    return ticks.map(t => ({
        id: t.id,
        timeLabel: new Date(t.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseTime: t.response_time_ms,
        status: t.status,
    }));
}