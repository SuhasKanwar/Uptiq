"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWebsite, getWebsiteTicks, Website, WebsiteTick } from "@/utils/websites";
import { Loader2, ArrowLeft, ExternalLink, Activity, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StatsCard from "@/components/dashboard/StatsCard";
import ResponseChart from "@/components/dashboard/ResponseChart";
import { POLLING_TIME } from "@/lib/config";

export default function WebsiteDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession({ required: true });

    const [website, setWebsite] = useState<Website | null>(null);
    const [ticks, setTicks] = useState<WebsiteTick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWebsite = async (id: string) => {
        try {
            const data = await getWebsite(id);
            setWebsite(data);
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to load website details.");
        }
    };

    const fetchTicks = async (id: string) => {
        try {
            const data = await getWebsiteTicks(id);
            setTicks(data);
        } catch (err) {
            console.error("Failed to fetch ticks", err);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && params.id) {
            const id = params.id as string;
            setLoading(true);
            Promise.all([fetchWebsite(id), fetchTicks(id)])
                .finally(() => setLoading(false));
        }
    }, [status, params.id]);

    useEffect(() => {
        if (status === "authenticated" && params.id) {
            const id = params.id as string;
            const interval = setInterval(() => {
                fetchTicks(id);
            }, POLLING_TIME);

            return () => clearInterval(interval);
        }
    }, [status, params.id]);

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-(--background-color)">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary-color)" />
            </div>
        );
    }

    if (error || !website) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-(--background-color) px-4">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center shadow-lg backdrop-blur-md">
                    <h2 className="mb-2 text-xl font-bold text-red-500">Error Loading Website</h2>
                    <p className="mb-6 text-sm text-red-400">{error || "Website not found."}</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    let urlObj;
    try {
        urlObj = new URL(website.url);
    } catch (e) {
        urlObj = { hostname: website.url };
    }

    const sortedTicks = [...ticks].sort((a, b) => b.created_at - a.created_at);
    const latestTick = sortedTicks[0];

    const currentStatus = latestTick ? latestTick.status : "Waiting...";
    const isUp = currentStatus === "Up";

    const totalTicks = ticks.length;
    const upTicks = ticks.filter(t => t.status === "Up").length;
    const uptimePercentage = totalTicks > 0 ? ((upTicks / totalTicks) * 100).toFixed(2) : "0.00";

    const avgResponseTime = totalTicks > 0
        ? Math.floor(ticks.reduce((sum, t) => sum + t.response_time_ms, 0) / totalTicks)
        : 0;

    return (
        <div className="min-h-[100dvh] bg-(--background-color) pb-24 pt-32 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-(--primary-color) opacity-5 blur-[120px]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-(--secondary-color) transition hover:text-(--white-color)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-(--white-color)">
                                {urlObj.hostname}
                            </h1>
                            <div className="mt-3 flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${isUp ? 'border-(--primary-color)/20 bg-(--primary-color)/10 text-(--primary-color)' : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500'}`}>
                                    {isUp && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--primary-color) opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-(--primary-color)"></span>
                                        </span>
                                    )}
                                    {isUp ? 'Healthy' : currentStatus}
                                </span>
                                <span className="text-sm text-(--secondary-color)">
                                    Monitoring active since {new Date(website.time_added * 1000).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-(--white-color) transition hover:bg-white/10 shadow-lg backdrop-blur-sm"
                        >
                            Open Website
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                    <StatsCard
                        title="Current Status"
                        icon={<Activity className={`h-5 w-5 ${isUp ? 'text-(--primary-color)' : 'text-yellow-500'}`} />}
                        value={currentStatus}
                        subtitle={latestTick ? `Last ping: ${new Date(latestTick.created_at * 1000).toLocaleTimeString()}` : 'No pings yet'}
                    />

                    <StatsCard
                        title="Uptime (Rolling)"
                        icon={<ShieldCheck className="h-5 w-5 text-[#63e0c2]" />}
                        value={`${uptimePercentage}%`}
                        subtitle={totalTicks > 0 ? `Based on last ${totalTicks} checks` : 'No data'}
                    />

                    <StatsCard
                        title="Avg Response Time"
                        icon={<Clock className="h-5 w-5 text-blue-400" />}
                        value={`${avgResponseTime} ms`}
                        subtitle={totalTicks > 0 ? 'Calculated from recent pings' : 'Waiting...'}
                    />
                </div>

                <ResponseChart ticks={ticks} />

                <div className="mt-8 flex justify-between items-center text-xs text-white/30 px-2">
                    <p>Internal Tracking ID: {website.id}</p>
                    <p>Uptiq Telemetry System</p>
                </div>
            </div>
        </div>
    );
}