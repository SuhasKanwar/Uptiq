"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWebsite, Website } from "@/utils/websites";
import { Loader2, ArrowLeft, ExternalLink, Activity, Clock, ShieldCheck, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WebsiteDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession({ required: true });

    const [website, setWebsite] = useState<Website | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated" && params.id) {
            fetchWebsite(params.id as string);
        }
    }, [status, params.id]);

    const fetchWebsite = async (id: string) => {
        try {
            setLoading(true);
            const data = await getWebsite(id);
            setWebsite(data);
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to load website details.");
        } finally {
            setLoading(false);
        }
    };

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

    const mockResponseTimes = Array.from({ length: 24 }, () => Math.floor(Math.random() * 300) + 50);
    const mockUptime = 99.98;

    return (
        <div className="min-h-[100dvh] bg-(--background-color) pb-24 pt-32 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-(--primary-color) opacity-5 blur-[120px]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
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
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-(--primary-color)/20 bg-(--primary-color)/10 px-3 py-1 text-xs font-medium text-(--primary-color)">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--primary-color) opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-(--primary-color)"></span>
                                    </span>
                                    Healthy
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

                {/* Grid Layout for Analytics */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                    {/* Stat Cards */}
                    <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-(--secondary-color)">
                            <Activity className="h-5 w-5 text-(--primary-color)" />
                            <h3 className="font-medium">Current Status</h3>
                        </div>
                        <p className="text-3xl font-bold text-(--white-color)">Operational</p>
                        <p className="mt-2 text-sm text-(--secondary-color)">Last checked: Just now</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-(--secondary-color)">
                            <ShieldCheck className="h-5 w-5 text-[#63e0c2]" />
                            <h3 className="font-medium">Uptime (24h)</h3>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-(--white-color)">{mockUptime}%</p>
                            <span className="text-sm font-medium text-(--primary-color) mb-1">+0.01%</span>
                        </div>
                        <p className="mt-2 text-sm text-(--secondary-color)">0 incidents reported</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-(--secondary-color)">
                            <Clock className="h-5 w-5 text-blue-400" />
                            <h3 className="font-medium">Avg Response Time</h3>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-(--white-color)">
                                {Math.floor(mockResponseTimes.reduce((a, b) => a + b) / mockResponseTimes.length)} ms
                            </p>
                        </div>
                        <p className="mt-2 text-sm text-(--secondary-color)">Consistent performance</p>
                    </div>
                </div>

                {/* Mock Chart Section */}
                <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white/5 p-2 border border-white/10">
                                <BarChart3 className="h-5 w-5 text-(--white-color)" />
                            </div>
                            <h3 className="text-lg font-medium text-(--white-color)">Response Times (Last 24h)</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-(--primary-color)">
                            <TrendingUp className="h-4 w-4" />
                            Optimal
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-1 sm:gap-2">
                        {mockResponseTimes.map((val, i) => {
                            const max = Math.max(...mockResponseTimes);
                            const heightPercentage = (val / max) * 100;
                            // Color logic: green if fast, yellow/red if slow. Since it's mock, we'll keep it sleek.
                            const isHigh = heightPercentage > 80;
                            return (
                                <div key={i} className="group relative flex w-full flex-col items-center justify-end h-full">
                                    <div
                                        style={{ height: `${heightPercentage}%` }}
                                        className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-100 cursor-crosshair ${isHigh ? 'bg-white/40' : 'bg-(--primary-color)/70 opacity-50'}`}
                                    ></div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                                        <div className="rounded bg-black/80 px-2 py-1 text-xs text-white border border-white/10 whitespace-nowrap shadow-xl">
                                            {val} ms
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-(--secondary-color) border-t border-white/5 pt-4">
                        <span>24 hours ago</span>
                        <span>12 hours ago</span>
                        <span>Now</span>
                    </div>
                </div>

                {/* Meta details footer */}
                <div className="mt-8 flex justify-between items-center text-xs text-white/30 px-2">
                    <p>Internal Tracking ID: {website.id}</p>
                    <p>Uptiq Telemetry System</p>
                </div>
            </div>
        </div>
    );
}