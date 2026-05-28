"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-(--background-color)">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/[0.1] border-t-(--primary-color)" />
        </div>
    ),
});

const timeline = [
    { time: "00:00", label: "Checkout latency drift", state: "watching" },
    { time: "00:03", label: "Synthetic probe failed in Mumbai", state: "incident" },
    { time: "00:07", label: "Webhook dispatched to on-call", state: "sent" },
];

const metrics = [
    { value: "18", label: "regions" },
    { value: "2.8s", label: "median signal" },
    { value: "99.99", label: "SLO target" },
];

export default function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-(--background-color)">
            <div className="absolute inset-0 opacity-95">
                <GlobeScene />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--background-color)_0%,rgba(8,11,16,0.92)_28%,rgba(8,11,16,0.62)_58%,rgba(8,11,16,0.22)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,var(--background-color))]" />

            <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:pt-24">
                <div className="max-w-3xl">
                    <div className="mb-7 inline-flex items-center gap-3 border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase text-(--secondary-color) backdrop-blur-md">
                        <span className="h-2 w-2 bg-(--primary-color) shadow-[0_0_18px_var(--primary-color)]" />
                        Live uptime intelligence
                    </div>

                    <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-(--white-color) sm:text-6xl lg:text-7xl">
                        See outages form before customers feel them.
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-(--secondary-color) sm:text-lg">
                        Uptiq watches every service from distributed probes, correlates the first weak signals, and routes the right alert before an outage becomes a support queue.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/signup"
                            className="inline-flex min-h-12 items-center justify-center gap-2 bg-(--primary-color) px-6 text-sm font-semibold text-[#05110e] transition hover:-translate-y-0.5 hover:bg-[#63e0c2] focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:ring-offset-2 focus:ring-offset-(--background-color)"
                        >
                            Start monitoring
                            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/SuhasKanwar/Uptiq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/[0.14] bg-white/[0.035] px-6 text-sm font-semibold text-(--white-color) backdrop-blur-md transition hover:border-white/[0.28] hover:bg-white/[0.07]"
                        >
                            Inspect the repo
                        </a>
                    </div>

                    <div className="mt-11 grid max-w-xl grid-cols-3 border-y border-white/[0.1]">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="border-r border-white/[0.1] py-5 last:border-r-0">
                                <div className="text-2xl font-semibold text-(--white-color)">{metric.value}</div>
                                <div className="mt-1 text-xs uppercase text-(--secondary-color)">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="w-full border border-white/[0.12] bg-[#0b1015]/[0.78] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:justify-self-end">
                    <div className="flex items-center justify-between border-b border-white/[0.1] pb-4">
                        <div>
                            <p className="text-xs uppercase text-(--secondary-color)">Incident trace</p>
                            <h2 className="mt-1 text-lg font-semibold text-(--white-color)">payments.api</h2>
                        </div>
                        <span className="border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold text-[#fbbf24]">
                            degraded
                        </span>
                    </div>

                    <div className="mt-5 space-y-3">
                        {timeline.map((item) => (
                            <div key={item.time} className="grid grid-cols-[54px_1fr] gap-4 border border-white/[0.08] bg-white/[0.035] p-3">
                                <span className="font-mono text-xs text-(--secondary-color)">{item.time}</span>
                                <div>
                                    <p className="text-sm font-medium text-(--white-color)">{item.label}</p>
                                    <p className="mt-1 text-xs uppercase text-(--secondary-color)">{item.state}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="border border-white/[0.08] bg-white/[0.035] p-3">
                            <p className="text-xs text-(--secondary-color)">Response</p>
                            <p className="mt-2 text-2xl font-semibold text-(--white-color)">421ms</p>
                        </div>
                        <div className="border border-white/[0.08] bg-white/[0.035] p-3">
                            <p className="text-xs text-(--secondary-color)">Loss</p>
                            <p className="mt-2 text-2xl font-semibold text-[#f87171]">4.1%</p>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
